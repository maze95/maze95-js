import * as Player from "./player_controller.js"
import { startObj } from "./object_defines.js"

let interval = 1
export const moveOut = () => {
  if (Player.checkCollided()) {
    Player.pObj.position.x += interval
    // if still not out of wall
    if (Player.checkCollided()) {
      interval += 2
      moveOut()
    } else {
        startObj.position.x = interval
    }
  }
}
moveOut()

export const isInRange = (val, low, high) => {
  if (val < high && val > low) { return true } else { return false }
}