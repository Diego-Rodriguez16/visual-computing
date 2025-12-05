# config.py

import os

# --- Gestures configuration ---
GESTURE_OPEN_NAME = "GESTURE_OPEN_HAND"
GESTURE_FIST_NAME = "GESTURE_FIST"
GESTURE_THUMBS_UP_NAME = "GESTURE_THUMBS_UP"

# --- Voice commands configuration ---
# Palabras en inglés para que funcionen bien con el reconocimiento "en-US".
# Puedes cambiarlas a español si quieres y también ajustas el language en voice.py.
VOICE_KEYWORDS = {
    "start": "CMD_START",
    "stop": "CMD_STOP",
    "reset": "CMD_RESET",
    "red": "CMD_RED",
    "blue": "CMD_BLUE",
    "faster": "CMD_FASTER",
    "slower": "CMD_SLOWER",
}

# --- EEG Simulation configuration ---
EEG_MIN = 0.0
EEG_MAX = 1.0
EEG_STEP = 0.05       # paso cuando ajustas manualmente (teclas)
EEG_RANDOM_STEP = 0.01  # jitter aleatorio por frame
EEG_CALM_THRESHOLD = 0.3
EEG_ALERT_THRESHOLD = 0.7

# --- Multimodal state machine ---
INITIAL_STATE = "IDLE"
VALID_STATES = ["IDLE", "RUNNING", "PAUSED"]

# --- Logging paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_PATH = os.path.join(LOG_DIR, "events_log.csv")
