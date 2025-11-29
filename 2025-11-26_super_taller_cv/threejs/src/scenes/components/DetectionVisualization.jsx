import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function DetectionVisualization({ detections }) {
  const groupRef = useRef()
  const markersRef = useRef([])
  
  useEffect(() => {
    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => {
      groupRef.current?.remove(marker)
    })
    markersRef.current = []
    
    // Crear nuevos marcadores
    detections.forEach((det) => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16)
      const material = new THREE.MeshStandardMaterial({
        color: det.class === 'person' ? 0x00ff00 : 0xff0000,
        emissive: det.class === 'person' ? 0x00ff00 : 0xff0000,
        emissiveIntensity: 0.8,
        wireframe: true
      })
      
      const marker = new THREE.Mesh(geometry, material)
      marker.position.set(
        (det.x || Math.random() * 4) - 2,
        (det.y || 1),
        (det.z || Math.random() * 4) - 2
      )
      
      groupRef.current?.add(marker)
      markersRef.current.push(marker)
    })
  }, [detections])
  
  useFrame(() => {
    markersRef.current.forEach(marker => {
      marker.rotation.x += 0.01
      marker.rotation.y += 0.01
      marker.position.y += Math.sin(Date.now() * 0.001) * 0.02
    })
  })
  
  return <group ref={groupRef} />
}