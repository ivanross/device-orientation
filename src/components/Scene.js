import React, { useEffect, useRef } from 'react'
import createRegl from 'regl'
import createCamera from 'regl-camera'
import createCube from 'primitive-cube'
import mat4 from 'gl-mat4'
import { useRender } from '../lib/useRender'
const cube = createCube()

const rad = (deg) => (deg / 360) * Math.PI * 2

class Scene {
  constructor(canvas) {
    const regl = createRegl(canvas)
    const camera = createCamera(regl, { damping: 0, distance: 4 })
    const drawCube = regl({
      vert: `
      attribute vec3 position;
      uniform mat4 mvp;
      
      void main() {
        gl_Position = mvp * vec4(position,1.);
      }
      `,
      frag: `
      precision highp float;
      uniform float opacity;
      void main() {
        gl_FragColor = vec4(0,0,0,opacity);
      }
      `,

      attributes: {
        position: cube.positions,
      },
      context: {
        model: () => {
          const scale = 1
          const model = mat4.identity([])
          mat4.rotateY(model, model, -rad(this.gamma * scale))
          mat4.rotateZ(model, model, rad(this.beta * scale))
          mat4.rotateX(model, model, -rad(this.alpha * scale))
          return model
        },
      },

      uniforms: {
        opacity: regl.prop('opacity'),
        mvp: (context) =>
          mat4.multiply([], context.projection, mat4.multiply([], context.view, context.model)),
      },
      elements: cube.cells,
      primitive: regl.prop('primitive'),
    })

    regl.frame(() => {
      console.log('frame')
      try {
        camera(() => {
          drawCube({ opacity: 0.3, primitive: 'triangles' })
          drawCube({ opacity: 1, primitive: 'line strip' })
        })
      } catch (e) {
        console.error('ERROR', e)
        console.error('DESTROY')
        regl.destroy()
      }
    })
  }
}

export function SceneComponent() {
  const scene = useRef()
  const render = useRender()

  useEffect(() => {
    scene.current = new Scene()

    function handleOrientation(event) {
      scene.current.alpha = event.alpha
      scene.current.beta = event.beta
      scene.current.gamma = event.gamma

      render()
    }
    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.addEventListener('deviceorientation', handleOrientation)
  }, [])
  return scene.current ? (
    <pre>
      {JSON.stringify(
        {
          alpha: Math.round(scene.current.alpha),
          beta: Math.round(scene.current.beta),
          gamma: Math.round(scene.current.gamma),
        },
        null,
        2
      )}
    </pre>
  ) : null
}
