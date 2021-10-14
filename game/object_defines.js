import * as THREE from './three.module.js'
import { face, start } from "../textures/textures.js"

export const faceObj = new THREE.Mesh(
  new THREE.BoxGeometry(16,9.5,0),
  face
)
faceObj.position.x = 0
faceObj.position.y = -3
faceObj.position.z = 0

export const startObj = new THREE.Mesh(
  new THREE.BoxGeometry(18,25,0),
  start
)
startObj.position.x = 0
startObj.position.y = -3.2
startObj.position.z = -40