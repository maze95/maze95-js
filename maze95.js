import * as THREE from './game/three.module.js' // Maze 95 JS, now in 3D!
import { GLTFLoader } from "./game/model_loader.js"
import "./game/keydrown.min.js" // input
import { SelectedLVL } from "./levels/level_defines.js"
import { collisionMat, billboard } from "./game/settings.js"
import { initRenderer, renderer, width, height } from "./game/renderer.js"
import { col_util } from "./game/collision_util.js"

import { faceObj } from "./game/object_defines.js" // object
import { startObj } from "./game/object_defines.js" // object
import { playerAction, player } from "./game/player_controller.js" // player code

import { floorMat, ceilingMat, wallMat } from "./textures/inside.js" // for eval flags

console.log("achieved with MazeSrc\n\nepic Half-Life reference")
window.spd = 0.0000000001
window.rotDiv = 1
initRenderer()
export const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60,width/height)
scene.add(player)
scene.add(camera)

let collisionVisible = false
window.showCollision = function() {
  collisionVisible = !collisionVisible
  if (collisionVisible) {
    collisionMat.opacity = 0.9
  } else {
    collisionMat.opacity = 0
  }
}

let amb
let model
function loadMap() {
  let loader = new GLTFLoader()
  loader.load(SelectedLVL("lvlDir"), function (gltf) {
    eval(SelectedLVL("flg"))
    scene.add(gltf.scene)
    model = gltf
  })
  player.position.x = SelectedLVL("pos")[0]
  player.position.y = SelectedLVL("pos")[1]
  player.position.z = SelectedLVL("pos")[2]
  // collision
  if (SelectedLVL("col") != null) {
    SelectedLVL("col").forEach(wall => {
      scene.add(wall)
    })
  }

  scene.add(faceObj)
  scene.add(startObj)

  amb = new THREE.AmbientLight(0xffffff, SelectedLVL("ambLightIntensity"))
  scene.add(amb)
  if (SelectedLVL("lvlMus") != "mus_none") {
    let mus = new Audio('./audio/' + SelectedLVL("lvlMus") + '.mp3')
    mus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
      this.currentTime = 0
      this.play()
    }, false)
    mus.play()
  }
}
loadMap()
col_util()

let codeExec = false // variable for only running code once within the update function after the maze has rose
function update() {
  requestAnimationFrame(update)
  camera.position.x = player.position.x
  camera.position.y = player.position.y
  camera.position.z = player.position.z
  billboard(camera, player) // makes sense if you think about it
  billboard(faceObj, player)
  billboard(startObj, player)

  if (model != undefined) {
    if (model.scene.position.y < 54) {
      model.scene.position.y += 0.5
    } else {
      if (!codeExec) {
        codeExec = true
        window.spd = 0.95
        window.rotDiv = 22.5
        model.scene.position.y = 54
      }
    }
  }
  renderer.render(scene, camera)
}

kd.W.down(()=> {playerAction("move", -window.spd)})
kd.S.down(()=> {playerAction("move", window.spd)})
kd.A.down(()=> {playerAction("rotate", window.spd / window.rotDiv)})
kd.D.down(()=> {playerAction("rotate", -window.spd / window.rotDiv)})
kd.run(function(){kd.tick()})
update()