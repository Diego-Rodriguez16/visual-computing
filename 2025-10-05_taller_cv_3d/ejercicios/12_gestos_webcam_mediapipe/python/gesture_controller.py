import cv2
import mediapipe as mp
import math
import numpy as np

# --- Initialization ---
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
cap = cv2.VideoCapture(0)

# IDs of the fingertips
tip_ids = [4, 8, 12, 16, 20]

# --- Function to count fingers ---
def count_fingers(hand_landmarks):
    finger_count = 0
    
    # Logic for the thumb (compare X position)
    if hand_landmarks.landmark[tip_ids[0]].x < hand_landmarks.landmark[tip_ids[0] - 1].x:
        finger_count += 1
    
    # Logic for the other 4 fingers (compare Y position)
    for id in range(1, 5):
        if hand_landmarks.landmark[tip_ids[id]].y < hand_landmarks.landmark[tip_ids[id] - 2].y:
            finger_count += 1
            
    return finger_count

# --- Main Loop ---
with mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5) as hands:

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        height, width, _ = frame.shape
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw landmarks
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # --- TASK 1: Count fingers ---
                fingers = count_fingers(hand_landmarks)
                
                # --- TASK 2: Measure distance (Pinch Gesture) ---
                thumb_tip = hand_landmarks.landmark[4]
                index_tip = hand_landmarks.landmark[8]
                
                # Convert normalized coordinates to pixels
                thumb_x, thumb_y = int(thumb_tip.x * width), int(thumb_tip.y * height)
                index_x, index_y = int(index_tip.x * width), int(index_tip.y * height)
                
                # Calculate Euclidean distance
                distance = math.hypot(index_x - thumb_x, index_y - thumb_y)
                
                # Draw line between fingers
                cv2.line(frame, (thumb_x, thumb_y), (index_x, index_y), (255, 0, 0), 3)

                # --- TASK 3: Map gestures to actions ---
                # Action 1: Circle color changes with the number of fingers
                color = (0, 0, 255) # Default red
                if fingers == 1: color = (255, 0, 0) # Blue
                elif fingers == 2: color = (0, 255, 0) # Green
                elif fingers == 3: color = (0, 255, 255) # Yellow
                elif fingers == 4: color = (255, 0, 255) # Magenta
                elif fingers == 5: color = (255, 255, 255) # White

                # Action 2: Circle position follows the index finger
                circle_center = (index_x, index_y)
                
                # Action 3: Circle radius changes with the pinch distance
                # Map the distance (e.g., 20-200px) to a radius (e.g., 10-60px)
                radius = int(np.interp(distance, [20, 200], [10, 60]))
                
                # Draw the controlled circle
                cv2.circle(frame, circle_center, radius, color, cv2.FILLED)

                # Display information on screen
                cv2.putText(frame, f'Fingers: {fingers}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                cv2.putText(frame, f'Distance: {int(distance)}', (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)


        cv2.imshow('Gesture Control', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()