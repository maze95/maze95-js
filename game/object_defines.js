import * as THREE from './three.module.js'

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
faceObj.position.x = 0
faceObj.position.y = -3
faceObj.position.z = 0

export const startObj = new THREE.Mesh(
  new THREE.BoxGeometry(18,25,0),
  startMat
)
startObj.position.x = 0
startObj.position.y = -3.2
startObj.position.z = -40