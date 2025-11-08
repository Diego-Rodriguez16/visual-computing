# Integrated workshop - visual computing

## Workshop Summary

This repository documents the work completed for the workshop, showing interactive visual experiences that integrate 3D modeling, PBR materials, custom shaders, dynamic textures, multimodal sensing (voice, gestures, EEG), and camera or environment control. Each section explores a component of the graphics and sensory pipeline, uniting visual perception, light physics, procedural geometry, and human-computer interaction.

## Exercises

This section details the exercises that have been completed so far.

--
### Ejercicio 1. Materiales, luz y color (PBR y modelos cromáticos)

- **Descripción de lo realizado:**  
  En este ejercicio implementamos un **cubo de ladrillo centrado** usando Three.js y materiales PBR. Se aplicaron **texturas albedo, normal y roughness** para simular el material de forma realista.  
  La escena se iluminó con un **sistema de luces múltiples**: key light, fill light, rim light y luz ambiental. La cámara se centró en el cubo con perspectiva, y se ajustó para mantener la proporción al cambiar el tamaño de la ventana.  
  También se incorporó **animación** para rotar el cubo, permitiendo observar las variaciones de luz y material desde diferentes ángulos.

(./gifs/01/CuboLadrillo.gif)

  Este ejercicio permitió comprender cómo **las texturas PBR y la iluminación múltiple** afectan la percepción de los materiales en 3D. Además, practicar la rotación animada y la gestión de la cámara refuerza el control sobre la escena y la composición visual.

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
## Exercise 10 — BCI Simulation (Synthetic EEG and Control)

### Objective
Simulate a Brain-Computer Interface (BCI) using synthetic EEG signals to classify mental states and trigger visual actions in real-time.

### General Description
1. Generation of **synthetic EEG signals** with Alpha (8-12 Hz) and Beta (13-30 Hz) bands.
2. Implementation of **Butterworth bandpass filters** using `scipy.signal`.
3. Calculation of **band energies** and classification based on thresholds.
4. **Interactive controls** to simulate relaxed, active, and normal mental states.
5. Real-time visualization with **PyGame** showing state changes through color, size, and metrics display.

### Evidence
- **Animated GIF:** showing mental state transitions and interactive controls.
  
  ![bci_simulation](./gifs/10/bci_simulation.gif)


**Link to the code:**
> [Python Code](./exercises/10_bci_simulation_synthetic_eeg_control/python/simulacion_BCI.py)

### Personal Comments
- **Learning:** I understood how EEG signals are processed and filtered to extract meaningful brain activity patterns.
- **Challenge:** Implementing the bandpass filters correctly and tuning the classification thresholds for realistic state transitions.
- **Insight:** The simulation effectively demonstrates how BCIs work by mapping brain signals to visual outputs.

### Prompts Used
- "Cómo implementar filtros pasa banda con scipy.signal para señales EEG?"
- "Cómo generar señales EEG sintéticas con componentes Alpha y Beta?"
- "Cómo crear una interfaz interactiva con PyGame para visualización en tiempo real?"

---
## Exercise 11 — Projective Spaces and Projection Matrices

### Objective
Explore projective geometry concepts through the implementation of orthographic and perspective projection matrices, visualizing 3D objects from different camera viewpoints.

### General Description
1. Implementation of **homogeneous coordinates** for 3D point representation.
2. Creation of **orthographic and perspective projection matrices** from scratch.
3. Development of **view matrices** (lookAt) for camera positioning.
4. Visualization of a 3D cube from **4 different cameras** (Frontal, Superior, Lateral, Isometric).
5. **Interactive selector** with `ipywidgets` to switch between cameras and projection types.
6. **Depth visualization** using color gradients (Z-buffer simulation).

### Evidence
- **Animated GIF:** showing camera switching and projection type changes.
  
  ![conmutacion_camaras](./gifs/11/conmutacion_camaras.gif)


**Link to the code:**
> [Colab Notebook](./exercises/11_projective_spaces_and_projection_matrices/python/Espacios_proyectivos_matrices_proyeccion.ipynb)

### Personal Comments
- **Learning:** I gained deep understanding of how 3D graphics pipelines work, from world coordinates to screen space through matrix transformations.
- **Challenge:** Implementing the projection matrices correctly and understanding the mathematical differences between orthographic and perspective projections.
- **Insight:** The interactive selector made it clear how camera position and projection type dramatically affect the final 2D representation of 3D objects.

### Prompts Used
- "Cómo implementar coordenadas homogéneas en Python?"
- "Cómo crear matrices de proyección y vista desde cero?"

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
│   │   └── python/
│   │       └── simulacion_BCI.py
│   └── 11_projective_spaces_and_projection_matrices/
│       └──  python/
│           └── Espacios_proyectivos_matrices_proyeccion.ipynb
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
│   │   └── bci_simulation.gif
│   └── 11/
│   │   └── commutacion_camaras.gif
└── README.md

```
