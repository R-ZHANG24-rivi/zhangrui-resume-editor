# PRISM — Portfolio 2026

**ONE LIGHT / MULTIPLE SPECTRUMS**
*Design refracts the ordinary into possibilities.*

Phase 1 deliverable: the visual and interaction prototype. Structure, optics and
motion are in place; project content is intentionally placeholder.

---

## Run

```bash
npm install
npm run dev      # http://localhost:5178
npm run build    # → dist/
npm run preview
```

---

## Concept → code map

The narrative chain `LIGHT → PRISM → REFRACTION → SPECTRUM` is literal in the code:

| Concept | Where it lives |
| --- | --- |
| The white beam entering | `webgl/LightBeam.jsx` + `shaders/lightBeam.js` |
| The crystal | `webgl/Prism.jsx` + `geometry/prismGeometry.js` + `shaders/prismGlass.js` |
| Dispersed spectrum | `webgl/SpectrumField.jsx` + `shaders/spectrumField.js` |
| Light sliced by glass sheets | `webgl/GlassLamellae.jsx` + `shaders/glassLamella.js` |
| Glow / aberration / vignette | `webgl/Effects.jsx` |
| Six wavelengths (projects) | `data/spectrum.js` |
| Information architecture | `data/structure.js` |

---

## The prism state machine

One state drives every optical element at once. Set in `core/store.js`,
mapped per section in `data/structure.js`.

| State | Section | What the light does |
| --- | --- | --- |
| `hero` | 00 / PRISM | Full dispersion, crystal at full scale |
| `converge` | 01 / WHITE LIGHT | Spectrum collapses back into white |
| `disperse` | 02 / SPECTRUM | White light splits into six wavelengths |
| `project` | (inside a project) | Crystal shrinks to a navigation object |
| `orbit` | 03 / BEYOND | Crystal drifts off-axis |
| `ending` | 04 / REFRACTION CONTINUES | Everything reconverges |

Scroll drives the state via `IntersectionObserver` in `core/hooks.js`.

**Section transitions happen through light, not fades.** The camera never moves —
`SECTION_LAYOUT` in `core/store.js` slides the entire optical rig per state, so
the light recomposes around the text.

---

## Two views, one universe

`index` (the scrolling page) and `project` (a single wavelength) swap inside
`App.jsx`. The WebGL layer is **never unmounted** between them, so the light
carries across — the prism genuinely acts as the navigation object rather than
each page loading its own decoration.

Entering / leaving a project runs a curtain: a refracting glass sheet sweeps the
frame carrying the destination wavelength, the DOM swaps while it is opaque, then
it sweeps off in the same direction. Timings live at the top of
`components/Transition.jsx`.

`indexScrollY` in the store remembers where you left the index, restored during
the opaque phase so the jump is never visible. Projects always open at their top.

**A project must never look like a different website.** `styles/project.css`
introduces no new layout language and contains **zero hardcoded colour** — it
takes its hue entirely from the `--spectrum-*` custom properties that
`applyLight()` sets. Switching project changes light, never structure.

---

## Where to change what

| To change | Edit |
| --- | --- |
| Colours, type scale, grid, spacing, motion curves | `styles/tokens.css` |
| Crystal silhouette (facets, proportions, size) | `PRISM_PARAMS` in `geometry/prismGeometry.js` |
| Glass look (fresnel, highlights, dispersion) | `shaders/prismGlass.js` |
| Rainbow colours / softness / slicing | `shaders/spectrumField.js` |
| Where the rig sits per section | `SECTION_LAYOUT` in `core/store.js` |
| Crystal scale + tilt per section | `POSE` in `webgl/Prism.jsx` |
| Project names, colours, wavelengths | `data/spectrum.js` |
| Adding a section | one object in `data/structure.js` |
| Glow strength | `webgl/Effects.jsx` |
| Parallax speeds / word reveals | `core/motion.jsx` |
| Oversized section titles | `.mega-title` in `styles/motion.css` |
| Project page layout | `styles/project.css` |
| Transition timing / feel | `components/Transition.jsx` + `.transition-curtain` in `sections.css` |

### Adding real project content

`data/spectrum.js` holds all six entries. Fill in `summary`, `discipline`,
`year`, `role`, `cover` and `sections` — no component changes required. The
colour system (`color`, `colorSecondary`, `glow`, `nm`, `character`) already
drives the light, so a project's atmosphere follows automatically.

---

## Performance model

Three quality tiers, auto-detected in `core/store.js` (`detectTier`), from
viewport, memory, pointer type and `prefers-reduced-motion`:

| Tier | DPR cap | Glass slices | Bloom |
| --- | --- | --- | --- |
| `high` | 1.75 | 9 | yes |
| `mid` | 1.4 | 6 | yes |
| `low` | 1.2 | 4 | no |

Budget rules being followed:
- **Zero 3D assets.** All geometry is procedural; the environment map is a
  generated canvas texture. Nothing to download.
- **No React re-renders in the frame loop.** Pointer state lives outside React
  (`pointer` in `core/store.js`) and is read directly inside `useFrame`.
- **One expensive material maximum** — the hero crystal. Every other "glass"
  surface is a cheap shader plane.
- **Frame-rate independent damping** everywhere, so motion is identical at
  30fps and 144fps.
- `prefers-reduced-motion` drops to `low` tier: no bloom, minimal motion, text
  always readable.

Build output: ~300 KB gzip total (three.js ~176 KB, R3F ~105 KB, app ~14 KB).

---

## On smooth scrolling

A hand-rolled inertial scroll (translating a content wrapper and faking document
height with a spacer) was built and then removed. It breaks every
`position: fixed` descendant — the nav, the WebGL canvas, the project back
button — and makes scroll offsets ambiguous for anchors and IntersectionObserver.

Native scrolling is kept. The premium feel comes from what actually reads on
screen: parallax depth (`useParallax`), masked word-by-word reveals
(`SplitText`), and long eased transitions. Nothing fights the platform.

---

## Two non-obvious constraints

Both were the cause of real failures. Please keep them in mind when editing.

**1. Vector uniforms must be `THREE.Vector3`, never plain arrays.**

```js
// WRONG — an array has no .set(), so the frame loop throws
uTint: { value: [1, 1, 1] }

// RIGHT
uTint: { value: new THREE.Vector3(1, 1, 1) }
```

Any uncaught exception inside `useFrame` **permanently kills R3F's render loop**,
and the entire WebGL layer silently goes black — usually with no useful console
error. This is the single easiest way to break the site.

**2. The crystal does not use `MeshPhysicalMaterial` transmission.**

`transmission` refracts whatever the scene renders *behind* the mesh. On a pure
black page that is nothing, so the glass collapses into a flat white sheen that
reads as milky plastic. Supplying a backdrop fixes the glass but makes that
backdrop visible across the page.

`shaders/prismGlass.js` therefore synthesises the optics per-fragment — fresnel,
per-facet speculars, chromatic dispersion along the refraction vector, internal
caustics. Self-contained, so **black stays black**.

---

## Structure

```
src/
├── core/
│   ├── store.js          state machine, tiers, SECTION_LAYOUT, pointer
│   └── hooks.js          pointer inertia, scroll, section observer, capabilities
├── data/
│   ├── spectrum.js       six projects — fill content here
│   └── structure.js      information architecture
├── webgl/
│   ├── Scene.jsx             canvas shell only
│   ├── OpticalSystem.jsx     scene composition + rig motion
│   ├── OpticalEnvironment.jsx procedural env map + lights
│   ├── Prism.jsx             the crystal
│   ├── LightBeam.jsx         incoming white light
│   ├── SpectrumField.jsx     dispersed rainbow
│   ├── GlassLamellae.jsx     translucent slicing sheets
│   ├── Effects.jsx           bloom / aberration / vignette
│   ├── geometry/             procedural crystal
│   └── shaders/              GLSL
├── sections/             one component per section + ProjectView.jsx
├── components/           Nav, Loader, Transition
├── core/motion.jsx       useParallax + SplitText (shared rAF loop)
└── styles/               tokens → base → sections → motion → project
```

---

## Phase 2 candidates

- Real project content in `data/spectrum.js` + case-study layouts
- Deep-linkable project URLs (routing is currently in-memory state)
- Drag / click interaction on the crystal
- Mobile interaction polish
- Final typography and font loading
