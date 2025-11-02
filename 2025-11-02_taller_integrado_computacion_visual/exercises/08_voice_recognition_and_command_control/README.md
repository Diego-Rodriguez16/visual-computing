# 🗣️ Voice Recognition and Command Control

_Part of the Integrated Visual Computing Workshop_

## 🎯 Overview

This experiment implements **voice command recognition** to control a **visual element in Processing**, using **Python** for audio capture and speech interpretation.  
The goal is to demonstrate an **interactive system** that reacts to spoken commands with both **visual** and **auditory feedback**.

Communication between Python and Processing is handled through **OSC (Open Sound Control)** messages.

---

## 🧠 Concept

- **SpeechRecognition + PyAudio:** Captures and recognizes voice commands in Spanish.
- **pyttsx3:** Provides voice feedback (text-to-speech).
- **python-osc:** Sends recognized commands to Processing via OSC.
- **Processing (oscP5):** Receives OSC messages and updates the on-screen visuals accordingly.

Commands such as “adelante”, “izquierda”, or “detener” move or stop a circle inside a Processing sketch.

---

## ⚙️ Requirements and Installation

### 🐍 Python dependencies

Make sure you have **Python 3.10+** installed.  
Then install the following libraries:

```bash
pip install SpeechRecognition pyttsx3 python-osc pyaudio
```

---

## Processing

1. Install Processing from https://processing.org/
   (if you don't have it).

2. In Processing: Sketch → Import Library → Add Library... → search and install oscP5 (this also installs netP5).

## 🚀 How to Run

1. **Run Processing first**

   - Open and run your Processing sketch (the one that listens for OSC messages).

2. **Run the Python script**

   - Execute the voice recognition script in a terminal:

   ```bash
   python voz_control.py
   ```

3. **Speak a command while the Python program is running:**

   - Examples: “adelante”, “izquierda”, “derecha”, “atrás”, “detener”.

4. **Observe**

   - Processing updates the visualization according to the received OSC message.

   - Python gives a spoken confirmation (via pyttsx3) and prints recognized text to the console.

---

## 📸 Visual Evidence

### Video

[🎥 Watch demo video](../../assets/08/voice_control.mp4)

### Gif

![🎥 gif](../../gifs/08/voice_control.gif)
