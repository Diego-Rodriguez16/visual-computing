# -*- coding: utf-8 -*-
import threading
import time
from collections import deque
from dataclasses import dataclass
import cv2
import mediapipe as mp
import speech_recognition as sr
import pyttsx3
from pythonosc import udp_client

# =========================
# CONFIG
# =========================
OSC_HOST = "127.0.0.1"
OSC_PORT = 12000

CAM_INDEX = 0                 # Índice de cámara
GESTURE_FRAMES_ON = 2         # Nº de frames "ON" requeridos para confirmar gesto
GESTURE_WINDOW = 6            # Ventana deslizante de verificación
GESTURE_MIN_INTERVAL = 1.0    # Segundos mínimos entre gestos confirmados

VOICE_PHRASE_LIMIT = 3.0      # Duración máx. de frase (seg)
VOICE_TIMEOUT = 1.5           # Timeout para listen no bloqueante
VOICE_WINDOW_SEC   = 4.0      # ← antes 2.0
GESTURE_WINDOW_SEC = 4.0      # ← antes 2.0
ACTION_COOLDOWN    = 0.8      # ← antes 1.5
USE_TTS            = False
DEBUG_LOG = False
# CONFIG …
COMBO_HOLD = 1.2  # segundos que esperamos la otra modalidad antes de disparar acción "simple"




ALLOWED_VOICE = {
    "adelante": "adelante",
    "siguiente": "adelante",
    "avanzar": "adelante",
    "play": "adelante",
    "detener": "detener",
    "para": "detener",
    "pausa": "detener",
    "stop": "detener",
}

# =========================
# EVENT BUS
# =========================
@dataclass
class LastEvent:
    value: str | None
    t: float

class EventBus:
    def __init__(self):
        self.lock = threading.Lock()
        self.voice = LastEvent(None, 0.0)
        self.gesture = LastEvent(None, 0.0)
        self.stop_event = threading.Event()

    def set_voice(self, value: str):
        with self.lock:
            self.voice = LastEvent(value, time.time())

    def set_gesture(self, value: str):
        with self.lock:
            self.gesture = LastEvent(value, time.time())

    def snapshot(self):
        with self.lock:
            return (self.voice.value, self.voice.t, self.gesture.value, self.gesture.t)

    def should_stop(self) -> bool:
        return self.stop_event.is_set()

    def request_stop(self):
        self.stop_event.set()

# =========================
# VOICE WORKER
# =========================
class VoiceWorker(threading.Thread):
    def __init__(self, bus: EventBus):
        super().__init__(daemon=True)
        self.bus = bus
        self.rec = sr.Recognizer()
        self.tts = pyttsx3.init()
        with sr.Microphone() as source:
            self.rec.adjust_for_ambient_noise(source, duration=1.0)

    def speak(self, text: str):
        if not USE_TTS:
            return
        try:
            self.tts.say(text)
            self.tts.runAndWait()
        except Exception:
            pass

    def run(self):
        print("🎤 VoiceWorker: listo (di 'adelante' / 'detener').")
        while not self.bus.should_stop():
            try:
                with sr.Microphone() as source:
                    audio = self.rec.listen(source, timeout=VOICE_TIMEOUT, phrase_time_limit=VOICE_PHRASE_LIMIT)

                # 1) Intento con es-CO, 2) fallback a es-ES
                txt = None
                for lang in ("es-CO", "es-ES"):
                    try:
                        txt = self.rec.recognize_google(audio, language=lang)
                        break
                    except Exception:
                        continue
                if not txt:
                    continue

                txt = txt.lower().strip()
                # Normaliza a comandos permitidos
                cmd = None
                if txt in ALLOWED_VOICE:
                    cmd = ALLOWED_VOICE[txt]
                else:
                    for k in ALLOWED_VOICE:
                        if k in txt:
                            cmd = ALLOWED_VOICE[k]
                            break

                if cmd:
                    print(f"🎤 Voz: {cmd}  (raw: «{txt}»)")
                    self.bus.set_voice(cmd)
                    self.speak(f"Comando {cmd}")
                else:
                    # Para depurar qué viene
                    print(f"🎤 Voz (sin comando): «{txt}»")

            except sr.WaitTimeoutError:
                continue
            except sr.UnknownValueError:
                continue
            except Exception as e:
                print(f"🎤 VoiceWorker error: {e}")
                time.sleep(0.2)


# =========================
# GESTURE WORKER (MediaPipe Hands)
# =========================
class GestureWorker(threading.Thread):
    def __init__(self, bus: EventBus):
        super().__init__(daemon=True)
        self.bus = bus
        self.cap = None
        self.last_emit = 0.0
        self.hist = deque(maxlen=GESTURE_WINDOW)
        self.threshold = 0.35  # ← UMBRAL: tercio superior aprox (ajústalo 0.33–0.45)

    def hand_center_y(self, lm) -> float:
        # Promedio de todas las landmarks (y normalizado 0..1; menor = más alto)
        return sum(p.y for p in lm) / len(lm)

    def run(self):
        print("✋ GestureWorker: inicializando cámara…")
        mp_hands = mp.solutions.hands
        self.cap = cv2.VideoCapture(CAM_INDEX)
        if not self.cap.isOpened():
            print("❌ No se pudo abrir la cámara.")
            self.bus.request_stop()
            return

        with mp_hands.Hands(
            model_complexity=0,
            max_num_hands=1,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.5,
        ) as hands:
            print("✋ GestureWorker: listo (ESC para salir).")
            while not self.bus.should_stop():
                ok, frame = self.cap.read()
                if not ok:
                    continue
                frame = cv2.flip(frame, 1)
                h, w = frame.shape[:2]

                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                res = hands.process(rgb)

                center_y = None
                hand_up_now = False

                if res.multi_hand_landmarks:
                    hand = res.multi_hand_landmarks[0]
                    center_y = self.hand_center_y(hand.landmark)

                    # Regla robusta: mano "arriba" si el centro está por encima del umbral
                    hand_up_now = center_y < self.threshold

                # Debounce: mayoría en ventana
                self.hist.append(1 if hand_up_now else 0)
                confirmed = sum(self.hist) >= GESTURE_FRAMES_ON

                # Rising edge
                now = time.time()
                prev_confirmed = sum(list(self.hist)[:-1]) >= GESTURE_FRAMES_ON
                if confirmed and not prev_confirmed and (now - self.last_emit) > GESTURE_MIN_INTERVAL:
                    print("✋ Gesto: mano_arriba (confirmado)")
                    self.bus.set_gesture("mano_arriba")
                    self.last_emit = now

                # ---------- HUD de depuración ----------
                # Línea de umbral
                y_line = int(self.threshold * h)
                cv2.line(frame, (0, y_line), (w, y_line), (0, 255, 255), 2)

                # Texto estado
                status = "CONFIRMADO" if confirmed else "buscando"
                cv2.putText(frame, f"umbral y={self.threshold:.2f}", (10, 25),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                if center_y is not None:
                    cv2.putText(frame, f"center_y={center_y:.2f}", (10, 55),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                cv2.putText(frame, f"mano_arriba={int(hand_up_now)}  {status}", (10, 85),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                            (0, 255, 0) if confirmed else (0, 0, 255), 2)

                cv2.imshow("Gestures", frame)
                if cv2.waitKey(1) & 0xFF == 27:  # ESC
                    self.bus.request_stop()
                    break

        try:
            self.cap.release()
            cv2.destroyAllWindows()
        except Exception:
            pass


# =========================
# LOGIC WORKER
# =========================
class LogicWorker(threading.Thread):
    def __init__(self, bus: EventBus):
        super().__init__(daemon=True)
        self.bus = bus
        self.client = udp_client.SimpleUDPClient(OSC_HOST, OSC_PORT)
        self.last_action = None
        self.last_action_t = 0.0
        self._last_debug = 0.0
        self.combo_lockout_until = 0.0


    def send_action(self, action: str):
        now = time.time()
        if self.last_action == action and (now - self.last_action_t) < ACTION_COOLDOWN:
            return
        print(f"➡️ Acción: {action}")
        try:
            self.client.send_message(f"/{action}", 1)
        except Exception as e:
            print(f"OSC error: {e}")
        self.last_action = action
        self.last_action_t = now

    def run(self):
        print("🧠 LogicWorker: ejecutando lógica multimodal…")
        while not self.bus.should_stop():
            v_val, v_t, g_val, g_t = self.bus.snapshot()
            now = time.time()

            voice_age = now - v_t if v_t else 999
            gest_age  = now - g_t if g_t else 999

            if now < self.combo_lockout_until:
                # durante el lockout ignoramos gestos
                gesture_active = False


            voice_active   = v_val is not None and voice_age <= VOICE_WINDOW_SEC
            gesture_active = g_val is not None and gest_age  <= GESTURE_WINDOW_SEC

            # Debug cada 0.5 s
            if DEBUG_LOG and (now - self._last_debug > 0.5):
                print(f"🧪 estado: voice=({voice_active},{v_val},{voice_age:.1f}s)  "
                    f"gest=({gesture_active},{g_val},{gest_age:.1f}s)")
                self._last_debug = now


            action = None

            # ====== 1) Combinada (prioridad máxima) ======
            if voice_active and gesture_active and v_val == "adelante" and g_val == "mano_arriba":
                action = "adelante_rapido"
                self.combo_lockout_until = now + 0.6  # opcional: tregua corta post-combo
                # Consumimos ambas para no caer luego en "solo gesto" o "solo voz"
                self.bus.set_voice(None)
                self.bus.set_gesture(None)

            # ====== 2) Solo VOZ, pero con HOLD para dar chance al gesto ======
            elif voice_active and not gesture_active:
                # Si es 'detener', no conviene esperar: aplica inmediato
                if v_val == "detener":
                    action = "detener"
                    self.bus.set_voice(None)
                else:
                    # Para 'adelante' esperamos COMBO_HOLD antes de disparar simple
                    if voice_age >= COMBO_HOLD:
                        action = "adelante"
                        self.bus.set_voice(None)
                    # Si aún no pasó el HOLD, NO dispares nada: estás "esperando combo"

            # ====== 3) Solo GESTO, con HOLD simétrico para dar chance a la voz ======
            elif gesture_active and not voice_active:
                if gest_age >= COMBO_HOLD:
                    action = "saludo"  # tu Processing ya maneja /saludo
                    self.bus.set_gesture(None)
                # Si aún no pasó el HOLD, NO dispares: estás "esperando combo"


            if action:
                self.send_action(action)

            time.sleep(0.05)

# =========================
# MAIN
# =========================
def main():
    bus = EventBus()
    vw = VoiceWorker(bus)
    gw = GestureWorker(bus)
    lw = LogicWorker(bus)

    try:
        vw.start()
        gw.start()
        lw.start()

        # Espera hasta que se pida terminar
        while not bus.should_stop():
            time.sleep(0.2)

    except KeyboardInterrupt:
        print("\n🛑 Interrumpido por usuario.")
    finally:
        bus.request_stop()
        # damos tiempo a cerrar
        time.sleep(0.5)

if __name__ == "__main__":
    main()
