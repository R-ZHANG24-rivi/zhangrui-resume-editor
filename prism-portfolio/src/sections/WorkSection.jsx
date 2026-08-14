/**
 * PRISM — WORK SECTION
 * 02 / SPECTRUM — Six projects, six wavelengths inside ONE black universe.
 * Project cards with colour-coded hover states.
 */

import React from 'react'
import { useReveal } from '../core/hooks'
import { useStore } from '../core/store'
import { useParallax } from '../core/motion'
import { SPECTRUM } from '../data/spectrum'

function ProjectCard({ project, index }) {
  const { setHoveredProject, openProject } = useStore()
  const ref = React.useRef(null)
  const shown = useReveal(ref, { threshold: 0.18 })

  /* Alternating drift speeds. Cards in the same row travelling at slightly
     different rates is what stops a grid from feeling like a static table. */
  const drift = useParallax(index % 2 === 0 ? -0.045 : 0.045)

  return (
    <div className="card-drift" ref={drift}>
    <article
      ref={ref}
      className={`project-card glass ${shown ? 'is-shown' : ''}`}
      style={{
        '--project-color': project.color,
        '--project-glow': project.glow,
        /* stagger the entrance across the grid */
        transitionDelay: `${(index % 3) * 0.09}s`,
      }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      onClick={() => openProject(project.id)}
      data-project-id={project.id}
      role="button"
      tabIndex={0}
      aria-label={`${project.title} — ${project.wavelength}`}
    >
      {/* index + wavelength */}
      <div className="card-header">
        <span className="t-pixel card-index">{project.index}</span>
        <span className="t-micro card-wavelength" style={{ color: project.color }}>
          {project.wavelength}
        </span>
        <span className="t-micro card-nm">{project.nm}nm</span>
      </div>

      {/* title */}
      <h3 className="t-h2 card-title">{project.title}</h3>

      {/* placeholder content */}
      <div className="card-body">
        <p className="t-small u-dim card-discipline">{project.discipline}</p>
        <p className="t-small u-dim card-year">{project.year}</p>
        <p className="t-body u-mute card-summary">{project.summary}</p>
      </div>

      {/* colour bar at bottom */}
      <div className="card-spectrum-bar" style={{ background: `linear-gradient(90deg, ${project.color}00, ${project.color}, ${project.colorSecondary}, ${project.color}00)` }} />

      {/* hover glow */}
      <div className="card-glow" style={{ background: `radial-gradient(ellipse at 50% 80%, ${project.glow}, transparent 70%)` }} />
    </article>
    </div>
  )
}

export default function WorkSection() {
  const ref = React.useRef(null)
  const shown = useReveal(ref, { threshold: 0.1 })
  const titleLayer = useParallax(-0.05)

  return (
    <section className="section section-work" data-section="spectrum" id="spectrum">
      <div className="bleed">
        {/* oversized marker — the wavelength wash makes it belong to this section */}
        <div className="mega-row" ref={titleLayer}>
          <span className="mega-title is-spectral">SPECTRUM</span>
        </div>

        <div className={`work-wrap ${shown ? 'is-shown' : ''}`} ref={ref}>
          {/* section header */}
          <div className="work-header">
            <p className="t-label">02</p>
            <p className="t-body u-mute work-kicker">Selected works — six wavelengths in one universe.</p>
          </div>

          {/* project grid — column count is owned by .project-grid */}
          <div className="project-grid">
            {SPECTRUM.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
