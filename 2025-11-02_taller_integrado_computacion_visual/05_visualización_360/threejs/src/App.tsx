import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {Video360Viewer}  from './components/Video360Viewer'
import { ControlsUI } from './components/ControlsUI'
import { Html } from '@react-three/drei'
import './styles.css'

export default function App() {
  const [isMuted, setIsMuted] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)

  return (
    <div className="container">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={<Html center>Loading 360° video...</Html>}>
          <Video360Viewer 
            videoPath="/videos/video.mp4"
          />
        </Suspense>
      </Canvas>

      <ControlsUI
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        isMuted={isMuted}
        autoRotate={autoRotate}
      />
    </div>
  )
}