/**
 * PRISM — GLASS LAMELLAE
 *
 * The translucent vertical sheets that slice through the spectrum, so the light
 * reads as "being parsed by space, layer by layer" — the layered-slice quality
 * from the visual references.
 *
 * Deliberately cheap: each sheet is an edge-lit shader plane, no transmission,
 * no extra render pass. Real glass is reserved for the single hero crystal.
 *
 * One InstancedMesh would be cheaper still, but per-sheet uniforms (tint, phase,
 * opacity) keep the art direction adjustable; at 4–9 planes the cost is trivial.
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { lamellaVertex, lamellaFragment, lamellaUniforms } from './shaders/glassLamella'
import { snap, TIER_CONFIG, useStore } from '../core/store'

/* opacity multiplier per prism state — lamellae are loudest when light disperses */
const STATE_OPACITY = {
  hero: 1.0,
  converge: 0.16,   // About: white light, slices nearly vanish
  disperse: 1.15,   // Work: maximum parsing
  project: 0.55,
  orbit: 0.7,
  ending: 0.34,
}

function Lamella({ index, total, x, y, z, width, height, rotY }) {
  const matRef = useRef()

  /* uniforms are per-instance; uTint is a Vector3 so .set() is safe in the loop */
  const uniforms = useMemo(() => lamellaUniforms(), [])

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, 1, 1),
    [width, height]
  )

  /* resting tint: cool at the front of the stack, warm toward the back */
  const restTint = useMemo(() => {
    const t = total > 1 ? index / (total - 1) : 0
    const c = new THREE.Color()
    c.setHSL(0.58 - t * 0.5, 0.42, 0.86)
    return c
  }, [index, total])

  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }, delta) => {
    const mat = matRef.current
    if (!mat) return
    const u = mat.uniforms
    const t = clock.getElapsedTime()
    const s = snap()

    const k = 1 - Math.pow(0.002, Math.min(delta, 0.05))

    u.uTime.value = t
    u.uIndex.value = total > 1 ? index / (total - 1) : 0

    /* state-driven visibility, damped so section changes glide */
    const targetOp = STATE_OPACITY[s.prismState] ?? 1
    u.uOpacity.value += (targetOp - u.uOpacity.value) * k * 0.25

    /* breathing edge light — each sheet offset in phase */
    u.uEdge.value = 0.46 + Math.sin(t * 0.42 + index * 0.55) * 0.13
    u.uFringe.value = 0.2 + Math.sin(t * 0.31 + index * 0.72) * 0.09

    /* tint leans toward the active project wavelength, if any */
    const light = s.light
    if (light && light.id !== 'white') {
      tmp.set(light.color).lerp(restTint, 0.45)
    } else {
      tmp.copy(restTint)
    }
    u.uTint.value.set(tmp.r, tmp.g, tmp.b)
  })

  return (
    <mesh position={[x, y, z]} rotation={[0, rotY, 0]} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={lamellaVertex}
        fragmentShader={lamellaFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function GlassLamellae() {
  const tier = useStore((s) => s.tier)
  const count = (TIER_CONFIG[tier] || TIER_CONFIG.high).slices || 9

  /**
   * Sheets fan to the right of the prism, staggered in depth and offset
   * vertically — a sequence, never a flat tiled grid. Deterministic (no
   * Math.random) so the composition is identical on every load.
   */
  const lamellae = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) : 0
      /* golden-ratio jitter keeps it organic but stable */
      const j = ((i * 0.6180339887) % 1) - 0.5

      arr.push({
        index: i,
        total: count,
        x: 0.72 + t * 2.35,
        y: Math.sin(t * Math.PI) * 0.06 + j * 0.04,
        z: -t * 0.42 + j * 0.08,
        width: 0.05 + Math.abs(j) * 0.05,
        /* Height follows the spectrum cone, which widens with distance. Fixed
           tall sheets poke out above the light and read as stray coloured
           rectangles floating in the black. */
        height: 0.5 + t * 1.1,
        rotY: j * 0.12,
      })
    }
    return arr
  }, [count])

  return (
    <group>
      {lamellae.map((l) => (
        <Lamella key={l.index} {...l} />
      ))}
    </group>
  )
}
