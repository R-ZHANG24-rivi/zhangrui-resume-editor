/**
 * LIGHT BEAM SHADER
 * A single restrained white beam entering the prism from the left.
 * Volumetric feel via soft radial falloff + a slow travelling pulse.
 */

import * as THREE from 'three'

export const beamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const beamFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uThickness;   // core thickness, 0..1
  uniform float uPointer;
  uniform vec3  uColor;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float axis = abs(vUv.y - 0.5) * 2.0;

    // hard-ish core with a wide volumetric halo
    float core = 1.0 - smoothstep(0.0, uThickness, axis);
    float halo = exp(-axis * 5.2) * 0.34;

    // brightens as it approaches the crystal (x → 1)
    float approach = mix(0.42, 1.0, pow(vUv.x, 1.7));

    // travelling energy along the beam, extremely subtle
    float pulse = sin((vUv.x * 2.2 - uTime * 0.22) * 6.2831) * 0.5 + 0.5;
    pulse = 0.86 + pow(pulse, 4.0) * 0.2;

    // fade in from the void at the far left
    float birth = smoothstep(0.0, 0.22, vUv.x);
    // fade out right before the surface so the beam never clips the mesh
    float entry = 1.0 - smoothstep(0.88, 1.0, vUv.x);

    float a = (core * 0.85 + halo) * approach * pulse * birth * entry;
    a *= uIntensity * (0.9 + uPointer * 0.18);

    float g = (hash(vUv * 480.0 + uTime) - 0.5) * 0.03;
    vec3 col = uColor + g;

    gl_FragColor = vec4(col * a, a * 0.9);
  }
`

export const beamUniforms = () => ({
  uTime:      { value: 0 },
  uIntensity: { value: 1 },
  uThickness: { value: 0.16 },
  uPointer:   { value: 0 },
  uColor:     { value: new THREE.Vector3(1, 1, 1) },
})
