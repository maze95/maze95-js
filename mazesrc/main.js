import * as THREE from './three.module.js'
import "./keydrown.min.js" // input library
import { Player } from './player_controller.js'

const check = (val, def) => {
    val = val == null ? def : val
    return val
}
const set_obj_position = (obj, x, y, z) => {
    obj.position.x = x
    obj.position.y = y
    obj.position.z = z
}
const set_obj_rotation = (obj, x, y, z) => {
    obj.rotation.x = THREE.Math.degToRad(x)
    obj.rotation.y = THREE.Math.degToRad(y)
    obj.rotation.z = THREE.Math.degToRad(z)
}

export const scene = new THREE.Scene()

const missing_material = new THREE.MeshBasicMaterial({color: 0xff00ff})

class mazeSrc {
    constructor(canvasName) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector(`#${canvasName}`),
            antialias: false
        })

        this.box = 0

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight)
        scene.add(this.camera)
        this.player = new Player()

        this.initialize_game()
    }

    initialize_game() {
        kd.W.down(()=> { this.player.playerInput.up    = true })
        kd.S.down(()=> { this.player.playerInput.down  = true })
        kd.A.down(()=> { this.player.playerInput.left  = true })
        kd.D.down(()=> { this.player.playerInput.right = true })
        
        kd.W.up(()=> { this.player.playerInput.up    = false })
        kd.S.up(()=> { this.player.playerInput.down  = false })
        kd.A.up(()=> { this.player.playerInput.left  = false })
        kd.D.up(()=> { this.player.playerInput.right = false })

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        window.addEventListener('resize', () =>
        {
            // update camera
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            // update renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.renderer.setPixelRatio(window.devicePixelRatio)
        })

        this.engineVersion = "0.0.1"
        console.log(`MazeSrc v${this.engineVersion}\nInitialized at ${window.innerWidth}x${window.innerHeight}`)
    }

    create_object(params) {
        // params template { type: "box", name: "floor", material: null, scaleX: 1, scaleY: 1, scaleZ: 1, rotX: 0, rotY: 0, rotZ: 0, posX: 0, posY: -13, posZ: 0 }
        switch(params.type) {
            case this.box:
                let geo = new THREE.BoxGeometry(check(params.scaleX, 1), check(params.scaleY, 1), check(params.scaleZ, 1))
                let object = new THREE.Mesh(geo, check(params.material, missing_material))
                set_obj_position(object, check(params.posX, 0), check(params.posY, 0), check(params.posZ, 0))
                set_obj_rotation(object, check(params.rotX, 0), check(params.rotY, 0), check(params.rotZ, 0))
                scene.add(object)
                return object
            default:
                console.log("unknown object type " + params.type)
                break
        }
    }

    billboard(object) {
        object.rotation.y = this.player.playerState.object.rotation.y
    }

    render_game() {
        kd.tick()
        if (this.player.playerInput.up) { this.player.action("move", -this.player.playerState.speed) }
        if (this.player.playerInput.down) { this.player.action("move", this.player.playerState.speed) }
        if (this.player.playerInput.left) { this.player.action("rotate", this.player.playerState.speed / this.player.playerState.lookDivider) }
        if (this.player.playerInput.right) { this.player.action("rotate", -this.player.playerState.speed / this.player.playerState.lookDivider) }
        this.player.move_camera(this.camera)

        this.renderer.render(scene, this.camera)
    }
}
export const MazeSrc = new mazeSrc("game")