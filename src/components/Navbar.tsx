import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/what-we-offer', label: 'What we offer' },
  { to: '/projects', label: 'Projects' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm transition-colors ${
      isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
      <nav
        className={`flex w-full max-w-4xl items-center justify-between rounded-full border border-white/10 bg-ink/80 px-3 py-2 backdrop-blur-xl transition-shadow ${
          scrolled ? 'shadow-xl shadow-black/40' : ''
        }`}
      >
        <Link to="/" className="flex items-center gap-3 pl-1" onClick={() => setOpen(false)}>
          <span className="accent-gradient grid h-10 w-10 shrink-0 place-items-center rounded-full p-[2px] transition-transform hover:scale-110">
            <span className="grid h-full w-full place-items-center rounded-full bg-ink">
              <img src="/images/dna-logo.svg" alt="DNA Constructions logo" className="h-6 w-6" />
            </span>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-white">DNA Constructions</span>
            <span className="block text-[11px] text-white/50">&amp; Architects</span>
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
            className="accent-gradient rounded-full px-5 py-2 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            Contact us
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="absolute inset-x-4 top-[76px] flex flex-col gap-1 rounded-3xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="accent-gradient mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold text-ink"
          >
            Contact us
          </Link>
        </div>
      )}
    </header>
  )
}
