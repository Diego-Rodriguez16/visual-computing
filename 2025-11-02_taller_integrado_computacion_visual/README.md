# Integrated workshop - visual computing

## Workshop Summary

This repository documents the work completed for the Visual Computing & 3D Workshop.

## Exercises

This section details the exercises that have been completed so far.

---

### 7. Webcam Gesture Control

- **Brief Explanation:** This project implemented a real-time gesture control system using Python and MediaPipe. The initial version focused on core gesture recognition: counting raised fingers and detecting a "pinch" by measuring the distance between the thumb and index finger. These gestures were mapped to control the color, size, and position of a circle. The project was then extended into a bonus minigame where the user must "pop" a randomly appearing target by moving their hand and using the pinch gesture.
- **Key Results (GIFs):**

|            Gesture Controlled Object             |             "Pop the Target" Minigame             |
| :----------------------------------------------: | :-----------------------------------------------: |
| ![Interactive gif](./python/assets/gestures.gif) | ![Interactive gif](./python/assets/mini-game.gif) |

- **Link to Code:**
  - [View Gesture Control Code](./python/gestures/)
- **Personal Comments:**
  - **Learning:** This was an excellent introduction to the power of pre-trained models like MediaPipe. The primary learning was in translating raw landmark coordinates into robust, meaningful gestures. Implementing the minigame logic was a great exercise in managing application state and event detection.
  - **Challenges:** The main technical challenge was devising a reliable logic for counting fingers, especially the thumb. For the minigame, tuning the gesture thresholds for a responsive but not overly sensitive interaction was key.

---

## Dependencies and How to Run

### Python Environment

- **Dependencies:** Python 3.8+, OpenCV, MediaPipe, NumPy.
- **Installation:**
  ```bash
  pip install opencv-python mediapipe numpy
  ```
- **Execution:** Navigate to an exercise directory and run the script.
  ```bash
  # Example for the minigame
  cd python/gestures/
  python game.py
  ```

## Repository Structure

```
2025-11-02_taller_integrado_computacion_visual/
├── python/
│   ├── assets/
│   │   ├── gestures.gif
│   │   └── mini-game.gif
│   └── gestures/
│       ├── game.py
│       ├── game.py
│       └── gesture_controller.py
└── README.md
```
