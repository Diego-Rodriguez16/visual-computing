import cv2
import numpy as np
import math
from PIL import Image

# --- Función para crear GIF ---
def create_gif(images, duration=1000, filename='proceso_metricas.gif'):
    """Crea y guarda un GIF a partir de una lista de imágenes."""
    frames = []
    for img_np in images:
        if len(img_np.shape) == 2:
            img_np = cv2.cvtColor(img_np, cv2.COLOR_GRAY2RGB)
        elif img_np.dtype != np.uint8:
            img_np = (img_np * 255).astype(np.uint8)
        elif img_np.shape[2] == 3:
             img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
    frames.append(Image.fromarray(img_np))
    if frames: # Asegurarse de que haya al menos un frame para guardar
        frames[0].save(filename, save_all=True, append_images=frames[1:], duration=duration, loop=0)
        print(f"GIF guardado como '{filename}'")

# --- Función para colocar etiquetas de forma inteligente ---
def get_label_position(cx, cy, img_width):
    pos_x = cx - 60
    pos_y = cy - 15
    if pos_x < 0:
        pos_x = cx + 15
    # Asegurarse que la etiqueta no se salga por la derecha
    if pos_x + 150 > img_width: # Estimado, ajustar 150 según largo de etiquetas
        pos_x = img_width - 150
        if pos_x < 0: pos_x = 0 # En caso de que la imagen sea muy estrecha

    # Asegurarse que la etiqueta no se salga por arriba
    if pos_y < 0:
        pos_y = cy + 20 # Moverla un poco hacia abajo

    return (pos_x, pos_y)

# --- Inicio del Script ---
try:
    img = cv2.imread('image.jpg')
    if img is None:
        raise FileNotFoundError("El archivo 'image.jpg' no se encontró.")

    img_height, img_width, _ = img.shape
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    result_image = img.copy()
    
    # === CAMBIO CLAVE PARA EL GIF ANIMADO ===
    gif_animation_frames = [img.copy(), cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)] 
    # Añadimos la imagen original y la binarizada como primeros frames
    # Luego, añadiremos un frame por cada contorno procesado
    # =========================================

    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        perimeter = cv2.arcLength(cnt, True)

        if area < 400 or perimeter < 50:
            continue

        M = cv2.moments(cnt)
        cx = int(M["m10"] / M["m00"]) if M["m00"] != 0 else 0
        cy = int(M["m01"] / M["m00"]) if M["m00"] != 0 else 0

        epsilon = 0.035 * perimeter
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        vertices = len(approx)
        
        circularity = (4 * math.pi * area) / (perimeter**2) if perimeter > 0 else 0
        
        shape_label = f"Poligono ({vertices}v)"
        color = (255, 0, 255) # Magenta por defecto

        if vertices == 3:
            shape_label = "Triangulo"
            color = (255, 0, 0) # Azul
        elif vertices == 4:
            x, y, w, h = cv2.boundingRect(approx)
            aspect_ratio = float(w)/h
            if 0.90 <= aspect_ratio <= 1.10: # Rango un poco más amplio para cuadrados
                shape_label = "Cuadrado"
            else:
                shape_label = "Rectangulo"
            color = (0, 255, 0) # Verde
        elif circularity > 0.88:
            shape_label = "Circulo"
            color = (0, 0, 255) # Rojo
        else:
            if vertices == 5:
                shape_label = "Pentagono"
            elif vertices == 6:
                shape_label = "Hexagono"
            color = (255, 165, 0) # Naranja

        cv2.drawContours(result_image, [cnt], -1, color, 3)
        cv2.circle(result_image, (cx, cy), 5, (255, 255, 255), -1)

        label_pos = get_label_position(cx, cy, img_width)
        text = f"#{i+1} [{shape_label}]"
        metrics_text = f"A:{int(area)} P:{int(perimeter)}"
        
        cv2.putText(result_image, text, label_pos, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 4, cv2.LINE_AA)
        cv2.putText(result_image, text, label_pos, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1, cv2.LINE_AA)
        cv2.putText(result_image, metrics_text, (label_pos[0], label_pos[1] + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 4, cv2.LINE_AA)
        cv2.putText(result_image, metrics_text, (label_pos[0], label_pos[1] + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1, cv2.LINE_AA)

        # === CAMBIO CLAVE PARA EL GIF ANIMADO ===
        # Añadir una copia del estado actual de result_image al final de cada iteración
        gif_animation_frames.append(result_image.copy())
        # =========================================

    # --- Guardar GIF animado ---
    create_gif(gif_animation_frames, duration=700) # Duración ajustada para la animación

    # --- Mostrar SOLO la imagen de resultados final ---
    cv2.namedWindow('Resultados con Metricas', cv2.WINDOW_NORMAL)
    cv2.imshow('Resultados con Metricas', result_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

except FileNotFoundError as e:
    print(e)
except Exception as e:
    print(f"Ocurrió un error inesperado: {e}")