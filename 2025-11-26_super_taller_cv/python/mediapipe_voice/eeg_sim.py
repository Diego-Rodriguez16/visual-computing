# eeg_sim.py

import random
import time
from typing import Dict

from config import (
    EEG_MIN,
    EEG_MAX,
    EEG_STEP,
    EEG_RANDOM_STEP,
    EEG_CALM_THRESHOLD,
    EEG_ALERT_THRESHOLD,
)


class EEGSimulator:
    """
    Simulador sencillo de señal EEG entre 0 y 1 con:
    - Variaciones aleatorias pequeñas.
    - Ajustes manuales opcionales (p.ej. con teclas).
    """

    def __init__(self, initial_value: float = 0.5):
        self.value = max(min(initial_value, EEG_MAX), EEG_MIN)
        self.last_label = None

    def random_walk(self):
        """
        Aplica un pequeño cambio aleatorio a la señal.
        """
        delta = random.uniform(-EEG_RANDOM_STEP, EEG_RANDOM_STEP)
        self.value = max(min(self.value + delta, EEG_MAX), EEG_MIN)

    def manual_adjust(self, steps: int):
        """
        Permite subir o bajar el valor manualmente, por ejemplo con teclas.
        steps > 0 sube, steps < 0 baja.
        """
        self.value = max(min(self.value + steps * EEG_STEP, EEG_MAX), EEG_MIN)

    def get_state(self) -> Dict:
        """
        Devuelve el estado actual de la señal y su etiqueta:
        {
          "type": "eeg",
          "value": 0.62,
          "label": "EEG_NEUTRAL",
          "timestamp": ...
        }
        """
        if self.value < EEG_CALM_THRESHOLD:
            label = "EEG_CALM"
        elif self.value > EEG_ALERT_THRESHOLD:
            label = "EEG_ALERT"
        else:
            label = "EEG_NEUTRAL"

        self.last_label = label
        return {
            "type": "eeg",
            "value": self.value,
            "label": label,
            "timestamp": time.time(),
        }
