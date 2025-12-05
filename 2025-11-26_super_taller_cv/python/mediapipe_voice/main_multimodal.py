# main_multimodal.py

import csv
import time

import cv2

from config import INITIAL_STATE, LOG_PATH
from gestures import GestureDetector
from voice import VoiceCommandListener
from eeg_sim import EEGSimulator
from fusion import fuse_events
from visualizer import draw_visualization


def log_event(writer: csv.writer, event_type: str, event_name: str, state: str, eeg_value: float):
    now = time.time()
    writer.writerow([now, event_type, event_name, state, f"{eeg_value:.3f}"])


def main():
    # Iniciar captura de webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("No se pudo abrir la cámara.")
        return

    gesture_detector = GestureDetector()
    eeg_sim = EEGSimulator()
    voice_listener = VoiceCommandListener()

    # Iniciar escucha de voz en segundo plano (si falla, puedes comentar estas dos líneas)
    try:
        voice_listener.start()
    except Exception as e:
        print(f"No se pudo iniciar el listener de voz: {e}")

    # Preparar logging
    log_file = open(LOG_PATH, mode="w", newline="", encoding="utf-8")
    writer = csv.writer(log_file)
    writer.writerow(["timestamp", "event_type", "event_name", "state", "eeg_value"])

    current_state = INITIAL_STATE
    prev_state = current_state
    last_eeg_label = None

    last_gesture_event = None
    last_voice_event = None

    print("Controles:")
    print(" - Tecla 'q': salir")
    print(" - Tecla 'w': subir EEG (más alerta)")
    print(" - Tecla 's': bajar EEG (más calmado)")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("No se pudo leer frame de la cámara.")
                break

            # Procesar gesto
            gesture_event, frame = gesture_detector.process_frame(frame)
            if gesture_event:
                last_gesture_event = gesture_event

            # Obtener comando de voz (si hay uno nuevo en la cola)
            voice_event = voice_listener.get_event()
            if voice_event:
                last_voice_event = voice_event

            # Actualizar EEG (random walk cada frame)
            eeg_sim.random_walk()
            eeg_state = eeg_sim.get_state()

            # Fusión de eventos con el estado actual
            fusion_output = fuse_events(
                current_state=current_state,
                gesture_event=last_gesture_event,
                voice_event=last_voice_event,
                eeg_state=eeg_state,
            )
            current_state = fusion_output["state"]

            # Dibujar HUD sobre el frame
            frame_viz = draw_visualization(
                frame,
                last_gesture_event,
                last_voice_event,
                eeg_state,
                fusion_output,
            )

            cv2.imshow("Multimodal Control (Subsistema 2)", frame_viz)

            # Logging de eventos relevantes
            eeg_value = eeg_state["value"]

            if gesture_event:
                log_event(writer, "gesture", gesture_event["name"], current_state, eeg_value)

            if voice_event:
                log_event(writer, "voice", voice_event["name"], current_state, eeg_value)

            if current_state != prev_state:
                log_event(writer, "state_change", current_state, current_state, eeg_value)
                prev_state = current_state

            if eeg_state["label"] != last_eeg_label:
                log_event(writer, "eeg_state", eeg_state["label"], current_state, eeg_value)
                last_eeg_label = eeg_state["label"]

            # Teclas de control
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break
            elif key == ord("w"):
                eeg_sim.manual_adjust(+1)
            elif key == ord("s"):
                eeg_sim.manual_adjust(-1)

    finally:
        cap.release()
        cv2.destroyAllWindows()
        try:
            voice_listener.stop()
        except Exception:
            pass
        log_file.close()
        print("Ejecución finalizada.")


if __name__ == "__main__":
    main()
