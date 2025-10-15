// components/DataVisualizer.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

// Función auxiliar para mapear valores de un rango a otro
const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export default function DataVisualizer({ data }) {
  const groupRef = useRef();
  
  // Controles para ajustar la visualización
  const { 
    layout,
    heightScale,
    colorMode,
    rotationSpeed,
    geometryType,
    animateRotation,
    showGrid
  } = useControls('Visualization', {
    layout: {
      options: ['circular', 'grid', 'spiral'],
      value: 'circular'
    },
    geometryType: {
      options: ['box', 'sphere', 'cone', 'torus'],
      value: 'box'
    },
    heightScale: {
      value: 1,
      min: 0.1,
      max: 3,
      step: 0.1
    },
    colorMode: {
      options: ['value', 'category', 'gradient'],
      value: 'value'
    },
    rotationSpeed: {
      value: 0.01,
      min: 0,
      max: 0.1,
      step: 0.001
    },
    animateRotation: true,
    showGrid: true
  });

  // Encuentra los valores mínimos y máximos para normalizar los datos
  const valueMax = Math.max(...data.map(item => item.value));
  const valueMin = Math.min(...data.map(item => item.value));
  
  // Animación de rotación del grupo
  useFrame((state, delta) => {
    if (animateRotation && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Función para determinar la posición basada en el layout
  const getPosition = (index, total) => {
    const angle = (index / total) * Math.PI * 2;
    
    switch (layout) {
      case 'circular':
        const radius = 10;
        return [
          Math.sin(angle) * radius,
          0,
          Math.cos(angle) * radius
        ];
      
      case 'grid':
        const gridSize = Math.ceil(Math.sqrt(total));
        const gridX = (index % gridSize) - gridSize / 2;
        const gridZ = Math.floor(index / gridSize) - gridSize / 2;
        return [gridX * 4, 0, gridZ * 4];
      
      case 'spiral':
        const spiralRadius = (index / total) * 10 + 2;
        return [
          Math.sin(angle * 3) * spiralRadius,
          0,
          Math.cos(angle * 3) * spiralRadius
        ];
        
      default:
        return [0, 0, 0];
    }
  };

  // Función para determinar el color basado en el modo
  const getColor = (item, index, total) => {
    switch (colorMode) {
      case 'value':
        // Colorea según el valor (azul bajo, rojo alto)
        const normalizedValue = mapRange(item.value, valueMin, valueMax, 0, 1);
        return new THREE.Color(normalizedValue, 0.2, 1 - normalizedValue);
      
      case 'category':
        // Colores por categoría
        return new THREE.Color().setHSL(item.category / 5, 0.8, 0.6);
      
      case 'gradient':
        // Gradiente de color basado en la posición
        return new THREE.Color().setHSL(index / total, 0.8, 0.6);
        
      default:
        return new THREE.Color(0x00ff00);
    }
  };

  const getGeometry = (type) => {
    switch (type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.7, 16, 16]} />;
      case 'cone':
        return <coneGeometry args={[0.7, 1.5, 16]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Grid opcional */}
      {showGrid && (
        <gridHelper args={[30, 30, 0x555555, 0x333333]} position={[0, -5, 0]} />
      )}
      
      {/* Mapear los datos a objetos 3D */}
      {data.map((item, index) => {
        // Calcular posición según el layout
        const position = getPosition(index, data.length);
        
        // Escala basada en el valor, aplicando el factor de escala del control
        const scaleY = mapRange(item.value, valueMin, valueMax, 0.5, 5) * heightScale;
        const scale = [1, scaleY, 1];
        
        // Rotación basada en propiedades del objeto
        const rotation = [
          0,
          item.rotation * Math.PI * 2, // Rotación Y basada en el dato
          item.category * 0.2 // Ligera inclinación por categoría
        ];
        
        // Color basado en el modo seleccionado
        const color = getColor(item, index, data.length);
        
        // Renderizado condicional según el valor
        const shouldRenderSpecial = item.value > valueMax * 0.8;
        
        return (
          <mesh
            key={index}
            position={[position[0], position[1] + scaleY / 2, position[2]]}
            rotation={rotation}
            scale={scale}
          >
            {getGeometry(shouldRenderSpecial ? 'torus' : geometryType)}
            <meshStandardMaterial 
              color={color} 
              metalness={item.category / 5}
              roughness={0.5} 
            />
          </mesh>
        );
      })}
    </group>
  );
}