export default class WebSocketClient {
  constructor(url) {
    this.url = url
    this.listeners = {}
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    
    this.connect()
  }
  
  connect() {
    try {
      this.ws = new WebSocket(this.url)
      
      this.ws.onopen = () => {
        console.log('✓ WebSocket connected')
        this.reconnectAttempts = 0
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const type = data.type
          
          if (this.listeners[type]) {
            this.listeners[type].forEach(cb => cb(data.payload))
          }
        } catch (err) {
          console.error('Parse error:', err)
        }
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      this.ws.onclose = () => {
        console.warn('WebSocket closed. Attempting to reconnect...')
        this.reconnect()
      }
    } catch (err) {
      console.error('Connection error:', err)
    }
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => this.connect(), this.reconnectDelay)
    }
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }
  
  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('WebSocket not connected')
    }
  }
  
  disconnect() {
    this.ws?.close()
  }
}