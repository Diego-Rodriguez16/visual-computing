import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  Stats,
  PerspectiveCamera 
} from '@react-three/drei'
import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import InteractiveModel from './components/InteractiveModel'
import DynamicLighting from './components/DynamicLighting'
import DetectionVisualization from './components/DetectionVisualization'
import WebSocketClient from '../interactions/WebSocketClient'
import { PerformanceMonitor } from '../optimization/PerformanceMonitor'
import ParticleSystem from './components/ParticleSystem'
import { LODManager } from '../optimization/LODManager'
import { TextureOptimizer } from '../optimization/TextureOptimizer'

// Inner component that uses R3F hooks (must be inside Canvas)
function SceneContent({ 
  detections, 
  gesture, 
  voiceCommand, 
  onDataUpdate,
  showMetrics
}) {
  const { gl, scene, camera: _camera } = useThree()
  const _monitorRef = useRef(new PerformanceMonitor())
  const lodManagerRef = useRef(null)

  useEffect(() => {
    if (!lodManagerRef.current && scene && _camera) {
      lodManagerRef.current = new LODManager(scene, _camera)
    }
  }, [scene, _camera])

  const getPerfReport = useCallback(() => {
    const report = _monitorRef.current.getReport()
    const rendererInfo = gl?.info ? gl.info : null
    const memory = typeof performance !== 'undefined' && performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize
    } : null

    return {
      timestamp: Date.now(),
      metrics: report.current,
      history: report.history,
      rendererInfo,
      memory,
      sceneStats: {
        objects: scene?.children?.length ?? null
      }
    }
  }, [gl, scene])

  const applyOptimizations = useCallback(async () => {
    if (!scene) return
    scene.traverse(obj => {
      if (obj.isMesh && obj.material) {
        try { TextureOptimizer.optimizeMaterial(obj.material) } catch { /* ignore */ }
      }
    })

    if (lodManagerRef.current) {
      const topMeshes = []
      scene.traverse(obj => {
        if (obj.isMesh) topMeshes.push(obj)
      })

      const maxConvert = Math.min(6, topMeshes.length)
      for (let i = 0; i < maxConvert; i++) {
        const mesh = topMeshes[i]
        try {
          lodManagerRef.current.createLODFromModel(mesh, [
            { distance: 0, quality: 1.0 },
            { distance: 8, quality: 0.5 },
            { distance: 20, quality: 0.2 }
          ])
          if (mesh.parent) mesh.parent.remove(mesh)
        } catch {
          // ignore
        }
      }
    }
  }, [scene])

  useEffect(() => {
    // Pass functions to parent via onDataUpdate
    onDataUpdate(prev => ({ ...prev, getPerfReport, applyOptimizations }))
    return () => onDataUpdate(prev => {
      const copy = { ...prev }
      delete copy.getPerfReport
      delete copy.applyOptimizations
      return copy
    })
  }, [gl, scene, onDataUpdate, getPerfReport, applyOptimizations])

  useFrame(() => {
    if (gl) _monitorRef.current.update(gl)
  })

  return (
    <Suspense fallback={null}>
      {/* Iluminación */}
      <DynamicLighting voiceCommand={voiceCommand} />
      
      {/* Ambiente */}
      <Environment preset="studio" background blur={0.8} />
      
      {/* Grid para referencia */}
      <gridHelper args={[20, 20]} position={[0, -2, 0]} />
      
      {/* Modelos interactivos */}
      <InteractiveModel 
        detections={detections}
        gesture={gesture}
        voiceCommand={voiceCommand}
        position={[0, 0, 0]}
        applyOptimizations={applyOptimizations}
        getPerfReport={getPerfReport}
      />
      
      {/* Visualización de detecciones */}
      <DetectionVisualization detections={detections} />
      
      {/* Sistema de partículas */}
      <ParticleSystem trigger={gesture} />
      
      {/* Controles */}
      <OrbitControls 
        makeDefault
        autoRotate={false}
        autoRotateSpeed={0}
      />
      
      {/* Estadísticas */}
      {showMetrics && <Stats showPanel={0} />}
    </Suspense>
  )
}

// Outer component that manages state and WebSocket
export default function MainScene({ onDataUpdate, showMetrics }) {
  const [detections, setDetections] = useState([])
  const [gesture, setGesture] = useState(null)
  const [voiceCommand, setVoiceCommand] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    // Inicializar WebSocket
    wsRef.current = new WebSocketClient('ws://localhost:8765')
    
    wsRef.current.on('detection', (data) => {
      setDetections(Array.isArray(data) ? data : [data])
      onDataUpdate(prev => ({ ...prev, detections: data }))
    })
    
    wsRef.current.on('gesture', (data) => {
      setGesture(data)
      onDataUpdate(prev => ({ ...prev, gesture: data }))
    })
    
    wsRef.current.on('voice', (data) => {
      setVoiceCommand(data)
      onDataUpdate(prev => ({ ...prev, voiceCommand: data }))
    })
    
    return () => wsRef.current?.disconnect()
  }, [onDataUpdate])

  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 50 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        precision: "highp",
        alpha: true
      }}
      shadows="soft"
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContent
        detections={detections}
        gesture={gesture}
        voiceCommand={voiceCommand}
        onDataUpdate={onDataUpdate}
        showMetrics={showMetrics}
      />
    </Canvas>
  )
}