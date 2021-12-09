import * as THREE from './game/three.module.js' // Maze 95 JS, now in 3D!
import * as MazeGen from "./game/generation.js"
import * as Utils from "./game/utils.js"
import * as Player from "./game/player_controller.js"
import "./game/keydrown.min.js"

import { ceilingMat, floorMat } from "./textures/textures.js"

import { startObj } from "./game/object_defines.js" // object

window.widescreen = false
let width = 640
let height = 480

export const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#game'),
  antialias: false
})
renderer.setPixelRatio(window.devicePixelRatio)
if (widescreen) {
  renderer.setSize(window.innerWidth, window.innerHeight)
} else {
  renderer.setSize(width, height)
}
const camera = new THREE.PerspectiveCamera(60,width/height)

if (window.location.href.includes("full")) {
  window.widescreen = true
  // update sizes
  width = window.innerWidth
  height = window.innerHeight
  // update camera
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

//Dynamic scaling for widescreen
window.addEventListener('resize', () =>
{
  if (window.widescreen) {
    // update sizes
    width = window.innerWidth
    height = window.innerHeight
    // update camera
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
})

if ('ontouchstart' in document.documentElement && !window.location.href.includes("full")) window.location.href = "./full.html" // if mobile

export const scene = new THREE.Scene()
scene.add(Player.pObj)
scene.add(camera)

window.spd = 0.95
window.rotDiv = 22

let amb
Player.pObj.position.y = -3
Player.pObj.position.z = -25

MazeGen.make_maze()

amb = new THREE.AmbientLight(0xffffff, 2)
scene.add(amb)

const floorGeo = new THREE.BoxGeometry(1000,1,1000)
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.position.y = -13
scene.add(floor)

const ceilingGeo = new THREE.BoxGeometry(1000,1,1000)
const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat)
ceiling.position.y = 9
scene.add(ceiling)

// objects
// scene.add(startObj)

Utils.moveOut()

function update() {
  requestAnimationFrame(update)
  camera.position.x = Player.pObj.position.x
  camera.position.y = Player.pObj.position.y
  camera.position.z = Player.pObj.position.z
  camera.rotation.y = Player.pObj.rotation.y

  startObj.rotation.y = Player.pObj.rotation.y

  renderer.render(scene, camera)
}

kd.W.down(()=> {Player.playerAction("move", -window.spd)})
kd.S.down(()=> {Player.playerAction("move", window.spd)})
kd.A.down(()=> {Player.playerAction("rotate", window.spd / window.rotDiv)})
kd.D.down(()=> {Player.playerAction("rotate", -window.spd / window.rotDiv)})
kd.run(function(){kd.tick()})

update()
console.log("achieved with MazeSrc\n\nepic Half-Life reference")
