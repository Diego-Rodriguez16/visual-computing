# visualizer.py

from typing import Optional, Dict, Tuple

import cv2
import numpy as np


def _state_color(state: str, alert: bool) -> Tuple[int, int, int]:
    """
    Devuelve el color BGR del círculo según el estado y alerta.
    """
    if alert:
        return (0, 0, 255)  # rojo
    if state == "IDLE":
        return (128, 128, 128)  # gris
    if state == "RUNNING":
        return (0, 255, 0)  # verde
    if state == "PAUSED":
        return (0, 255, 255)  # amarillo
    return (255, 255, 255)  # blanco por defecto


def draw_visualization(
    frame,
    gesture_event: Optional[Dict],
    voice_event: Optional[Dict],
    eeg_state: Dict,
    fusion_output: Dict,
):
    """
    Dibuja sobre el frame:
    - Información de gesto, voz, EEG.
    - Estado global del sistema.
    - Un círculo que cambia de color/tamaño según el estado y modo alerta.
    """

    h, w, _ = frame.shape

    # Panel semitransparente arriba
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, 0), (w, 120), (0, 0, 0), thickness=-1)
    frame = cv2.addWeighted(overlay, 0.4, frame, 0.6, 0)

    # Texto básico
    gesture_text = gesture_event["name"] if gesture_event else "---"
    voice_text = voice_event["name"] if voice_event else "---"
    eeg_value = eeg_state.get("value", 0.0)
    eeg_label = eeg_state.get("label", "EEG_NEUTRAL")
    state = fusion_output.get("state", "IDLE")
    alert = fusion_output.get("alert", False)

    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = 0.6
    thickness = 1

    cv2.putText(frame, f"Gesture: {gesture_text}", (10, 30), font, scale, (255, 255, 255), thickness, cv2.LINE_AA)
    cv2.putText(frame, f"Voice: {voice_text}", (10, 55), font, scale, (255, 255, 255), thickness, cv2.LINE_AA)
    cv2.putText(frame, f"EEG: {eeg_value:.2f} ({eeg_label})", (10, 80), font, scale, (255, 255, 255), thickness, cv2.LINE_AA)
    cv2.putText(frame, f"State: {state}", (10, 105), font, scale, (255, 255, 255), thickness, cv2.LINE_AA)

    # Círculo de estado
    circle_color = _state_color(state, alert)
    radius = 40
    if state == "RUNNING":
        radius = 55
    if alert:
        radius = 70

    center_x = w - 80
    center_y = h - 80

    cv2.circle(frame, (center_x, center_y), radius, circle_color, thickness=-1)
    cv2.circle(frame, (center_x, center_y), radius + 4, (255, 255, 255), thickness=2)

    return frame
