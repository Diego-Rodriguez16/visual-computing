import { useRef, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export function Video360Viewer({ videoPath }: { videoPath: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null)
  const { gl } = useThree()

  useEffect(() => {
    const video = document.createElement('video')
    video.src = videoPath
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    videoRef.current = video

    const handleLoadedMetadata = () => {
      const texture = new THREE.VideoTexture(video)
      // Actualización para Three.js r148+
      texture.colorSpace = THREE.SRGBColorSpace
      setVideoTexture(texture)
      video.play().catch(e => console.error("Error al reproducir:", e))
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.pause()
      if (videoTexture) videoTexture.dispose()
    }
  }, [videoPath])

  return (
    <>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 64, 64]} />
        {videoTexture && (
          <meshBasicMaterial side={THREE.BackSide}>
            <primitive attach="map" object={videoTexture} />
          </meshBasicMaterial>
        )}
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.3}
      />
    </>
  )
}