import cv2
import mediapipe as mp
import math
import numpy as np
import random

# --- Initialization ---
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
cap = cv2.VideoCapture(0)

# --- Game Variables ---
score = 0
target_radius = 30

def get_random_position(width, height):
    """Returns a random (x, y) position within the screen boundaries."""
    x = random.randint(target_radius * 2, width - target_radius * 2)
    y = random.randint(target_radius * 2, height - target_radius * 2)
    return (x, y)

# Initialize the target position
ret, frame = cap.read()
if ret:
    height, width, _ = frame.shape
    target_pos = get_random_position(width, height)
else:
    # If the frame cannot be read, use default values
    width, height = 640, 480
    target_pos = (width // 2, height // 2)

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
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)
        
        # --- Draw the target ---
        cv2.circle(frame, target_pos, target_radius, (0, 0, 255), 3) # Red circle

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw landmarks
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # --- Get finger coordinates ---
                thumb_tip = hand_landmarks.landmark[4]
                index_tip = hand_landmarks.landmark[8]
                
                # Convert coordinates to pixels
                thumb_x, thumb_y = int(thumb_tip.x * width), int(thumb_tip.y * height)
                index_x, index_y = int(index_tip.x * width), int(index_tip.y * height)

                # --- Game Logic ---
                # 1. Distance for the "pinch" gesture
                pinch_distance = math.hypot(index_x - thumb_x, index_y - thumb_y)
                
                # 2. Distance from the index finger to the target
                cursor_to_target_dist = math.hypot(target_pos[0] - index_x, target_pos[1] - index_y)
                
                # 3. Check if the target is "caught"
                # Condition: The index finger is on the target AND the pinch gesture is made
                pinch_threshold = 40
                if cursor_to_target_dist < target_radius and pinch_distance < pinch_threshold:
                    score += 1
                    target_pos = get_random_position(width, height) # Move the target to a new position
                    
                # --- Visualization ---
                # Draw a "cursor" on the index finger
                cv2.circle(frame, (index_x, index_y), 10, (0, 255, 0), cv2.FILLED)
                
                # Change the cursor color if the pinch is active
                if pinch_distance < pinch_threshold:
                    cv2.circle(frame, (index_x, index_y), 10, (255, 255, 0), cv2.FILLED) # Cyan color when pinching

        # Display the score
        cv2.putText(frame, f'Score: {score}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 0), 3)
        cv2.imshow('Gesture Mini-Game', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()