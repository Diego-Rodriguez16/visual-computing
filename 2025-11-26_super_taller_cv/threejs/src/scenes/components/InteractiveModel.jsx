import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureOptimizer } from '../../optimization/TextureOptimizer'

// InteractiveModel: ahora soporta optimización automática al cargar un glTF
// Props adicionales: `modelPath` (string), `applyOptimizations` (fn), `getPerfReport` (fn)

export default function InteractiveModel({ gesture, voiceCommand, position, modelPath, applyOptimizations, getPerfReport }) {
  const group = useRef()
  const meshRef = useRef()
  const loadedRef = useRef(false)
  
  // Crear un modelo simple si no hay GLTF
  useEffect(() => {
    // Si ya existe un mesh (p. ej. creado por GLTF), no hacemos nada
    if (meshRef.current) return
    if (!group.current) return
    
    // Crear geometría de demostración
    const geometry = new THREE.BoxGeometry(1, 2, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.4,
      metalness: 0.5
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    group.current.add(mesh)
    meshRef.current = mesh
  }, [])

  // Cargar GLTF si se proporciona `modelPath` y ejecutar optimizaciones y benchmark
  useEffect(() => {
    if (!modelPath || loadedRef.current || !group.current) return

    const loader = new GLTFLoader()
    loadedRef.current = true

    loader.load(modelPath, async (gltf) => {
      // Añadir modelo a grupo
      group.current.add(gltf.scene)

      // Optimizar materiales locales
      gltf.scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          try { TextureOptimizer.optimizeMaterial(obj.material) } catch { /* ignore */ }
        }
      })

      // Si se proporciona una función de optimización global, ejecutarla
      if (applyOptimizations) await applyOptimizations()

      // Ejecutar benchmark automático si hay getPerfReport
      if (getPerfReport) {
        try {
          const baseline = []
          // 15s baseline
          for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 1000))
            baseline.push(getPerfReport())
          }

          // optimizaciones ya aplicadas arriba; esperar estabilización
          await new Promise(r => setTimeout(r, 1000))

          const optimized = []
          for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 1000))
            optimized.push(getPerfReport())
          }

          const report = { meta: { modelPath, timestamp: Date.now() }, baseline, optimized }
          const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `auto-benchmark-${new Date().toISOString()}.json`
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)
        } catch {
          // ignore errors during benchmark
        }
      }
    }, undefined, () => {
      // onError
      console.warn('Failed to load model:', modelPath)
    })

    return () => { /* no-op cleanup */ }
  }, [modelPath, applyOptimizations, getPerfReport])
  
  // Responder a gestos
  useFrame(() => {
    if (!group.current) return
    
    if (gesture?.type === 'thumbs_up') {
      group.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
    } else {
      group.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
    
    if (gesture?.type === 'peace') {
      group.current.rotation.y += 0.05
    }
  })
  
  // Responder a comandos de voz
  useEffect(() => {
    if (!voiceCommand || !meshRef.current) return
    
    const cmd = voiceCommand.toLowerCase()
    
    if (cmd.includes('red')) {
      meshRef.current.material.color.set(0xff0000)
    } else if (cmd.includes('blue')) {
      meshRef.current.material.color.set(0x0000ff)
    } else if (cmd.includes('green')) {
      meshRef.current.material.color.set(0x00ff00)
    } else if (cmd.includes('spin')) {
      group.current.rotation.y += Math.PI / 4
    }
  }, [voiceCommand])
  
  return (
    <group ref={group} position={position} castShadow receiveShadow>
      <mesh ref={meshRef} castShadow receiveShadow />
    </group>
  )
}
