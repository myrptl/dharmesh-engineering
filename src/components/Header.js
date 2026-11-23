import { useEffect, useState } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { NAV } from '../constants.js'
import { Logo } from './Primitives.js'

export default function Header() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      el && obs.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={'header ' + (scrolled ? 'scrolled' : '')}>
      <div className="container header-in">
        <a href="#home" className="brand" onClick={(e) => go(e, 'home')}>
          <Logo />
          <span>
            <b>DHARMESH</b> ENGINEERING
            <small>Precision turned components · Since 2004</small>
          </span>
        </a>

        <nav className="nav" aria-label="Main navigation">
          {NAV.map((n) => (
            <a key={n.id} href={'#' + n.id} onClick={(e) => go(e, n.id)} className={active === n.id ? 'on' : ''}>
              {active === n.id && <motion.i layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{n.label}</span>
            </a>
          ))}
        </nav>

        <a href="#contact" className="header-cta" onClick={(e) => go(e, 'contact')}>
          Get a Quote
        </a>

        <button className={'burger ' + (open ? 'open' : '')} onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <i /><i />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {NAV.map((n, i) => (
              <motion.a key={n.id} href={'#' + n.id} onClick={(e) => go(e, n.id)} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                {n.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
    </header>
  )
}
