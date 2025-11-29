import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function ParticleSystem({ trigger }) {
  const pointsRef = useRef()
  const particlesRef = useRef({ positions: [], velocities: [] })
  
  useEffect(() => {
    if (!trigger) return
    
    // Crear partículas en reacción al gesto
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const speed = 0.2
      
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      
      velocities.push({
        x: Math.cos(angle) * speed,
        y: Math.random() * 0.3 + 0.1,
        z: Math.sin(angle) * speed
      })
    }
    
    particlesRef.current = { positions, velocities }
    
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )
    }
  }, [trigger])
  
  useFrame(() => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array
    const { velocities } = particlesRef.current
    
    velocities.forEach((vel, i) => {
      positions[i * 3] += vel.x
      positions[i * 3 + 1] += vel.y
      positions[i * 3 + 2] += vel.z
      
      vel.y -= 0.01 // Gravedad
    })
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={new Float32Array(300)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0x00ffff}
        size={0.1}
        sizeAttenuation
      />
    </points>
  )
}
