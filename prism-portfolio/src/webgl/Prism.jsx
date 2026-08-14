/**
 * PRISM — CRYSTAL MESH
 *
 * The hero optical element: a sharp, faceted optical crystal.
 * Not a textbook triangular prism, not jewellery.
 *
 * Rendered with a purpose-built shader (see shaders/prismGlass.js) rather than
 * MeshPhysicalMaterial. Reason: `transmission` refracts whatever the scene draws
 * behind the mesh, and on a pure black page that is nothing — the glass
 * collapses into a milky white surface. Supplying a backdrop fixes the glass but
 * makes that backdrop visible across the page. The shader synthesises fresnel,
 * facet speculars and chromatic dispersion instead, so black stays black.
 *
 * Two draw layers:
 *   1. body  — the synthesised glass optic
 *   2. edges — additive silhouette lines, kept very faint
 *
 * Reacts to: pointer (parallax), prismState (scale + pose), hover (dispersion
 * and glow lift), active wavelength (tint).
 */

import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createPrismGeometry, createPrismEdgeGeometry, PRISM_PARAMS } from './geometry/prismGeometry'
import { prismGlassVertex, prismGlassFragment, prismGlassUniforms } from './shaders/prismGlass'
import { snap, pointer } from '../core/store'

/* pose per state: scale + resting tilt. Gentle — this is heavy glass. */
const POSE = {
  hero:     { scale: 1.00, tilt:  0.00 },
  converge: { scale: 0.74, tilt: -0.18 },
  disperse: { scale: 0.92, tilt:  0.10 },
  project:  { scale: 0.34, tilt:  0.28 },
  orbit:    { scale: 0.62, tilt: -0.34 },
  ending:   { scale: 1.06, tilt:  0.00 },
}

export default function Prism({ ready }) {
  const bodyRef = useRef()
  const edgeRef = useRef()
  const matRef = useRef()
  const [hovered, setHovered] = useState(false)

  const geometry = useMemo(() => createPrismGeometry(PRISM_PARAMS), [])
  const edgeGeometry = useMemo(() => createPrismEdgeGeometry(PRISM_PARAMS), [])

  /* uniforms: vec3 values must be real Vector3 instances, never plain arrays —
     frame-loop code calls .set() on them, and a throw in useFrame kills the
     entire R3F render loop silently. */
  const uniforms = useMemo(() => {
    const u = prismGlassUniforms()
    u.uKeyDir.value = new THREE.Vector3(-1, 0.18, 0.55).normalize()
    u.uTint.value = new THREE.Vector3(1, 1, 1)
    return u
  }, [])

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#dce6ff'),
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  )

  const tmpColor = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }, delta) => {
    if (!bodyRef.current || !ready) return
    const t = clock.getElapsedTime()
    const s = snap()
    const pose = POSE[s.prismState] || POSE.hero

    /* frame-rate independent damping */
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.05))
    const b = bodyRef.current

    /* ---- pointer parallax: restrained, feels like heavy glass ---- */
    const targetRx = pointer.sy * 0.14 + pose.tilt
    const targetRy = pointer.sx * 0.22
    b.rotation.x += (targetRx - b.rotation.x) * k * 0.4
    b.rotation.y += (targetRy - b.rotation.y) * k * 0.4

    /* ---- perpetual slow rotation: facets must keep catching light ---- */
    b.rotation.y += delta * 0.05
    b.rotation.z = Math.sin(t * 0.16) * 0.03

    /* ---- idle float ---- */
    b.position.y = Math.sin(t * 0.32) * 0.035
    b.position.x = Math.sin(t * 0.21) * 0.018

    /* ---- state scale + hover lift ---- */
    const target = pose.scale * (hovered ? 1.04 : 1)
    b.scale.setScalar(b.scale.x + (target - b.scale.x) * k * 0.4)

    /* ---- shader uniforms ---- */
    if (matRef.current) {
      const u = matRef.current.uniforms
      u.uTime.value = t
      u.uHover.value += ((hovered ? 1 : 0) - u.uHover.value) * k * 0.25

      /* dispersion also responds to pointer speed — light reacts to movement */
      const targetDisp = 0.85 + pointer.vel * 0.35
      u.uDispersion.value += (targetDisp - u.uDispersion.value) * k * 0.2

      /* wavelength tint: white on the index, project colour inside a project */
      const light = s.light
      if (light && light.id !== 'white') {
        tmpColor.set(light.color)
        u.uTint.value.set(tmpColor.r, tmpColor.g, tmpColor.b)
        u.uTintMix.value += (0.55 - u.uTintMix.value) * k * 0.2
      } else {
        u.uTintMix.value += (0 - u.uTintMix.value) * k * 0.2
      }
    }

    /* edges brighten on hover / movement */
    const targetEdge = (hovered ? 0.2 : 0.07) + pointer.vel * 0.05
    edgeMaterial.opacity += (targetEdge - edgeMaterial.opacity) * k * 0.3

    /* keep the edge lines locked to the body */
    if (edgeRef.current) {
      edgeRef.current.rotation.copy(b.rotation)
      edgeRef.current.position.copy(b.position)
      edgeRef.current.scale.copy(b.scale)
    }
  })

  if (!ready) return null

  return (
    <group>
      {/* glass body — synthesised optic */}
      <mesh
        ref={bodyRef}
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <shaderMaterial
          ref={matRef}
          vertexShader={prismGlassVertex}
          fragmentShader={prismGlassFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* facet edges — the silhouette on black */}
      <lineSegments ref={edgeRef} geometry={edgeGeometry} material={edgeMaterial} />
    </group>
  )
}
