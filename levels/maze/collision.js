import * as THREE from '../../lib/three.module.js'
import { collisionMat } from "../../lib/settings.js"

const wall1Geo = new THREE.BoxGeometry(400,50,5)
const wall1 = new THREE.Mesh(wall1Geo, collisionMat)
wall1.position.x = -100
wall1.position.z = -11

const wall2Geo = new THREE.BoxGeometry(5,50,400)
const wall2 = new THREE.Mesh(wall2Geo, collisionMat)
wall2.position.z = -150
wall2.position.x = 66.5

const wall3Geo = new THREE.BoxGeometry(100,50,5)
const wall3 = new THREE.Mesh(wall3Geo, collisionMat)
wall3.position.x = 13
wall3.position.z = -56

export const maze0Collision = [wall1, wall2, wall3]