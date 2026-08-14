/**
 * PRISM — NAVIGATION
 *
 * Minimal and editorial: four links plus a live readout of the optical state.
 *
 * Works from both views. Inside a project the index sections are unmounted, so
 * a plain `scrollIntoView` would silently do nothing — the nav closes the
 * project first, then scrolls once the index is back in the DOM.
 */

import React, { useCallback } from 'react'
import { useStore } from '../core/store'
import { scrollToSection } from '../core/hooks'
import { NAV_ITEMS } from '../data/structure'

export default function Nav() {
  const activeSection = useStore((s) => s.activeSection)
  const setActiveSection = useStore((s) => s.setActiveSection)
  const prismState = useStore((s) => s.prismState)
  const view = useStore((s) => s.view)
  const transitioning = useStore((s) => s.transitioning)
  const closeProject = useStore((s) => s.closeProject)

  /**
   * Scroll to a section, returning to the index first if needed.
   * The target is stashed so it can be honoured after the curtain swaps views.
   */
  const goToSection = useCallback(
    (id) => {
      if (transitioning) return

      if (view === 'project') {
        closeProject()
        /* wait for the index to mount, then scroll — the curtain covers this */
        const tryScroll = (attempt = 0) => {
          if (scrollToSection(id, 'instant')) {
            setActiveSection(id)
          } else if (attempt < 30) {
            requestAnimationFrame(() => tryScroll(attempt + 1))
          }
        }
        setTimeout(() => tryScroll(), 640) // just past the curtain midpoint
        return
      }

      scrollToSection(id)
      setActiveSection(id)
    },
    [view, transitioning, closeProject, setActiveSection]
  )

  return (
    <nav className="nav" role="navigation" aria-label="Main">
      <div className="nav-inner">
        {/* brand → back to the top of the index */}
        <button
          className="nav-brand"
          onClick={() => goToSection('prism')}
          aria-label="Back to PRISM"
        >
          <span className="t-pixel">PRISM</span>
        </button>

        {/* section links */}
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${
                  view === 'index' && activeSection === item.id ? 'is-active' : ''
                }`}
                onClick={() => goToSection(item.id)}
              >
                <span className="nav-index">{item.index}</span>
                <span className="nav-label">{item.nav}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* optical state readout — the prism's current mode, always honest */}
        <span className="nav-state t-mono">{prismState}</span>
      </div>
    </nav>
  )
}
