import cv2
import numpy as np

# --- Cargar imagen ---
img = cv2.imread("guacamaya.jpg")  # Cambia por el nombre de tu imagen
if img is None:
    raise ValueError("No se pudo cargar la imagen. Verifica la ruta.")

# Redimensionar para que sea más manejable
img = cv2.resize(img, (600, 400))

# --- Crear ventana con sliders ---
cv2.namedWindow("Ajuste de Brillo y Contraste")

def nothing(x):
    pass

# Sliders: (nombre, ventana, valor_inicial, valor_max, función)
cv2.createTrackbar("Contraste", "Ajuste de Brillo y Contraste", 100, 300, nothing)
cv2.createTrackbar("Brillo", "Ajuste de Brillo y Contraste", 50, 100, nothing)

while True:
    # Leer los valores actuales de los sliders
    contrast = cv2.getTrackbarPos("Contraste", "Ajuste de Brillo y Contraste")
    brightness = cv2.getTrackbarPos("Brillo", "Ajuste de Brillo y Contraste") 

    # Normalizar valores (contraste: 1.0 = 100)
    contrast = contrast / 100.0
    brightness = brightness - 50  # Rango: [-50, +50]

    # Aplicar brillo y contraste
    adjusted = cv2.convertScaleAbs(img, alpha=contrast, beta=brightness)

    # Mostrar la imagen ajustada
    combined = np.hstack((img, adjusted))
    cv2.imshow("Ajuste de Brillo y Contraste", combined)

    # Salir con la tecla ESC
    key = cv2.waitKey(1)
    if key == 27:  # ESC
        break

cv2.destroyAllWindows()
