import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { prefersReducedMotion } from './Reveal'
import Fmt from './Fmt'
import { splitList, telHref, useContent, useSettings } from '../lib/content'

export default function Footer() {
  const c = useContent()
  const s = useSettings()
  const track = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    tweenRef.current = gsap.to(track.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    return () => {
      tweenRef.current?.kill()
    }
  }, [])

  const slow = () => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 0.15, duration: 0.6 })
  const resume = () => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 })

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.04]" />

      {/* GSAP marquee — slows down under the cursor */}
      <div className="relative border-b border-white/5 py-8 md:py-10" onMouseEnter={slow} onMouseLeave={resume}>
        <div ref={track} className="flex w-max items-center whitespace-nowrap will-change-transform">
          {[0, 1].map((half) => (
            <span key={half} className="flex items-center">
              {splitList(c.footerMarquee).map((word) => (
                <span key={word} className="flex items-center">
                  <span className="font-display text-4xl uppercase text-white/10 transition-colors duration-500 hover:text-primary/40 md:text-7xl">
                    {word}
                  </span>
                  <span className="mx-6 h-2.5 w-2.5 rounded-full bg-primary opacity-50 md:mx-8 md:h-3 md:w-3" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div>
          <div className="group flex items-center gap-3">
            <img
              src="/images/dna-logo.svg"
              alt="DNA Constructions logo"
              className="h-12 w-12 transition-transform duration-500 group-hover:rotate-[15deg]"
            />
            <div className="leading-tight">
              <p className="text-lg font-bold">DNA Constructions</p>
              <p className="text-sm text-white/50">&amp; Architects</p>
            </div>
          </div>
          <p className="mt-6 font-display text-3xl uppercase leading-none text-white/80">
            <Fmt text={c.footerTagline} />
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Quick links</h4>
          <nav className="flex flex-col gap-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/projects', label: 'Projects' },
              { to: '/what-we-offer', label: 'What we offer' },
              { to: '/contact', label: 'Contact us' },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="link-underline w-fit text-white/70 transition-colors hover:text-primary">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Contact</h4>
          <div className="flex flex-col gap-3 text-white/70">
            <a href={telHref(s.phone1)} className="link-underline w-fit transition-colors hover:text-primary">
              {s.phone1}
            </a>
            <a
              href={`mailto:${s.email1}`}
              className="link-underline w-fit break-all transition-colors hover:text-primary"
            >
              {s.email1}
            </a>
            <p>{s.address}</p>
            <div className="mt-2 flex gap-3">
              <a
                href={s.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a
                href={s.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 12s0-3.85-.49-5.69a2.98 2.98 0 0 0-2.1-2.11C18.57 3.7 12 3.7 12 3.7s-6.57 0-8.41.5a2.98 2.98 0 0 0-2.1 2.11C1 8.15 1 12 1 12s0 3.85.49 5.69a2.98 2.98 0 0 0 2.1 2.11c1.84.5 8.41.5 8.41.5s6.57 0 8.41-.5a2.98 2.98 0 0 0 2.1-2.11C23 15.85 23 12 23 12zM9.75 15.57V8.43L15.82 12l-6.07 3.57z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-white/40 md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} DNA Constructions &amp; Architects</p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            Open for new projects
          </p>
          <p>Crafted &amp; baked with ❤️</p>
        </div>
      </div>
    </footer>
  )
}
