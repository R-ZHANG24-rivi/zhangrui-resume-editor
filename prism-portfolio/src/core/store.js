/**
 * PRISM — STATE
 *
 * One store, one truth. Everything optical reads from `prismState`.
 *
 * PRISM STATE MACHINE
 *   hero      → prism at full scale, white beam in, spectrum fanning out right
 *   converge  → spectrum collapses back into a single white core (About)
 *   disperse  → white light splits into the six wavelengths (Work)
 *   project    → prism shrinks into a navigation object, one wavelength dominant
 *   orbit     → prism drifts off-axis, facets scatter (Beyond)
 *   ending    → all spectrums reconverge, back to the source
 */

import { create } from 'zustand'
import { SECTIONS } from '../data/structure'
import { WHITE_LIGHT, getProject } from '../data/spectrum'

/* --------------------------------------------------------------------------
   Pointer lives outside React. Mutated at rAF rate by the pointer hook and
   read directly inside the r3f frame loop — zero re-renders.
   -------------------------------------------------------------------------- */
export const pointer = {
  x: 0, y: 0,            // normalised -1..1, raw
  sx: 0, sy: 0,          // smoothed (inertial)
  vel: 0,                // smoothed speed, drives dispersion boost
  inside: true,
  overPrism: false,
}

/* Quality tiers keep the expensive glass affordable on weak GPUs. */
export function detectTier() {
  if (typeof window === 'undefined') return 'high'
  const w = window.innerWidth
  const mem = navigator.deviceMemory || navigator.hardwareConcurrency || 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return 'low'
  if (coarse || w < 820 || mem <= 4) return 'low'
  if (w < 1400 || mem <= 6) return 'mid'
  return 'high'
}

export const TIER_CONFIG = {
  high: { dpr: [1, 1.75], samples: 4, transmission: true, slices: 9,  bloom: true, grain: true },
  mid:  { dpr: [1, 1.4],  samples: 2, transmission: true, slices: 6,  bloom: true, grain: true },
  low:  { dpr: [1, 1.2],  samples: 0, transmission: false, slices: 4, bloom: false, grain: false },
}

/* --------------------------------------------------------------------------
   SPATIAL COMPOSITION PER STATE

   Where the whole optical rig sits, per prism state. This is the mechanism
   behind "section transitions happen through light, not fades": the camera
   never moves — the optical composition slides, so the light itself
   recomposes around the text.

   Hero keeps the rig right-of-centre so it never fights the PRISM wordmark.
   -------------------------------------------------------------------------- */
export const SECTION_LAYOUT = {
  /* Hero: the wordmark occupies the left two-thirds, so the crystal sits in the
     right-hand negative space and stays fully legible rather than fighting type */
  hero:     { x:  0.92, y:  0.05, z:  0.10 },
  converge: { x:  1.35, y:  0.12, z: -0.55 },  // About: pushed right + back
  disperse: { x: -0.20, y:  0.20, z: -0.30 },  // Work: recentres, opens up
  project:  { x: -1.55, y:  0.55, z: -0.85 },  // Project: small nav object
  orbit:    { x:  1.15, y: -0.30, z: -0.65 },  // Beyond: drifts off-axis
  ending:   { x:  0.00, y:  0.00, z:  0.25 },  // Contact: returns to centre
}

export const useStore = create((set, get) => ({
  /* ---------- boot ---------- */
  booted: false,
  progress: 0,
  tier: 'high',
  reducedMotion: false,

  setBooted: (v) => set({ booted: v }),
  setProgress: (p) => set({ progress: p }),
  setTier: (t) => set({ tier: t }),
  setReducedMotion: (v) => set({ reducedMotion: v }),

  /* ---------- routing ---------- */
  view: 'index',            // 'index' | 'project'
  activeSection: 'prism',
  activeProject: null,      // project id
  transitioning: false,

  /* ---------- optics ---------- */
  prismState: 'hero',
  // 0..1 scroll progress inside the whole index document
  scroll: 0,
  // 0..1 how much the spectrum is dispersed (1 = full rainbow, 0 = white)
  dispersion: 1,

  setActiveSection: (id) => {
    if (get().activeSection === id) return
    const s = SECTIONS.find((x) => x.id === id)
    set({
      activeSection: id,
      prismState: get().view === 'project' ? 'project' : (s?.prismState || 'hero'),
    })
  },

  setScroll: (v) => set({ scroll: v }),

  /* ---------- light identity ---------- */
  light: WHITE_LIGHT,

  /** Applies a wavelength to CSS custom props so HTML + WebGL stay in sync. */
  applyLight: (light) => {
    const root = document.documentElement
    root.style.setProperty('--spectrum-primary', light.color)
    root.style.setProperty('--spectrum-secondary', light.colorSecondary)
    root.style.setProperty('--spectrum-glow', light.glow)
    set({ light })
  },

  /* ---------- navigation actions ----------

     Transitions are pure state, deliberately NOT custom DOM events.

     An earlier version set `transitioning: true` and then immediately
     dispatched `prism:transition`. <Transition/> only registered its listener
     inside an effect that ran *after* `transitioning` flipped, so the event
     always fired before anyone was listening and the curtain never ran.

     Now the store owns the phase, and <Transition/> simply renders it.
     -------------------------------------------------------------------------- */

  /** 'idle' | 'in' (covering) | 'hold' (opaque, DOM swaps) | 'out' (revealing) */
  curtainPhase: 'idle',
  curtainColor: WHITE_LIGHT.color,
  /** where the transition is heading — consumed at the opaque midpoint */
  pendingView: null,
  pendingProject: null,
  /** index scroll position, so closing a project returns you where you were */
  indexScrollY: 0,

  /** Enter a project: prism becomes a navigation object, one wavelength wins. */
  openProject: (id) => {
    const p = getProject(id)
    if (!p || get().transitioning) return
    get().applyLight(p)
    set({
      transitioning: true,
      curtainPhase: 'in',
      curtainColor: p.color,
      pendingView: 'project',
      pendingProject: id,
      /* only remember the position when leaving the index, not project→project */
      indexScrollY: get().view === 'index' ? window.scrollY : get().indexScrollY,
    })
  },

  closeProject: () => {
    if (get().transitioning) return
    set({
      transitioning: true,
      curtainPhase: 'in',
      curtainColor: WHITE_LIGHT.color,
      pendingView: 'index',
      pendingProject: null,
    })
  },

  /** Called by <Transition/> once the curtain is fully opaque. */
  commitPending: () => {
    const { pendingView, pendingProject } = get()
    if (pendingView === 'project') {
      set({
        view: 'project',
        activeProject: pendingProject,
        prismState: 'project',
        activeSection: 'spectrum',
        curtainPhase: 'hold',
      })
    } else {
      get().applyLight(WHITE_LIGHT)
      set({
        view: 'index',
        activeProject: null,
        prismState: 'disperse',
        activeSection: 'spectrum',
        curtainPhase: 'hold',
      })
    }
  },

  setCurtainPhase: (phase) => set({ curtainPhase: phase }),

  endTransition: () =>
    set({
      transitioning: false,
      curtainPhase: 'idle',
      pendingView: null,
      pendingProject: null,
    }),

  /* ---------- hover preview on the work index ---------- */
  hoveredProject: null,
  setHoveredProject: (id) => {
    if (get().view === 'project') return
    set({ hoveredProject: id })
    const p = id ? getProject(id) : null
    get().applyLight(p || WHITE_LIGHT)
  },
}))

/** Non-reactive selector helper for the render loop. */
export const snap = () => useStore.getState()
