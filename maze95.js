import * as THREE from './game/three.module.js' // Maze 95 JS, now in 3D!
import * as MazeGen from "./game/generation.js"
import * as Utils from "./game/utils.js"
import * as Player from "./game/player_controller.js"
import "./game/input.js" // script for user input

import { ceilingMat, floorMat } from "./textures/textures.js"

import { startObj } from "./game/object_defines.js" // object

window.widescreen = false
export const width = 640
export const height = 480
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

window.enterFullscreen = () => {
  document.getElementById("game").requestFullscreen()
}

//Dynamic scaling for widescreen
window.addEventListener('resize', () =>
{
  if (window.widescreen) {
    // update sizes
    const widewidth = window.innerWidth
    const wideheight = window.innerHeight

    // update camera
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(widewidth, wideheight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
})

export const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60,width/height)
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

if (window.playerInput.uniUpDown) { Player.playerAction("move", -window.spd) }
if (window.playerInput.uniDownDown) { Player.playerAction("move", window.spd) }
if (window.playerInput.uniLeftDown) { Player.playerAction("rotate", window.spd / window.rotDiv) }
if (window.playerInput.uniRightDown) { Player.playerAction("rotate", -window.spd / window.rotDiv) }

update()
console.log("achieved with MazeSrc\n\nepic Half-Life reference")
