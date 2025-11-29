export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      memory: 0
    }
    this.history = []
    this.lastTime = performance.now()
  }
  
  update(renderer) {
    const now = performance.now()
    this.metrics.frameTime = now - this.lastTime
    this.lastTime = now
    
    if (renderer && renderer.info) {
      this.metrics.drawCalls = renderer.info.render.calls
      this.metrics.triangles = renderer.info.render.triangles
    }
    
    if (performance.memory) {
      this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576)
    }
    
    this.metrics.fps = Math.round(1000 / this.metrics.frameTime)
    
    this.history.push({ ...this.metrics, timestamp: Date.now() })
    if (this.history.length > 300) this.history.shift()
  }
  
  getReport() {
    return {
      current: this.metrics,
      history: this.history
    }
  }
}
