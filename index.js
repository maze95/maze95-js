import Scene from './maze95.js';
import * as THREE from './lib/three.module.js'
import "./lib/keydrown.min.js"
import "./lib/settings.js"
import { io } from 'socket.io-client'
import "./lib/player_no_col.js"
import { GLTFLoader } from "./lib/model_loader.js"

if(window.location.href.includes("localhost" || "127.0.0.1")) {
  document.title = "Maze 95 JS - LOCAL"
}

const webSocketServerPath = "http://localhost:3000"

export const green = new THREE.Color(0x248000)
export const playerGeo = new THREE.CylinderGeometry(10,10,30)
const playerTex = new THREE.TextureLoader().load("./textures/playertex.png")
export const playerMat = new THREE.MeshBasicMaterial({map: playerTex})

const resetButton = document.getElementById("reset")
resetButton.onclick = function resetGame() {
  location.reload()
}

//All below is managing the connection with the server.

//A socket.io instance
const socket = io(webSocketServerPath);

//One WebGL context to rule them all !
export const gameScene = new Scene();
let id;
let instances = [];
let clients = new Object();

gameScene.on('userMoved', ()=>{
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z]);
});

//On connection server sends the client his ID
socket.on('introduction', (_id, _clientNum, _ids)=>{

  for(let i = 0; i < _ids.length; i++){
    if(_ids[i] != _id){
      clients[_ids[i]] = {
        mesh: new THREE.Mesh(
          playerGeo,
          playerMat
        )
      }

      //Add initial users to the scene
      gameScene.scene.add(clients[_ids[i]].mesh);
    }
  }

  console.log(clients);

  id = _id;
  console.log(`Client ID is ${id}`);

});

socket.on('newUserConnected', (clientCount, _id, _ids)=>{
  document.getElementById("numberonline").innerHTML = `Players online: ${clientCount}`
  let alreadyHasUser = false;
  for(let i = 0; i < Object.keys(clients).length; i++){
    if(Object.keys(clients)[i] == _id){
      alreadyHasUser = true;
      break;
    }
  }
  if(_id != id && !alreadyHasUser){
    console.log('A new user connected with the id: ' + _id);
    clients[_id] = {
      mesh: new THREE.Mesh(
        playerGeo,
        playerMat
      )
    }

    //Add initial users to the scene
    gameScene.scene.add(clients[_id].mesh);
    clients[_id].mesh.position.y = -10
    clients[_id].mesh.position.z = -23
  }

});

socket.on('userDisconnected', (clientCount, _id, _ids)=>{
  //Update the data from the server
  document.getElementById("numberonline").innerHTML = `Players online: ${clientCount}`

  if(_id != id){
    console.log('A user disconnected with the id: ' + _id);
    gameScene.scene.remove(clients[_id].mesh);
    delete clients[_id];
  }
});

socket.on('connect', ()=>{});

//Update when one of the users moves in space
socket.on('userPositions', _clientProps =>{
  // console.log('Positions of all users are ', _clientProps, id);
  // console.log(Object.keys(_clientProps)[0] == id);
  for(let i = 0; i < Object.keys(_clientProps).length; i++){
    if(Object.keys(_clientProps)[i] != id){

      //Store the values
      let oldPos = clients[Object.keys(_clientProps)[i]].mesh.position;
      let newPos = _clientProps[Object.keys(_clientProps)[i]].position;

      //Create a vector 3 and lerp the new values with the old values
      let lerpedPos = new THREE.Vector3();
      lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3);
      lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3);
      lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3);

      //Set the position
      clients[Object.keys(_clientProps)[i]].mesh.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);
    }
  }
});

function loadModel() {
  const loader = new GLTFLoader();
  loader.load("./levels/maze/model/model.glb", function (gltf) {
    gameScene.scene.add(gltf.scene)
    gltf.scene.position.y = 46
  })
}
loadModel()

function rotateD(speed) {
  gameScene.player.rotation.y -= speed
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z]);
}

function rotateA(speed) {
  gameScene.player.rotation.y += speed
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z]);
}

function moveW(speed) {
  gameScene.player.position.x += -Math.sin(gameScene.player.rotation.y) * speed;
  gameScene.player.position.z += -Math.cos(gameScene.player.rotation.y) * speed;
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z]);
}

function moveS(speed) {
  gameScene.player.position.x -= -Math.sin(gameScene.player.rotation.y) * speed;
  gameScene.player.position.z -= -Math.cos(gameScene.player.rotation.y) * speed;
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z]);
}

kd.W.down(function(){moveW(window.spd)})
kd.A.down(function(){rotateA(window.spd/window.rotDiv)})
kd.S.down(function(){moveS(window.spd)})
kd.D.down(function(){rotateD(window.spd/window.rotDiv)})

kd.run(function(){kd.tick()})