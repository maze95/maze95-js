import * as THREE from './three.module.js'
import { SelectedLVL } from "../levels/level_defines.js"

let finPos = SelectedLVL("finPos")
let startlogoPos = SelectedLVL("startLogoPos")

//Texture defines
const faceTexture = new THREE.TextureLoader().load("./textures/fin.png")
faceTexture.magFilter = THREE.NearestFilter
const face = new THREE.MeshStandardMaterial({map: faceTexture, transparent: true, opacity: 0.65})

const startTexture = new THREE.TextureLoader().load("./textures/start.png")
startTexture.magFilter = THREE.NearestFilter
const startMat = new THREE.MeshBasicMaterial({map: startTexture, transparent: true, opacity: 0.6})

export const faceObj = new THREE.Mesh(
  new THREE.BoxGeometry(16,9.5,0),
  face
)
faceObj.position.x = finPos[0]
faceObj.position.y = finPos[1] - 3
faceObj.position.z = finPos[2]

export const startObj = new THREE.Mesh(
  new THREE.BoxGeometry(18,25,0),
  startMat
)
startObj.position.x = startlogoPos[0]
startObj.position.y = startlogoPos[1] - 3
startObj.position.z = startlogoPos[2]