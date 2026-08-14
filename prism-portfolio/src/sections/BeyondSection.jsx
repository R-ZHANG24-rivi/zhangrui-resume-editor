/**
 * PRISM — BEYOND SECTION
 * 03 / BEYOND — Other facets of the designer.
 * Prism drifts off-axis, facets scatter.
 */

import React from 'react'
import { useReveal } from '../core/hooks'
import { useParallax } from '../core/motion'
import { CV } from '../data/cv'

export default function BeyondSection() {
  const ref = React.useRef(null)
  const shown = useReveal(ref, { threshold: 0.15 })
  const titleLayer = useParallax(-0.05)

  const aiSkills = CV.skills.find((s) => s.group === 'AI 能力')
  const productSkills = CV.skills.find((s) => s.group === '产品体验')

  return (
    <section className="section section-beyond" data-section="beyond" id="beyond">
      <div className="bleed">
        {/* oversized marker keeps the section rhythm consistent across the site */}
        <div className="mega-row" ref={titleLayer}>
          <span className="mega-title is-outline">BEYOND</span>
        </div>

        <div className={`beyond-grid grid12 ${shown ? 'is-shown' : ''}`} ref={ref}>
          <div className="beyond-header grid-span-12">
            <p className="t-label">03</p>
            <p className="t-body u-mute beyond-kicker">Other facets.</p>
          </div>

          {/* content blocks — driven by data/cv.js */}
          <div className="beyond-content grid-span-8">
            <div className="glass-lg beyond-block">
              <span className="t-label">Interests & Explorations</span>
              <p className="t-small u-dim cv-line">
                <span className="cv-k">AI 工具链：</span>
                {aiSkills ? aiSkills.items.join('、') : ''}
              </p>
              <p className="t-small u-dim cv-line">
                <span className="cv-k">产品方法：</span>
                {productSkills ? productSkills.items.join('、') : ''}
              </p>
              <p className="t-small u-dim cv-line">
                持续关注原生 AI 产品的交互范式与行业前沿，把 AI 用于需求分析、创意探索与原型 Coding。
              </p>
            </div>

            <div className="glass beyond-block">
              <span className="t-label">Writing & Research</span>
              {CV.papers.map((p) => (
                <div className="cv-block" key={p.title}>
                  <p className="t-small cv-line">
                    <span className="cv-k">{p.title}</span> · {p.venue}（{p.role}）
                  </p>
                  <p className="t-small u-dim cv-line">{p.note}</p>
                </div>
              ))}
              <p className="t-small u-dim cv-line cv-sub">
                <span className="cv-k">获奖：</span>
                {CV.awards.join('；')}
              </p>
            </div>
          </div>

          <div className="beyond-sidebar grid-span-4">
            <div className="glass beyond-stat">
              <span className="t-display stat-value">{CV.papers.length}</span>
              <span className="t-micro stat-label">学术论文</span>
            </div>
            <div className="glass beyond-stat">
              <span className="t-display stat-value">{CV.awards.length}</span>
              <span className="t-micro stat-label">主要荣誉</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
