/**
 * PRISM — HERO SECTION
 * 00 / PRISM — full-screen immersive hero.
 *
 * Composition borrows the reference's editorial device: oversized type split
 * into offset layers, with the visual sitting *between* them so the crystal
 * feels embedded in the typography rather than placed behind it.
 *
 * Here that structure carries the concept — LIGHT enters at the top line, the
 * prism occupies the centre, SPECTRUM leaves at the bottom.
 *
 * The 3D canvas is fixed behind; this layer is pure editorial overlay.
 */

import React, { useRef } from 'react'
import { SITE } from '../data/structure'
import { useReveal } from '../core/hooks'
import { useParallax, SplitText } from '../core/motion'

export default function HeroSection() {
  const ref = useRef(null)
  const shown = useReveal(ref, { threshold: 0.05 })

  /* the two type layers drift at different rates — depth without a 3D trick */
  const topLine = useParallax(-0.055)
  const bottomLine = useParallax(0.075)
  const meta = useParallax(-0.03)

  return (
    <section className="section section-hero" data-section="prism" id="prism">
      <div className={`hero-stack ${shown ? 'is-shown' : ''}`} ref={ref}>
        {/* ---- upper type layer: the light going in ---- */}
        <div className="hero-line hero-line-top" ref={topLine}>
          <span className="mega-title">PRISM</span>
        </div>

        {/* ---- lower type layer, offset right: what comes out.
                Outlined so the crystal and spectrum read through it. ---- */}
        <div className="hero-line hero-line-bottom" ref={bottomLine}>
          <span className="mega-title is-outline">SPECTRUM</span>
        </div>

        {/* ---- editorial meta, sits between the layers ---- */}
        <div className="hero-meta" ref={meta}>
          <p className="t-label hero-kicker">{SITE.narrative}</p>
          <span className="t-mono hero-year">{SITE.year}</span>
        </div>

        {/* ---- thesis: lights up word by word ---- */}
        <SplitText
          as="p"
          className="t-lead hero-thesis is-dim"
          text={SITE.thesis}
          stagger={0.055}
          delay={0.35}
        />

        {/* ---- optical chain annotation ---- */}
        <div className="hero-chain">
          {SITE.chain.map((word, i) => (
            <React.Fragment key={word}>
              <span className="t-pixel chain-node">{word}</span>
              {i < SITE.chain.length - 1 && <span className="chain-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* ---- scroll hint ---- */}
        <div className="hero-scroll">
          <span className="t-micro">Scroll to refract</span>
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  )
}
