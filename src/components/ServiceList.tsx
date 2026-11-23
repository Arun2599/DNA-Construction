import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Service } from '../lib/content'

/* Services as a big numbered index: hover floods the row with its colour and floats a photo
   preview at the cursor (desktop); click / tap opens the row's details. Expanding is click-only
   on purpose — rows that grow on hover would shift under the cursor. */

const FILLS = ['bg-primary', 'bg-sun', 'bg-[#F4845F]', 'bg-[#6BBF7A]', 'bg-[#6EB5FF]']
// ponytail: services have no image field yet, so previews cycle the site's own photos
const IMGS = ['/images/we-offer.webp', '/images/home-sub.webp', '/images/project.webp', '/images/home-hero.webp', '/images/team.jpg']

export default function ServiceList({ services, more = false }: { services: Service[]; more?: boolean }) {
  const [open, setOpen] = useState(0)
  const [hover, setHover] = useState(-1)
  const wrap = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)

  // the photo trails the cursor inside the list
  useEffect(() => {
    const el = wrap.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    gsap.set(preview.current, { xPercent: -50, yPercent: -50 })
    const x = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' })
    const y = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' })
    const r = gsap.quickTo(preview.current, 'rotate', { duration: 0.8, ease: 'power3' })
    let lastX = 0
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      x(e.clientX - b.left)
      y(e.clientY - b.top)
      r(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6)) // tilts with the swipe direction
      lastX = e.clientX
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={wrap} className="relative border-t-2 border-ink" onMouseLeave={() => setHover(-1)}>
      {services.map((s, i) => {
        const on = open === i
        const lit = hover === i || on
        return (
          <div key={s.id ?? s.title} className="group relative border-b-2 border-ink" onMouseEnter={() => setHover(i)}>
            {/* colour flood */}
            <span
              aria-hidden
              className={`absolute inset-0 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${FILLS[i % FILLS.length]} ${
                lit ? 'scale-y-100' : 'scale-y-0'
              }`}
            />
            <button
              onClick={() => setOpen(on ? -1 : i)}
              aria-expanded={on}
              className="relative flex w-full items-center gap-4 px-1 py-6 text-left md:gap-10 md:px-6 md:py-9"
            >
              <span className="w-8 shrink-0 font-display text-sm text-ink/45 md:w-12 md:text-xl">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="flex-1 font-display text-[clamp(2rem,6.5vw,5.5rem)] uppercase leading-[0.9] tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-4">
                {s.title}
              </h3>
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-all duration-500 md:h-14 md:w-14 ${
                  on ? 'rotate-45 bg-ink text-white' : 'text-ink'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>

            {/* details: grid-rows 0fr→1fr animates to the content's real height */}
            <div
              className={`relative grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              onTransitionEnd={() => ScrollTrigger.refresh()}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-6 px-1 pb-8 pl-12 md:flex-row md:items-end md:justify-between md:px-6 md:pb-10 md:pl-[6.5rem]">
                  <p className="max-w-xl text-base font-medium leading-relaxed text-ink/80 md:text-lg">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 md:max-w-sm md:justify-end">
                    {s.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span key={t} className="rounded-full border-2 border-ink/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide">
                          {t}
                        </span>
                      ))}
                    {more && (
                      <Link
                        to="/what-we-offer"
                        className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-transform hover:scale-105"
                      >
                        Learn more ↗
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* cursor-following photo (desktop) */}
      {/* outer layer: GSAP moves it; inner layer: CSS pops it in — separate so the transforms don't clash */}
      <div ref={preview} aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block">
        <div
          className={`relative h-56 w-44 overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ease-out ${
            hover >= 0 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          {services.map((s, i) => (
            <img
              key={s.id ?? s.title}
              src={IMGS[i % IMGS.length]}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hover === i ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
