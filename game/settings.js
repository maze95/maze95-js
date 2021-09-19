import * as THREE from './three.module.js'

export const widescreen = false
export const collisionMat = new THREE.MeshBasicMaterial({color: 0xe621e6, transparent: true, opacity: 0, depthTest: false}) //lol
export const invisible = new THREE.MeshBasicMaterial({color: 0x248000, /*transparent: true,*/ opacity: 0})

export const billboard = (obj, lookAt) => {
    obj.rotation.y = lookAt.rotation.y
}