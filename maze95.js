import * as THREE from './lib/three.module.js'
import { GLTFLoader } from "./lib/model_loader.js"
import "./lib/keydrown.min.js"
import { SelectedLVL } from "./levels/level_defines.js"
import { widescreen, collisionMat } from "./lib/settings.js"
import "./lib/settings.js"

import { faceObj } from "./lib/object_defines.js"
import { startObj } from "./lib/object_defines.js"
import { collisionCheck } from './lib/surface.js'

let width = 512
let height = 384

let gameStarted = false
let clock = new THREE.Clock()
let dir = new THREE.Vector3() //Player direction
window.spd
window.rotDiv = 20

let collisionVisible = false
window.showCollision = function() {
  collisionVisible = !collisionVisible
  if (collisionVisible) {
    collisionMat.opacity = 0.9
  } else {
    collisionMat.opacity = 0
  }
}

const renderer = new THREE.WebGLRenderer({
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

const invisible = new THREE.MeshBasicMaterial({color: 0x248000, /*transparent: true,*/ opacity: 0})

export const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60,width/height)

const playerGeo = new THREE.BoxGeometry(3,3,3)
export const player = new THREE.Mesh(playerGeo, invisible)

scene.add(player)
scene.add(camera)

const wallTex = new THREE.TextureLoader().load("./textures/wall.png", function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,-0.02)
  texture.repeat.set(1,0.98)
})
wallTex.magFilter = THREE.NearestFilter

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

let amb
let mixer
let action
function loadModel() { //Loads in the maze 3D model
  var loader = new GLTFLoader();
  loader.load(SelectedLVL("lvlDir"), function (gltf) {
  if (!SelectedLVL("lvlName").includes("maze")) {
    scene.remove(floor)
    scene.remove(ceiling)
  } else {
    mixer = new THREE.AnimationMixer(gltf.scene)

    action = mixer.clipAction(gltf.animations[ 0 ])
    action.setLoop(THREE.LoopOnce)
    action.clampWhenFinished = true
    action.enable = true
    action.play()
    action.play().reset()
  }
  eval(SelectedLVL("flg"))
  scene.add(gltf.scene)
  gltf.scene.position.y = 8
  })
  window.spd = 0.95 //Easter egg if you're looking here
}

function loadMap() { //Sets the properties to begin the game
  floor.position.set(0,-18,-215)
  ceiling.position.set(0,12,-215)
  player.position.x = SelectedLVL("pos")[0]
  player.position.y = SelectedLVL("pos")[1]
  player.position.z = SelectedLVL("pos")[2]

  //Collision
  if (SelectedLVL("col") != null) {
    SelectedLVL("col").forEach(wall => {
      scene.add(wall)
    })
  }

  //Various objects
  scene.add(ceiling)
  scene.add(floor)
  scene.add(faceObj)
  scene.add(startObj)

  amb = new THREE.AmbientLight(0xffffff, SelectedLVL("ambLightIntensity"))
  scene.add(amb)
  gameStarted = true
  playMusic()
}
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

loadModel()
loadMap()

function redraw() {
  requestAnimationFrame(redraw)
  camera.position.x = player.position.x
  camera.position.y = player.position.y
  camera.position.z = player.position.z
  camera.rotation.y = player.rotation.y
  faceObj.rotation.y = player.rotation.y
  startObj.rotation.y = player.rotation.y

	var delta = clock.getDelta()
	if (mixer) mixer.update(delta)

  renderer.render(scene, camera)
}

function playerAction(type, speed) {
  switch(type) {
    case "move":
      player.getWorldDirection(dir)

      player.position.x += dir.x * (speed/1.45)
      SelectedLVL("col").forEach(wall => {
        if(collisionCheck(player, wall)) player.position.x -= dir.x * (speed/1.45)
      })
      player.position.z += dir.z * (speed/1.45)
      SelectedLVL("col").forEach(wall => {
        if(collisionCheck(player, wall)) player.position.z -= dir.z * (speed/1.45)
      })
      break
    
    case "rotate":
      player.rotation.y += speed
      break
  }
}

kd.W.down(()=> {playerAction("move", -window.spd)})
kd.S.down(()=> {playerAction("move", window.spd)})

kd.A.down(()=> {playerAction("rotate", window.spd / window.rotDiv)})
kd.D.down(()=> {playerAction("rotate", -window.spd / window.rotDiv)})

//Execute keydrown tick and run redraw
kd.run(function(){kd.tick()})
redraw()