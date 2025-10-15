import cv2
import numpy as np

# Inicializar webcam
cap = cv2.VideoCapture(0)

# Crear ventana
cv2.namedWindow("Filtros en vivo")

# --- Función vacía para los sliders ---
def nothing(x):
    pass

# --- Sliders principales ---
cv2.createTrackbar("Blur", "Filtros en vivo", 1, 20, nothing)
cv2.createTrackbar("Sharpen", "Filtros en vivo", 0, 5, nothing)
cv2.createTrackbar("Sobel", "Filtros en vivo", 0, 1, nothing)       # 0=OFF, 1=ON
cv2.createTrackbar("Laplaciano", "Filtros en vivo", 0, 1, nothing)  # 0=OFF, 1=ON

while True:
    ret, frame = cap.read()
    if not ret:
        print("No se pudo acceder a la cámara.")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # --- Leer sliders ---
    blur_value = cv2.getTrackbarPos("Blur", "Filtros en vivo")
    sharpen_value = cv2.getTrackbarPos("Sharpen", "Filtros en vivo")
    sobel_on = cv2.getTrackbarPos("Sobel", "Filtros en vivo")
    lap_on = cv2.getTrackbarPos("Laplaciano", "Filtros en vivo")

    # --- Filtro Blur ---
    if blur_value > 0:
        gray = cv2.GaussianBlur(gray, (2 * blur_value + 1, 2 * blur_value + 1), 0)

    # --- Filtro Sharpen ---
    if sharpen_value > 0:
        kernel = np.array([[0, -1, 0],
                           [-1, 5 + sharpen_value, -1],
                           [0, -1, 0]])
        gray = cv2.filter2D(gray, -1, kernel)

    # --- Filtro Sobel ---
    if sobel_on == 1:
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        sobel = cv2.addWeighted(cv2.convertScaleAbs(sobelx), 0.5,
                                cv2.convertScaleAbs(sobely), 0.5, 0)
        gray = sobel

    # --- Filtro Laplaciano ---
    if lap_on == 1:
        lap = cv2.Laplacian(gray, cv2.CV_64F)
        gray = cv2.convertScaleAbs(lap)

    # --- Mostrar resultado ---
    cv2.imshow("Filtros en vivo", gray)

    # Salir con ESC
    if cv2.waitKey(1) & 0xFF == 27:
        break

# Liberar cámara
cap.release()
cv2.destroyAllWindows()

