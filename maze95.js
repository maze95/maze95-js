import { MazeSrc } from "./mazesrc/main.js"
import { floor, ceiling, start } from "./textures/textures.js"
import * as MazeGen from "./mazesrc/generation.js" // code for generating maze

let startLogo = null

const main = () => {
    requestAnimationFrame(main)
    MazeSrc.billboard(startLogo)
    MazeSrc.render_game()
}

// config Maze 95 JS
const startGame = () => {
    MazeSrc.create_object({type: MazeSrc.box, name: "floor", material: floor, scaleX: 1000, scaleY: 1, scaleZ: 1000, posY: -13})
    MazeSrc.create_object({type: MazeSrc.box, name: "ceiling", material: ceiling, scaleX: 1000, scaleY: 1, scaleZ: 1000, posY: 9})
    startLogo = MazeSrc.create_object({type: MazeSrc.box, name: "start_logo", material: start, scaleX: 18, scaleY: 25, scaleZ: 0, posX: MazeSrc.player.playerState.object.position.x, posY: -3, posZ: MazeSrc.player.playerState.object.position.z})

    MazeGen.make_maze()
    MazeSrc.player.move_player()
    main()
}
startGame()