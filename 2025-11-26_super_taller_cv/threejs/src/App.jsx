import { Suspense, useState } from 'react'
import MainScene from './scenes/MainScene'
import ARScene from './scenes/ARScene'
import Dashboard from './scenes/components/Dashboard'
import './App.css'

function App() {
  const [showMetrics, setShowMetrics] = useState(true)
  const [sceneMode, setSceneMode] = useState('main') // 'main' o 'ar'
  const [sceneData, setSceneData] = useState({
    detections: [],
    gesture: null,
    voiceCommand: null,
    metrics: {}
  })

  return (
    <div className="app-container">
      <div className="scene-wrapper">
        <Suspense fallback={<div className="loading">Loading 3D Scene...</div>}>
          {sceneMode === 'main' ? (
            <MainScene 
              onDataUpdate={setSceneData}
              showMetrics={showMetrics}
            />
          ) : (
            <ARScene />
          )}
        </Suspense>
      </div>
      
      {showMetrics && (
        <div className="dashboard-wrapper">
          {sceneMode === 'main' && <Dashboard data={sceneData} />}
          <div className="controls-wrapper">
            <button 
              className="scene-toggle"
              onClick={() => setSceneMode(sceneMode === 'main' ? 'ar' : 'main')}
            >
              {sceneMode === 'main' ? '📱 AR Mode' : '🎬 3D Scene'}
            </button>
            <button 
              className="toggle-metrics"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
