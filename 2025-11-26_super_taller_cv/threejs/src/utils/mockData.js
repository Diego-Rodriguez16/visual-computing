export function startMockWebSocket() {
  const _mockDetections = [
    { class: 'person', x: 2, y: 1, z: 2, confidence: 0.95 },
    { class: 'person', x: -2, y: 1, z: -1, confidence: 0.87 }
  ]

  const _mockGestures = ['thumbs_up', 'peace', 'wave', null]
  const _mockCommands = ['red', 'blue', 'spin', 'bright', 'dark']
  
  // Simular datos cada cierto tiempo
  setInterval(() => {
    // Enviar a escena...
  }, 2000)
}
