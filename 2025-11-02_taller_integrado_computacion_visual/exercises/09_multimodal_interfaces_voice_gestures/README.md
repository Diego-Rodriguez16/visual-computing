# Voice + Hand Gestures → OSC (Processing)

Real-time control of a Processing sketch using **voice** + **hand gestures** via **Python**, **MediaPipe**, **SpeechRecognition**, and **OSC**. Supports **solo** actions and **combo** (voice+gesture) within a short time window.

---

## Demo

**GIF preview:**  
![demo gif](../../gifs/09/multimodal.gif)

**Video:**  
[Watch demo video](../../assets/09/multimodal.mp4)

---

## Requirements

- Python 3.9+
- OpenCV, MediaPipe, SpeechRecognition, PyAudio, pyttsx3 (optional), python-osc
- Processing (receives OSC)

Install:

```bash
pip install opencv-python mediapipe SpeechRecognition python-osc pyttsx3 pyaudio
# If PyAudio fails:
# Windows: pip install pipwin && pipwin install pyaudio
# Linux: sudo apt-get install portaudio19-dev && pip install pyaudio
# macOS: brew install portaudio && pip install pyaudio
```

---

## Run

1. Start your Processing sketch (listening on **UDP 12000**), handling:
   `/adelante_rapido`, `/adelante`, `/saludo`, `/detener`.

2. Run Python:

```bash
python multimodal_control.py
```

3. Try:

- Raise hand (upper third of frame) → **/saludo**
- Say “adelante” → **/adelante**
- Say “detener” → **/detener**
- **Combo**: hand up + “adelante” within **COMBO_HOLD** (default 0.8 s) → **/adelante_rapido**

---

## OSC Mapping (Python → Processing)

| Event Source    | OSC Address        | Processing Action                    | Color Effect (RGB) |
| --------------- | ------------------ | ------------------------------------ | ------------------ |
| Gesture only    | `/saludo`          | `currentColor = color(255, 255, 0);` | Yellow (255,255,0) |
| Voice: adelante | `/adelante`        | `currentColor = color(0, 100, 255);` | Blue (0,100,255)   |
| Voice: detener  | `/detener`         | `currentColor = color(0);`           | Black (0,0,0)      |
| Combo (V+G)     | `/adelante_rapido` | `currentColor = color(0, 255, 0);`   | Green (0,255,0)    |

> Processing sketch reference:
>
> ```java
> import oscP5.*;
> import netP5.*;
>
> OscP5 oscP5;
> color currentColor;
>
> void setup() {
>   size(400, 400);
>   oscP5 = new OscP5(this, 12000);
>   currentColor = color(150); // gray default
> }
>
> void draw() {
>   background(currentColor);
>   fill(255);
>   textAlign(CENTER, CENTER);
>   textSize(18);
>   text("Esperando comandos OSC...", width/2, height/2);
> }
>
> void oscEvent(OscMessage msg) {
>   String addr = msg.addrPattern();
>   println("Received:", addr);
>
>   if (addr.equals("/adelante_rapido")) {
>     currentColor = color(0, 255, 0);   // Green
>   } else if (addr.equals("/adelante")) {
>     currentColor = color(0, 100, 255); // Blue
>   } else if (addr.equals("/saludo")) {
>     currentColor = color(255, 255, 0); // Yellow
>   } else if (addr.equals("/detener")) {
>     currentColor = color(0);           // Black
>   } else {
>     currentColor = color(150);         // Gray (default)
>   }
> }
> ```

---

## Key Config (in `multimodal_control.py`)

```python
OSC_HOST="127.0.0.1"; OSC_PORT=12000
CAM_INDEX=0
GESTURE_FRAMES_ON=2; GESTURE_WINDOW=6; GESTURE_MIN_INTERVAL=1.0
VOICE_PHRASE_LIMIT=3.0; VOICE_TIMEOUT=1.5
VOICE_WINDOW_SEC=4.0; GESTURE_WINDOW_SEC=4.0
ACTION_COOLDOWN=0.8; COMBO_HOLD=0.8
USE_TTS=False; DEBUG_LOG=False
# Hand-up threshold inside GestureWorker:
# self.threshold = 0.35  # raise to 0.40–0.45 if needed
```

**Voice keywords:**

- forward: “adelante”, “siguiente”, “avanzar”, “play” → `/adelante`
- stop: “detener”, “para”, “pausa”, “stop” → `/detener`

---

## How it Works (quick)

- **Gesture “hand up”** = hand center Y above threshold; debounced; rising-edge only.
- **Combo logic** waits **COMBO_HOLD** so the other modality can arrive:
  - both present → `/adelante_rapido` (consume both)
  - otherwise → solo action.

---

## Tips

- Increase `COMBO_HOLD` (e.g., 1.2 s) if combos are hard to trigger.
- Adjust `self.threshold` to tune hand-up sensitivity.
- Keep `DEBUG_LOG=False` to avoid console spam.
