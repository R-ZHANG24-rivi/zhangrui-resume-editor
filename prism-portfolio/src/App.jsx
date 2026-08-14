/**
 * PRISM — APP
 *
 * Root orchestrator: one fixed 3D canvas behind, swappable content on top.
 *
 * Two views share the same optical system — the WebGL layer is never unmounted,
 * so moving between the index and a project reads as the same light recomposing
 * rather than a new page loading. That continuity is the whole point of the
 * prism-as-navigation-object idea.
 */

import React, { useEffect, useState } from 'react'
import { useStore } from './core/store'
import { usePointerField, useScrollProgress, useSectionObserver, useCapabilities } from './core/hooks'
import Scene from './webgl/Scene'
import Nav from './components/Nav'
import Loader from './components/Loader'
import Transition from './components/Transition'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import WorkSection from './sections/WorkSection'
import BeyondSection from './sections/BeyondSection'
import ContactSection from './sections/ContactSection'
import ProjectView from './sections/ProjectView'

export default function App() {
  const booted = useStore((s) => s.booted)
  const setBooted = useStore((s) => s.setBooted)
  const view = useStore((s) => s.view)
  const [ready, setReady] = useState(false)

  /* ---- hooks that drive the optical system ---- */
  usePointerField()
  useScrollProgress()
  /* section observer only matters on the index — a project owns its own state */
  useSectionObserver(view === 'index')
  useCapabilities()

  /* boot sequence: short delay so the loader reads as intent, not lag */
  useEffect(() => {
    const t = setTimeout(() => {
      setBooted(true)
      setTimeout(() => setReady(true), 600)
    }, 1200)
    return () => clearTimeout(t)
  }, [setBooted])

  return (
    <>
      {/* ---- fixed WebGL layer: persists across views, never remounts ---- */}
      <Scene ready={ready} />

      {/* ---- content layer ---- */}
      <div className="site" data-site data-view={view}>
        <a href="#main" className="skip-link">Skip to content</a>

        <Nav />

        <main id="main">
          {view === 'project' ? (
            <ProjectView />
          ) : (
            <>
              <HeroSection />
              <AboutSection />
              <WorkSection />
              <BeyondSection />
              <ContactSection />
            </>
          )}
        </main>
      </div>

      {/* ---- UI overlays ---- */}
      {!booted && <Loader />}
      <Transition />
    </>
  )
}
