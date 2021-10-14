import * as THREE from './game/three.module.js' // Maze 95 JS, now in 3D!
import "./game/keydrown.min.js" // input
import * as maze_gen from "./game/generation.js"
import { startObj } from "./game/object_defines.js" // object
import { playerAction, player } from "./game/player_controller.js" // player code
import { ceilingMat, floorMat } from './textures/textures.js'

const widescreen = false
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

//Dynamic scaling for widescreen
window.addEventListener('resize', () =>
{
  if (widescreen) {
    // Update sizes
    const widewidth = window.innerWidth
    const wideheight = window.innerHeight

      // Update camera
    camera.aspect = width / height
    camera.updateProjectionMatrix()

      // Update renderer
    renderer.setSize(widewidth, wideheight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
})

export const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60,width/height)
scene.add(player)
scene.add(camera)

window.spd = 0.8
window.rotDiv = 20

let amb
player.position.y = -3
player.position.z = -25
if (!window.location.href.includes("?seen=1")) {
  alert("You are probably gonna spawn in a wall, if that happens, refresh the page and try again.")
  window.location.href += "?seen=1"
}

maze_gen.make_maze()
//scene.add(faceObj)
scene.add(startObj)
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

function update() {
  requestAnimationFrame(update)
  camera.position.x = player.position.x
  camera.position.y = player.position.y
  camera.position.z = player.position.z
  camera.rotation.y = player.rotation.y
  //billboard(faceObj, player)
  startObj.rotation.y = player.rotation.y

  renderer.render(scene, camera)
}

kd.W.down(()=> {playerAction("move", -window.spd)})
kd.S.down(()=> {playerAction("move", window.spd)})
kd.A.down(()=> {playerAction("rotate", window.spd / window.rotDiv)})
kd.D.down(()=> {playerAction("rotate", -window.spd / window.rotDiv)})
kd.run(function(){kd.tick()})
update()
console.log("achieved with MazeSrc\n\nepic Half-Life reference")