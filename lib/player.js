import { playerObj } from "../maze95.js"

export const p = {
    forwardVel: 0,
    collided: false
}

export const determineVelocity = (spd) => {
    p.forwardVel += spd / 10
    if (p.forwardVel > spd) {
        p.forwardVel = spd
    }
}

//Rotation
export const rotateD = (maxSpeed) => {
    playerObj.rotation.y -= maxSpeed
}
  
export const rotateA = (maxSpeed) => {
    playerObj.rotation.y += maxSpeed
}

export const stop = (maxSpeed) => {
    let timer = setInterval(()=> {
        p.forwardVel -= maxSpeed / 10

        if (p.forwardVel < 0) {
            p.forwardVel = 0
            clearTimeout(timer)
        }
    }, 10)
}