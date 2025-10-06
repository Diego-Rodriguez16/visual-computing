import React from "react";
// Importa 'createRoot' desde 'react-dom/client' en lugar de 'ReactDOM'
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// 1. Obtén el contenedor del DOM
const container = document.getElementById("root");

// 2. Crea una "raíz" (root) para la aplicación
const root = createRoot(container);

// 3. Renderiza tu aplicación dentro de la raíz
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
