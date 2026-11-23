import { useEffect, useRef } from 'react'
import Header from './components/Header.js'
import Hero from './components/Hero.js'
import Marquee from './components/Marquee.js'
import About from './components/About.js'
import Capabilities from './components/Capabilities.js'
import Workshop from './components/Workshop.js'
import Contact from './components/Contact.js'
import { Logo } from './components/Primitives.js'

export default function App() {
  const glow = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const move = (e) => glow.current && (glow.current.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`)
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <>
      <div className="cursor-glow" ref={glow} aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Capabilities />
        <Workshop />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container footer-in">
          <div className="brand"><Logo size={30} /><span><b>DHARMESH</b> ENGINEERING</span></div>
          <p>Antaliya GIDC, Bilimora, Gujarat, India · Established 2004</p>
          <p>© 2026 Dharmesh Engineering. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
