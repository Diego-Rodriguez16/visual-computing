# Visualización de imágenes y video 360°

---

## 🧠 Conceptos Aprendidos  
- [x] Proyecciones equirectangulares  
- [x] Skybox y esferas invertidas  
- [x] Reproducción programática de video 360°  
- [x] Controles de cámara interactivos  
- [x] Integración de texturas en shaders  

---

## 🔧 Herramientas y Entornos  
- **Unity 2022.3 LTS**:  
  `VideoPlayer`, `XR Interaction Toolkit`, `Shader Graph`  
- **Three.js + React**:  
  `@react-three/fiber`, `@react-three/drei`, `three.js`  
- **Python (Opcional)**:  
  `opencv-python` para preprocesamiento de texturas  

---

## 📁 Estructura del Proyecto

```
05_visualización_360/
├── unity/
│ ├── Assets/
│ │ ├── Scripts/
│ │ │ ├── Video360Manager.cs
│ │ │ └── PanoramicCamera.cs
│ │ └── Videos/
│ │ | └── video.mp4
├── threejs/
│ ├── public/
│ │ └── videos/
│ │ └── video.mp4
│ ├── src/
│ │ ├── components/
│ │ │ └── Video360Viewer.tsx
│ │ └── App.tsx
└── README.md
```

---

## 🧪 Implementación  

### 🔹 Unity - Video 360°  
**Pasos clave**:  
1. Crear una esfera con normales invertidas (`Scale X = -1`).  
2. Configurar el componente `VideoPlayer`:  
```csharp
public class Video360Manager : MonoBehaviour {
    void Start() {
        VideoPlayer vp = gameObject.AddComponent<VideoPlayer>();
        vp.url = System.IO.Path.Combine(Application.streamingAssetsPath, "space_360.mp4");
        vp.targetMaterialRenderer = GetComponent<Renderer>();
        vp.Play();
    }
}
```

###  Three.js (React Fiber) - Visor Interactivo

```typescript
function Video360Viewer() {
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial side={THREE.BackSide}>
        <videoTexture attach="map" args={[videoRef.current!]} />
      </meshBasicMaterial>
      <OrbitControls enableZoom={false} />
    </mesh>
  )
}
```
---

## 📊 Resultados Visuales

- Unity
  ![prueba_unity](./unity/prueba.gif)

- Threejs

  ![prueba_threejs](./threejs/prueba.gif)

---

## 🧩 Prompts Usados

> como puedo cargar y visualizar el video en unity? teniendo en cuenta la solución que me acabas de proveer, que tipo de archivo de video deberia subir? donde podria conseguir un ejemplo?

---
## 💬 Reflexión Final  
El taller permitió explorar dos enfoques complementarios para visualización inmersiva:  
- **Unity**: Demostró ser ideal para experiencias complejas con integración XR y manejo avanzado de assets.  
- **Three.js**: Ofreció una solución ligera y eficiente para despliegue web con controles intuitivos.  

**Principales aprendizajes**:  
1. La importancia de la optimización de texturas para videos 4K  
2. Diferencias en el pipeline de renderizado entre motores 3D  
3. Retos de sincronización audio-visual en contenido 360°  

**Desafíos superados**:  
✅ Configuración de materiales para esferas invertidas  
✅ Implementación de controles multiplataforma (mouse/touch/XR)  
✅ Manejo de autoplay en navegadores móviles  

**Mejoras futuras**:  
- Implementar transiciones suaves entre escenas  
- Añadir soporte para audio espacial  
- Integrar sistema de marcadores interactivos  

---