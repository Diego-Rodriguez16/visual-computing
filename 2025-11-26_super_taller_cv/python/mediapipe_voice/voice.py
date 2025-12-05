# voice.py

import threading
import time
import queue
from typing import Optional, Dict

import speech_recognition as sr

from config import VOICE_KEYWORDS


class VoiceCommandListener:
    """
    Hilo en segundo plano que escucha el micrófono y detecta comandos de voz simples.

    Uso:
        listener = VoiceCommandListener()
        listener.start()
        ...
        event = listener.get_event()
        ...
        listener.stop()
    """

    def __init__(self, phrase_time_limit: float = 3.0, energy_threshold: Optional[int] = None):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.phrase_time_limit = phrase_time_limit
        self.energy_threshold = energy_threshold
        self._thread: Optional[threading.Thread] = None
        self._running = False
        self._queue: "queue.Queue[Dict]" = queue.Queue()

    def start(self):
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        # No hacemos join aquí para no bloquear en cierre.

    def _map_text_to_command(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for keyword, cmd_name in VOICE_KEYWORDS.items():
            if keyword in text_lower:
                return cmd_name
        return None

    def _run(self):
        # Configurar micrófono y ruido ambiente
        with self.microphone as source:
            if self.energy_threshold is None:
                print("[voice] Ajustando al ruido ambiente...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
            else:
                self.recognizer.energy_threshold = self.energy_threshold

            print("[voice] Iniciando escucha de comandos de voz...")

            while self._running:
                try:
                    audio = self.recognizer.listen(
                        source,
                        timeout=1,
                        phrase_time_limit=self.phrase_time_limit,
                    )
                except sr.WaitTimeoutError:
                    # No se dijo nada en este intervalo
                    continue
                except Exception as e:
                    print(f"[voice] Error al escuchar: {e}")
                    continue

                try:
                    # Idioma en-US para palabras "start", "stop", etc.
                    text = self.recognizer.recognize_google(audio, language="en-US")
                    print(f"[voice] Reconocido: {text}")
                except sr.UnknownValueError:
                    print("[voice] No se entendió el audio.")
                    continue
                except sr.RequestError as e:
                    print(f"[voice] Error con el servicio de reconocimiento: {e}")
                    continue

                cmd_name = self._map_text_to_command(text)
                if cmd_name:
                    event = {
                        "type": "voice",
                        "name": cmd_name,
                        "raw_text": text,
                        "timestamp": time.time(),
                    }
                    self._queue.put(event)
                else:
                    print("[voice] Texto reconocido pero sin comando conocido.")

    def get_event(self) -> Optional[Dict]:
        """
        Devuelve un solo evento de voz si hay en la cola, si no devuelve None.
        """
        try:
            return self._queue.get_nowait()
        except queue.Empty:
            return None
