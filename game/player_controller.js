import * as THREE from './three.module.js'
import { collisionCheck } from "./surface.js"
import { collisionMesh } from "./generation.js"

const mat = new THREE.MeshBasicMaterial({color: 0x248000})
const pGeo = new THREE.BoxGeometry(10,20,10)
export const pObj = new THREE.Mesh(pGeo, mat)
let dir = new THREE.Vector3() //Player direction

export const playerAction = (type, speed) => {
    switch(type) {
      case "move":
        pObj.getWorldDirection(dir)
  
        pObj.position.x += dir.x * (speed/1.45)
        for (let i = 0; i < collisionMesh.length; i++) {
          if(collisionCheck(pObj, collisionMesh[i])) pObj.position.x -= dir.x * (speed/1.45)
        }
        pObj.position.z += dir.z * (speed/1.45)
        for (let i = 0; i < collisionMesh.length; i++) {
          if(collisionCheck(pObj, collisionMesh[i])) pObj.position.z -= dir.z * (speed/1.45)
        }
        break
      
      case "rotate":
        pObj.rotation.y += speed
        break
    }
}

export const checkCollided = () => {
  for (let i = 0; i < collisionMesh.length; i++) {
    if (collisionCheck(pObj, collisionMesh[i])) {
      return true
    }
  }
}