/**
 * GLASS LAMELLA SHADER
 * Cheap stand-in for real glass: used on the vertical translucent sheets that
 * slice the spectrum. No transmission, no extra render pass — just an edge-lit
 * plane with a faint chromatic fringe. Real transmission is reserved for the
 * one hero crystal.
 */

import * as THREE from 'three'

export const lamellaVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

export const lamellaFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uEdge;      // edge-light strength
  uniform float uFringe;    // chromatic aberration on the edges
  uniform vec3  uTint;
  uniform float uIndex;     // 0..1 position in the stack

  void main() {
    // fresnel: glass is only visible where it turns away from you
    float f = pow(1.0 - abs(dot(vNormalW, vViewDir)), 3.1);

    // crisp specular lines along the four borders
    float bx = min(vUv.x, 1.0 - vUv.x);
    float by = min(vUv.y, 1.0 - vUv.y);
    float border = (1.0 - smoothstep(0.0, 0.012, bx)) + (1.0 - smoothstep(0.0, 0.018, by));
    border = clamp(border, 0.0, 1.0);

    // top edge catches more light than the bottom — reads as a real sheet
    float topLit = (1.0 - smoothstep(0.0, 0.14, 1.0 - vUv.y)) * 0.7;

    // faint vertical grain, like ribbed/fluted glass
    float flute = sin(vUv.x * 128.0) * 0.5 + 0.5;
    flute = 0.86 + flute * 0.14;

    vec3 col = uTint;
    // chromatic fringe: warm on one border, cool on the other
    col += vec3(uFringe, 0.0, -uFringe * 0.6) * (1.0 - smoothstep(0.0, 0.05, vUv.x));
    col += vec3(-uFringe * 0.6, 0.0, uFringe) * (1.0 - smoothstep(0.0, 0.05, 1.0 - vUv.x));

    float a = (f * 0.5 + border * uEdge + topLit * uEdge * 0.8) * flute;
    // deeper sheets in the stack fade — depth without fog cost
    a *= mix(1.0, 0.42, uIndex);

    /* Fade the top and bottom of each sheet. Without this the sheets terminate
       hard where the geometry ends, and any part extending past the spectrum
       cone reads as a stray coloured rectangle sitting in the black. */
    float vFade = smoothstep(0.0, 0.22, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
    a *= vFade;

    a *= uOpacity;

    gl_FragColor = vec4(col * a, a);
  }
`

export const lamellaUniforms = () => ({
  uTime:    { value: 0 },
  uOpacity: { value: 1 },
  uEdge:    { value: 0.5 },
  uFringe:  { value: 0.25 },
  // THREE.Vector3 (not a plain array) so frame-loop code can call .set()
  uTint:    { value: new THREE.Vector3(0.86, 0.9, 1.0) },
  uIndex:   { value: 0 },
})
