# gestures.py

import time
from typing import Optional, Dict, Tuple

import cv2
import mediapipe as mp

from config import (
    GESTURE_OPEN_NAME,
    GESTURE_FIST_NAME,
    GESTURE_THUMBS_UP_NAME,
)


class GestureDetector:
    def __init__(self, max_num_hands: int = 1, detection_confidence: float = 0.7, tracking_confidence: float = 0.6):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=max_num_hands,
            min_detection_confidence=detection_confidence,
            min_tracking_confidence=tracking_confidence,
        )
        self.mp_drawing = mp.solutions.drawing_utils
        self.last_gesture_name: Optional[str] = None
        self.last_event_time = 0.0
        self.min_event_interval = 0.3  # segundos entre eventos para no spamear

    def _finger_extended(self, landmarks, tip_id: int, pip_id: int) -> bool:
        tip = landmarks[tip_id]
        pip = landmarks[pip_id]
        # En coordenadas de imagen, y crece hacia abajo. Dedo extendido => tip "más arriba" (y más pequeño).
        return tip.y < pip.y

    def _classify_gesture(self, hand_landmarks) -> Optional[str]:
        lm = hand_landmarks.landmark

        # Indices PIP y tips
        index_extended = self._finger_extended(lm, tip_id=8, pip_id=6)
        middle_extended = self._finger_extended(lm, tip_id=12, pip_id=10)
        ring_extended = self._finger_extended(lm, tip_id=16, pip_id=14)
        pinky_extended = self._finger_extended(lm, tip_id=20, pip_id=18)

        fingers_extended = [index_extended, middle_extended, ring_extended, pinky_extended]
        num_extended = sum(fingers_extended)

        # Clasificación heurística simple
        if num_extended == 4:
            return GESTURE_OPEN_NAME
        if num_extended == 0:
            # Posible puño o thumbs up; check pulgar
            thumb_tip = lm[4]
            thumb_ip = lm[3]
            thumb_extended = abs(thumb_tip.y - thumb_ip.y) < 0.05
            if thumb_extended:
                return GESTURE_THUMBS_UP_NAME
            return GESTURE_FIST_NAME

        # Se puede extender con más patrones si quieres
        return None

    def process_frame(self, frame) -> Tuple[Optional[Dict], any]:
        """
        Procesa un frame BGR de OpenCV, dibuja la mano y devuelve (evento, frame_dibujado).
        Evento es un dict o None:
        {
          "type": "gesture",
          "name": "GESTURE_OPEN_HAND",
          "timestamp": ...
        }
        """
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(image_rgb)

        event = None
        if results.multi_hand_landmarks:
            # Usamos solo la primera mano detectada
            hand_landmarks = results.multi_hand_landmarks[0]

            # Dibujar landmarks
            self.mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                self.mp_hands.HAND_CONNECTIONS,
            )

            gesture_name = self._classify_gesture(hand_landmarks)

            now = time.time()
            if gesture_name and (gesture_name != self.last_gesture_name or (now - self.last_event_time) > self.min_event_interval):
                event = {
                    "type": "gesture",
                    "name": gesture_name,
                    "timestamp": now,
                }
                self.last_gesture_name = gesture_name
                self.last_event_time = now

        return event, frame
