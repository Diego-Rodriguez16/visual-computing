# Integrated workshop - visual computing

## Workshop Summary

This repository documents the work completed for the workshop, showing interactive visual experiences that integrate 3D modeling, PBR materials, custom shaders, dynamic textures, multimodal sensing (voice, gestures, EEG), and camera or environment control. Each section explores a component of the graphics and sensory pipeline, uniting visual perception, light physics, procedural geometry, and human-computer interaction.

## Exercises

This section details the exercises that have been completed so far.

---

### 7. Webcam Gesture Control

- **Brief Explanation:** This project implemented a real-time gesture control system using Python and MediaPipe. The initial version focused on core gesture recognition: counting raised fingers and detecting a "pinch" by measuring the distance between the thumb and index finger. These gestures were mapped to control the color, size, and position of a circle. The project was then extended into a bonus minigame where the user must "pop" a randomly appearing target by moving their hand and using the pinch gesture.
- **Key Results (GIFs):**

|         Gesture Controlled Object          |          "Pop the Target" Minigame          |
| :----------------------------------------: | :-----------------------------------------: |
| ![Interactive gif](./gifs/07/gestures.gif) | ![Interactive gif](./gifs/07/mini-game.gif) |

- **Link to Code:**
  - [View Gesture Control Code](./exercises/07_webcam_gestures_mediapipe_hands/)
- **Personal Comments:**
  - **Learning:** This was an excellent introduction to the power of pre-trained models like MediaPipe. The primary learning was in translating raw landmark coordinates into robust, meaningful gestures. Implementing the minigame logic was a great exercise in managing application state and event detection.
  - **Challenges:** The main technical challenge was devising a reliable logic for counting fingers, especially the thumb. For the minigame, tuning the gesture thresholds for a responsive but not overly sensitive interaction was key.

---

### 8. Voice Recognition and Command Control

- **Brief Explanation:**  
  This experiment integrates **Python voice recognition** with a **Processing visualization**. Spoken commands like “forward”, “left”, or “stop” are recognized through the microphone and transmitted via **OSC** to control on-screen elements in real time. The system also provides **spoken feedback** using text-to-speech, creating a complete voice-driven interaction loop.

- **Core Technologies:**  
  Python (`SpeechRecognition`, `pyttsx3`, `python-osc`, `pyaudio`) and Processing (`oscP5`).

- **Key Results (GIFs):**

  ![🎥 gif](./gifs/08/voice_control.gif)

- **📽️ Demo Video**

  - [🎥 Watch Demo Video](./assets/08/voice_control.mp4)

- **Link to Code:**

  - [View Code](./exercises/08_voice_recognition_and_command_control/)

- **Personal Comments:**
  - **Learning:** Exploring OSC communication between Python and Processing helped bridge audio input and graphical output effectively.
  - **Challenges:** Setting up PyAudio and achieving stable voice recognition accuracy required careful tuning of microphone sensitivity and noise thresholds.

---

### 9. Multimodal Interfaces: Voice + Hand Gestures (OSC → Processing)

- **Brief Explanation:**  
  Real-time control of a Processing sketch using **voice** and **hand gestures** via Python. Supports solo actions (voice _or_ gesture) and **combo** (voice+gesture within a short time window). The combo (“hand up” + “adelante”) triggers a higher-priority action.

- **Core Technologies:**  
  Python (`OpenCV`, `MediaPipe`, `SpeechRecognition`, `PyAudio`, `pyttsx3` optional, `python-osc`) + Processing (`oscP5`).

- **Key Results (GIF / Video):**  
  ![Multimodal demo](./gifs/09/multimodal.gif)  
  **Demo video:** [▶️ Watch](./assets/09/multimodal.mp4)

- **OSC Mapping (Python → Processing):**

  | Event Source      | OSC Address        | Processing Action                    | Color (RGB)        |
  | ----------------- | ------------------ | ------------------------------------ | ------------------ |
  | Gesture only      | `/saludo`          | `currentColor = color(255, 255, 0);` | Yellow (255,255,0) |
  | Voice: “adelante” | `/adelante`        | `currentColor = color(0, 100, 255);` | Blue (0,100,255)   |
  | Voice: “detener”  | `/detener`         | `currentColor = color(0);`           | Black (0,0,0)      |
  | **Combo (V+G)**   | `/adelante_rapido` | `currentColor = color(0, 255, 0);`   | Green (0,255,0)    |

- **Link to Code:**

  - [View Multimodal Code](./exercises/09_multimodal_interfaces_voice_gestures/)
  - Main script: `multimodal_control.py`

- **Personal Comments:**
  - **Learning:** Built a thread-safe event bus with timestamps, debounced gesture detection, and a **combo hold** to fuse modalities reliably.
  - **Challenges:** Tuning gesture threshold/frame window for responsiveness vs. stability; handling mic noise; aligning OSC routes with the Processing sketch.

---

## Folder Structure

```
2025-11-02_taller_integrado_computacion_visual/
├── exercises/
│   ├── 01_materials_light_and_color_pbr_chromatic_models/
│   ├── 02_procedural_modeling_from_code/
│   ├── 03_custom_shaders_and_effects/
│   ├── 04_dynamic_texturing_and_particles/
│   ├── 05_image_and_video_360_visualization/
│   ├── 06_input_and_interaction_ui_collisions/
│   ├── 07_webcam_gestures_mediapipe_hands/
│   │   ├── python/
│   │   │   ├── game.py
│   │   │   └── gesture_controller.py
│   │   └── README.md
│   ├── 08_voice_recognition_and_command_control/
│   │   ├── processing/
│   │   │   └── receptor_voz.pde
│   │   ├── python/
│   │   │   └── voz_control.py
│   │   └── README.md
│   ├── 09_multimodal_interfaces_voice_gestures/
│   │   ├── processing/
│   │   │   └── multimoal_reception.pde
│   │   ├── python/
│   │   │   └── multimodal_control.py
│   │   └── README.md
│   ├── 10_bci_simulation_synthetic_eeg_control/
│   └── 11_projective_spaces_and_projection_matrices/
│
├── assets/
│   ├── 01/
│   ├── 02/
│   ├── 03/
│   ├── 04/
│   ├── 05/
│   ├── 06/
│   ├── 08/
│   │   └── voice_control.mp4
│   ├── 09/
│   │   └── multimodal.mp4
│   ├── 10/
│   └── 11/
│
├── gifs/
│   ├── 01/
│   ├── 02/
│   ├── 03/
│   ├── 04/
│   ├── 05/
│   ├── 06/
│   ├── 07/
│   │   ├── gestures.gif
│   │   └── mini-game.gif
│   ├── 08/
│   │   └── voice_control.gif
│   ├── 09/
│   │   └── multimodal.gif
│   ├── 10/
│   └── 11/
│
└── README.md

```
