/**
 * PRISM — CONTACT / ENDING SECTION
 * 04 / REFRACTION CONTINUES — Visual closure.
 * All spectrums reconverge, back to the source.
 */

import React from 'react'
import { useReveal } from '../core/hooks'
import { SplitText } from '../core/motion'
import { SITE } from '../data/structure'
import { CV } from '../data/cv'

export default function ContactSection() {
  const ref = React.useRef(null)
  const shown = useReveal(ref, { threshold: 0.2 })
  const { contact, profile } = CV

  return (
    <section className="section section-contact" data-section="refraction" id="refraction">
      <div className="bleed">
        <div className={`contact-wrap ${shown ? 'is-shown' : ''}`} ref={ref}>
          <div className="contact-header">
            <p className="t-label">04</p>
            <SplitText
              as="h2"
              className="t-h1 contact-title"
              text="REFRACTION CONTINUES"
              stagger={0.07}
            />
            <SplitText
              as="p"
              className="t-lead is-dim contact-kicker"
              text={profile.name + ' · ' + profile.title}
              stagger={0.03}
              delay={0.3}
            />
          </div>

          {/* contact — driven by data/cv.js */}
          <div className="contact-body grid12">
            <div className="glass-lg contact-block grid-span-6">
              <span className="t-label">Get in touch</span>
              <p className="t-small u-dim cv-line">邮箱：{contact.email}</p>
              <p className="t-small u-dim cv-line">电话：{contact.phone}</p>
              <p className="t-small u-dim cv-line">城市：{contact.location}</p>
              <p className="t-small u-dim cv-line">求职意向：{profile.objective}</p>
            </div>

            <div className="contact-closure grid-span-6">
              <p className="t-display" style={{ opacity: 0.5 }}>—</p>
              <p className="t-mono u-dim" style={{ marginTop: '1em' }}>
                {SITE.narrative}
              </p>
              {/* visual closure: the chain reversed */}
              <div className="contact-chain">
                {[...SITE.chain].reverse().map((word, i) => (
                  <React.Fragment key={word}>
                    <span className="t-pixel">{word}</span>
                    {i < SITE.chain.length - 1 && <span className="u-dim">←</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
