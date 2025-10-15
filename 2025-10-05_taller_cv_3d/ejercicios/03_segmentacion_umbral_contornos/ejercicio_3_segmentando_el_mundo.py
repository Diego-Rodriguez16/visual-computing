import numpy as np
import cv2
import matplotlib.pyplot as plt
from PIL import Image
import io
import math
# Función para crear GIF
def create_gif(images, duration=1000):
    frames = []
    for img in images:
        # Convertir de BGR a RGB si es necesario
        if len(img.shape) == 3 and img.shape[2] == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Convertir a uint8 si es necesario
        if img.dtype != np.uint8:
            img = (img * 255).astype(np.uint8)
        frames.append(Image.fromarray(img))
    
    # Guardar como GIF
    frames[0].save('proceso.gif', save_all=True, append_images=frames[1:], duration=duration, loop=0)

# Cargar imagen
img = cv2.imread('image.jpg')

# Convertir a escala de grises
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Aplicar suavizado Gaussiano para reducir ruido
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Umbralización fija con Otsu (determina automáticamente el mejor umbral)
thresh_val, thresh_fixed = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

# Umbralización adaptativa con parámetros ajustados
thresh_adaptive = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY, 21, 5)

# Aplicar operaciones morfológicas para mejorar la detección
kernel = np.ones((3,3), np.uint8)
thresh_fixed = cv2.morphologyEx(thresh_fixed, cv2.MORPH_CLOSE, kernel)
thresh_adaptive = cv2.morphologyEx(thresh_adaptive, cv2.MORPH_CLOSE, kernel)

# Encontrar contornos en ambas imágenes (ahora buscamos todos los contornos, no solo externos)
contours_fixed, _ = cv2.findContours(thresh_fixed, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours_adaptive, _ = cv2.findContours(thresh_adaptive, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# Crear copias para dibujar
result_fixed = img.copy()
result_adaptive = img.copy()

# Procesar contornos
def process_contours(image, contours):
    result = image.copy()
    min_area = 100  # Área mínima para filtrar ruido
    
    for cnt in contours:
        # Calcular área
        area = cv2.contourArea(cnt)
        
        # Filtrar contornos pequeños
        if area < min_area:
            continue
            
        # Calcular perímetro
        perimeter = cv2.arcLength(cnt, True)
        
        # Aproximar forma
        epsilon = 0.02 * perimeter  # Reducido para mejor detección
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        vertices = len(approx)
        circularity= perimeter**2/(4*math.pi*area)

        # Dibujar contorno con color según número de vértices
        color = (0, 255, 0)  # Verde por defecto
        if vertices == 3:
            color = (255, 0, 0)  # Triángulo - Azul
        elif vertices == 4:
            color = (0, 0, 255)  # Cuadrilátero - Rojo
        elif (4 * math.pi * area) / (perimeter**2) > 0.85:
            color = (255, 255, 0) # Círculo - Cian
        elif vertices > 4:
            color = (0, 255, 255) # Amarillo

        # Calcular centroide
        M = cv2.moments(cnt)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            
            # Dibujar centroide
            cv2.circle(result, (cx, cy), 3, (0, 255, 0), -1)
        

        
        cv2.drawContours(result, [cnt], -1, color, 1)
        
        # Dibujar rectángulo delimitador si el área es significativa
        if area > min_area * 2:
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.rectangle(result, (x, y), (x+w, y+h), (255, 0, 255), 1)
        
    return result

# Procesar ambas imágenes
result_fixed = process_contours(result_fixed, contours_fixed)
result_adaptive = process_contours(result_adaptive, contours_adaptive)

# Crear GIF con el proceso
create_gif([img, thresh_fixed, result_fixed,
           img, thresh_adaptive, result_adaptive], duration=1000)

# Mostrar resultados
plt.figure(figsize=(15, 10))

plt.subplot(231)
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.title('Imagen Original')
plt.axis('off')

plt.subplot(232)
plt.imshow(thresh_fixed, cmap='gray')
plt.title('Umbralización Fija (Otsu)')
plt.axis('off')

plt.subplot(233)
plt.imshow(cv2.cvtColor(result_fixed, cv2.COLOR_BGR2RGB))
plt.title('Contornos (Umbral Fijo)')
plt.axis('off')

plt.subplot(234)
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.title('Imagen Original')
plt.axis('off')

plt.subplot(235)
plt.imshow(thresh_adaptive, cmap='gray')
plt.title('Umbralización Adaptativa')
plt.axis('off')

plt.subplot(236)
plt.imshow(cv2.cvtColor(result_adaptive, cv2.COLOR_BGR2RGB))
plt.title('Contornos (Umbral Adaptativo)')
plt.axis('off')

plt.tight_layout()
plt.show()