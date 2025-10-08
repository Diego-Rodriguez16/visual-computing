## Ejercicio 5 — Rasterización desde Cero

En este notebook implementamos desde cero tres algoritmos clásicos de rasterización:

-   Algoritmo de  **Bresenham**  para líneas.
-   Algoritmo de  **Punto Medio**  para círculos.
-   Algoritmo de  **Scanline**  para triángulos.

Sin librerías gráficas de alto nivel (solo NumPy y Matplotlib).
### Algoritmo de Bresenham — Líneas

Este algoritmo permite dibujar líneas de forma eficiente usando solo operaciones enteras.

**Idea básica:**

-   Se avanza paso a paso en la dirección X, calculando el error para decidir cuándo incrementar Y.
-   No se usan multiplicaciones o divisiones en cada paso.
- ![Bresenham](`assets/bresenham.jpg)
### Algoritmo de Punto Medio — Círculos

Este algoritmo rasteriza un círculo aprovechando su  **simetría octogonal**, calculando solo un octante y reflejando los puntos.

**Idea básica:**

-   Se inicia en (0, r) y se avanza en x.
-   Se utiliza un parámetro de decisión  `p`  para determinar si el siguiente punto está dentro o fuera del círculo ideal.
-   Los puntos se reflejan en los 8 octantes para dibujar el círculo completo.
 ![Punto medio](`assets/punto_medio.jpg)
## #Algoritmo de Scanline — Triángulos

El algoritmo  **Scanline**  rellena un triángulo línea por línea (por filas de pixeles), intersectando las aristas con cada scanline horizontal.

**Idea básica:**

-   Se ordenan los vértices por Y.
-   Para cada fila, se encuentran las intersecciones con los lados del triángulo.
-   Se rellenan los puntos entre las intersecciones izquierda y derecha.
 ![Scanline](`assets/scanline.jpg)
## Ejercicio 9 — Filtro Visual (Convoluciones Personalizadas)

Este ejercicio implementa una  **convolución 2D manual**  y la compara con la función  `cv2.filter2D`  de OpenCV.

Se diseñan tres kernels:

-   **Sharpen (Afilado):**  resalta los bordes y detalles.
-   **Blur (Desenfoque):**  suaviza la imagen reduciendo ruido.
-   **Edge Detection (Detección de bordes):**  resalta los contornos de los objetos.
- 
**Descripción del código**
El programa descarga una imagen de ejemplo (“Lena”) desde internet y la convierte a escala de grises. Luego, implementa manualmente una **convolución 2D**, que consiste en aplicar un **kernel** (matriz de pesos) sobre cada píxel de la imagen para modificar sus valores. Se definen tres kernels:

-   **Sharpen** (enfocar): resalta los bordes y detalles finos.
    
-   **Blur** (desenfoque): suaviza la imagen promediando los píxeles.
    
-   **Edge Detection** (detección de bordes): resalta los contornos y transiciones de intensidad.
    

Finalmente, el código compara los resultados obtenidos con la función manual frente a la función integrada `cv2.filter2D` de OpenCV, mostrando ambas imágenes lado a lado en una misma figura.
- ![Filtros](`assets/lena_filtros.jpg)

### Exercise 10 — Exploring Color & Interactive Materials

This exercise was divided into two parts. The first part involved a deep dive into digital color models and simulations using Python and OpenCV. The second, optional part, translated these concepts into an interactive 3D scene using React Three Fiber to manipulate material properties in real-time.

---

#### Part 1: Color Analysis in Python (Google Colab)

**Explanation:**

In this section, Python, along with the OpenCV and NumPy libraries, was used to analyze how digital images are represented through different color models. The goal was to understand the practical applications and perceptual differences between these models.

- **Color Models (RGB, HSV, LAB):** A sample image was converted from the standard RGB model to HSV (Hue, Saturation, Value) and LAB.

  - **RGB** is the standard additive model for displays.
  - **HSV** is more intuitive as it separates color information (Hue and Saturation) from brightness (Value), proving useful in computer vision tasks like object tracking.
  - **LAB** is designed to be perceptually uniform, meaning changes in its values correspond more closely to how humans perceive color differences.

- **Channel Visualization:** The converted images were split into their individual channels to visualize each component. For instance, visualizing the 'S' (Saturation) channel of the HSV model clearly shows which parts of the image are the most colorful, independent of their brightness.

- **Filters and Simulations:** Several filters were applied to simulate different viewing conditions:
  - **Daltonism (Protanopia):** A color matrix transformation was implemented to simulate red-green color blindness. This demonstrates how linear algebra can be used to remap the entire color space of an image.
  - **Color Temperature:** "Warm" and "cool" filters were created by directly manipulating the values in the Red and Blue channels.
  - **Other Filters:** Basic filters like monochrome (grayscale) and color inversion were also implemented.

**Visual Evidence:**

The GIF below demonstrates the interactive menu developed in Google Colab, allowing for a quick comparison between the original image and the various filters and simulations applied.

![Python Color Analysis GIF](../../gifs/10/python.gif)

This image shows a static comparison of the original image against its separated HSV channels, making it easy to understand what each channel represents.

![HSV Channel Separation](../../assets/10/comparisson.png)

**Observations**

- **Learning Outcomes:** A key insight from this exercise was how abstract concepts like color spaces have very practical applications. The daltonism filter was particularly powerful, providing a tangible way to understand different types of vision.

---

#### Part 2: Interactive 3D Materials (React Three Fiber)

**Explanation:**

To complement the 2D analysis, an optional interactive 3D scene was built using React Three Fiber and `leva`. This project demonstrates how color and material properties are handled in a 3D rendering context, allowing for real-time manipulation.

- **Physically Based Rendering (PBR):** The scene uses a `meshStandardMaterial`, which is a PBR material. PBR aims to simulate how light interacts with surfaces in the real world using intuitive properties.
- **Interactive Controls:** The `leva` library was integrated to create a simple UI panel that directly controls the material's core properties:
  - **`color`**: The base color of the material.
  - **`roughness`**: Controls how rough or smooth the surface is (0.0 for a mirror-like surface, 1.0 for a diffuse matte surface).
  - **`metalness`**: Controls the transition between a non-metal (dielectric) and a metal surface.
- **Animation:** The `useFrame` hook from React Three Fiber was used to add a constant rotation to the object, allowing the material's properties to be observed from all angles as the light hits its surfaces.

**Visual Evidence:**

The following GIF shows the 3D scene in action. The `leva` control panel is used to change the cube's color, roughness, and metalness in real-time, while the cube continues to rotate automatically.

![Interactive 3D Material Demo](../../gifs/10/threejs.gif)

**Learning Outcomes:** This part served as a practical demonstration of PBR material properties. Observing how `roughness` and `metalness` interact to create realistic surfaces, from shiny plastic to brushed metal, was a key takeaway.
