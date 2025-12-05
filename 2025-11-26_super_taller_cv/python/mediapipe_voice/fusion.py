# fusion.py

from typing import Optional, Dict, List


def fuse_events(
    current_state: str,
    gesture_event: Optional[Dict],
    voice_event: Optional[Dict],
    eeg_state: Dict,
) -> Dict:
    """
    Aplica reglas de fusión entre gesto, voz y EEG para actualizar el estado global
    y producir acciones. Devuelve:
    {
      "state": "RUNNING",
      "actions": ["ACTION_START"],
      "alert": True/False
    }
    """

    state = current_state
    actions: List[str] = []

    gesture_name = gesture_event["name"] if gesture_event else None
    voice_name = voice_event["name"] if voice_event else None
    eeg_label = eeg_state.get("label", "EEG_NEUTRAL")

    # --- Regla global: RESET ---
    if voice_name == "CMD_RESET":
        state = "IDLE"
        actions.append("ACTION_RESET")

    # --- Cambios de estado según gesto/voz ---
    if state == "IDLE":
        if gesture_name in ("GESTURE_THUMBS_UP",) or voice_name == "CMD_START":
            state = "RUNNING"
            actions.append("ACTION_START")

    elif state == "RUNNING":
        if gesture_name in ("GESTURE_OPEN_HAND", "GESTURE_FIST") or voice_name == "CMD_STOP":
            state = "PAUSED"
            actions.append("ACTION_PAUSE")

    elif state == "PAUSED":
        if gesture_name in ("GESTURE_THUMBS_UP",) or voice_name == "CMD_START":
            state = "RUNNING"
            actions.append("ACTION_RESUME")

    # --- Modo alerta basado en EEG ---
    alert_mode = False
    if eeg_label == "EEG_ALERT" and state == "RUNNING":
        alert_mode = True
        actions.append("ACTION_ALERT_ON")
    else:
        actions.append("ACTION_ALERT_OFF")

    # --- Ajustes visuales adicionales según comandos de voz ---
    if voice_name in ("CMD_RED", "CMD_BLUE"):
        # ACTION_SET_COLOR_RED o ACTION_SET_COLOR_BLUE
        actions.append(f"ACTION_SET_COLOR_{voice_name.split('_')[-1]}")

    if voice_name in ("CMD_FASTER", "CMD_SLOWER"):
        actions.append(voice_name.replace("CMD_", "ACTION_"))

    return {
        "state": state,
        "actions": actions,
        "alert": alert_mode,
    }
