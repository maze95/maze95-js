import * as THREE from './three.module.js'
import { collision_check } from "./surface.js"
import { collision_mesh } from "./generation.js"

export class Player {
    constructor() {
        this.playerInput = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        // TODO remove playerState as it just makes code more complicated and longer
        this.playerState = {
            speed: 0.95,
            lookDivider: 4.75,
            dir: new THREE.Vector3(),
            object: new THREE.Mesh(new THREE.BoxGeometry(10,20,10), new THREE.MeshBasicMaterial({color: 0x248000}))
        }
        this.playerState.object.position.y = -3
    }

    check_collided() {
        for (let i = 0; i < collision_mesh.length; i++) {
            if (collision_check(this.playerState.object, collision_mesh[i])) {
              return true
            }
        }
    }

    move_player() { // move player out of the way of walls
        while (this.check_collided()) {
            this.playerState.object.position.x++
        }
    }

    action(type, speed) {
        const dir = this.playerState.dir
        switch(type) {
            case "move":
                this.playerState.object.getWorldDirection(dir)
            
                this.playerState.object.position.x += dir.x * (speed/1.45)
                for (let i = 0; i < collision_mesh.length; i++) { // TODO optimize with cells?
                  if(collision_check(this.playerState.object, collision_mesh[i])) this.playerState.object.position.x -= dir.x * (speed/1.45)
                }
                this.playerState.object.position.z += dir.z * (speed/1.45)
                for (let i = 0; i < collision_mesh.length; i++) {
                  if(collision_check(this.playerState.object, collision_mesh[i])) this.playerState.object.position.z -= dir.z * (speed/1.45)
                }
                break
            case "rotate":
                this.playerState.object.rotation.y += speed / this.playerState.lookDivider
                break
        }
    }

    move_camera(camera) {
        camera.position.x = this.playerState.object.position.x
        camera.position.y = this.playerState.object.position.y
        camera.position.z = this.playerState.object.position.z
        camera.rotation.y = this.playerState.object.rotation.y
    }
}