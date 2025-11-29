import * as THREE from 'three'

export class TextureOptimizer {
  static async compressTexture(texture, maxSize = 1024) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Redimensionar
    const scale = Math.min(1, maxSize / Math.max(texture.image.width, texture.image.height))
    canvas.width = texture.image.width * scale
    canvas.height = texture.image.height * scale
    
    ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height)
    
    // Crear nueva textura optimizada
    const optimized = new THREE.CanvasTexture(canvas)
    optimized.minFilter = THREE.LinearMipMapLinearFilter
    optimized.magFilter = THREE.LinearFilter
    optimized.generateMipmaps = true
    optimized.encoding = THREE.sRGBEncoding
    
    return optimized
  }
  
  static optimizeMaterial(material) {
    // Reducir precisión de texturas
    if (material.map) {
      material.map.minFilter = THREE.LinearMipMapLinearFilter
      material.map.anisotropy = 4 // Reducir de 16
    }
    
    // Desactivar mapas innecesarios si están lejos
    const unnecessaryMaps = ['aoMap', 'lightMap', 'emissiveMap']
    unnecessaryMaps.forEach(mapName => {
      if (material[mapName]) {
        material[mapName].dispose()
        material[mapName] = null
      }
    })
    
    material.needsUpdate = true
    return material
  }
}