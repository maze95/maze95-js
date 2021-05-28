import * as THREE from './lib/three.module.js'
import { GLTFLoader } from "./lib/GLTFLoader.js"
import "./lib/keydrown.min.js"
import { SelectedLVL } from "./levels/level_defines.js"
import { move } from "./lib/player_col.js"
import { rotateA, rotateD, moveW, moveS } from "./lib/player_no_col.js"

import { faceObj } from "./lib/object_defines.js"
import { startObj } from "./lib/object_defines.js"

//Canvas width and height to set if widescreen is set to false
var width = 512
var height = 384

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60,width/height)

let green = new THREE.MeshBasicMaterial({color: 0x248000})
let red = new THREE.MeshBasicMaterial({color: 0xfc0303})

let dir = new THREE.Vector3()
var spd = 0
window.spd = 0
window.rotDiv = 17
const playergeo = new THREE.BoxGeometry(3,3,3)
export const player = new THREE.Mesh(playergeo,green)

var startLis = document.getElementById("start")

scene.add(player)
scene.add(camera)
const widescreen = false //Experimental

const ceilingTex = new THREE.TextureLoader().load("./textures/ceiling.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(40,30)
})
ceilingTex.magFilter = THREE.NearestFilter
const ceilingMat = new THREE.MeshBasicMaterial({map: ceilingTex})

const floorTex = new THREE.TextureLoader().load("./textures/floor.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(20,20)
})
floorTex.magFilter = THREE.NearestFilter
const floorMat = new THREE.MeshBasicMaterial({map: floorTex})

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(1000,0.1,1000),
  floorMat
)
const ceiling = new THREE.Mesh(
  new THREE.BoxGeometry(1000,0.1,1000),
  ceilingMat
)

if(!SelectedLVL("lvlMus") == "mus_none") {
  let mus = new Audio('../audio/' + SelectedLVL("lvlMus") + '.mp3')
  mus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
    this.currentTime = 0
    this.play()
  }, false)
  mus.play()
}

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
if(widescreen == false) {
  renderer.setSize(width, height)
}
else {
  renderer.setSize(window.innerWidth, window.innerHeight)
}

//Canvas width and height only used if widescreen is set to true
const widesizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Init widescreen functionality
if(widescreen) {
  width = innerWidth
  height = innerHeight
}
else {
  width = 512
  height = 384
}

//Dynamic scaling for widescreen
window.addEventListener('resize', () =>
{
  if(widescreen)
  {
    // Update sizes
    widesizes.width = window.innerWidth
    widesizes.height = window.innerHeight

    // Update camera
    camera.aspect = widesizes.width / widesizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(widesizes.width, widesizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
})

startLis.onclick = function startGame() {
  document.getElementById("start").disabled = true
  window.spd = 0.9
  spd = 0.9
  loadMap()
}

var resetButton = document.getElementById("reset")

resetButton.onclick = function resetGame() {
  location.reload()
}

function loadMap() {
  const loader = new GLTFLoader();
  loader.load(SelectedLVL("lvlDir"), function (gltf) {
  	scene.add(gltf.scene)
  })
  floor.position.set(0,-18,-215)
  ceiling.position.set(0,12,-215)
  scene.add(ceiling)
  scene.add(floor)
  scene.add(faceObj)
  scene.add(startObj)

  const amb = new THREE.AmbientLight(0xffffff, SelectedLVL("ambLightIntensity"))
  scene.add(amb)
}
function redraw() {
  requestAnimationFrame(redraw)
  player.getWorldDirection(dir)
  camera.position.x = player.position.x
  camera.position.y = player.position.y
  camera.position.z = player.position.z
  camera.rotation.y = player.rotation.y
  spd = window.spd
  faceObj.rotation.y = player.rotation.y
  startObj.rotation.y = player.rotation.y

  renderer.render(scene, camera)
}

kd.W.down(function(){moveW(spd)})
kd.A.down(function(){rotateA(spd/window.rotDiv)})
kd.S.down(function(){moveS(spd)})
kd.D.down(function(){rotateD(spd/window.rotDiv)})

/*function move(type,speed) {
  switch(type) {
      case "move":
          //if(kd.Q.isDown()) speed *= 1.7
          player.getWorldDirection(dir)
          // Could applyScaledVector, however splitting X and Z application allows for collision detection to "slide" you down walls.
          player.position.x += dir.x * (speed/2)
          if(!collisionCheck()) player.position.x -= dir.x * (speed/2)
          player.position.z += dir.z * (speed/2)
          if(!collisionCheck()) player.position.z -= dir.z * (speed/2)
          break
      case "rotate":
          player.rotation.y += speed/28
          break
      default: // fallback
          throw "you do not exist " + type // theoretically this should never be called
  }
}
commented out player controller that is supposed to work with collision
// key input checks
kd.W.down(function(){move("move",-spd)})
kd.A.down(function(){move("rotate",spd)})
kd.S.down(function(){move("move",spd)})
kd.D.down(function(){move("rotate",-spd)})*/

kd.L.down(
  function() {
    console.log(player.position)
    console.log(player.rotation.y)
  }
)
//Execute keydrown tick and run redraw
kd.run(function(){kd.tick()})
redraw()
//F in the chat for luphoria aswell, his Discord account got disabled because he entered a trap server afaik, Tragic.