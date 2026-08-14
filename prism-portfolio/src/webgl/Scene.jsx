/**
 * PRISM — SCENE
 * The fixed full-screen R3F canvas. Owns the entire optical system:
 * Prism crystal, light beam, spectrum field, glass lamellae, post-processing.
 *
 * Positioning: fixed behind HTML content (z-index: 0 via CSS).
 * Reads pointer / scroll / state from store — zero React re-renders in the loop.
 *
 * NOTE ON UNIFORMS: every vec3 uniform must be a THREE.Vector3, never a plain
 * array. Frame-loop code calls `.set()` on them; a plain array throws, and a
 * throw inside useFrame permanently kills R3F's render loop (silent black canvas).
 */

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { snap, TIER_CONFIG } from '../core/store'
import OpticalSystem from './OpticalSystem'

/* camera pulls back slightly so the prism reads as "object in space" not "fill frame" */
const CAMERA = {
  position: [0, 0.1, 3.8],
  fov: 45,
  near: 0.1,
  far: 50,
}

export default function Scene({ ready }) {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={TIER_CONFIG[snap().tier]?.dpr || [1, 1.5]}
        camera={CAMERA}
      >
        <Suspense fallback={null}>
          <OpticalSystem ready={ready} />
        </Suspense>
      </Canvas>
    </div>
  )
}
