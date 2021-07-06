import Scene from './scene.js'
import * as THREE from './lib/three.module.js'
import "./lib/keydrown.min.js"
import "./lib/settings.js"
import { io } from 'socket.io-client'
import { GLTFLoader } from "./lib/model_loader.js"
import "./lib/object_defines.js"
import { faceObj, startObj } from './lib/object_defines.js'

if(window.location.href.includes("localhost" || "127.0.0.1")) {
  document.title = "Maze 95 JS - LOCAL"
}

//Path to the server
const webSocketServerPath = "http://localhost:3000"

//Misc variables
window.spooky
window.spooky = false

let gameStarted = false
window.spd = 0

const playerDecelMovement = 0.75
const playerDecelTurning = 0.75
let playerVel = [0.0, 0.0, 0.0] /*X,Z,Turning*/
window.pv = () => {return playerVel}
//Colors
const win95teal = new THREE.Color(0x018281)
const black = new THREE.Color(0x000000)
export const green = new THREE.Color(0x248000)

//Player properties
export const playerGeo = () => {return new THREE.BoxGeometry(25,38,0)} //new THREE.CylinderGeometry(10,10,30)

export const quickLoadTexture = (texturePath, texOpacity = 1.0) => { /* Helps keep the table below from taking up a ton of lines. */
	const texture_loaded = new THREE.TextureLoader().load(`./textures/${texturePath}.png`)
	texture_loaded.magFilter = THREE.NearestFilter
	return new THREE.MeshStandardMaterial({map: texture_loaded, transparent: true, opacity: texOpacity})
}

export const playerRotSprites = { /* You can probably guess what this is for. */
	"_0" : quickLoadTexture("xenle_sprites/0001"),
	"_1" : quickLoadTexture("xenle_sprites/0002"),
	"_2" : quickLoadTexture("xenle_sprites/0003"),
	"_3" : quickLoadTexture("xenle_sprites/0004"),
	"_4" : quickLoadTexture("xenle_sprites/0005"),
	"_5" : quickLoadTexture("xenle_sprites/0006"),
	"_6" : quickLoadTexture("xenle_sprites/0007"),
	"_7" : quickLoadTexture("xenle_sprites/0008")	
}

// Doom-like player sprite calc stuff

export const raw_looppoint = 6.30
export const sprite_offset = 4
/*This is used to remap raw angles to a workable value.*/
export const remapAngle = (angle) => {
  return angle + (angle < 0.0 ? raw_looppoint : (angle > raw_looppoint ? -raw_looppoint : 0.0))
}
/*Convert raw angle to readable for math.*/
export const convertRaw2Read = (angle) => {
  return (remapAngle(angle)/(raw_looppoint/360))%360
}
/*Convert readable angle to raw for math. Only here incase you need to make a quick fix to this function.*/
export const convertRead2Raw = (angle) => {
  return remapAngle(angle*(raw_looppoint/360))
}
/*convert raw ang to sprite id. this will return a number from 0 to 7, and assumes that in order the sprites are first facing front, then adding 45 deg until it loops.*/
/*tl;dr If the player angle is the same as the camera angle the player will be facing away, store sprites in a list with the order based on filename. this returns index.*/
export const playerSpriteFromRot = (playerRot, cameraRot) => {
  const player_rotation = convertRaw2Read(playerRot-cameraRot)
  return `_${((sprite_offset+(Math.round(player_rotation/45)))%8)}` /*add 4, this is because if the player rot is the same as the camera rot then the player should be FACING AWAY.*/
}


//Disable Story Mode button as it does nothing
document.getElementById("storystart").disabled = true

//Action of reset button
const resetButton = document.getElementById("reset")
resetButton.onclick = function resetGame() {
  location.reload()
}

//Textures
const wallTex = new THREE.TextureLoader().load(`${texturePath}${window.wallTexName}`, function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(2,2)
})
wallTex.magFilter = THREE.NearestFilter
const wallMat = new THREE.MeshBasicMaterial({map: wallTex})

//Make connection with server
const socket = io(webSocketServerPath)

//The game scene
export const gameScene = new Scene()
gameScene.scene.background = win95teal

//Some client-server properties
let id
let instances = []
export const clients = new Object()
window.clientInitialized = false
function clients_initialized () {return window.clientInitialized}

//Cube on title screen
const titleCubeGeo = new THREE.BoxGeometry(15,15,15)
const titleCube = new THREE.Mesh(titleCubeGeo, wallMat)
gameScene.scene.add(titleCube)
titleCube.position.z = -50
titleCube.position.x = 7
titleCube.rotation.y = 0.45

//Fog function
function fog(color, near, far) {
  gameScene.scene.fog = new THREE.Fog(color, near, far);
}
function unfog() {
  gameScene.scene.fog = null
}
if(window.spooky && !gameStarted) {
  console.warn("Cannot enable spooky mode yet, map not loaded.") //Any help on how not to newly warn every single framew would be appreciated
}
if(window.spooky && gameStarted) {
  fog(0x0000, 5, 50)
  amb.color.setHex(0x707070)
}
else {
  unfog()
}

//Music on title screen
let titleMus = new Audio("./audio/mus_bg.mp3")
titleMus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
  this.currentTime = 0
  this.play()
}, false)
titleMus.play()

var mixer
var action

export { mixer, action }

function loadMap() {
  gameScene.scene.remove(titleCube)
  gameScene.scene.add(gameScene.ceiling)
  gameScene.scene.add(gameScene.floor)
  gameScene.scene.add(faceObj)
  gameScene.scene.add(startObj)
  window.spd = 1.5
  gameStarted = true
}

function loadModel() {
  const loader = new GLTFLoader()
  loader.load("./levels/maze/model/model.glb", function (gltf) {
    gameScene.scene.add(gltf.scene)
    gltf.scene.position.y = 46

    mixer = new THREE.AnimationMixer(gltf.scene)

    action = mixer.clipAction(gltf.animations[ 0 ])
    action.setLoop(THREE.LoopOnce)
    action.clampWhenFinished = true
    action.enable = true
    action.play()
    action.play().reset()
  })
}

function clearCanvas() {
  document.getElementById("title").remove()
  document.getElementById("classicstart").remove()
  document.getElementById("storystart").remove()
  titleMus.pause()
}

document.getElementById("classicstart").onclick = function startGame() {
  document.getElementById("classicstart").disabled = true
  gameScene.scene.background = black
  clearCanvas()
  loadModel()
  loadMap()
}

//On moved
gameScene.on('userMoved', ()=>{
  socket.emit('move', {"pos":[gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z],"rot":[gameScene.player.rotation.x, remapAngle(gameScene.player.rotation.y), gameScene.player.rotation.z]})

})

//On connection server sends the client their ID
socket.on('introduction', (_id, _clientNum, _ids)=>{

  for(let i = 0; i < _ids.length; i++){
    if(_ids[i] != _id){
      clients[_ids[i]] = {
        mesh: new THREE.Mesh(
          playerGeo(),
          quickLoadTexture("xenle_sprites/0001")
        ),
		rot: 0.0
      }

      //Add initial users to the scene
      gameScene.scene.add(clients[_ids[i]].mesh)
    }
  }

  console.log(clients)

  id = _id
  console.log(`Client ID is ${id}`)


  window.clientInitialized = true
})

//Run when a new user has connected to the server
socket.on('newUserConnected', (clientCount, _id, _ids)=>{
  document.getElementById("numberonline").innerHTML = `Players online: ${clientCount}`
  let alreadyHasUser = false
  for(let i = 0; i < Object.keys(clients).length; i++){
    if(Object.keys(clients)[i] == _id){
      alreadyHasUser = true
      break
    }
  }
  if(_id != id && !alreadyHasUser){
    console.log('A new user connected with the id: ' + _id)
    clients[_id] = {
      mesh: new THREE.Mesh(
          playerGeo(),
          quickLoadTexture("xenle_sprites/0001")
      ),
	  rot: 0.0
    }

    //Add initial users to the scene
    gameScene.scene.add(clients[_id].mesh)
    clients[_id].mesh.position.y = -7//-10
    clients[_id].mesh.position.z = -23
  }

})

//Run when a user disconnects
socket.on('userDisconnected', (clientCount, _id, _ids)=>{
  //Update the data from the server
  document.getElementById("numberonline").innerHTML = `Players online: ${clientCount}`

  if(_id != id){
    console.log('A user disconnected with the id: ' + _id)
    gameScene.scene.remove(clients[_id].mesh)
    delete clients[_id]
  }
})

socket.on('connect', ()=>{})

//Update when one of the users moves in space
socket.on('userPositions', _clientProps =>{
  // console.log('Positions of all users are ', _clientProps, id)
  // console.log(Object.keys(_clientProps)[0] == id)
  for(let i = 0; i < Object.keys(_clientProps).length; i++){
    if(Object.keys(_clientProps)[i] != id){
      let newPos = _clientProps[Object.keys(_clientProps)[i]].position
	  
      clients[Object.keys(_clientProps)[i]].mesh.position.set(newPos[0], newPos[1], newPos[2])
	  clients[Object.keys(_clientProps)[i]].rot = _clientProps[Object.keys(_clientProps)[i]].rotation[1]
    }
  }
})

//Move functions
function rotateD(speed) {
  playerVel[2] -= speed
}

function rotateA(speed) {
  playerVel[2] += speed
}

function moveW(speed) {
  playerVel[0] += (-Math.sin(gameScene.player.rotation.y) * speed)/4 //X
  playerVel[1] += (-Math.cos(gameScene.player.rotation.y) * speed)/4 //Z
}

function moveS(speed) {
  playerVel[0] -= (-Math.sin(gameScene.player.rotation.y) * speed)/4 //X
  playerVel[1] -= (-Math.cos(gameScene.player.rotation.y) * speed)/4 //Z
}

kd.W.down(function(){moveW(window.spd)})
kd.A.down(function(){rotateA(window.spd/window.rotDiv)})
kd.S.down(function(){moveS(window.spd)})
kd.D.down(function(){rotateD(window.spd/window.rotDiv)})

kd.run(function(){kd.tick()})

function updatePlayerSprites () {
		for(let i = 0; i < Object.keys(clients).length; i++){
			if(clients[Object.keys(clients)[i]] != null){
				clients[Object.keys(clients)[i]].mesh.rotation.set(gameScene.player.rotation.x, gameScene.player.rotation.y, gameScene.player.rotation.z)
				clients[Object.keys(clients)[i]].mesh.material.map = playerRotSprites[playerSpriteFromRot(clients[Object.keys(clients)[i]].rot, remapAngle(gameScene.player.rotation.y))].map
				clients[Object.keys(clients)[i]].mesh.material.needsUpdate = true
			}
		}
}
function updatePlayerSpeeds (player) {
	playerVel[0] *= playerDecelMovement;
	playerVel[1] *= playerDecelMovement;
	playerVel[2] *= playerDecelTurning;
	if (playerVel[0] > window.spd) playerVel[0] = window.spd
	if (playerVel[1] > window.spd) playerVel[1] = window.spd
	if (playerVel[2] > window.spd/window.rotDiv) playerVel[2] = window.spd/window.rotDiv
	if (playerVel[0] < -window.spd) playerVel[0] = -window.spd
	if (playerVel[1] < -window.spd) playerVel[1] = -window.spd
	if (playerVel[2] < -window.spd/window.rotDiv) playerVel[2] = -window.spd/window.rotDiv
	player.position.x += playerVel[0]
	player.position.z += playerVel[1]
	player.rotation.y += playerVel[2]
    player.rotation.y = remapAngle(player.rotation.y)
	if (playerVel[0] != 0.0 ||
	playerVel[1] != 0.0 ||
	playerVel[2] != 0.0) {socket.emit('move', {"pos":[player.position.x, player.position.y, player.position.z],"rot":[player.rotation.x, remapAngle(player.rotation.y), player.rotation.z]})}
	document.title = `Maze 95 JS - ${Math.round(playerVel[0])}, ${Math.round(playerVel[1])}`
}
export {updatePlayerSprites, clients_initialized, updatePlayerSpeeds}