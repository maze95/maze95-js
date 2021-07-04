import { gameScene } from "../index.js"

function rotateD(speed) {
    gameScene.player.rotation.y -= speed
}
  
function rotateA(speed) {
    gameScene.player.rotation.y += speed
}

function moveW(speed) {
    gameScene.player.position.x += -Math.sin(gameScene.player.rotation.y) * speed;
    gameScene.player.position.z += -Math.cos(gameScene.player.rotation.y) * speed;
}

function moveS(speed) {
    gameScene.player.position.x -= -Math.sin(gameScene.player.rotation.y) * speed;
    gameScene.player.position.z -= -Math.cos(gameScene.player.rotation.y) * speed;
}

export { rotateD, rotateA, moveS, moveW }