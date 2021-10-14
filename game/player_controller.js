import * as THREE from './three.module.js'
import { collisionCheck } from "./surface.js"
import { collisionMesh } from "./generation.js"

const mat = new THREE.MeshBasicMaterial({color: 0x248000})
const playerGeo = new THREE.BoxGeometry(10,20,10)
export const player = new THREE.Mesh(playerGeo, mat)
let dir = new THREE.Vector3() //Player direction

export const playerAction = (type, speed) => {
    switch(type) {
      case "move":
        player.getWorldDirection(dir)
  
        player.position.x += dir.x * (speed/1.45)
        for (let i = 0; i < collisionMesh.length; i++) {
          if(collisionCheck(player, collisionMesh[i])) player.position.x -= dir.x * (speed/1.45)
        }
        player.position.z += dir.z * (speed/1.45)
        for (let i = 0; i < collisionMesh.length; i++) {
          if(collisionCheck(player, collisionMesh[i])) player.position.z -= dir.z * (speed/1.45)
        }
        break
      
      case "rotate":
        player.rotation.y += speed
        break
    }
}