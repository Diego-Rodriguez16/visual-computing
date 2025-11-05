import { useState } from 'react'

type ControlsUIProps = {
  onToggleMute: () => void
  onToggleAutoRotate: () => void
  isMuted: boolean
  autoRotate: boolean
}

export function ControlsUI({ 
  onToggleMute, 
  onToggleAutoRotate,
  isMuted,
  autoRotate
}: ControlsUIProps) {
  return (
    <div className="controls-ui">
      <button onClick={onToggleMute}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      <button onClick={onToggleAutoRotate}>
        {autoRotate ? '⏹️ Auto-rotación' : '🔄 Auto-rotación'}
      </button>
    </div>
  )
}