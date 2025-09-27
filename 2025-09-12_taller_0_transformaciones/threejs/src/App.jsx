// src/App.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import React, { useRef } from 'react'

/**
 * Component with a cube that:
 * - Translates in a circular path using elapsedTime
 * - Rotates: increments each frame
 * - Scales: oscillates smoothly with sin()
 */
function AnimatedCube() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // 1) Circular translation (radio=2)
    const radius = 2
    const x = radius * Math.cos(t)
    const z = radius * Math.sin(t)
    meshRef.current.position.set(x, 0, z)

    // 2) Rotates around its axis (increments with delta)
    meshRef.current.rotation.x += delta * 0.8
    meshRef.current.rotation.y += delta * 1.0

    // 3) Scales smoothly (between ~0.8 and ~1.2)
    const s = 1.0 + 0.2 * Math.sin(t)
    meshRef.current.scale.set(s, s, s)
  })

  return (
    <mesh ref={meshRef}>
      {/* Change the geometry to a sphere */}
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#ffa466" roughness={0.3} metalness={0.2} />
    </mesh>
  )
}

export default function App() {
  return (
    <div className="canvas-wrap">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        shadows
      >
        {/* Ambient and directional lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        {/* Simple floor for reference */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#687092ff" />
        </mesh>

        {/* Our animated object */}
        <AnimatedCube />

        {/* BONUS: controls to navigate with the mouse */}
        <OrbitControls enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  )
}
