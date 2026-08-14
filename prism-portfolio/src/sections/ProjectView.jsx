/**
 * PRISM — PROJECT VIEW
 *
 * 02 / SPECTRUM → a single wavelength.
 *
 * The critical rule from the brief: six projects must NOT feel like six
 * different websites. They are six wavelengths in ONE black universe — so the
 * grid, typography, glass and prism are all identical to the index. Only the
 * light changes: colour, glow, atmosphere.
 *
 * That colour arrives through the `--spectrum-*` CSS custom properties, set by
 * `applyLight()` in the store, so nothing here hardcodes a project colour.
 *
 * Content is deliberately placeholder — structure first, case studies later.
 */

import React, { useEffect, useRef } from 'react'
import { useStore } from '../core/store'
import { SPECTRUM, getProject } from '../data/spectrum'

export default function ProjectView() {
  const activeProject = useStore((s) => s.activeProject)
  const closeProject = useStore((s) => s.closeProject)
  const openProject = useStore((s) => s.openProject)
  const topRef = useRef(null)

  const project = getProject(activeProject)

  /* Escape returns to the index — expected behaviour for an immersive view */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeProject()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeProject])

  if (!project) return null

  const idx = SPECTRUM.findIndex((p) => p.id === project.id)
  const prev = SPECTRUM[(idx - 1 + SPECTRUM.length) % SPECTRUM.length]
  const next = SPECTRUM[(idx + 1) % SPECTRUM.length]

  return (
    <article className="project-view" ref={topRef} data-project-view={project.id}>
      {/* ---- back to index ---- */}
      <button className="project-back t-micro" onClick={closeProject}>
        <span className="back-arrow" aria-hidden="true">←</span>
        <span>SPECTRUM INDEX</span>
      </button>

      {/* ---- HERO ---- */}
      <header className="project-hero bleed">
        <div className="project-hero-meta">
          <span className="t-pixel project-index">{project.index}</span>
          <span className="t-micro project-wavelength">{project.wavelength}</span>
          <span className="t-micro u-dim project-nm">{project.nm}nm</span>
        </div>

        <h1 className="t-display project-title">{project.title}</h1>

        {/* the wavelength as a physical band of light */}
        <div className="project-spectrum-band" aria-hidden="true">
          <span className="band-fill" />
        </div>

        <dl className="project-facts">
          <div className="fact">
            <dt className="t-micro u-dim">DISCIPLINE</dt>
            <dd className="t-small">{project.discipline}</dd>
          </div>
          <div className="fact">
            <dt className="t-micro u-dim">YEAR</dt>
            <dd className="t-small">{project.year}</dd>
          </div>
          <div className="fact">
            <dt className="t-micro u-dim">ROLE</dt>
            <dd className="t-small">{project.role}</dd>
          </div>
        </dl>
      </header>

      {/* ---- BODY: placeholder blocks, ready for real case-study content ---- */}
      <div className="project-body bleed">
        <section className="project-block">
          <p className="t-label u-dim">OVERVIEW</p>
          <p className="t-lead project-summary">{project.overview || project.summary}</p>
        </section>

        {/* cover / hero image slot */}
        <figure className="project-media glass" aria-label="Project cover placeholder">
          <span className="t-micro u-dim">COVER IMAGE — to be provided</span>
        </figure>

        {/* two-up media slots */}
        <div className="project-media-pair">
          <figure className="project-media glass is-half">
            <span className="t-micro u-dim">IMAGE — to be provided</span>
          </figure>
          <figure className="project-media glass is-half">
            <span className="t-micro u-dim">IMAGE — to be provided</span>
          </figure>
        </div>

        {[
          { label: 'PROBLEM', text: project.problem },
          { label: 'PROCESS', text: project.process },
          { label: 'OUTCOME', text: project.outcome },
        ].map(({ label, text }) => (
          <section className="project-block" key={label}>
            <p className="t-label u-dim">{label}</p>
            <p className="t-body u-mute">{text || 'Placeholder — content to be provided.'}</p>
          </section>
        ))}
      </div>

      {/* ---- NEXT / PREV WAVELENGTH ---- */}
      <nav className="project-nav bleed" aria-label="Project navigation">
        <button
          className="project-nav-item"
          onClick={() => openProject(prev.id)}
          style={{ '--nav-color': prev.color }}
        >
          <span className="t-micro u-dim">PREVIOUS WAVELENGTH</span>
          <span className="t-h3">{prev.title}</span>
          <span className="t-micro nav-wl">{prev.wavelength}</span>
        </button>

        <button
          className="project-nav-item is-next"
          onClick={() => openProject(next.id)}
          style={{ '--nav-color': next.color }}
        >
          <span className="t-micro u-dim">NEXT WAVELENGTH</span>
          <span className="t-h3">{next.title}</span>
          <span className="t-micro nav-wl">{next.wavelength}</span>
        </button>
      </nav>
    </article>
  )
}
