// auto generated collision by collision_util
import * as THREE from '../../game/three.module.js'
import { collisionMat } from "../../game/settings.js"

const box_0_geo = new THREE.BoxGeometry(346, 50, 2)
const box_0 = new THREE.Mesh(box_0_geo, collisionMat)
const box_1_geo = new THREE.BoxGeometry(104, 50, 2)
const box_1 = new THREE.Mesh(box_1_geo, collisionMat)
const box_2_geo = new THREE.BoxGeometry(7, 50, 54)
const box_2 = new THREE.Mesh(box_2_geo, collisionMat)
const box_3_geo = new THREE.BoxGeometry(2, 50, 58)
const box_3 = new THREE.Mesh(box_3_geo, collisionMat)
const box_4_geo = new THREE.BoxGeometry(1, 50, 352)
const box_4 = new THREE.Mesh(box_4_geo, collisionMat)
const box_5_geo = new THREE.BoxGeometry(346, 50, 2)
const box_5 = new THREE.Mesh(box_5_geo, collisionMat)
const box_6_geo = new THREE.BoxGeometry(1, 50, 352)
const box_6 = new THREE.Mesh(box_6_geo, collisionMat)

box_0.position.x = -92
box_0.position.z = -6
box_1.position.x = 20.5
box_1.position.z = -58
box_2.position.x = -35
box_2.position.z = -84
box_3.position.x = -88
box_3.position.z = -32
box_4.position.x = 66.5
box_4.position.z = -160
box_5.position.x = -92
box_5.position.z = -317
box_6.position.x = -241
box_6.position.z = -160

export const maze_collision = [box_0,box_1,box_2,box_3,box_4,box_5,box_6]