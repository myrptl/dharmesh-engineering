import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate, useReducedMotion } from 'framer-motion'

export function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <path d="M32 6l21.5 12.4v24.8L32 56 10.5 43.2V18.4z" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="32" cy="31" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="31" r="3" fill="currentColor" />
    </svg>
  )
}

/** Splits text into words that slide up out of a mask */
export function RevealWords({ text, className, delay = 0, as: Tag = 'h2', accent = [] }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="word-mask" key={i} aria-hidden="true">
          <motion.span
            className={'word ' + (accent.includes(i) ? 'accent' : '')}
            initial={reduce ? false : { y: '115%', rotate: 4 }}
            animate={inView || reduce ? { y: 0, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: delay + i * 0.07, ease: [0.2, 0.7, 0.1, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Reveal({ children, delay = 0, y = 36, className, as = 'div', ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.1, 1] }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function CountUp({ to, suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, duration])
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

export function SectionHead({ eyebrow, title, accent, children }) {
  return (
    <div className="section-head">
      <Reveal className="eyebrow" y={12}>
        <span className="eyebrow-line" /> {eyebrow}
      </Reveal>
      <RevealWords text={title} accent={accent} className="h2" />
      {children && (
        <Reveal as="p" className="lead" delay={0.2}>
          {children}
        </Reveal>
      )}
    </div>
  )
}

/** Button that gently follows the cursor */
export function Magnetic({ children, className = '', href, onClick, type, ...rest }) {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const leave = () => ref.current && (ref.current.style.transform = '')
  const Tag = href ? 'a' : 'button'
  return (
    <Tag ref={ref} className={'btn ' + className} href={href} onClick={onClick} type={type} onMouseMove={move} onMouseLeave={leave} {...rest}>
      <span>{children}</span>
    </Tag>
  )
}

/** Card that tilts toward the pointer and shows a brass glow */
export function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * 7}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return (
    <div ref={ref} className={'tilt ' + className} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  )
}
