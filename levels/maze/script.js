import { maze0Collision } from "./collision.js"

export const maze_entry = [
    "maze", //Level name

    "./levels/maze/model/model.glb", //Model directory from main script

    "mus_none", //Music to play

    [0, /*X*/ -3, /*Y*/ -23 /*Z*/], //Start pos

    maze0Collision, //Collision

    1.5, //Ambient light intensity

    [-101.19122157811111, -1, -33.62296792829396], //Fin (level ender) XYZ pos

    [0,0.2,-40], //Start logo XYZ pos

    "gltf.scene.children[0].children[0].material = new THREE.MeshBasicMaterial({map: wallTex})" //Level flags
]