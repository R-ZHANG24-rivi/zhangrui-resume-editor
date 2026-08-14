/**
 * PRISM — OPTICAL SYSTEM
 * Everything that lives inside the R3F context.
 *
 * Composition, left → right, matching the narrative:
 *   LIGHT  →  PRISM  →  REFRACTION  →  SPECTRUM
 *
 * The whole rig is parented to one group so section changes can slide the
 * entire optical composition without touching individual elements.
 */

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { snap, pointer, SECTION_LAYOUT } from '../core/store'
import Prism from './Prism'
import LightBeam from './LightBeam'
import SpectrumField from './SpectrumField'
import GlassLamellae from './GlassLamellae'
import OpticalEnvironment from './OpticalEnvironment'
import Effects from './Effects'

export default function OpticalSystem({ ready }) {
  const rig = useRef()

  /**
   * The rig drifts to a different composition per section. Everything is
   * critically damped toward a target — no springs, no bounce, just inertia.
   */
  useFrame((_, delta) => {
    if (!rig.current) return
    const s = snap()
    const layout = SECTION_LAYOUT[s.prismState] || SECTION_LAYOUT.hero

    /* frame-rate independent damping */
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05))

    const g = rig.current
    g.position.x += (layout.x - g.position.x) * k * 0.55
    g.position.y += (layout.y - g.position.y) * k * 0.55
    g.position.z += (layout.z - g.position.z) * k * 0.55

    /* pointer parallax on the whole composition — very slight */
    const px = pointer.sx * 0.06
    const py = pointer.sy * 0.04
    g.rotation.y += (px - g.rotation.y) * k * 0.35
    g.rotation.x += (-py - g.rotation.x) * k * 0.35
  })

  return (
    <>
      {/* environment + lights: what the glass actually refracts */}
      <OpticalEnvironment />

      <group ref={rig}>
        <LightBeam />
        <Prism ready={ready} />
        <SpectrumField />
        <GlassLamellae />
      </group>

      <Effects />
    </>
  )
}
