/**
 * PRISM — SPECTRUM FIELD
 * Art-directed rainbow dispersion emerging from the right face of the prism.
 * NOT a physics sim — it's "light being parsed by space, layer by layer."
 *
 * Uses the spectrumField shader with lamella slicing, scanning band,
 * and project-wavelength tinting.
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { spectrumVertex, spectrumFragment, spectrumUniforms } from './shaders/spectrumField'
import { snap, pointer, TIER_CONFIG } from '../core/store'

export default function SpectrumField() {
  const matRef = useRef()

  const uniforms = useMemo(() => spectrumUniforms(), [])

  /* the volume the dispersed light travels through, right of the crystal */
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(3.4, 2.2, 1, 1)
  }, [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const t = clock.getElapsedTime()
    const s = snap()
    const p = pointer
    const u = matRef.current.uniforms

    u.uTime.value = t
    u.uPointer.value = p.vel

    /* ---- dispersion: how spread out the rainbow is ---- */
    switch (s.prismState) {
      case 'hero':     u.uDispersion.value = 1.0; break
      case 'converge': u.uDispersion.value = 0.08; break   // collapses to white
      case 'disperse': u.uDispersion.value = 1.15; break
      case 'project':  u.uDispersion.value = 0.7; break
      case 'orbit':    u.uDispersion.value = 0.9; break
      case 'ending':   u.uDispersion.value = 0.3; break    // reconverging
      default:         u.uDispersion.value = 1.0;
    }

    /* intensity per state */
    switch (s.prismState) {
      case 'hero':     u.uIntensity.value = 1.0; break
      case 'converge': u.uIntensity.value = 0.25; break
      case 'disperse': u.uIntensity.value = 1.1; break
      case 'project':  u.uIntensity.value = 0.8; break
      case 'orbit':    u.uIntensity.value = 0.7; break
      case 'ending':   u.uIntensity.value = 0.5; break
      default:         u.uIntensity.value = 1.0;
    }

    /* active project tint */
    if (s.light && s.light.id !== 'white') {
      const c = new THREE.Color(s.light.color)
      u.uTint.value.set(c.r, c.g, c.b)
      u.uTintMix.value = s.prismState === 'project' ? 0.75 : 0.25
    } else {
      u.uTintMix.value = 0
    }

    /* slice count by tier */
    const tier = TIER_CONFIG[s.tier] || TIER_CONFIG.mid
    u.uSlices.value = tier.slices || 6
  })

  return (
    /* x offset starts the field just past the crystal's right edge */
    <mesh position={[1.62, 0, -0.14]} rotation={[0, 0, 0]} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={spectrumVertex}
        fragmentShader={spectrumFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
