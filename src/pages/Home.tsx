import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal, { prefersReducedMotion } from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import Scene3D, { introScene, playScene, staticScene } from '../components/Scene3D'
import Fmt, { fmtAccent } from '../components/Fmt'
import ScrubText from '../components/ScrubText'
import {
  splitList,
  useContent,
  fallbackProjects,
  fallbackServices,
  fallbackTestimonials,
  telHref,
  useList,
  useSettings,
  type Project,
  type Service,
  type Testimonial,
} from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2000)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span key={i} className="animate-word-in inline-block font-display text-primary">
      {words[i]}
    </span>
  )
}

function StatCard({
  value,
  suffix,
  label,
  bg,
  tilt,
}: {
  value: number
  suffix: string
  label: string
  bg: string
  tilt: number
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.textContent = `${value}${suffix}`
      return
    }
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: 'power2.out',
      snap: { v: 1 },
      onUpdate: () => {
        el.textContent = `${obj.v}${suffix}`
      },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, suffix])
  return (
    <div
      className={`${bg} w-full rounded-2xl p-3.5 text-ink sm:p-5 shadow-xl shadow-black/20 transition-transform duration-500 hover:rotate-0 hover:scale-105 sm:w-[150px] md:w-[170px]`}
      style={{ rotate: `${tilt}deg` }}
    >
      <p ref={ref} className="font-display text-3xl sm:text-4xl md:text-5xl">
        0{suffix}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-ink/70 sm:text-xs">{label}</p>
    </div>
  )
}

/* Content comes from Firestore (editable at /admin); these style cycles keep the poster look. */
const serviceStyles = [
  { bg: 'bg-ink', dark: true, tilt: -2 },
  { bg: 'bg-primary', dark: false, tilt: 1.5 },
  { bg: 'bg-sun', dark: false, tilt: -1 },
]

const projectSpans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']

const testimonialStyles = [
  { bg: 'bg-white', tilt: -1 },
  { bg: 'bg-sun', tilt: 1.5 },
  { bg: 'bg-white', tilt: -1.5 },
  { bg: 'bg-primary', tilt: 1 },
]

function TestimonialMarquee({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    tweenRef.current = gsap.to(track.current, { xPercent: -50, duration: 45, ease: 'none', repeat: -1 })
    return () => {
      tweenRef.current?.kill()
    }
  }, [])

  const slow = () => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 0.15, duration: 0.5 })
  const resume = () => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 })

  return (
    <div className="overflow-hidden" onMouseEnter={slow} onMouseLeave={resume}>
      <div ref={track} className="flex w-max gap-7 py-6 pr-7 will-change-transform">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-7">
            {items.map((t, i) => (
              <figure
                key={`${half}-${t.id ?? t.name}`}
                className={`${testimonialStyles[i % testimonialStyles.length].bg} flex w-[320px] flex-col rounded-3xl p-7 text-ink shadow-lg transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] md:w-[400px] md:p-8`}
                style={{ rotate: `${testimonialStyles[i % testimonialStyles.length].tilt}deg` }}
              >
                <span className="font-display text-5xl leading-none text-ink/20">❝</span>
                <blockquote className="mt-3 line-clamp-6 break-words font-medium leading-relaxed text-ink/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink font-display text-white">
                    {t.name.split(' ')[1]?.[0] ?? t.name[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words font-display text-lg uppercase leading-none">{t.name}</p>
                    <p className="mt-1 break-words text-xs font-bold uppercase tracking-wide text-ink/50">{t.place}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Desktop: the section pins and the projects slide past sideways, each photo drifting inside its frame.
   Phones keep the stacked grid (see Home). */
function ProjectRail({ projects, title }: { projects: Project[]; title: string }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const t = track.current!
      const dist = () => t.scrollWidth - innerWidth
      const slide = gsap.to(t, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
      t.querySelectorAll('.rail-img').forEach((img) =>
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        }),
      )
      gsap.fromTo(t.querySelectorAll('.rail-card'), { rotate: 3, y: 40 }, {
        rotate: 0,
        y: 0,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'top top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [projects.length])

  return (
    <section ref={section} className="relative hidden h-svh overflow-hidden bg-mist text-ink lg:block">
      <div ref={track} className="relative flex h-full w-max items-center gap-10 pl-[max(2.5rem,calc((100vw-1300px)/2+2.5rem))] pr-[10vw] motion-reduce:w-full motion-reduce:overflow-x-auto">
        <div className="w-[34vw] max-w-[520px] shrink-0">
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
            <span className="h-px w-10 bg-primary" />
            Our work
          </p>
          <h2 className="font-display text-[clamp(3rem,6vw,6.5rem)] uppercase leading-[0.9] tracking-tight">
            <Fmt text={title} />
          </h2>
          <p className="mt-6 flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-ink/50">
            Keep scrolling
            <svg width="40" height="12" viewBox="0 0 40 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M0 6h38m-5-5 5 5-5 5" /></svg>
          </p>
        </div>

        {projects.map((p, i) => (
          <Link
            key={p.id ?? p.title}
            to={p.id ? `/projects/${p.id}` : '/projects'}
            data-cursor="View"
            className={`rail-card group relative block h-[64vh] shrink-0 overflow-hidden rounded-[2rem] shadow-2xl ${i % 2 ? 'mt-[10vh] w-[38vw]' : '-mt-[6vh] w-[50vw]'}`}
          >
            <img src={p.img} alt={p.title} className="rail-img absolute inset-y-0 -left-[10%] h-full w-[120%] max-w-none object-cover transition-[filter] duration-700 group-hover:saturate-150" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
            <span className="absolute left-6 top-6 rotate-[-3deg] rounded-full bg-sun px-4 py-1.5 text-xs font-bold uppercase text-ink shadow-md transition-transform duration-300 group-hover:rotate-0">
              {p.category}
            </span>
            <span className="pointer-events-none absolute right-6 top-2 font-display text-[7rem] leading-none text-white/15 transition-colors duration-500 group-hover:text-primary/50">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 text-white">
              <div>
                <h3 className="font-display text-4xl uppercase leading-none transition-transform duration-500 group-hover:-translate-y-1">{p.title}</h3>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white/60">
                  {[p.location, p.year].filter(Boolean).join(' · ') || p.desc}
                </p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
              </span>
            </div>
          </Link>
        ))}

        <Link
          to="/projects"
          className="group grid h-[42vh] w-[26vw] shrink-0 rotate-[2deg] place-items-center rounded-[2rem] bg-ink p-8 text-center text-white shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-[1.03]"
        >
          <span className="font-display text-[clamp(2.5rem,4vw,4.5rem)] uppercase leading-[0.9]">
            View all
            <br />
            <span className="text-primary">projects ↗</span>
          </span>
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const c = useContent()
  const settings = useSettings()
  const services: Service[] = useList('services', fallbackServices).slice(0, 3)
  const allProjects: Project[] = useList('projects', fallbackProjects)
  const flagged = allProjects.filter((p) => p.featured)
  const featuredProjects = (flagged.length ? flagged : allProjects).slice(0, 4)
  const testimonials: Testimonial[] = useList('testimonials', fallbackTestimonials)

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const q = gsap.utils.selector(hero)
    if (prefersReducedMotion()) {
      staticScene(q('.p3-scene')[0] as HTMLElement) // show only the finished house
      return
    }
    // Everything below animates transform/opacity only, so it stays on the GPU at 60fps.
    // Each element gets one job (intro, scroll, or mouse) via nested wrappers so tweens never fight.
    const mm = gsap.matchMedia(hero) // scoped: class selectors resolve inside the hero
    const ctx = gsap.context(() => {
      // 1 · intro: a seam of light splits the shutter, the house settles in, type rises, cards slap on
      gsap.set(q('.hero-shutter, .hero-seam'), { autoAlpha: 1 })
      const intro = gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(q('.hero-seam'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' })
        .to(q('.hero-shutter-top'), { yPercent: -100, duration: 1.4, ease: 'expo.inOut' })
        .to(q('.hero-shutter-bot'), { yPercent: 100, duration: 1.4, ease: 'expo.inOut' }, '<')
        .to(q('.hero-seam'), { autoAlpha: 0, duration: 0.4 }, '<0.25')
        .fromTo(q('.hero-img'), { scale: 1.35 }, { scale: 1.08, duration: 2.6 }, '<')
        .fromTo(q('.hero-word'), { yPercent: 140, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.09 }, 1.1)
        .fromTo(q('.blur-in'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, '<0.45')
        .fromTo(
          q('.hero-card'),
          { autoAlpha: 0, y: 140, scale: 0.55, rotate: (i: number) => [-28, 20, -16][i % 3] },
          { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 1, stagger: 0.12, ease: 'back.out(1.7)' },
          '<0.15',
        )
        .fromTo(q('.hero-call'), { autoAlpha: 0, xPercent: 60 }, { autoAlpha: 1, xPercent: 0, duration: 1.1 }, '<0.2')
      // the 3D blueprint house appears with a laser scan while the type lands
      const scene = q('.p3-scene')[0] as HTMLElement
      introScene(intro, scene, 1.0)

      // 2 · idle life: the photo breathes slowly once the intro has landed
      gsap.to(q('.hero-img'), { scale: 1.16, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: intro.duration() })

      // 3 · scroll: the house builds itself, plot → handover ("watch your home rise")
      mm.add('(min-width: 1024px)', () =>
        // desktop: the whole landing screen pins; the copy steps aside and the camera takes over
        playScene(
          scene,
          { trigger: hero, start: 'top top', end: '+=500%', pin: true, scrub: 0.8 },
          {
            sxv: 0.2,
            onStart: (tl) =>
              tl
                .to(q('.hero-content, .hero-call'), { autoAlpha: 0, x: -80, duration: 0.6, ease: 'power2.in' }, 's0')
                .to(q('.hero-depth-bg'), { opacity: 0.35, duration: 0.6, ease: 'none' }, 's0'),
          },
        ),
      )
      mm.add('(max-width: 1023px)', () =>
        // phone: the 3D stage sits under the copy and pins itself for the build
        // pinSpacing must be explicit: the hero is a flex column, where ScrollTrigger defaults it off
        playScene(scene, { trigger: scene, start: 'top top', end: '+=400%', pin: true, pinSpacing: true, scrub: 0.6 }),
      )
    }, hero)

    // 4 · depth on desktop: photo, headline and cards drift at different depths with the pointer
    let onMove: ((e: PointerEvent) => void) | undefined
    if (matchMedia('(pointer: fine)').matches) {
      const layers = (
        [
          ['.hero-depth-bg', -16],
          ['.hero-depth-text', 8],
          ['.hero-cards', 22],
        ] as const
      ).map(([sel, amt]) => ({
        x: gsap.quickTo(q(sel), 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(q(sel), 'y', { duration: 1.2, ease: 'power3' }),
        amt,
      }))
      // cursor spotlight: a soft light that lights up the blueprint grid wherever you point
      gsap.set(q('.hero-spot'), { xPercent: -50, yPercent: -50 })
      const spotX = gsap.quickTo(q('.hero-spot'), 'x', { duration: 0.6, ease: 'power3' })
      const spotY = gsap.quickTo(q('.hero-spot'), 'y', { duration: 0.6, ease: 'power3' })
      onMove = (e) => {
        const r = hero.getBoundingClientRect()
        spotX(e.clientX - r.left)
        spotY(e.clientY - r.top)
        const nx = e.clientX / innerWidth - 0.5
        const ny = e.clientY / innerHeight - 0.5
        for (const l of layers) {
          l.x(nx * l.amt * 2)
          l.y(ny * l.amt * 2)
        }
      }
      hero.addEventListener('pointermove', onMove)
    }
    return () => {
      if (onMove) hero.removeEventListener('pointermove', onMove)
      mm.revert()
      ctx.revert()
    }
  }, [])

  return (
    <main>
      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-[#071a2e] text-white">
        {/* media: scroll layer › mouse-depth layer › image (intro zoom + breathing) */}
        <div className="hero-media absolute inset-0 will-change-transform">
          <div className="hero-depth-bg absolute -inset-10">
            <img
              src="/images/home-hero.webp"
              alt=""
              {...{ fetchpriority: 'high' }} /* React 18 only knows the lowercase attribute */
              className="hero-img h-full w-full object-cover opacity-60 will-change-transform"
            />
          </div>
        </div>
        {/* cinematic fade: solid behind the type on the left, the house shows through on the right */}
        {/* blueprint poster: navy wash over the photo, drafting grid, giant outlined DNA */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071a2e] via-[#071a2e]/85 to-[#071a2e]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2e] via-transparent to-[#071a2e]/60" />
        <div className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_68%_45%,black_15%,transparent_72%)]" />
        <div className="hero-spot pointer-events-none absolute left-0 top-0 hidden h-[640px] w-[640px] rounded-full text-primary opacity-25 orb lg:block" />
        <span
          aria-hidden
          className="hero-dna pointer-events-none absolute -bottom-[5vw] -right-[3vw] select-none font-display text-[38vw] leading-[0.8] text-transparent [-webkit-text-stroke:2px_rgba(143,227,255,0.10)]"
        >
          DNA
        </span>
        <div className="hero-orb pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full text-primary opacity-40 orb" />
        <div className="hero-orb pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full text-sun opacity-30 orb" />
        <div className="hero-orb pointer-events-none absolute bottom-0 right-1/3 h-80 w-80 rounded-full text-[#F4845F] opacity-20 orb" />
        <div className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.35]" />

        {/* intro shutter: hidden unless the intro runs (reduced motion never sees it) */}
        <div className="hero-shutter hero-shutter-top invisible absolute inset-x-0 top-0 z-[15] h-1/2 bg-[#071a2e]" />
        <div className="hero-shutter hero-shutter-bot invisible absolute inset-x-0 bottom-0 z-[15] h-1/2 bg-[#071a2e]" />
        <div className="hero-seam invisible absolute inset-x-0 top-1/2 z-[16] h-[2px] origin-left bg-primary shadow-[0_0_24px_4px_rgba(76,201,240,0.6)]" />

        <div className="hero-content relative z-20 mx-auto w-full max-w-[1300px] px-5 pb-16 pt-28 md:px-10 md:pb-20 md:pt-32">
          <p className="blur-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {c.heroBadge}
          </p>

          <div className="hero-depth-text">
          <h1 className="font-display text-[clamp(3.2rem,min(15vw,16svh),11rem)] uppercase leading-[0.88] tracking-tight">
            {c.heroTitle.split('\n').map((line, i, arr) => (
              <span key={i}>
                <span className="inline-block overflow-hidden align-top">
                  <span className="hero-word inline-block will-change-transform">{fmtAccent(line)}</span>
                </span>
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
          </div>

          <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <p className="blur-in text-lg font-semibold text-white/90">
                {c.taglinePrefix} <RotatingWord words={splitList(c.rotatingWords)} /> {c.taglineSuffix}
              </p>
              <p className="blur-in mt-3 leading-relaxed text-white/60">{c.heroDesc}</p>
              <div className="blur-in mt-7 flex flex-wrap gap-4">
                <Magnetic>
                  <Link
                    to="/projects"
                    className="shine group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    See our work
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:border-primary hover:text-primary active:scale-95"
                  >
                    Reach out
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* cards: mouse-depth container › scroll parallax › intro slap › the card itself (hover) */}
            <div className="hero-cards grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-4 md:gap-5">
              {[
                { value: settings.statProjects, suffix: '+', label: 'Projects Done', bg: 'bg-primary', tilt: -3 },
                { value: settings.statYears, suffix: '+', label: 'Years Experience', bg: 'bg-white', tilt: 2 },
                { value: settings.statClients, suffix: '%', label: 'Happy Clients', bg: 'bg-sun', tilt: -2 },
              ].map((st) => (
                <div key={st.label} className="hero-card-p">
                  <div className="hero-card">
                    <StatCard {...st} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* the 3D house: full-bleed behind the copy on desktop, its own pinned screen under it on phones */}
        <Scene3D className="relative h-svh lg:absolute lg:inset-0 lg:z-[12] lg:h-auto" />

        <a
          href={telHref(settings.phone1)}
          className="hero-call group absolute bottom-6 right-5 z-20 hidden items-center gap-2 font-display text-[clamp(1.4rem,3.5vw,3rem)] uppercase leading-none text-white/90 transition-colors duration-300 hover:text-primary lg:flex"
        >
          Call us
          <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>

        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <div className="flex h-10 w-[26px] justify-center rounded-full border-2 border-white/20 pt-2">
            <span className="animate-wheel h-2 w-[3px] rounded-full bg-primary" />
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO — the about copy reads itself as you scroll ============ */}
      <section className="relative overflow-hidden bg-white py-28 text-ink md:py-40">
        <span aria-hidden className="pointer-events-none absolute -left-[2vw] top-6 select-none whitespace-nowrap font-display text-[22vw] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(17,17,17,0.06)]">
          SINCE 2022
        </span>
        <div className="relative mx-auto max-w-[1300px] px-5 md:px-10">
          <p className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
            <span className="h-px w-10 bg-primary" />
            Who we are
          </p>
          <ScrubText
            text={c.aboutText}
            className="max-w-6xl text-[clamp(1.7rem,4.2vw,3.6rem)] font-semibold leading-[1.15] tracking-tight"
          />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="bg-mist py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid items-stretch gap-12 lg:grid-cols-2">
            <Reveal stagger={0.1} className="flex flex-col justify-center">
              <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
                <span className="h-px w-10 bg-primary" />
                About us
              </p>
              <h2 className="font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[0.92] tracking-tight">
                <Fmt text={c.aboutTitle} />
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                {splitList(c.aboutChips).map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border-2 border-ink/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary-dark"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} clip>
              <div className="group relative h-full min-h-[420px] overflow-hidden rounded-[2rem] shadow-2xl md:min-h-[520px]">
                <img
                  src="/images/team.jpg"
                  alt="The DNA Constructions team"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/50 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-md backdrop-blur-md">
                  {c.aboutBadgeTeam}
                </span>
                <span className="absolute bottom-5 right-5 rotate-[-2deg] rounded-2xl bg-sun px-5 py-3 font-display text-xl uppercase text-ink shadow-xl transition-transform duration-500 group-hover:rotate-0">
                  {c.aboutBadgeSince}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {[
                { n: '01', h: c.visionTitle, p: c.visionText, bg: 'bg-ink', dark: true, tilt: -1.5 },
                { n: '02', h: c.missionTitle, p: c.missionText, bg: 'bg-primary', dark: false, tilt: 1.5 },
                { n: '03', h: c.goalsTitle, p: c.goalsText, bg: 'bg-sun', dark: false, tilt: -1 },
              ].map((item, i) => (
              <Reveal key={item.h} delay={(i % 3) * 0.1} stackTop={96 + i * 10}>
                <div
                  className={`${item.bg} ${item.dark ? 'text-white' : 'text-ink'} rounded-3xl p-7 shadow-lg transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] md:p-8`}
                  style={{ rotate: `${item.tilt}deg` }}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl uppercase tracking-wide">{item.h}</h3>
                    <span className={`font-display text-lg ${item.dark ? 'text-white/25' : 'text-ink/25'}`}>{item.n}</span>
                  </div>
                  <p className={`mt-3 font-medium leading-relaxed ${item.dark ? 'text-white/70' : 'text-ink/75'}`}>{item.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="bg-white py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal stagger={0.1} className="mb-14">
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
              <span className="h-px w-10 bg-primary" />
              What we offer
            </p>
            <h2 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-tight">
              <Fmt text={c.servicesTitle} />
            </h2>
          </Reveal>

          <div className="grid gap-7 lg:grid-cols-3">
            {services.map((s, i) => {
              const st = serviceStyles[i % serviceStyles.length]
              return (
              <Reveal key={s.id ?? s.title} delay={i * 0.1} stackTop={96 + i * 10}>
                <div
                  className={`${st.bg} ${st.dark ? 'text-white' : 'text-ink'} group flex h-full flex-col rounded-3xl p-8 shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-2xl`}
                  style={{ rotate: `${st.tilt}deg` }}
                >
                  <h3 className="font-display text-3xl uppercase leading-none">{s.title}</h3>
                  <p className={`mt-4 flex-1 font-medium leading-relaxed ${st.dark ? 'text-white/70' : 'text-ink/75'}`}>{s.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.tags.split(',').map((raw) => raw.trim()).filter(Boolean).map((t) => (
                      <span
                        key={t}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                          st.dark ? 'bg-white/10 text-white/85' : 'bg-ink/10 text-ink/80'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/what-we-offer"
                    className={`mt-7 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 group-hover:gap-3 ${
                      st.dark ? 'bg-primary text-ink' : 'bg-ink text-white'
                    }`}
                  >
                    Learn more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            )})}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <ProjectRail projects={featuredProjects} title={c.projectsTitle} />
      <section className="bg-mist py-24 text-ink md:py-32 lg:hidden">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
                <span className="h-px w-10 bg-primary" />
                Our work
              </p>
              <h2 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-tight">
                <Fmt text={c.projectsTitle} />
              </h2>
            </div>
            <Magnetic>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-105"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </Link>
            </Magnetic>
          </Reveal>

          <div className="grid gap-7 lg:grid-cols-12">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.id ?? p.title} delay={(i % 2) * 0.1} className={projectSpans[i % projectSpans.length]} stackTop={96 + (i % 4) * 10}>
                <Link
                  to={p.id ? `/projects/${p.id}` : '/projects'}
                  data-cursor="View"
                  className="group relative block h-[300px] overflow-hidden rounded-[2rem] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[420px]"
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/95" />

                  <span className="absolute left-5 top-5 rotate-[-3deg] rounded-full bg-sun px-4 py-1.5 text-xs font-bold uppercase text-ink shadow-md transition-transform duration-300 group-hover:rotate-0">
                    {p.category}
                  </span>

                  <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>

                  <span className="pointer-events-none absolute -bottom-2 right-4 font-display text-7xl leading-none text-white/10 transition-colors duration-500 group-hover:text-primary/30 md:text-8xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                    <h3 className="font-display text-2xl uppercase leading-none transition-transform duration-500 group-hover:-translate-y-1 md:text-3xl">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="overflow-hidden bg-white py-24 text-ink md:py-32">
        <div className="mx-auto mb-4 max-w-[1300px] px-5 md:px-10">
          <Reveal stagger={0.1}>
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
              <span className="h-px w-10 bg-primary" />
              Testimonials
            </p>
            <h2 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-tight">
              <Fmt text={c.testimonialsTitle} />
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <TestimonialMarquee items={testimonials} />
        </Reveal>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden bg-ink py-28 text-white md:py-36">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full text-primary opacity-20 orb" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full text-sun opacity-10 orb" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.35]" />

        <div className="relative mx-auto max-w-[1300px] px-5 text-center md:px-10">
          <Reveal stagger={0.12}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{c.ctaEyebrow}</p>
            <Link
              to="/contact"
              className="group mt-6 block font-display text-[clamp(2.8rem,9vw,8rem)] uppercase leading-[0.95] tracking-tight transition-colors duration-300 hover:text-primary"
            >
              <Fmt text={c.ctaTitle} />
              <svg
                width="0.7em"
                height="0.7em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-3 inline-block align-baseline transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </Link>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <a
                href={telHref(settings.phone1)}
                className="rotate-[-2deg] rounded-2xl bg-sun px-7 py-4 font-display text-lg uppercase text-ink shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105"
              >
                {settings.phone1}
              </a>
              <a
                href={`mailto:${settings.email1}`}
                className="rotate-[2deg] rounded-2xl bg-primary px-7 py-4 font-display text-lg uppercase text-ink shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105"
              >
                Email us
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
