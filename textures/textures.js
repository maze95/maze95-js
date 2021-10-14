import * as THREE from '../game/three.module.js'

let texPath = "./textures/"
if (!window.location.href.includes("localhost") || !window.location.href.includes("127.0.0.1")) texPath = "https://maze95.js.org/textures/"

const wallTex = new THREE.TextureLoader().load(`${texPath}wall.png`, function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,-0.02)
  texture.repeat.set(1,1.2)
})
wallTex.magFilter = THREE.NearestFilter
export const wallMat = new THREE.MeshBasicMaterial({map: wallTex})

const ceilingTex = new THREE.TextureLoader().load(`${texPath}ceiling.png`, function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(120,100)
})
ceilingTex.magFilter = THREE.NearestFilter
export const ceilingMat = new THREE.MeshBasicMaterial({map: ceilingTex})

const floorTex = new THREE.TextureLoader().load(`${texPath}floor.png`, function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(50,50)
})
floorTex.magFilter = THREE.NearestFilter
export const floorMat = new THREE.MeshBasicMaterial({map: floorTex})


const faceTexture = new THREE.TextureLoader().load("./textures/fin.png")
faceTexture.magFilter = THREE.NearestFilter
export const face = new THREE.MeshStandardMaterial({map: faceTexture, transparent: true, opacity: 0.65})

const startTexture = new THREE.TextureLoader().load("./textures/start.png")
startTexture.magFilter = THREE.NearestFilter
export const start = new THREE.MeshBasicMaterial({map: startTexture, transparent: true, opacity: 0.6})