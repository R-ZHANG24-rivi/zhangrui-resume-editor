/**
 * PRISM — OPTICAL ENVIRONMENT
 *
 * Transmissive glass is only visible if there is something to refract.
 * On a pure black page there is nothing — which is exactly why a
 * `transmission: 1.0` crystal renders as an invisible hole.
 *
 * Rather than load an HDR (weight + latency), we paint a tiny procedural
 * environment: a dark navy void with a few bright light bands positioned to
 * match the art direction — one hard white key from the left (the incoming
 * beam), a cool rim from behind, and a faint spectral wash on the right.
 *
 * That gives the crystal real highlights, real internal structure, and real
 * edge dispersion, at the cost of one 256px cubemap generated once.
 */

import React, { useMemo, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

function buildEnvTexture() {
  const size = 512
  const c = document.createElement('canvas')
  c.width = size
  c.height = size / 2
  const ctx = c.getContext('2d')

  /* deep navy void base */
  ctx.fillStyle = '#04050a'
  ctx.fillRect(0, 0, c.width, c.height)

  /* soft navy gradient: slightly brighter overhead */
  const base = ctx.createLinearGradient(0, 0, 0, c.height)
  base.addColorStop(0, '#0d1430')
  base.addColorStop(0.5, '#070a18')
  base.addColorStop(1, '#03040a')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, c.width, c.height)

  /* helper: soft radial light blob */
  const blob = (x, y, r, color, alpha) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalAlpha = alpha
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  /**
   * KEY LIGHT — small and hard, left side. This is the incoming beam.
   * Kept tight on purpose: a large soft white source floods every facet at once
   * and the crystal goes milky. A small source gives separated highlights and
   * lets black read in between — which is what makes it look like clean glass.
   */
  blob(c.width * 0.15, c.height * 0.5, c.width * 0.035, '#ffffff', 1.0)
  blob(c.width * 0.15, c.height * 0.5, c.width * 0.12, '#aebbe8', 0.16)

  /* COOL RIM — behind, defines the facet edges. Narrow, not a wash. */
  blob(c.width * 0.63, c.height * 0.3, c.width * 0.1, '#7fb4ff', 0.3)

  /* SPECTRAL KICKS — small saturated sources so refraction picks up colour */
  blob(c.width * 0.82, c.height * 0.58, c.width * 0.075, '#ff7a3c', 0.3)
  blob(c.width * 0.92, c.height * 0.44, c.width * 0.065, '#c65cff', 0.28)
  blob(c.width * 0.73, c.height * 0.68, c.width * 0.06, '#39d8ff', 0.26)

  /* crisp bright bars — these become the hard specular lines along the facets */
  ctx.globalAlpha = 0.85
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(c.width * 0.06, c.height * 0.44, c.width * 0.012, c.height * 0.13)
  ctx.globalAlpha = 0.3
  ctx.fillRect(c.width * 0.42, c.height * 0.12, c.width * 0.006, c.height * 0.3)
  ctx.globalAlpha = 0.12
  ctx.fillRect(0, c.height * 0.18, c.width, 1.5)
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export default function OpticalEnvironment() {
  const { gl, scene } = useThree()

  /* generate once, convert to a proper PMREM cubemap for physical materials */
  const envMap = useMemo(() => {
    const tex = buildEnvTexture()
    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const rt = pmrem.fromEquirectangular(tex)
    tex.dispose()
    pmrem.dispose()
    return rt.texture
  }, [gl])

  /* apply as scene environment so every physical material picks it up */
  useEffect(() => {
    scene.environment = envMap
    // background stays null — the black page shows through
    scene.background = null
    return () => {
      scene.environment = null
    }
  }, [scene, envMap])

  return (
    <>
      {/**
       * Lights here are for any future non-shader meshes (and the lamellae's
       * fresnel reference). The hero crystal synthesises its own optics in
       * shaders/prismGlass.js, so it does not depend on these.
       *
       * Ambient stays near zero: on a black page, ambient light is the fastest
       * way to make anything transparent look milky.
       */}
      <ambientLight intensity={0.05} color="#161d38" />

      {/* the key: hard white from the left, matching the incoming beam */}
      <directionalLight position={[-4, 0.6, 2.4]} intensity={1.1} color="#ffffff" />

      {/* cool rim from behind-right, defines facet edges */}
      <directionalLight position={[3.2, 1.8, -2.2]} intensity={0.4} color="#8fb8ff" />
    </>
  )
}
