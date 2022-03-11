# maze95-js
This is a port / authentic remake of the non interactive classic Windows 95 3D Maze screensaver originally implemented in OpenGL made into an interactive web game experience. I am recreating it with my own little JS game engine called MazeSrc, built on top of Three.js.

You can play the game [here]("https://maze95.js.org/new_engine")

# How it works
## Engine
`mazesrc/`
I am attempting to make some engine of sorts that is supposed to capture the energy of early-mid 90s games and eventually I want to expand player movement and abilities with the collision engine as well to create something resembling idTech.

## Maze generation
`maze95-js/generation.js`
A maze generator algorithm determines where and where not to generate walls and once it finishes it pushes every wall to the collision mesh. The collision engine only works with box geometries and does not use collision cells thus making it a little unoptimized, however due to the size of the maze this isn't much of a problem.

## Player movement
`mazesrc/player_controller.js`
`mazesrc/surface.js`
Collision is checked on player move, player movement and looking around is managed by a function which takes in a type that runs through a switch statement that determines to move around or rotate. On game initialization, the player is moved on the x axis until wall collision is no longer detected to prevent spawning in a wall. This method doesn't work sometimes however and sometimes you may spawn outside of the maze itself.

## Textures
`textures/textures.js`
Texture loading from PNGs to Three.js compatible textures happens here.

## Misc objects in the maze
I have yet to implement various objects around the maze such as the rat or the OpenGL logo.

# FAQs -
## What is implemented?
Randomly generated mazes with fully implemented collision and player movement.

## Why JavaScript?
I think JavaScript is an excellent language when used correctly, and added onto that it is the language of the web. Loading speeds are
Making a web game is another part of it, something everybody can play, I doubt this will ever get much attention but it's still fun to work on.

## Why make this project at all?
This project was mainly started a learning experience for JavaScript and Three.js, I began working on it at a point where my JavaScript skills were still flourishing.
Now I have become a skilled JavaScript programmer, I have been learning the language for about 1 year now and I know how to create a lot of things with it.

## Bugs
Sometimes you may spawn out of the map due to how spawn placement works,
Start logo missing due to collision offset bugs,
Smiley face missing due to unfinished level loading and ending code + not being sure how random placement would work in the maze.
