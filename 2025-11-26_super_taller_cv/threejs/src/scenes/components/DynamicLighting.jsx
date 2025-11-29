import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DynamicLighting({ voiceCommand }) {
  const lightRef = useRef()
  const targetIntensity = useRef(1)
  
  useEffect(() => {
    if (!voiceCommand) return
    
    const cmd = voiceCommand.toLowerCase()
    
    if (cmd.includes('bright')) targetIntensity.current = 2
    if (cmd.includes('dark')) targetIntensity.current = 0.3
    if (cmd.includes('normal')) targetIntensity.current = 1
  }, [voiceCommand])
  
  useFrame(() => {
    if (!lightRef.current) return
    
    lightRef.current.intensity += 
      (targetIntensity.current - lightRef.current.intensity) * 0.05
  })
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={lightRef}
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight 
        position={[-5, 5, -5]} 
        intensity={0.5} 
        color="#ff6b6b" 
      />
    </>
  )
}
