import * as THREE from './game/three.module.js' // Maze 95 JS, now in 3D!
import * as MazeGen from "./game/generation.js" // code for generating maze
import * as Utils from "./game/utils.js" // various tools to help out
import * as Player from "./game/player_controller.js"
import "./game/keydrown.min.js" // input library

// ceiling and floor material to apply to floor and ceiling object input
import { ceilingMat, floorMat } from "./textures/textures.js"

import { startObj } from "./game/object_defines.js" // object

// viewport properties
window.widescreen = false
let width = 640
let height = 480

let renderer = new THREE.WebGLRenderer({
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

let div = 1
// dynamic scaling for widescreen
window.addEventListener('resize', () =>
{
  if (window.widescreen) {
    // update sizes
    width = window.innerWidth
    height = window.innerHeight / div
    // update camera
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
})

if ('ontouchstart' in document.documentElement && !window.location.href.includes("mobile")) window.location.href = "./mobile.html"
if (window.location.href.includes("mobile")) {
  div = 2
  window.widescreen = true
  // update sizes
  width = window.innerWidth
  height = window.innerHeight / div
  // update camera
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  document.getElementById("upBtn").addEventListener('touchstart', () => {
    window.playerInput.up = true
  })
  document.getElementById("upBtn").addEventListener('touchend', () => {
    window.playerInput.up = false
  })

  document.getElementById("leftBtn").addEventListener('touchstart', () => {
    window.playerInput.left = true
  })
  document.getElementById("leftBtn").addEventListener('touchend', () => {
    window.playerInput.left = false
  })

  document.getElementById("backBtn").addEventListener('touchstart', () => {
    window.playerInput.down = true
  })
  document.getElementById("backBtn").addEventListener('touchend', () => {
    window.playerInput.down = false
  })

  document.getElementById("rightBtn").addEventListener('touchstart', () => {
    window.playerInput.right = true
  })
  document.getElementById("rightBtn").addEventListener('touchend', () => {
    window.playerInput.right = false
  })
}

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

window.playerInput = {
  up: false,
  down: false,
  left: false,
  right: false
}

function update() {
  requestAnimationFrame(update)
  camera.position.x = Player.pObj.position.x
  camera.position.y = Player.pObj.position.y
  camera.position.z = Player.pObj.position.z
  camera.rotation.y = Player.pObj.rotation.y

  startObj.rotation.y = Player.pObj.rotation.y

  if (window.playerInput.up) { Player.playerAction("move", -window.spd) }
  if (window.playerInput.down) { Player.playerAction("move", window.spd) }
  if (window.playerInput.left) { Player.playerAction("rotate", window.spd / window.rotDiv) }
  if (window.playerInput.right) { Player.playerAction("rotate", -window.spd / window.rotDiv) }

  renderer.render(scene, camera)
}

kd.W.down(()=> {window.playerInput.up    = true})
kd.S.down(()=> {window.playerInput.down  = true})
kd.A.down(()=> {window.playerInput.left  = true})
kd.D.down(()=> {window.playerInput.right = true})

kd.W.up(()=> {window.playerInput.up    = false})
kd.S.up(()=> {window.playerInput.down  = false})
kd.A.up(()=> {window.playerInput.left  = false})
kd.D.up(()=> {window.playerInput.right = false})
kd.run(function(){kd.tick()})

update()
console.log("achieved with MazeSrc\n\nepic Half-Life reference")
