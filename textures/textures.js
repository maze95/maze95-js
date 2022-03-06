import * as THREE from '../mazesrc/three.module.js'

const wall_tex = new THREE.TextureLoader().load("./textures/wall.png", (texture) => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,-0.02)
  texture.repeat.set(1,1.2)
})
wall_tex.minFilter = THREE.NearestFilter
wall_tex.magFilter = THREE.NearestFilter
export const wall = new THREE.MeshBasicMaterial({map: wall_tex})

const ceiling_tex = new THREE.TextureLoader().load("./textures/ceiling.png", (texture) => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(120,100)
})
ceiling_tex.minFilter = THREE.NearestFilter
ceiling_tex.magFilter = THREE.NearestFilter
export const ceiling = new THREE.MeshBasicMaterial({map: ceiling_tex})

const floor_tex = new THREE.TextureLoader().load("./textures/floor.png", (texture) => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(50,50)
})
floor_tex.minFilter = THREE.NearestFilter
floor_tex.magFilter = THREE.NearestFilter
export const floor = new THREE.MeshBasicMaterial({map: floor_tex})

/*const faceTexture = new THREE.TextureLoader().load("./textures/fin.png") // unnecessary for the time being
faceTexture.magFilter = THREE.NearestFilter
export const face = new THREE.MeshStandardMaterial({map: faceTexture, transparent: true, opacity: 0.65})*/

const start_tex = new THREE.TextureLoader().load("./textures/start.png")
start_tex.minFilter = THREE.NearestFilter
start_tex.magFilter = THREE.NearestFilter
export const start = new THREE.MeshBasicMaterial({map: start_tex, transparent: true, opacity: 0.6})