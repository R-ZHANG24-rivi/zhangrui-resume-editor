/**
 * PRISM — LOADER
 * Pre-boot loading screen. Minimal, typographic.
 */

import React from 'react'
import { useStore } from '../core/store'
import { SITE } from '../data/structure'

export default function Loader() {
  const progress = useStore((s) => s.progress)

  return (
    <div className="loader" role="status">
      <div className="loader-inner">
        <p className="t-label loader-kicker">{SITE.narrative}</p>
        <h1 className="t-display loader-title">PRISM</h1>
        <div className="loader-bar">
          <div className="loader-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="t-micro loader-progress">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  )
}
