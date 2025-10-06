import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";

// Este es el componente principal de nuestra escena 3D
function Scene() {
    // El panel de control de 'leva' funciona perfectamente
    const { color, roughness, metalness } = useControls({
        color: "#ff8800",
        roughness: { value: 0.5, min: 0, max: 1 },
        metalness: { value: 0.1, min: 0, max: 1 }
    });

    // Crear una referencia para acceder directamente al mesh
    const meshRef = useRef();

    // useFrame se ejecuta en cada fotograma, creando la animación
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        // FIX: La propiedad 'ref' debe ir dentro de la etiqueta <mesh>
        <mesh ref={meshRef}>
            {/* La forma del objeto: una caja */}
            <boxGeometry args={[1.5, 1.5, 1.5]} />

            {/* El material cuyas propiedades se controlan con el panel */}
            <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
            />
        </mesh>
    );
}

// Componente principal de la aplicación (no necesita cambios)
export default function App() {
    return (
        <Canvas camera={{ position: [0, 0, 3.5] }}>
            {/* Luces mejoradas para una mejor visualización */}
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
            />
            <pointLight
                position={[-10, -10, -10]}
                decay={0}
                intensity={Math.PI}
            />
            <Scene />
        </Canvas>
    );
}
