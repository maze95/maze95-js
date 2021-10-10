import * as THREE from "./three.module.js"
import "./keydrown.min.js"
import { scene } from "../maze95.js"
import { collisionMat, getParam } from "./settings.js"
import { SelectedLVL } from "../levels/level_defines.js"

window.col_util = {
    boxes: [],
    geo_scales: [],
    log: () => {
        let box_names = []
        if (window.col_util.boxes.length == 0 || window.col_util.geo_scales.length == 0) return
        let jsOutput = `// auto generated collision by collision_util\nimport * as THREE from '../../game/three.module.js'\nimport { collisionMat } from "../../game/settings.js"\n\n`
        for (let i = 0; i < window.col_util.geo_scales.length; i++) {
            console.log(i)
            console.log(`Collision box #${i} X scale: ${window.col_util.geo_scales[i][0]}, Z scale: ${window.col_util.geo_scales[i][2]}`)
            jsOutput += `const box_${i}_geo = new THREE.BoxGeometry(${window.col_util.geo_scales[i][0]}, ${window.col_util.geo_scales[i][1]}, ${window.col_util.geo_scales[i][2]})\nconst box_${i} = new THREE.Mesh(box_${i}_geo, collisionMat)\n`
            box_names.push(`box_${i}`)
        }
        jsOutput += "\n"
        for (let i = 0; i < window.col_util.boxes.length; i++) {
            console.log(`Collision box #${i} X position: ${window.col_util.boxes[i].position.x}, Z position: ${window.col_util.boxes[i].position.z}`)
            jsOutput += `box_${i}.position.x = ${window.col_util.boxes[i].position.x}\nbox_${i}.position.z = ${window.col_util.boxes[i].position.z}\n`
        }
        jsOutput += `\nexport const ${SelectedLVL("lvlName")}_collision = [`
        for (let i = 0; i < box_names.length; i++) {
            jsOutput += `${box_names[i]},`
        }
        jsOutput += "]"
        console.log("JavaScript output:")
        console.log(jsOutput)
    }
}

export const col_util = () => {
    if (getParam("col_util")) {
        console.log(`
Collision Utility for Maze 95 JS.

Press N to make a new collision box and ENTER to finish it's changes.
Press the up and down arrow keys to move the collision box on the Z axis and left and right for the X axis.
Press I and K to scale a collision box on the Z axis and J and L on the X axis.

Once you are done, type in col_util.log() into the console to get the JavaScript output for your collision boxes.

I know this probably isn't the greatest method for collision but I don't know enough about how it works to make something better.
        `)
        col_util_update()
    }
}

let counter = 0 // counter variable for the current box
let inTheMaking = false
let enterPressed = false
// collision creation code of the utterly deranged
export const col_util_update = () => {
    requestAnimationFrame(col_util_update)
    kd.N.down(()=> { // N for new, also keeping other keydrown functions inside of N.down so they cannot be triggered before pressing it.
        // create box
        if (!inTheMaking) {
            inTheMaking = true
            window.col_util.geo_scales[counter] = [2, 50, 2]
            let box_geo = new THREE.BoxGeometry(window.col_util.geo_scales[counter][0], window.col_util.geo_scales[counter][1], window.col_util.geo_scales[counter][2])
            window.col_util.boxes[counter] = new THREE.Mesh(box_geo, collisionMat)
            window.col_util.boxes[counter].position.z = -6
            scene.add(window.col_util.boxes[counter])
            SelectedLVL("col").push(window.col_util.boxes[counter])
        }

        // movement
        kd.LEFT.down(()=>  {if (window.col_util.boxes[counter] === null || undefined || NaN) return; window.col_util.boxes[counter].position.x -= 0.5})
        kd.RIGHT.down(()=> {if (window.col_util.boxes[counter] === null || undefined || NaN) return; window.col_util.boxes[counter].position.x += 0.5})
        kd.UP.down(()=>    {if (window.col_util.boxes[counter] === null || undefined || NaN) return; window.col_util.boxes[counter].position.z -= 0.5})
        kd.DOWN.down(()=>  {if (window.col_util.boxes[counter] === null || undefined || NaN) return; window.col_util.boxes[counter].position.z += 0.5})

        // scaling; has to be geometry scaling due to collision code
        kd.J.down(()=> {if (window.col_util.geo_scales[counter] === null || undefined || NaN) return; window.col_util.geo_scales[counter][0]--; window.col_util.boxes[counter].geometry = new THREE.BoxGeometry(window.col_util.geo_scales[counter][0], window.col_util.geo_scales[counter][1], window.col_util.geo_scales[counter][2])})
        kd.L.down(()=> {if (window.col_util.geo_scales[counter] === null || undefined || NaN) return; window.col_util.geo_scales[counter][0]++; window.col_util.boxes[counter].geometry = new THREE.BoxGeometry(window.col_util.geo_scales[counter][0], window.col_util.geo_scales[counter][1], window.col_util.geo_scales[counter][2])})
        kd.I.down(()=> {if (window.col_util.geo_scales[counter] === null || undefined || NaN) return; window.col_util.geo_scales[counter][2]++; window.col_util.boxes[counter].geometry = new THREE.BoxGeometry(window.col_util.geo_scales[counter][0], window.col_util.geo_scales[counter][1], window.col_util.geo_scales[counter][2])})
        kd.K.down(()=> {if (window.col_util.geo_scales[counter] === null || undefined || NaN) return; window.col_util.geo_scales[counter][2]--; window.col_util.boxes[counter].geometry = new THREE.BoxGeometry(window.col_util.geo_scales[counter][0], window.col_util.geo_scales[counter][1], window.col_util.geo_scales[counter][2])})

        // revert
        kd.ENTER.down(()=> {
            if (!enterPressed) {
                enterPressed = true
                setTimeout(()=> {enterPressed = false}, 500)
            } else {
                return
            }
            inTheMaking = false
            counter++
        })
    })
}