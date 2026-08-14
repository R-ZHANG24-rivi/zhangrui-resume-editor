/**
 * PRISM — POST-PROCESSING
 * Bloom carries the "light in darkness" quality — it is what makes the
 * spectrum feel like emitted light rather than coloured pixels.
 * Disabled entirely on low tier to protect frame rate.
 */

import React from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useStore } from '../core/store'

export default function Effects() {
  const tier = useStore((s) => s.tier)

  if (tier === 'low') return null

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {/* The glow that makes light read as light.
          Threshold stays fairly high on purpose: the spectrum is additively
          blended, so a low threshold blooms all the mid-tones together and the
          rainbow flattens into a single white mass. */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.34}
        luminanceSmoothing={0.68}
        mipmapBlur
        radius={0.66}
      />
      {/* optical imperfection — very slight, only reads at the frame edges */}
      <ChromaticAberration
        offset={[0.0006, 0.0009]}
        radialModulation
        modulationOffset={0.42}
        blendFunction={BlendFunction.NORMAL}
      />
      {/* pulls focus to the centre, deepens the black */}
      <Vignette offset={0.28} darkness={0.62} eskil={false} />
    </EffectComposer>
  )
}
