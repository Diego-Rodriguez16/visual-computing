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
│   ├── 10/
│   └── 11/
│
└── README.md

```
