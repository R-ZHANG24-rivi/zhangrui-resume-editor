import * as THREE from 'three'

/**
 * PRISM GEOMETRY — procedural faceted optical crystal.
 *
 * Silhouette brief: sharp top + bottom apex, spread wide across x, thickest
 * through the centre girdle, tapering to a crisp edge. A cut rhombus crystal —
 * more facets than a plain octahedron, but never jewellery.
 *
 * Two rules keep it reading as *optical glass* rather than a faceted ball:
 *   1. Few horizontal rings. Many rings read as a sphere; a handful read as
 *      deliberate cuts. Facet variety comes from radial segments instead.
 *   2. One shared flat normal per facet, so every plane stays perfectly flat
 *      and catches a single hard specular line. That crispness is the point.
 *
 * @param {object} o
 * @param {number} o.radialSegments facets around the axis
 * @param {number} o.width          x spread
 * @param {number} o.depth          z thickness (< width → flattened rhombus)
 * @param {number} o.height         apex-to-apex
 * @param {number} o.twist          per-ring rotation, breaks up rib alignment
 */

/* Vertical profile: [y in -1..1, radius in 0..1].
   Asymmetric on purpose — a taller crown and deeper pavilion, like a cut stone
   viewed edge-on, so the light entering from the left exits with structure. */
const PROFILE = [
  [ 1.00, 0.000],  // top apex
  [ 0.60, 0.400],  // crown
  [ 0.14, 0.860],  // upper girdle
  [-0.04, 1.000],  // girdle — thickest point
  [-0.46, 0.680],  // pavilion
  [-1.00, 0.000],  // bottom apex
]

/* index of the girdle ring — the only horizontal edge worth drawing */
const GIRDLE_RING = 3

function buildRings({ radialSegments, width, depth, height, twist }) {
  const seg = Math.max(3, radialSegments)
  const TAU = Math.PI * 2
  return PROFILE.map(([y, r], ring) => {
    const row = []
    for (let s = 0; s < seg; s++) {
      const a = (s / seg) * TAU + ring * twist
      row.push(
        new THREE.Vector3(
          Math.cos(a) * r * width,
          y * (height / 2),
          Math.sin(a) * r * depth
        )
      )
    }
    return row
  })
}

export function createPrismGeometry({
  radialSegments = 12,
  width = 1.0,
  depth = 0.55,
  height = 1.72,
  twist = 0.09,
} = {}) {
  const seg = Math.max(3, radialSegments)
  const rings = buildRings({ radialSegments: seg, width, depth, height, twist })

  const positions = []
  const normals = []
  const uvs = []

  const flatNormal = (a, b, c) => {
    const n = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(b, a),
      new THREE.Vector3().subVectors(c, a)
    )
    if (n.lengthSq() < 1e-10) return new THREE.Vector3(0, 1, 0)
    n.normalize()
    /* orient outward, ignoring y so the test works on both cones */
    const centre = new THREE.Vector3()
      .add(a).add(b).add(c)
      .multiplyScalar(1 / 3)
    if (n.dot(new THREE.Vector3(centre.x, 0, centre.z)) < 0) n.negate()
    return n
  }

  const pushTri = (a, b, c, uvA, uvB, uvC) => {
    const n = flatNormal(a, b, c)
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
    for (let i = 0; i < 3; i++) normals.push(n.x, n.y, n.z)
    uvs.push(uvA[0], uvA[1], uvB[0], uvB[1], uvC[0], uvC[1])
  }

  for (let ring = 0; ring < PROFILE.length - 1; ring++) {
    const rTop = PROFILE[ring][1]
    const rBot = PROFILE[ring + 1][1]
    const vTop = ring / (PROFILE.length - 1)
    const vBot = (ring + 1) / (PROFILE.length - 1)

    for (let s = 0; s < seg; s++) {
      const s2 = (s + 1) % seg
      const uA = s / seg
      const uB = (s + 1) / seg

      const p00 = rings[ring][s]
      const p01 = rings[ring][s2]
      const p10 = rings[ring + 1][s]
      const p11 = rings[ring + 1][s2]

      if (rTop === 0) {
        /* top apex fan — one triangle per segment */
        pushTri(p10, p11, p00, [uA, vBot], [uB, vBot], [uA, vTop])
      } else if (rBot === 0) {
        /* bottom apex fan */
        pushTri(p00, p01, p10, [uA, vTop], [uB, vTop], [uA, vBot])
      } else {
        /* quad band — split into two coplanar triangles sharing one normal */
        pushTri(p00, p01, p11, [uA, vTop], [uB, vTop], [uB, vBot])
        pushTri(p00, p11, p10, [uA, vTop], [uB, vBot], [uA, vBot])
      }
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  g.computeBoundingSphere()
  g.computeBoundingBox()
  return g
}

/**
 * Structural contour lines only.
 *
 * Not EdgesGeometry, and deliberately not every edge: drawing all horizontal
 * rings turns the crystal into a wireframe ball. We draw the vertical ribs
 * (apex → apex, which carry the silhouette) plus the single girdle ring.
 */
export function createPrismEdgeGeometry({
  radialSegments = 12,
  width = 1.0,
  depth = 0.55,
  height = 1.72,
  twist = 0.09,
} = {}) {
  const seg = Math.max(3, radialSegments)
  const rings = buildRings({ radialSegments: seg, width, depth, height, twist })
  const pts = []
  const push = (a, b) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z)

  /* vertical ribs */
  for (let s = 0; s < seg; s++) {
    for (let ring = 0; ring < PROFILE.length - 1; ring++) {
      push(rings[ring][s], rings[ring + 1][s])
    }
  }

  /* girdle ring only */
  for (let s = 0; s < seg; s++) {
    push(rings[GIRDLE_RING][s], rings[GIRDLE_RING][(s + 1) % seg])
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

/**
 * Shared params so mesh + edges never drift apart.
 *
 * Sized so the crystal reads as the hero object without filling the frame —
 * leaving the right side of the canvas free for the spectrum to travel through.
 */
export const PRISM_PARAMS = {
  radialSegments: 12,
  width: 0.78,
  depth: 0.44,
  height: 1.48,
  twist: 0.09,
}
