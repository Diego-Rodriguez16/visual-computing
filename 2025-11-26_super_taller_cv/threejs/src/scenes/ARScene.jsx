import { useEffect, useRef } from 'react'

export default function ARScene() {
  const containerRef = useRef(null)
  
  useEffect(() => {
    const containerElement = containerRef.current
    
    // Cargar ar.js desde CDN
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/ar.js@3.4.5/three.js/ar.js'
    script.async = true
    
    script.onload = () => {
      if (!containerElement) return
      
      console.log('AR.js cargado correctamente')
      
      // Información sobre modo AR
      containerElement.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: Arial, sans-serif;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
        ">
          <h1>📱 Modo AR Activado</h1>
          <p style="font-size: 18px; margin: 20px;">AR.js v3.4.5 cargado</p>
          
          <div style="
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 10px;
            max-width: 400px;
            text-align: center;
            margin: 20px;
          ">
            <h3>Instrucciones:</h3>
            <p>1. Permite acceso a cámara</p>
            <p>2. Apunta a un marcador Hiro</p>
            <p>3. Verás el modelo 3D superpuesto</p>
            <p style="font-size: 12px; color: #ccc; margin-top: 15px;">
              Modelo esperado: /models/optimized/ar_object.glb<br/>
              Marcador esperado: /markers/custom_pattern.patt
            </p>
          </div>
          
          <div style="
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            max-width: 300px;
          ">
            <p style="margin: 5px 0;"><strong>Estado:</strong> Inicializando...</p>
            <p style="margin: 5px 0;"><strong>Cámara:</strong> Esperando permiso</p>
            <p style="margin: 5px 0;"><strong>AR.js:</strong> Cargado</p>
          </div>
        </div>
      `
    }
    
    script.onerror = () => {
      console.error('Error al cargar AR.js')
      if (containerElement) {
        containerElement.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f44336;
            color: white;
            font-family: Arial, sans-serif;
          ">
            <h2>❌ Error al cargar AR.js</h2>
            <p>Verifica tu conexión a internet</p>
          </div>
        `
      }
    }
    
    document.head.appendChild(script)
    
    return () => {
      if (containerElement) {
        containerElement.innerHTML = ''
      }
    }
  }, [])
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  )
}
