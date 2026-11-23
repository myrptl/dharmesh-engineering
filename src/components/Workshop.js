import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { CNC_MACHINES, CONVENTIONAL_EQUIPMENT, QUALITY } from '../constants.js'
import { SectionHead, Reveal } from './Primitives.js'

function Showcase() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 0.88, 1])
  const radius = useTransform(scrollYProgress, [0, 0.5], [48, 24])
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', reduce ? '-6%' : '6%'])
  return (
    <motion.div className="showcase" ref={ref} style={{ scale, borderRadius: radius }}>
      <motion.img src="images/cover.jpg" alt="Brass and stainless-steel machined components" loading="lazy" style={{ y: imgY }} />
      <div className="showcase-cap">
        <b>Made to drawing</b>
        <span>Brass fittings, hose tails, adaptors and stainless components.</span>
      </div>
    </motion.div>
  )
}

export default function Workshop() {
  return (
    <section id="workshop" className="section workshop">
      <div className="container">
        <Showcase />

        <SectionHead eyebrow="The workshop" title="Where conventional skill meets CNC." accent={[3, 4]}>
          Our workshop combines CNC turning equipment with conventional machines to support custom components and repeat production.
        </SectionHead>

        <div className="machines">
          <Reveal className="mcol">
            <h3 className="mini-title">CNC turning machines</h3>
            {CNC_MACHINES.map((machine, i) => (
              <motion.div key={machine.name} className="machine" whileHover={{ x: 6 }}>
                <span className="m-no">CNC {i + 1}</span>
                <b>{machine.name}</b>
                <i className="bar"><em style={{ '--w': machine.capacity + '%' }} /></i>
              </motion.div>
            ))}
          </Reveal>
          <Reveal className="mcol" delay={0.12}>
            <h3 className="mini-title">Conventional equipment</h3>
            {CONVENTIONAL_EQUIPMENT.map(({ quantity, name }) => (
              <motion.div key={name} className="machine conv" whileHover={{ x: 6 }}>
                <span className="m-num">{quantity}</span>
                <b>{name}</b>
              </motion.div>
            ))}
          </Reveal>
        </div>

        <div className="quality">
          <Reveal className="quality-title">
            <h3 className="h3">Inspection &amp; quality practices</h3>
            <p>Dimensional requirements and acceptance criteria are confirmed against your drawing or specification before production.</p>
          </Reveal>
          <ul>
            {QUALITY.map((q, i) => (
              <Reveal as="li" key={q} delay={i * 0.1} y={20}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {q}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
