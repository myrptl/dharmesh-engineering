import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { STATS, TIMELINE } from '../constants.js'
import { SectionHead, Reveal, CountUp, RevealWords } from './Primitives.js'

function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  return (
    <div className="timeline" ref={ref}>
      <div className="tl-rail"><motion.i style={{ scaleY: scrollYProgress }} /></div>
      {TIMELINE.map((t, i) => (
        <Reveal key={t.year} className={'tl-item ' + (i % 2 ? 'right' : '')} y={44}>
          <span className="tl-dot" />
          <div className="tl-year">{t.year}</div>
          <div className="tl-card">
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <SectionHead eyebrow="Our story" title="Built on experience. Growing through technology." accent={[4, 5]}>
          Dharmesh Engineering is a family-run manufacturing business in Gujarat, grown through practical machining experience, customer relationships and continued investment in CNC technology.
        </SectionHead>

        <Timeline />

        <div className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="stat">
              <strong>{s.raw ? <CountUp to={s.n} duration={1.6} /> : <CountUp to={s.n} />}</strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="people">
          <div className="people-art" aria-hidden="true">
            <svg viewBox="0 0 120 120"><g fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="60" cy="60" r="52" /><circle cx="60" cy="60" r="36" strokeDasharray="3 4" /><polygon points="60,28 88,44 88,76 60,92 32,76 32,44" /></g></svg>
            <b>12</b>
          </div>
          <div>
            <RevealWords as="h3" className="h3" text="Based in Antaliya GIDC, Bilimora." />
            <Reveal as="p" delay={0.2}>
              Our team of 12 people supports our manufacturing activities. We also train local workers in conventional machining and drilling, contributing to the development of practical workshop skills.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
