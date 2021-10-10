import { maze_collision } from "./collision.js"

export const maze_entry = [
    "maze", //Level name

    "./levels/maze/model/model.glb", //Model directory from main script

    "mus_none", //Music to play

    [0, /*X*/ -3, /*Y*/ -23 /*Z*/], //Start pos

    maze_collision, //Collision

    1.5, //Ambient light intensity

    [-101.19122157811111, -1, -33.62296792829396], //Fin (level ender) XYZ pos

    [0,0.2,-40], //Start logo XYZ pos

    "gltf.scene.children[0].children[0].material = wallMat; const floor = new THREE.Mesh(new THREE.BoxGeometry(1000,0.1,1000), floorMat); scene.add(floor); const ceiling = new THREE.Mesh(new THREE.BoxGeometry(1000,0.1,1000), ceilingMat); scene.add(ceiling); floor.position.set(0,-18,-215); ceiling.position.set(0,12,-215);" //Level flags
]