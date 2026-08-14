/**
 * PRISM — TRANSITION CURTAIN
 *
 * Page transitions happen through light and glass, never a generic fade.
 *
 * Sequence: a refracting glass sheet sweeps across the frame carrying the
 * destination wavelength. At its opaque midpoint the DOM swaps, then it sweeps
 * off — so the change reads as light passing through a prism edge.
 *
 * Two bugs this design deliberately avoids:
 *
 * 1. Custom DOM events. Dispatching `prism:transition` immediately after
 *    setting `transitioning: true` raced the listener registration — the event
 *    always fired before anyone listened. Phase now lives in the store.
 *
 * 2. Re-entrant effects. The timeline must run exactly once per transition. If
 *    the effect keys on `phase`, advancing the phase re-runs it and the cleanup
 *    cancels its own pending timers, stranding the curtain on screen. The
 *    timeline is therefore started once, keyed on the transition itself, and
 *    tracked in a ref.
 */

import React, { useEffect, useRef } from 'react'
import { useStore } from '../core/store'

/* timings, ms — slow and cinematic per the motion brief */
const COVER = 620   // sweep in until fully opaque
const HOLD = 240    // opaque dwell, DOM swaps here
const REVEAL = 700  // sweep out

export default function Transition() {
  const transitioning = useStore((s) => s.transitioning)
  const phase = useStore((s) => s.curtainPhase)
  const color = useStore((s) => s.curtainColor)

  const timers = useRef([])
  const running = useRef(false)

  useEffect(() => {
    /* transition ended — reset so the next one can run */
    if (!transitioning) {
      running.current = false
      timers.current.forEach(clearTimeout)
      timers.current = []
      return
    }

    /* already driving this transition; ignore phase-change re-renders */
    if (running.current) return
    running.current = true

    const { commitPending, setCurtainPhase, endTransition } = useStore.getState()
    const wait = (fn, ms) => timers.current.push(setTimeout(fn, ms))

    /* opaque midpoint → swap the view */
    wait(() => {
      const heading = useStore.getState().pendingView
      commitPending()

      /* Restore scroll while the curtain is still opaque, so the jump is never
         visible. A project opens at its own top; returning to the index puts
         you back where you left off. */
      const y = heading === 'index' ? useStore.getState().indexScrollY : 0
      window.scrollTo({ top: y, behavior: 'instant' })

      /* brief dwell, then reveal */
      wait(() => {
        setCurtainPhase('out')
        wait(() => endTransition(), REVEAL)
      }, HOLD)
    }, COVER)

    /* NOTE: no cleanup that clears timers here — see note 2 above. Cleanup
       happens on the !transitioning branch and on unmount below. */
  }, [transitioning])

  /* clear any pending timers if the component itself goes away */
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (!transitioning) return null

  return (
    <div
      className={`transition-curtain curtain-${phase}`}
      style={{ '--curtain-color': color }}
      aria-hidden="true"
    >
      {/* the refracting sheet */}
      <div className="curtain-glass" />
      {/* chromatic leading edge — the wavelength being carried */}
      <div className="curtain-edge" />
    </div>
  )
}
