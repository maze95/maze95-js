import * as THREE from './three.module.js'
import { SelectedLVL } from "../levels/level_defines.js"
import { collisionCheck } from "./surface.js"
import { invisible } from "./settings.js"

const playerGeo = new THREE.BoxGeometry(15,20,15)
export const player = new THREE.Mesh(playerGeo, invisible)
let dir = new THREE.Vector3() //Player direction

export const playerAction = (type, speed) => {
    switch(type) {
      case "move":
        player.getWorldDirection(dir)
  
        player.position.x += dir.x * (speed/1.45)
        SelectedLVL("col").forEach(wall => {
          if(collisionCheck(player, wall)) player.position.x -= dir.x * (speed/1.45)
        })
        player.position.z += dir.z * (speed/1.45)
        SelectedLVL("col").forEach(wall => {
          if(collisionCheck(player, wall)) player.position.z -= dir.z * (speed/1.45)
        })
        break
      
      case "rotate":
        player.rotation.y += speed
        break
    }
}