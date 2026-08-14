/**
 * PRISM — SCROLL MOTION PRIMITIVES
 *
 * Two reusable behaviours lifted from the reference language, both driven by a
 * single shared rAF loop so adding more of them costs almost nothing.
 *
 * 1. useParallax  — elements travel at different speeds as you scroll, which is
 *                   what creates real depth. Layered against the fixed WebGL
 *                   canvas it reads as space rather than a moving page.
 *
 * 2. SplitText    — headings and lead paragraphs light up word by word as they
 *                   enter, so reading feels like light arriving. Not a fade-in.
 *
 * Both are no-ops under `prefers-reduced-motion`.
 */

import React, { useEffect, useRef, useMemo, useState } from 'react'

/* --------------------------------------------------------------------------
   Shared observer loop — one rAF for every parallax element on the page
   -------------------------------------------------------------------------- */

const items = new Set()
let loopId = 0
let reduced = false

function tick() {
  const vh = window.innerHeight

  items.forEach((item) => {
    const el = item.el
    if (!el) return
    const rect = el.getBoundingClientRect()

    /* skip anything comfortably off-screen */
    if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return

    /* -1 (just below the fold) → 0 (centred) → 1 (just above) */
    const progress = (rect.top + rect.height / 2 - vh / 2) / vh
    const y = progress * item.speed * 100

    el.style.transform = item.scale
      ? `translate3d(0, ${y}px, 0) scale(${1 + Math.abs(progress) * item.scale})`
      : `translate3d(0, ${y}px, 0)`
  })

  loopId = requestAnimationFrame(tick)
}

function register(item) {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  items.add(item)
  if (!loopId) loopId = requestAnimationFrame(tick)

  return () => {
    items.delete(item)
    if (items.size === 0) {
      cancelAnimationFrame(loopId)
      loopId = 0
    }
  }
}

/**
 * Move an element at a different rate than the scroll.
 * @param {number} speed negative drifts up (feels closer), positive drifts down
 * @param {number} scale optional subtle scale coupled to distance from centre
 */
export function useParallax(speed = -0.1, scale = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.willChange = 'transform'
    const unregister = register({ el, speed, scale })
    return () => {
      unregister()
      el.style.willChange = ''
      el.style.transform = ''
    }
  }, [speed, scale])

  return ref
}

/* --------------------------------------------------------------------------
   SplitText — word-by-word reveal
   -------------------------------------------------------------------------- */

/**
 * Splits text into words and lights them up in sequence on enter.
 *
 * Words are wrapped in an overflow-hidden span so each one rises out of a mask
 * rather than simply fading — the difference between "animated" and "designed".
 *
 * @param {string}  as       element tag to render
 * @param {string}  text     content to split
 * @param {number}  stagger  seconds between words
 * @param {number}  delay    initial delay in seconds
 * @param {boolean} once     animate a single time (default) or on every enter
 */
export function SplitText({
  as: Tag = 'p',
  text = '',
  className = '',
  stagger = 0.045,
  delay = 0,
  once = true,
  threshold = 0.25,
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  const words = useMemo(() => String(text).split(/(\s+)/), [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) io.disconnect()
        } else if (!once) {
          setShown(false)
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, threshold])

  return (
    <Tag ref={ref} className={`split-text ${shown ? 'is-lit' : ''} ${className}`}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return ' '
        /* index counts only real words so whitespace doesn't skew the stagger */
        const order = words.slice(0, i).filter((x) => !/^\s+$/.test(x)).length
        return (
          <span className="split-word" key={`${w}-${i}`}>
            <span
              className="split-inner"
              style={{ transitionDelay: `${delay + order * stagger}s` }}
            >
              {w}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
