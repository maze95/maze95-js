import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { SelectedLVL } from "./levels/level_defines"
import * as THREE from 'three'
import "./node_modules/keydrown/dist/keydrown"

var width
var height

const widescreen = false //experimental

if(widescreen == false) {
  width = innerWidth
  height = innerHeight
}
else {
  width = 320
  height = 224
}

//Scene & camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, 320/224)
let green = new THREE.MeshBasicMaterial({color: 0x248000})
scene.add(camera)
//Music
if(SelectedLVL("lvlMus") == "mus_none") {
  console.log("Audio set to none")
}
else {
  let mus = new Audio('../audio/' + SelectedLVL("lvlMus") + '.mp3')
  mus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
    this.currentTime = 0
    this.play()
  }, false)
  mus.play()
}
//Render on canvas
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
})
//Canvas size parameters
renderer.setPixelRatio(window.devicePixelRatio)
if(widescreen == false) {
  renderer.setSize(320, 224)
}
else {
  renderer.setSize(window.innerWidth, window.innerHeight)
}
//Object loader
const loader = new GLTFLoader();
loader.load(SelectedLVL("lvlDir"), function (gltf) {
	scene.add(gltf.scene)
})
const player = new THREE.Mesh(
  new THREE.BoxGeometry(8,12,8),
  green
)
scene.add(player)
//Light
const amb = new THREE.AmbientLight(0xffffff, 1.1)
scene.add(amb)

var rtSpd = 0.035
var mvSpd = 0.5
//Function to redraw the frame each change
function redraw() {
  camera.position.x = player.position.x
  camera.position.y = player.position.y
  camera.position.z = player.position.z
  camera.rotation.y = player.rotation.y
  requestAnimationFrame(redraw)
  renderer.render(scene, camera)
}

function rotateD(speed) {
  player.rotation.y -= speed
}

function rotateA(speed) {
  player.rotation.y += speed
}

function moveW(speed) {
  player.position.x += -Math.sin(player.rotation.y) * speed;
  player.position.z += -Math.cos(player.rotation.y) * speed;
}

function moveS(speed) {
	player.position.x -= -Math.sin(player.rotation.y) * speed;
	player.position.z -= -Math.cos(player.rotation.y) * speed;
}

//Keydrown movement mapping
kd.W.down(function(){moveW(mvSpd)})
kd.A.down(function(){rotateA(rtSpd)})
kd.S.down(function(){moveS(mvSpd)})
kd.D.down(function(){rotateD(rtSpd)})
//Execute keydrown tick and run redraw
kd.run(function(){kd.tick()})
redraw()