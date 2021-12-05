import * as THREE from './three.module.js'
import { scene } from "../maze95.js"
import { wallMat } from "../textures/textures.js"

let collisionMesh = []
export { collisionMesh }

// Huge credits to https://github.com/johansatge/three-maze for the code to generate the maze.
const generateMaze = (size) => {
    var cN = [[0,0],[0,0],[0,0],[0,0]]
    var cx
    var cy
    var map = []
    var random_direction, int_done = 0
    // small fix, bln_blocked was undefined for some reason
    let bln_blocked = 0
    for (var x = 1; x <= size; x += 1)
    {
        map[x] = []
        for (var y = 1; y <= size; y += 1)
        {
            map[x][y] = 0
        }
    }
    do
    {
        x= 2 + Math.floor(Math.random() * (size - 1))
        if (x % 2 != 0)
        {
            x -= 1
        }
        y= 2 + Math.floor(Math.random() * (size - 1))
        if (y % 2 != 0)
        {
            y -= 1
        }
        if (int_done == 0)
        {
            map[x][y] = 1
        }
        if (map[x][y] == 1)
        {
            random_direction = Math.floor(Math.random() * 4)
            if (random_direction == 0)
            {
                cN = [[-1,0],[1,0],[0,-1],[0,1]]
            }
            else if (random_direction == 1)
            {
                cN = [[0,1],[0,-1],[1,0],[-1,0]]
            }
            else if (random_direction == 2)
            {
                cN = [[0,-1],[0,1],[-1,0],[1,0]]
            }
            else if (random_direction == 3)
            {
                cN = [[1,0],[-1,0],[0,1],[0,-1]]
            }
            bln_blocked = 1
            do
            {
                bln_blocked += 1;
                for (var int_dir = 0; int_dir <= 3; int_dir += 1)
                {
                    cx = x + cN[int_dir][0] * 2
                    cy = y + cN[int_dir][1] * 2
                    if (cx < size && cy < size && cx > 1 && cy > 1)
                    {
                        if (map[cx][cy] != 1)
                        {
                            map[cx][cy] = 1
                            map[x][y] = 1
                            map[x + cN[int_dir][0]][y + cN[int_dir][1]] = 1
                            x = cx
                            y = cy
                            bln_blocked = 0
                            int_done += 1
                            int_dir = 4
                        }
                    }
                }
            } while (bln_blocked == 1)
        }
    } while (int_done + 1 < ((size - 1) * (size - 1)) / 4)
    return map
}

export const make_maze = () => {
    let side = 31
    let thicknessXZ = 20
    let thicknessY = 25
    let new_map = generateMaze(side)
    for (var x = side; x > 0; x -= 1)
    {
        for (var y = 1; y < side + 1; y += 1)
        {
            // Adds a new mesh if needed
            if (new_map[x][y] === 0)
            {
                // Generates the mesh
                let wall_geometry = new THREE.BoxGeometry(thicknessXZ, thicknessY, thicknessXZ, 1, 1, 1)
                new_map[x][y] = new THREE.Mesh(wall_geometry, wallMat)
                new_map[x][y].position.set(x * thicknessXZ - ((side * thicknessXZ) / 2), 0, y * 20 - ((side * thicknessXZ) / 2))
                collisionMesh.push(new_map[x][y])
                scene.add(new_map[x][y])
            } else { new_map[x][y] = false }
        }
    }
}