import { motion } from 'framer-motion'
import { CAP_CARDS, OPERATIONS, MATERIALS, THREADS } from '../constants.js'
import { SectionHead, Reveal, TiltCard } from './Primitives.js'

export default function Capabilities() {
  return (
    <section id="capabilities" className="section caps">
      <div className="container">
        <SectionHead eyebrow="Manufacturing capabilities" title="CNC turning and custom machining." accent={[0, 1]}>
          Custom-turned components and brass fittings to customer drawings. We work with brass, stainless steel, mild steel, aluminium and selected engineering plastics.
        </SectionHead>

        <div className="cards">
          {CAP_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12}>
              <TiltCard className="card">
                <div className="card-img"><img src={c.img} alt={c.alt} loading="lazy" /></div>
                <div className="card-body">
                  <span className="card-no">0{i + 1}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="ops">
          <Reveal as="h3" className="mini-title" y={16}>Machining operations</Reveal>
          <div className="ops-grid">
            {OPERATIONS.map((o, i) => (
              <motion.div key={o} className="op" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }} whileHover={{ y: -4 }}>
                <span>{String(i + 1).padStart(2, '0')}</span>{o}
              </motion.div>
            ))}
          </div>
          <Reveal className="spec" delay={0.1}>
            <b>Typical component size</b>
            Up to approximately 50 mm diameter and 200 mm length, subject to geometry, material and setup. Milling can be arranged through external partners when required.
          </Reveal>
        </div>

        <div className="duo">
          <Reveal className="panel">
            <h3 className="mini-title">Materials</h3>
            <div className="tags">{MATERIALS.map((m) => <span key={m} className="tag">{m}</span>)}</div>
            <p>Other material grades can be reviewed against the component specification.</p>
          </Reveal>
          <Reveal className="panel" delay={0.12}>
            <h3 className="mini-title">Thread standards</h3>
            <div className="tags">{THREADS.map((m) => <span key={m} className="tag">{m}</span>)}</div>
            <p>Other thread standards can be assessed against the drawing to confirm tooling and feasibility.</p>
          </Reveal>
        </div>

        <div className="moq">
          <Reveal className="moq-intro">
            <h3 className="mini-title">Typical minimum order quantities</h3>
            <p>Quantities vary by material and are reviewed for each component.</p>
          </Reveal>
          <Reveal className="moq-card" delay={0.1}><strong>500<small>pcs</small></strong><span>Brass components</span></Reveal>
          <Reveal className="moq-card steel" delay={0.2}><strong>200<small>pcs</small></strong><span>Stainless &amp; mild steel</span></Reveal>
        </div>
      </div>
    </section>
  )
}
