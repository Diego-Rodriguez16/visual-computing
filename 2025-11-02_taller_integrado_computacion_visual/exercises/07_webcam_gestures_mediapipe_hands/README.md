# Webcam Gesture Control

## Dependencies

This project was developed in Python. To run the exercises, you need to have the following libraries installed.

### Dependencies

- Python 3.8+
- OpenCV
- MediaPipe
- NumPy

You can install them using pip:

```bash
pip install opencv-python mediapipe numpy
```

### Gesture Controlled Object

#### Brief Explanation:

This initial implementation focuses on the core tasks of real-time hand tracking and gesture interpretation. The application uses the MediaPipe library to detect hand landmarks from a live webcam feed. Custom logic was developed to translate this data into meaningful gestures:

- Finger Counting: A function analyzes the vertical position of fingertips relative to their knuckles to count how many fingers are raised.

- Distance Measurement: The Euclidean distance between the thumb and index fingertips is calculated to detect a "pinch" gesture.

These gestures are then mapped to control the properties of a circle drawn on the screen: its color is determined by the finger count, its position follows the index finger, and its size is controlled by the pinch distance. This serves as a foundational proof-of-concept for gesture-based interaction.

#### Animated GIF:

![Interactive gif](../../gifs/07/gestures.gif)

### V2: "Pop the Target" Minigame

#### Brief Explanation:

This second version builds upon the foundation of the first, applying the gesture recognition system to create a simple and interactive minigame. The goal of the game is to "pop" a target that appears at random locations on the screen.

### The gesture mapping was adapted for gameplay:

#### The index fingertip acts as the player's cursor.

The "pinch" gesture (bringing the thumb and index finger close together) is used as the action button to pop the target.

The game logic checks if the player's cursor is inside the target's radius while the pinch gesture is active. If both conditions are met, the player's score increases, and the target respawns at a new random location. This transforms the technical demo into a complete, interactive application.

#### Animated GIF:

![Interactive gif](../../gifs/07/mini-game.gif)

## Comments:

Learning: This exercise was an excellent introduction to the power of pre-trained models like MediaPipe. It was fascinating to see how complex hand tracking could be implemented with relatively little code. The main learning was in translating the raw landmark coordinates into meaningful, robust gestures like counting fingers.

Challenges: The primary challenge was devising a reliable logic for finger counting, especially for the thumb, which moves on a different axis than the other fingers.

## Credits/References

This project heavily utilizes the MediaPipe Hands library by Google for real-time hand landmark detection. All credit for the underlying machine learning model goes to the MediaPipe team.
