import * as THREE from '../game/three.module.js'

const wallTex = new THREE.TextureLoader().load("./textures/wall.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,-0.02)
  texture.repeat.set(1,0.98)
})
wallTex.magFilter = THREE.NearestFilter
export const wallMat = new THREE.MeshBasicMaterial({map: wallTex})

const ceilingTex = new THREE.TextureLoader().load("./textures/ceiling.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(80,70)
})
ceilingTex.magFilter = THREE.NearestFilter
export const ceilingMat = new THREE.MeshBasicMaterial({map: ceilingTex})

const floorTex = new THREE.TextureLoader().load("./textures/floor.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(30,30)
})
floorTex.magFilter = THREE.NearestFilter
export const floorMat = new THREE.MeshBasicMaterial({map: floorTex})