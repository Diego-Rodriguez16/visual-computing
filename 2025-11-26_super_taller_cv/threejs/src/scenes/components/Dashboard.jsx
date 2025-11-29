import { useEffect, useState } from 'react'
import './Dashboard.css'

export default function Dashboard({ data }) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fps: Math.round(Math.random() * 60 + 40), // Simulado
        frameTime: Math.round(Math.random() * 30 + 10),
        drawCalls: Math.round(Math.random() * 200 + 50),
        triangles: Math.round(Math.random() * 1000000 + 500000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem'}}>
        <h2>Performance Metrics</h2>
        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
          <button className="download-report" onClick={() => {
            const report = data.getPerfReport?.()
            if (!report) return alert('Reporte no disponible todavía')
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `perf-report-${new Date(report.timestamp).toISOString()}.json`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
          }}>Download Report</button>
          <button className="run-benchmark" onClick={async () => {
            if (!data.getPerfReport) return alert('Monitor no listo')
            if (!confirm('Run 30s benchmark (15s baseline, 15s optimized)?')) return
            const samplesBaseline = []
            for (let i = 0; i < 15; i++) {
              await new Promise(r => setTimeout(r, 1000))
              samplesBaseline.push(data.getPerfReport())
            }
            // Apply optimizations
            await data.applyOptimizations?.()
            // Wait a moment for scene updates
            await new Promise(r => setTimeout(r, 1000))
            const samplesOptimized = []
            for (let i = 0; i < 15; i++) {
              await new Promise(r => setTimeout(r, 1000))
              samplesOptimized.push(data.getPerfReport())
            }
            const report = {
              meta: { timestamp: Date.now(), description: '30s benchmark (15s baseline, 15s optimized)' },
              baseline: samplesBaseline,
              optimized: samplesOptimized
            }
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `benchmark-${new Date().toISOString()}.json`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
            alert('Benchmark completo. Report descargado.')
          }}>Run 30s Benchmark</button>
        </div>
      </div>
      
      <div className="metric-item">
        <label>FPS</label>
        <div className="metric-value">{metrics.fps}</div>
      </div>
      
      <div className="metric-item">
        <label>Frame Time</label>
        <div className="metric-value">{metrics.frameTime}ms</div>
      </div>
      
      <div className="metric-item">
        <label>Draw Calls</label>
        <div className="metric-value">{metrics.drawCalls}</div>
      </div>
      
      <div className="metric-item">
        <label>Triangles</label>
        <div className="metric-value">{(metrics.triangles / 1000000).toFixed(2)}M</div>
      </div>
      
      {data.detections.length > 0 && (
        <div className="section">
          <h3>Detections ({data.detections.length})</h3>
          <div className="detection-list">
            {data.detections.slice(0, 5).map((det, i) => (
              <div key={i} className="detection-item">
                <span>{det.class}</span>
                <span>{(det.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.gesture && (
        <div className="section">
          <h3>Gesture</h3>
          <div className="info">{data.gesture.type}</div>
        </div>
      )}
      
      {data.voiceCommand && (
        <div className="section">
          <h3>Voice Command</h3>
          <div className="info">{data.voiceCommand}</div>
        </div>
      )}
    </div>
  )
}
