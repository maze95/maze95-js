import { maze0Collision } from "./collision.js"

export const maze_entry = [
    "maze", //Level name
    "./levels/maze/model/model.glb", //Model directory from main script
    "mus_none", //Music to play
    [0 /*X*/, 0 /*Y*/, 0 /*Z*/, -23/*yaw*/], //Start pos
    maze0Collision,
    1.5, //Ambient light intensity
    [-101.19122157811111, -1, -33.62296792829396], //Fin (level ender) XYZ pos
    [0,0.2,-40] //Start logo XYZ pos
]