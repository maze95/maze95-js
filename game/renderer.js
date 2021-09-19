import * as THREE from './three.module.js'
import { widescreen } from "./settings.js"

export const width = 640
export const height = 480

export const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#game'),
    antialias: false
})
export const initRenderer = () => {
    renderer.setPixelRatio(window.devicePixelRatio)
    if (widescreen) {
      renderer.setSize(window.innerWidth, window.innerHeight)
    } else {
      renderer.setSize(width, height)
    }
}
//Dynamic scaling for widescreen
window.addEventListener('resize', () =>
{
  if (widescreen) {
    // Update sizes
    const widewidth = window.innerWidth
    const wideheight = window.innerHeight

      // Update camera
    camera.aspect = width / height
    camera.updateProjectionMatrix()

      // Update renderer
    renderer.setSize(widewidth, wideheight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
})