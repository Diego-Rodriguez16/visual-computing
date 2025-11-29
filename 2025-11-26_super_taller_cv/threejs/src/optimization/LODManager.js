import * as THREE from 'three'
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier'

export class LODManager {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.lodObjects = []
  }
  
  createLODFromModel(model, levels = [
    { distance: 0, quality: 1.0 },
    { distance: 10, quality: 0.5 },
    { distance: 30, quality: 0.25 }
  ]) {
    const lod = new THREE.LOD()
    const modifier = new SimplifyModifier()
    
    levels.forEach(level => {
      const clone = model.clone()
      
      clone.traverse(child => {
        if (child.isMesh) {
          if (level.quality < 1.0) {
            const count = Math.floor(child.geometry.attributes.position.count * level.quality)
            child.geometry = modifier.modify(child.geometry, count)
          }
          
          // Optimizar materiales por distancia
          if (level.distance > 10) {
            child.material = child.material.clone()
            child.material.roughness = 1
            child.material.metalness = 0
            delete child.material.normalMap
            delete child.material.roughnessMap
          }
        }
      })
      
      lod.addLevel(clone, level.distance)
    })
    
    this.lodObjects.push(lod)
    this.scene.add(lod)
    return lod
  }
  
  update() {
    this.lodObjects.forEach(lod => lod.update(this.camera))
  }
}