import * as THREE from './lib/three.module.js'
import { GLTFLoader } from "./lib/model_loader.js"
import "./lib/keydrown.min.js"
import { SelectedLVL } from "./levels/level_defines.js"
import * as player from "./lib/player.js"
import { widescreen, collisionMat } from "./lib/settings.js"
import "./lib/settings.js"

import { faceObj } from "./lib/object_defines.js"
import { startObj } from "./lib/object_defines.js"
import { checkCollision } from './lib/surface.js'

var width = 512
var height = 384

let collisionVisible = false

window.showCollision = function() {
  collisionVisible = !collisionVisible
  if (collisionVisible) {
    collisionMat.opacity = 1
  } else {
    collisionMat.opacity = 0
  }
}

const gameCanvas = document.getElementById("game")

const win95teal = new THREE.Color(0x018281)
const black = new THREE.Color(0x000000)
const red = new THREE.MeshBasicMaterial({color: 0xfc0303})
const invisible = new THREE.MeshBasicMaterial({color: 0x248000, transparent: true, opacity: 0})

export const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60,width/height)

window.spd
window.rotDiv = 20

let clock = new THREE.Clock()
let gameStarted = false
let inMaze = true //I am planning to have a pool of maze levels that a random number generator's output determines, this value is for knowing if the player is in a maze level or bigroom due to the model loading function also needing to load in animations which bigroom does not have.

const playerGeo = new THREE.BoxGeometry(3,3,3)
export const playerObj = new THREE.Mesh(playerGeo, invisible)

scene.add(playerObj)
scene.add(camera)

const ceilingTex = new THREE.TextureLoader().load("./textures/ceiling.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(80,70)
})
ceilingTex.magFilter = THREE.NearestFilter
const ceilingMat = new THREE.MeshBasicMaterial({map: ceilingTex})

const floorTex = new THREE.TextureLoader().load("./textures/floor.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(30,30)
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

function playMusic() {
  if (SelectedLVL("lvlMus") != "mus_none") {
    let mus = new Audio('./audio/' + SelectedLVL("lvlMus") + '.mp3')
    mus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
      this.currentTime = 0
      this.play()
    }, false)
    mus.play()
  }
}

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#game'),
})

renderer.setPixelRatio(window.devicePixelRatio)
if (widescreen) {
  renderer.setSize(window.innerWidth, window.innerHeight)
} else {
  renderer.setSize(width, height)
}

var mixer
var action

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

function loadModel() { //Loads in the maze 3D model
  var loader = new GLTFLoader();
  loader.load(SelectedLVL("lvlDir"), function (gltf) {
  if (SelectedLVL("lvlName") != "maze") {
    inMaze = false
    scene.remove(floor)
    scene.remove(ceiling)
  }
  if (inMaze) {
    mixer = new THREE.AnimationMixer(gltf.scene)

    action = mixer.clipAction(gltf.animations[ 0 ])
    action.setLoop(THREE.LoopOnce)
    action.clampWhenFinished = true
    action.enable = true
    action.play()
    action.play().reset()
  }

  scene.add(gltf.scene)
  gltf.scene.position.y = 8
  })
  window.spd = 0.95
}

let amb

function loadMap() { //Sets the properties to begin the game
  floor.position.set(0,-18,-215)
  ceiling.position.set(0,12,-215)
  playerObj.position.y = -3
  playerObj.position.z = -23

  //Collision
  SelectedLVL("col").forEach(wall => {
    scene.add(wall)
  })

  scene.add(ceiling)
  scene.add(floor)
  scene.add(faceObj)
  scene.add(startObj)

  amb = new THREE.AmbientLight(0xffffff, SelectedLVL("ambLightIntensity"))
  scene.add(amb)
  gameStarted = true
  playMusic()
}

loadModel()
loadMap()

let goodPos = [0, 0, -23]

function redraw() {
  requestAnimationFrame(redraw)
  camera.position.x = playerObj.position.x
  camera.position.y = playerObj.position.y
  camera.position.z = playerObj.position.z
  camera.rotation.y = playerObj.rotation.y
  faceObj.rotation.y = playerObj.rotation.y
  startObj.rotation.y = playerObj.rotation.y

	var delta = clock.getDelta()
	if (mixer) mixer.update(delta)

  playerObj.position.x += -Math.sin(playerObj.rotation.y) * player.p.forwardVel
  playerObj.position.z += -Math.cos(playerObj.rotation.y) * player.p.forwardVel

  SelectedLVL("col").forEach(wall => {
    if(checkCollision(playerObj, wall)) {
      player.p.forwardVel = 0
      playerObj.position.x = goodPos[0]
      playerObj.position.y = goodPos[1]
      playerObj.position.z = goodPos[2]
    }
  })

  if (!player.p.collided) {
    goodPos[0] = playerObj.position.x
    goodPos[1] = playerObj.position.y
    goodPos[2] = playerObj.position.z
  }

  if (player.p.forwardVel < -window.spd) {
    player.p.forwardVel = -window.spd
  }

  renderer.render(scene, camera)
}

kd.W.down(function(){player.determineVelocity(window.spd)})
kd.W.up(()=> {player.stop(window.spd)})

kd.S.down(()=> {player.determineVelocity(-window.spd)})
kd.S.up(()=> {player.stop(-window.spd)})

kd.A.down(()=> {player.rotateA(window.spd/window.rotDiv)})
kd.D.down(()=> {player.rotateD(window.spd/window.rotDiv)})

//Execute keydrown tick and run redraw
kd.run(function(){kd.tick()})
redraw()