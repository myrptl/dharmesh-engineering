import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SPARKS } from '../constants.js'
import { RevealWords, Magnetic } from './Primitives.js'

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const fadeUp = (d) => ({ initial: reduce ? false : { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.2, 0.7, 0.1, 1] } })

  return (
    <section id="home" className="hero" ref={ref}>
      <motion.div className="hero-bg" style={{ y: bgY }}>
        <img src="images/cnc-turning.jpg" alt="" />
      </motion.div>
      <div className="hero-shade" />
      <div className="grid-lines" aria-hidden="true" />

      <svg className="hero-nut" viewBox="0 0 200 200" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" />
          <polygon points="100,28 163,64 163,136 100,172 37,136 37,64" opacity=".5" />
          <circle cx="100" cy="100" r="46" />
          <circle cx="100" cy="100" r="40" strokeDasharray="2 3" opacity=".7" />
        </g>
      </svg>

      <div className="sparks" aria-hidden="true">
        {SPARKS.map((s, i) => (
          <i key={i} style={{ left: s.left + '%', width: s.size, height: s.size, animationDuration: s.dur + 's', animationDelay: s.delay + 's', '--drift': s.drift + 'px' }} />
        ))}
      </div>

      <motion.div className="container hero-in" style={{ y: textY, opacity: fade }}>
        <motion.div className="hero-tag" {...fadeUp(0.1)}>
          <span className="pulse" /> Established 2004 · Antaliya GIDC, Bilimora, Gujarat
        </motion.div>

        <h1 className="hero-title" aria-label="Brass components. Made to your drawings.">
          <RevealWords as="span" className="line" text="Brass components." delay={0.25} accent={[1]} />
          <RevealWords as="span" className="line" text="Made to your drawings." delay={0.55} />
        </h1>

        <motion.p className="hero-sub" {...fadeUp(1.0)}>
          From conventional lathes in 2004 to three CNC turning machines today, we make custom brass fittings and turned components to your drawings and specifications.
        </motion.p>

        <motion.div className="hero-actions" {...fadeUp(1.15)}>
          <Magnetic href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Discuss your requirement →
          </Magnetic>
          <Magnetic href="#about" className="btn-ghost" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Our story
          </Magnetic>
        </motion.div>

        <motion.ul className="hero-chips" {...fadeUp(1.3)}>
          <li><b>22</b> years of machining</li>
          <li><b>3</b> CNC turning machines</li>
          <li><b>12</b> person team</li>
        </motion.ul>
      </motion.div>

      <motion.div className="scroll-cue" style={{ opacity: fade }} aria-hidden="true">
        <span>Scroll</span><i />
      </motion.div>
    </section>
  )
}
