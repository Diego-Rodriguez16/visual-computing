# Three.js Editor Scene Setup Guide ⚙️

## Overview

This folder contains the final scene for the workshop. The project was created entirely within the **Three.js Editor**, and all scene data—including models, textures, lights, materials, and animation scripts—is saved within a single `project.json` file.

**Important:** Due to the large file size of the exported scene, the project file has been compressed and split into **two parts** using WinRAR. You will need to reconstruct the file before you can load it.

---

## Prerequisites

Before you begin, please ensure you have the following:

- A file archiver compatible with multi-part RAR archives (e.g., **WinRAR** or **7-Zip**).
- A modern web browser (e.g., **Chrome**, **Firefox**) to access the Three.js Editor.
- The **Three.js Editor** website, accessible at: `https://threejs.org/editor`

---

## Setup Instructions

Please follow these steps carefully to load and view the project correctly.

### 1. Reconstruct the Project File

The project is contained in a split WinRAR archive.

1.  Inside this folder, you should find two files: `project.part1.rar` and `project.part2.rar`.
2.  Ensure **both** files are in the same location.
3.  Right-click on the first file, **`project.part1.rar`**, and select **"Extract Here"** (or a similar option).

The archiver will automatically detect the second part and combine them to extract the single, complete **`project.json`** file.

### 2. Load the Scene in the Editor

1.  Open the **Three.js Editor** in your web browser by navigating to `https://threejs.org/editor`.
2.  Drag and drop the extracted **`project.json`** file from your folder directly onto the editor's main viewport (the 3D view).

### 3. Run the Scene

After dragging the file, the editor will load the entire project. All models, lighting, and materials should appear exactly as designed.

To see the animations (camera movement, object rotation, etc.), click the **"Play"** button located in the main toolbar at the top of the editor.
