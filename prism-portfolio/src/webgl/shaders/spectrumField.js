/**
 * SPECTRUM FIELD SHADER
 *
 * Art-directed dispersion, not a physics sim.
 * The reference language: soft bloom, air-like rainbow diffusion, and a
 * spectrum that gets sliced by repeating translucent lamellae — light being
 * parsed by space, layer by layer.
 *
 * Deliberately NOT a hard Pink-Floyd rainbow triangle.
 */

import * as THREE from 'three'

export const spectrumVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const spectrumFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vPos;

  uniform float uTime;
  uniform float uDispersion;   // 0 = collapsed white, 1 = full spectrum
  uniform float uIntensity;    // master opacity
  uniform float uSlices;       // lamella count (0 = continuous field)
  uniform float uSliceSharp;   // hardness of each lamella edge
  uniform float uPointer;      // smoothed pointer influence
  uniform float uSpread;       // vertical spread of the cone
  uniform float uTintMix;      // 0 = full rainbow, 1 = single wavelength
  uniform vec3  uTint;         // active project wavelength
  uniform float uScanline;     // vertical scanning band strength
  uniform float uGrain;

  /**
   * Spectral ramp: warm → narrow pale seam → cool.
   *
   * The pale band in the middle is kept deliberately THIN. A wide white core
   * plus additive blending plus bloom compounds into a blown-out white blob
   * that swallows the colour either side of it. Saturated hues have to run
   * almost all the way through the centre for the dispersion to read.
   */
  vec3 spectralRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 red     = vec3(1.00, 0.18, 0.24);
    vec3 orange  = vec3(1.00, 0.48, 0.10);
    vec3 amber   = vec3(1.00, 0.80, 0.30);
    vec3 warmW   = vec3(1.00, 0.90, 0.78);
    vec3 coolW   = vec3(0.82, 0.90, 1.00);
    vec3 cyan    = vec3(0.22, 0.78, 1.00);
    vec3 blue    = vec3(0.18, 0.42, 1.00);
    vec3 violet  = vec3(0.54, 0.36, 1.00);
    vec3 magenta = vec3(1.00, 0.25, 0.82);

    vec3 c;
    if      (t < 0.140) c = mix(magenta, red,    smoothstep(0.0,   0.140, t));
    else if (t < 0.290) c = mix(red,     orange, smoothstep(0.140, 0.290, t));
    else if (t < 0.430) c = mix(orange,  amber,  smoothstep(0.290, 0.430, t));
    else if (t < 0.488) c = mix(amber,   warmW,  smoothstep(0.430, 0.488, t));
    else if (t < 0.512) c = mix(warmW,   coolW,  smoothstep(0.488, 0.512, t));
    else if (t < 0.570) c = mix(coolW,   cyan,   smoothstep(0.512, 0.570, t));
    else if (t < 0.720) c = mix(cyan,    blue,   smoothstep(0.570, 0.720, t));
    else if (t < 0.870) c = mix(blue,    violet, smoothstep(0.720, 0.870, t));
    else                c = mix(violet,  magenta,smoothstep(0.870, 1.000, t));
    return c;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;

    // ---- 1. cone geometry: light leaves the prism at the left edge ----
    float travel = uv.x;                          // 0 at prism, 1 far field
    float axis   = uv.y - 0.5;

    // the beam opens up as it travels; spread eased, never linear
    float openness = pow(travel, 0.72) * uSpread * mix(0.34, 1.0, uDispersion);
    float halfCone = 0.028 + openness;

    // soft cone mask, feathered — air, not a hard triangle
    float across = abs(axis) / max(halfCone, 1e-4);
    float cone = 1.0 - smoothstep(0.35, 1.0, across);

    // ---- 2. spectral position across the cone ----
    // slight drift + noise so it breathes instead of looking like a gradient
    float wobble = (noise(vec2(uv.x * 2.6, uTime * 0.06)) - 0.5) * 0.16;
    float t = 0.5 + (axis / max(halfCone, 1e-4)) * 0.5 * mix(0.12, 1.0, uDispersion) + wobble * uDispersion;

    vec3 col = spectralRamp(t);

    // when a project wavelength is active, fold the rainbow toward that hue
    col = mix(col, uTint * (0.65 + 0.6 * (1.0 - abs(axis) / max(halfCone, 1e-4))), uTintMix);

    // Near the prism the light is still white — dispersion accumulates with
    // distance. Kept short and weak: a long, strong white core reads as a solid
    // blob glued to the crystal instead of light leaving it.
    float whiteCore = 1.0 - smoothstep(0.0, 0.11 + 0.1 * (1.0 - uDispersion), travel);
    col = mix(col, vec3(1.0), whiteCore * 0.34);

    // ---- 3. lamellae: translucent slices cutting the light ----
    float lam = 1.0;
    if (uSlices > 0.5) {
      float sx = uv.x * uSlices;
      float cell = fract(sx);
      // each slice: bright leading edge, body, dark gap → layered sequence
      float edge = smoothstep(0.0, 0.06 * uSliceSharp, cell)
                 * (1.0 - smoothstep(0.62, 0.98, cell));
      float body = mix(0.42, 1.0, edge);
      // stepped offset so slices feel stacked in depth, not tiled flat
      float depthStep = floor(sx);
      float stagger = 1.0 - depthStep / max(uSlices, 1.0) * 0.35;
      lam = body * stagger;
      // specular line on each leading edge — restrained, these stack additively
      lam += (1.0 - smoothstep(0.0, 0.022, cell)) * 0.3;
    }

    // ---- 4. slow scanning band — "light being parsed" ----
    float scan = sin((uv.x * 3.4 - uTime * 0.16) * 6.2831) * 0.5 + 0.5;
    scan = pow(scan, 3.0) * uScanline;

    // ---- 5. falloff + bloom shaping ----
    // Emission ramp: light has to *leave* the crystal before it is visible.
    // Without this the field starts at full brightness flush against the mesh
    // and reads as a white blob stuck to it.
    float emerge = smoothstep(0.0, 0.10, travel);

    float nearGlow = exp(-travel * 4.6) * 0.3;                // hot spot at exit
    /* Fade out well before the plane's edge. If this reaches zero only at
       travel = 1.0 the falloff lands exactly on the geometry boundary and the
       light ends in a visible straight cut. */
    float farFade  = 1.0 - smoothstep(0.34, 0.88, travel);
    /* same reasoning vertically — feather inside the plane, not at its edge */
    float verticalSoft = 1.0 - smoothstep(0.42, 0.92, abs(axis) * 2.0);

    float a = cone * farFade * verticalSoft;
    a *= (0.55 + lam * 0.75);
    a += nearGlow * cone;
    a += scan * cone * 0.35;
    a *= emerge;

    // pointer adds a touch of energy, never a jump
    a *= (0.86 + uPointer * 0.28);
    a *= uIntensity;

    /* Guard against the plane's own boundary.
       Any mask still non-zero at the geometry edge gets cut off square, which
       shows up as a rectangular crop of the light floating in the black. This
       feathers the whole field inward from all four edges — belt and braces on
       top of the cone falloff above. */
    float edgeX = smoothstep(0.0, 0.04, uv.x) * (1.0 - smoothstep(0.72, 0.99, uv.x));
    float edgeY = smoothstep(0.0, 0.09, uv.y) * (1.0 - smoothstep(0.91, 1.0, uv.y));
    a *= edgeX * edgeY;

    // ---- 6. grain, kills banding in the wide soft areas ----
    float g = (hash(uv * 620.0 + uTime * 0.7) - 0.5) * uGrain;
    col += g;

    // additive light: colour scales with alpha so it reads as glow on black
    gl_FragColor = vec4(max(col, 0.0) * a, a * 0.92);
  }
`

export const spectrumUniforms = () => ({
  uTime:       { value: 0 },
  uDispersion: { value: 1 },
  uIntensity:  { value: 1 },
  uSlices:     { value: 9 },
  uSliceSharp: { value: 1 },
  uPointer:    { value: 0 },
  uSpread:     { value: 0.42 },
  uTintMix:    { value: 0 },
  // THREE.Vector3 (not a plain array) so frame-loop code can call .set()
  uTint:       { value: new THREE.Vector3(1, 1, 1) },
  uScanline:   { value: 0.35 },
  uGrain:      { value: 0.045 },
})
