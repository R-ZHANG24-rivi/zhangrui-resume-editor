/**
 * PRISM — LIGHT BEAM
 * A restrained white beam entering the prism from the left.
 * Uses the beamVertex/beamFragment shader for volumetric feel.
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { beamVertex, beamFragment, beamUniforms } from './shaders/lightBeam'
import { snap, pointer } from '../core/store'

export default function LightBeam() {
  const matRef = useRef()

  const uniforms = useMemo(() => beamUniforms(), [])

  /* plane geometry: spans from far-left to just before prism centre */
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(2.4, 0.7, 1, 1)
  }, [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const t = clock.getElapsedTime()
    const s = snap()
    const p = pointer

    const u = matRef.current.uniforms
    u.uTime.value = t
    u.uPointer.value = p.vel

    /* intensity per state */
    switch (s.prismState) {
      case 'hero':     u.uIntensity.value = 1.0; break
      case 'converge': u.uIntensity.value = 1.3; break
      case 'disperse': u.uIntensity.value = 0.85; break
      case 'project':  u.uIntensity.value = 0.5; break
      case 'orbit':    u.uIntensity.value = 0.6; break
      case 'ending':   u.uIntensity.value = 0.9; break
      default:         u.uIntensity.value = 1.0;
    }

    /* converge state: beam is the dominant element (white light reconverging) */
    if (s.prismState === 'converge') {
      u.uThickness.value = 0.3 + Math.sin(t * 0.5) * 0.08
    }
  })

  return (
    <mesh position={[-1.35, 0, -0.08]} rotation={[0, 0, 0]} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={beamVertex}
        fragmentShader={beamFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
