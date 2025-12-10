# Workshop 1: Materials, Lighting, and Color in a Virtual World

## Equipo:

● Michael Sebastian Caicedo Rosero
● Diego Leandro Rodriguez Diaz
● Sergio David Motta Romero
● Juan Diego Velasquez Pinzon
● Breyner Ismael Ciro Otero

## The Forgemaster's Workshop

This project presents an interactive 3D scene of a rustic forge, designed to explore how PBR and procedural materials react to different lighting schemes. The goal is to create a tangible atmosphere where light not only illuminates but also tells a story about the world's textures and surfaces. Using the **three js Editor**

---

## 1. GLB Models Used 📦

To build the scene, three models with distinct roles were selected, creating a balanced and coherent composition.

- **Architectural Model: The Forge Building**

  - **Source**: from Sketchfab
  - **Modifications**: The material of the **roof tiles** was adjusted to increase its `metalness` and decrease `roughness`, giving it a more polished, reflective look under the light.

- **Character & Environment Model: The Blacksmith Area**

  - **Source**: from Sketchfab
  - **Modifications**: To create a focal point, the **anvil's material** was modified to look like realistic forged iron, making it stand out from the character.

- **Utility Model: The Crafting Table**
  - **Source**: from Sketchfab
  - **Modifications**: This object received significant changes. New **PBR wood textures** (albedo, roughness, normal maps) were applied to the table's body for a richer appearance. The **tools** on the table were also given a metallic finish.

---

## 2. Lighting 💡

Lighting is the cornerstone of this project, designed to sculpt shapes and reveal the properties of materials. A 3-point lighting scheme was used along with ambient light.

### Lighting Scheme

- **Key Light**: A `DirectionalLight` that acts as the primary light source. It's the most intense and the only one that casts sharp shadows, defining the main forms.
- **Fill Light**: Another `DirectionalLight` with lower intensity and a slightly cooler color, used to soften the harsh shadows from the key light.
- **Rim Light**: A `DirectionalLight` positioned behind the objects to create a bright edge that separates them from the background, adding depth.
- **Ambient Light**: A dim `AmbientLight` ensures no part of the scene is completely black.

### Lighting Presets

Two environments were created to demonstrate material versatility:

- **"Day" Preset**: The Key Light is a neutral white color (`#FFFFFF`), positioned high to simulate noon.
- **"Sunset" Preset**: The Key Light changes to a deep orange (`#FF8C00`), and its angle is lower, creating long shadows and a warm atmosphere.

---

## 3. Materials and Textures (PBR) 🎨

The scene's realism is based on **PBR (Physically Based Rendering)** materials, which simulate how light interacts with surfaces based on `Roughness` (how polished a surface is) and `Metalness` (whether it's a metal or not). This was most notably applied to the crafting table.

|                                                Before PBR                                                 |                                                       After PBR                                                       |
| :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
| ![Original Crafting Table](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Before-textures.png) | ![Crafting Table with new PBR Textures](/2025-09-29_taller_1_materiales_iluminacion_color/renders/After-textures.png) |

---

## 4. Procedural Shaders 🎲

To demonstrate parameter-driven patterns, procedural textures were applied to the floor. Unlike PBR textures, these are generated patterns controlled via code. Both checkerboard and noise textures were tested.

- **Assigned to object**: The floor plane.
- **Key Parameters**: A script was attached to the floor object to control the texture's tiling. This script sets the `wrap` mode and `repeat` value, transforming a single image into a detailed pattern.
  - `texture.wrapS = THREE.RepeatWrapping;`
  - `texture.wrapT = THREE.RepeatWrapping;`
  - `texture.repeat.set(12, 12);` (This parameter was adjusted to control the density of the checkerboard/noise pattern).

---

|                                              Albedo                                              |                                                    Noise                                                     |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![Original Crafting Table](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Albedo.png) | ![Crafting Table with new PBR Textures](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Noise.png) |

---

## 5. Cameras 🎥

Two cameras were configured to offer different perspectives.

- **Perspective Camera**: Simulates human vision, creating a sense of depth and immersion. Used for the main animated tour.
- **Orthographic Camera**: Removes perspective, perfect for technical, top-down, or stylized diorama-like views.

---

## 6. Animations ✨

Subtle animations were implemented via scripts to bring the scene to life and showcase the interplay between light and materials.

- **Light Animation**: The **Key Light orbits** the entire scene in a wide arc. This dynamically demonstrates how PBR materials react as the light source moves, causing reflections and shadows to shift realistically.
- **Camera Animation**: The **camera performs a similar orbit** around the forge, providing a 360-degree view of the entire composition.
- **Object Animation**: The **crafting table rotates slowly** on its vertical axis. This highlights the new PBR materials applied to it, showing how they react to the moving light from all angles.

---

## 7. Color Model 🎨

A cohesive color palette was chosen to create a specific mood and guide the viewer's attention.

- **Base Palette (HSV)**: A palette of muted, analogous colors (browns, grays, greens) was used for the environment, with a strong complementary accent color.
- **Accent Tone**: Bright orange/red is used for the sunset light and the hot metal on the anvil to serve as a focal point.
- **Perceptual Contrast (CIELAB)**: The bright orange accent has a high lightness (L\*) and chromaticity value, making it stand out perceptually against the darker, less saturated background. This immediately draws the eye to the key areas of the scene.

---

## 8. Visual Demonstration 📸

### Screenshots

![Perspective view with day lighting.](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Perspective.png)

![Top-down orthographic view showing the layout.](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Orthographic.png)

### Video / Animated GIFs

**GIF 1: Change of cameras**

![GIF showing the change of cameras](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Cameras.gif)

**GIF 2: Day & Sunset Lighting**

![GIF showing the change of light](/2025-09-29_taller_1_materiales_iluminacion_color/renders/Lighting.gif)

**GIF 2: Object & Light Animation**

![GIF showing the tour and animations](/2025-09-29_taller_1_materiales_iluminacion_color/renders/World.gif)
