/**
 * PRISM GLASS SHADER
 *
 * Art-directed optical crystal. Deliberately NOT MeshPhysicalMaterial:
 *
 * `transmission` samples whatever the scene renders behind the mesh. On a pure
 * black page there is nothing behind it, so the glass refracts emptiness and
 * collapses into a flat white surface sheen — the "milky plastic" failure.
 * Feeding it a visible backdrop fixes the glass but paints artefacts across the
 * page, because that backdrop is also directly visible to the camera.
 *
 * So the optics are synthesised instead, entirely per-fragment:
 *   - fresnel rim         → glass is brightest where it turns away from you
 *   - facet specular      → one hard highlight per flat face (flat normals)
 *   - chromatic dispersion→ view-dependent RGB split along the refraction vector
 *   - internal caustics   → faint banding that reads as light trapped inside
 *
 * The result is fully self-contained: black stays black, and the crystal reads
 * as clean, sharp, high-transmission optical glass with no backdrop geometry.
 */

export const prismGlassVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vPosW;
  varying vec3 vPosL;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    vPosL = position;
    /* flat facet normals come straight from geometry — no smoothing */
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

export const prismGlassFragment = /* glsl */ `
  precision highp float;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vPosW;
  varying vec3 vPosL;

  uniform float uTime;
  uniform float uDispersion;   // strength of the RGB split
  uniform float uHover;        // 0..1 hover lift
  uniform float uClarity;      // master alpha — how present the glass is
  uniform vec3  uKeyDir;       // direction of the incoming white beam
  uniform vec3  uTint;         // active wavelength (white on the index)
  uniform float uTintMix;

  /* spectral ramp used for the dispersion fringe */
  vec3 spectral(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 r = vec3(1.00, 0.22, 0.28);
    vec3 o = vec3(1.00, 0.62, 0.20);
    vec3 y = vec3(1.00, 0.95, 0.55);
    vec3 c = vec3(0.35, 0.90, 1.00);
    vec3 b = vec3(0.28, 0.48, 1.00);
    vec3 v = vec3(0.62, 0.40, 1.00);
    if (t < 0.2)      return mix(r, o, t / 0.2);
    else if (t < 0.4) return mix(o, y, (t - 0.2) / 0.2);
    else if (t < 0.6) return mix(y, c, (t - 0.4) / 0.2);
    else if (t < 0.8) return mix(c, b, (t - 0.6) / 0.2);
    else              return mix(b, v, (t - 0.8) / 0.2);
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    float ndv = abs(dot(N, V));

    /* ---- 1. fresnel: the defining quality of transparent glass ---- */
    float fres = pow(1.0 - ndv, 3.2);

    /* ---- 2. facet specular: one crisp highlight per flat face ---- */
    vec3 L = normalize(uKeyDir);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 220.0);
    /* secondary wider lobe so facets read even when off-angle */
    float spec2 = pow(max(dot(N, H), 0.0), 26.0) * 0.16;

    /* ---- 3. chromatic dispersion along the refraction vector ---- */
    float disp = uDispersion * (1.0 + uHover * 0.9);
    vec3 R = refract(-V, N, 0.66);
    /* sample position along the refracted ray drives the hue split */
    float band = R.x * 1.6 + R.y * 0.7 + vPosL.y * 0.5;
    vec3 fringe = spectral(fract(band * 0.5 + 0.5)) * fres * disp;

    /* ---- 4. internal caustics: faint trapped-light banding ---- */
    float caustic = sin(vPosL.y * 22.0 + vPosL.x * 14.0 + uTime * 0.35) * 0.5 + 0.5;
    caustic = pow(caustic, 4.0) * 0.09 * (1.0 - ndv);

    /* ---- 5. edge accent: thin bright line right at the silhouette ---- */
    float rim = smoothstep(0.82, 1.0, 1.0 - ndv);

    /* ---- compose ---- */
    vec3 col = vec3(0.0);
    col += vec3(0.34, 0.44, 0.70) * fres * 0.8;    // cool glass body
    col += fringe * 1.25;                          // dispersion
    col += vec3(1.0) * spec * 3.2;                 // hard facet highlights
    col += vec3(0.88, 0.94, 1.0) * spec2 * 1.6;
    col += vec3(0.55, 0.70, 1.0) * caustic * 1.4;
    col += vec3(1.0) * rim * 0.42;

    /* fold toward the active project wavelength */
    col = mix(col, col * uTint * 1.35, uTintMix);

    /* hover lifts the whole optic slightly */
    col *= (1.0 + uHover * 0.35);

    /* alpha: glass is mostly invisible, present at rim / highlight / fringe */
    float a = fres * 0.72 + spec * 2.0 + rim * 0.42 + caustic * 1.8
            + length(fringe) * 0.5;
    a = clamp(a, 0.0, 1.0) * uClarity;

    gl_FragColor = vec4(col, a);
  }
`

export const prismGlassUniforms = () => ({
  uTime:       { value: 0 },
  uDispersion: { value: 0.85 },
  uHover:      { value: 0 },
  uClarity:    { value: 1 },
  uKeyDir:     { value: null },  // set to a THREE.Vector3 by the component
  uTint:       { value: null },  // set to a THREE.Vector3 by the component
  uTintMix:    { value: 0 },
})
