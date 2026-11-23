import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { telHref, useSettings } from '../lib/content'

const links = [
  { to: '/', label: 'Home' },
  { to: '/what-we-offer', label: 'What we offer' },
  { to: '/projects', label: 'Projects' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const s = useSettings()

  // lock page scroll behind the open menu
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setHidden(y > lastY.current && y > 320)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm transition-all duration-300 ${
      isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`

  return (
    <>
      {/* phones: full-screen poster menu — giant numbered links rise in one after another */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-ink px-6 pb-8 pt-28 text-white transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] md:hidden ${
          open ? '[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]' : 'pointer-events-none [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]'
        }`}
      >
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.3]" />
        <div className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full text-primary opacity-25 orb" />
        <nav className="relative flex flex-col">
          {[...links, { to: '/contact', label: 'Contact' }].map((l, i) => (
            <span key={l.to} className="overflow-hidden border-b border-white/10">
              <NavLink
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${200 + i * 70}ms` : '0ms' }}
                className={({ isActive }) =>
                  `flex items-baseline gap-4 py-3 font-display text-[clamp(2.6rem,13vw,4.5rem)] uppercase leading-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? 'translate-y-0' : 'translate-y-full'
                  } ${isActive ? 'text-primary' : 'text-white'}`
                }
              >
                <span className="font-body text-xs font-bold text-white/30">0{i + 1}</span>
                {l.label}
              </NavLink>
            </span>
          ))}
        </nav>
        <div
          className={`relative flex flex-col gap-1 text-sm font-semibold text-white/60 transition-opacity duration-500 ${open ? 'opacity-100 delay-500' : 'opacity-0'}`}
        >
          <a href={telHref(s.phone1)} className="font-display text-2xl uppercase text-sun">
            {s.phone1}
          </a>
          <a href={`mailto:${s.email1}`} className="break-all">
            {s.email1}
          </a>
        </div>
      </div>
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-500 ease-out md:pt-5 ${
        hidden && !open ? '-translate-y-28' : 'translate-y-0'
      }`}
    >
      <nav
        className={`animate-nav-in flex w-full max-w-4xl items-center justify-between rounded-full border border-white/10 bg-ink/90 px-3 py-2 transition-shadow duration-500 ${
          scrolled ? 'shadow-xl shadow-black/40' : ''
        }`}
      >
        <Link to="/" className="group flex items-center gap-3 pl-1" onClick={() => setOpen(false)}>
          <span className="accent-gradient grid h-10 w-10 shrink-0 place-items-center rounded-full p-[2px] transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-110">
            <span className="grid h-full w-full place-items-center rounded-full bg-ink">
              <img src="/images/dna-logo.svg" alt="DNA Constructions logo" className="h-6 w-6" />
            </span>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-white">DNA Constructions</span>
            <span className="block text-[11px] text-white/50 transition-colors duration-300 group-hover:text-primary">
              &amp; Architects
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <span className="mx-2 h-5 w-px bg-white/10" />
          <Link
            to="/contact"
            className="accent-gradient shine rounded-full px-5 py-2 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Contact us
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

    </header>
    </>
  )
}
