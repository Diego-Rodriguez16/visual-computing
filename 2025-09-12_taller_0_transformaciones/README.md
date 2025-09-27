# 🖥️ Transformations & Animations Workshop

This folder contains implementations of **object transformations and animations** using different tools and frameworks: **Python, Three.js (React Three Fiber), Unity, and Processing**.  
Each example demonstrates **translation, rotation, and scaling** over time, and all results are exported as animated GIFs for visualization.

---

## 1. 💻 Python (matplotlib + numpy + imageio)

A simple 2D square animated using **matrix transformations** (translation, rotation, and scaling).  
Frames are generated with `matplotlib` and exported as a GIF using `imageio`.

**Key Concepts:**

- Homogeneous 3×3 matrices (`T`, `R`, `S`).
- Composition of transformations.
- Time-driven animation with interpolation.

**Result:**  
![Python Animation](/2025-04-15_taller1_transformaciones/python/docs/output.gif)

---

## 2. 🌐 Three.js with React Three Fiber

A 3D cube rendered in a browser with **React Three Fiber**.  
The cube moves in a **circular trajectory**, rotates around its own axes, and scales smoothly with a sine function.  
`OrbitControls` allows users to interactively explore the scene.

**Key Concepts:**

- `useFrame` hook for per-frame updates.
- Translation using sine and cosine.
- Rotation and scaling with time functions.

**Result:**  
![Three.js Animation](/2025-04-15_taller1_transformaciones/threejs/docs/output.gif)

---

## 3. 🎮 Unity (C# Script)

A Unity project with a cube (or sphere) animated using a **C# script**.  
The object randomly changes translation axis, rotates constantly, and scales cyclically.  
Parameters such as speed, interval, and amplitude are configurable in the Inspector.

**Key Concepts:**

- `transform.Translate()`, `transform.Rotate()`, `transform.localScale`.
- Time-driven updates with `Time.deltaTime` and `Mathf.Sin(Time.time)`.
- Optional reset to initial position.

**Result:**  
![Unity Animation](/2025-04-15_taller1_transformaciones/unity/docs/output.gif)

---

## 4. 🎨 Processing (2D or 3D)

A sketch created in **Processing** (Java mode).  
The shape (rectangle or box) translates in a wavy pattern, rotates continuously, and scales cyclically.  
Transformations are isolated using `pushMatrix()` and `popMatrix()`.

**Key Concepts:**

- `translate()`, `rotate()`, `scale()`.
- Animation based on `millis()`, `frameCount`, or `sin()`.
- Matrix isolation with `pushMatrix()` / `popMatrix()`.

**Result:**  
![Processing Animation](/2025-04-15_taller1_transformaciones/processing/docs/output.gif)

---

## 📚 Learning Outcomes

Across all four implementations, you will learn to:

- Animate objects in **2D and 3D** environments.
- Use **translation, rotation, and scaling** transformations.
- Control animations with **time functions**.
- Export or capture animations as GIFs for documentation.

---
