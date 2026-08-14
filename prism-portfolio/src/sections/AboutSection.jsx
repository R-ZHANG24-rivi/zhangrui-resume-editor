/**
 * PRISM — ABOUT SECTION
 * 01 / WHITE LIGHT — "All colours reconverged."
 *
 * The concept here is subtraction: the rainbow from the hero collapses back into
 * a single white beam (handled by the `converge` prism state), and the page
 * returns to black / white / transparent glass. Colour survives only as a trace
 * inside the glass.
 *
 * The statement is the emotional core of the section, so it gets the word-by-word
 * reveal — the sentence assembles itself as you read, which is the point.
 */

import React, { useRef } from 'react'
import { useReveal } from '../core/hooks'
import { useParallax, SplitText } from '../core/motion'
import { CV } from '../data/cv'

export default function AboutSection() {
  const ref = useRef(null)
  const shown = useReveal(ref, { threshold: 0.15 })

  const titleLayer = useParallax(-0.05)
  const blocksLayer = useParallax(0.035)

  const { profile, education, skills, contact } = CV

  return (
    <section className="section section-about" data-section="white-light" id="white-light">
      <div className="bleed">
        {/* oversized section marker — a beat of pure scale before the content */}
        <div className="mega-row" ref={titleLayer}>
          <span className="mega-title is-outline">WHITE LIGHT</span>
        </div>

        <div className={`grid12 about-grid ${shown ? 'is-shown' : ''}`} ref={ref}>
          {/* section header */}
          <div className="about-header grid-span-12">
            <p className="t-label">01</p>
            <p className="t-body u-mute about-kicker">All colours, reconverged.</p>
          </div>

          {/* core statement — the sentence that carries the whole idea */}
          <div className="about-statement grid-span-7">
            <SplitText
              as="h3"
              className="t-h2 about-claim"
              text="我不是单一的颜色。"
              stagger={0.05}
            />
            <SplitText
              as="p"
              className="t-lead is-dim about-elaboration"
              text={profile.intro}
              stagger={0.012}
              delay={0.25}
            />
          </div>

          {/* content blocks — now driven by data/cv.js */}
          <div className="about-blocks grid-span-5" ref={blocksLayer}>
            {/* 求职意向 / 简介 */}
            <div className="glass about-placeholder">
              <span className="t-label">INTRODUCTION</span>
              <p className="t-small about-name">{profile.name} · {profile.title}</p>
              <p className="t-small u-dim cv-line">求职意向：{profile.objective}</p>
            </div>

            {/* 教育背景 */}
            <div className="glass about-placeholder">
              <span className="t-label">EDUCATION</span>
              {education.map((e) => (
                <div className="cv-block" key={e.school}>
                  <p className="t-small cv-line">
                    <span className="cv-k">{e.school}</span> · {e.degree}
                  </p>
                  <p className="t-micro u-dim cv-meta">{e.period}</p>
                  <p className="t-small u-dim cv-line">{e.note}</p>
                </div>
              ))}
            </div>

            {/* 技能 / 光谱 */}
            <div className="glass about-placeholder">
              <span className="t-label">SKILLS / SPECTRUM</span>
              {skills.map((s) => (
                <p className="t-small u-dim cv-line" key={s.group}>
                  <span className="cv-k">{s.group}：</span>
                  {s.items.join('、')}
                </p>
              ))}
            </div>

            {/* 联系方式 */}
            <div className="glass about-placeholder">
              <span className="t-label">CONTACT</span>
              <p className="t-small u-dim cv-line">邮箱：{contact.email}</p>
              <p className="t-small u-dim cv-line">电话：{contact.phone}</p>
              <p className="t-small u-dim cv-line">城市：{contact.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
