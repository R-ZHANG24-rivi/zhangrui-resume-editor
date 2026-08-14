/**
 * PRISM — HOOKS
 * Pointer inertia, scroll progress, section observation, media queries.
 */

import { useEffect, useRef, useState } from 'react'
import { pointer, useStore, detectTier } from './store'

/* --------------------------------------------------------------------------
   Pointer: writes into the module-level `pointer` object, never into React.
   -------------------------------------------------------------------------- */
export function usePointerField() {
  useEffect(() => {
    let raf = 0
    let lx = 0, ly = 0

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.inside = true
    }
    const onLeave = () => { pointer.inside = false; pointer.x = 0; pointer.y = 0 }
    const onTouch = (e) => {
      const t = e.touches[0]
      if (!t) return
      pointer.x = (t.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((t.clientY / window.innerHeight) * 2 - 1)
    }

    const loop = () => {
      // inertial smoothing — motion should feel like drifting light
      pointer.sx += (pointer.x - pointer.sx) * 0.045
      pointer.sy += (pointer.y - pointer.sy) * 0.045
      const d = Math.hypot(pointer.sx - lx, pointer.sy - ly)
      pointer.vel += (Math.min(d * 26, 1) - pointer.vel) * 0.09
      lx = pointer.sx; ly = pointer.sy
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])
}

/* --------------------------------------------------------------------------
   Document scroll progress → store (throttled to rAF).
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   Document scroll progress → store (throttled to rAF).
   -------------------------------------------------------------------------- */
export function useScrollProgress() {
  const setScroll = useStore((s) => s.setScroll)
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScroll(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    read()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [setScroll])
}

/* --------------------------------------------------------------------------
   Scroll to a section by id.
   -------------------------------------------------------------------------- */
export function scrollToSection(id, behavior = 'smooth') {
  const el = document.querySelector(`[data-section="${id}"]`)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}


/* --------------------------------------------------------------------------
   Which section owns the viewport → drives the prism state machine.
   -------------------------------------------------------------------------- */
export function useSectionObserver(enabled = true) {
  const setActiveSection = useStore((s) => s.setActiveSection)
  useEffect(() => {
    if (!enabled) return
    const nodes = Array.from(document.querySelectorAll('[data-section]'))
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.dataset.section)
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [enabled, setActiveSection])
}

/* --------------------------------------------------------------------------
   Reveal on enter — one observer, class toggled, CSS does the rest.
   -------------------------------------------------------------------------- */
export function useReveal(ref, { threshold = 0.22, once = true } = {}) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setShown(true); if (once) io.disconnect() }
        else if (!once) setShown(false)
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, once])
  return shown
}

/* --------------------------------------------------------------------------
   Capability detection.
   -------------------------------------------------------------------------- */
export function useCapabilities() {
  const setTier = useStore((s) => s.setTier)
  const setReducedMotion = useStore((s) => s.setReducedMotion)
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => { setTier(detectTier()); setReducedMotion(rm.matches) }
    apply()
    rm.addEventListener('change', apply)
    let t
    const onResize = () => { clearTimeout(t); t = setTimeout(apply, 250) }
    window.addEventListener('resize', onResize)
    return () => {
      rm.removeEventListener('change', apply)
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [setTier, setReducedMotion])
}

/** Lock body scroll (project view / transitions). */
export function useScrollLock(locked) {
  const y = useRef(0)
  useEffect(() => {
    if (!locked) return
    y.current = window.scrollY
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [locked])
}
