import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal, { prefersReducedMotion } from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import Fmt, { fmtAccent } from '../components/Fmt'
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
      className={`${bg} w-[150px] rounded-2xl p-5 text-ink shadow-xl shadow-black/20 transition-transform duration-500 hover:rotate-0 hover:scale-105 md:w-[170px]`}
      style={{ rotate: `${tilt}deg` }}
    >
      <p ref={ref} className="font-display text-4xl md:text-5xl">
        0{suffix}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/70">{label}</p>
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
                className={`${testimonialStyles[i % testimonialStyles.length].bg} w-[320px] rounded-3xl p-7 text-ink shadow-lg transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] md:w-[400px] md:p-8`}
                style={{ rotate: `${testimonialStyles[i % testimonialStyles.length].tilt}deg` }}
              >
                <span className="font-display text-5xl leading-none text-ink/20">❝</span>
                <blockquote className="mt-3 font-medium leading-relaxed text-ink/85">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-white">
                    {t.name.split(' ')[1]?.[0] ?? t.name[0]}
                  </span>
                  <div>
                    <p className="font-display text-lg uppercase leading-none">{t.name}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/50">{t.place}</p>
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
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .fromTo('.hero-word', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08, delay: 0.15 })
        .fromTo(
          '.blur-in',
          { autoAlpha: 0, y: 20, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power3.out' },
          '-=0.7',
        )
      gsap.to('.hero-bg', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-orb', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <main>
      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink text-white">
        <img
          src="/images/home-hero.svg"
          alt=""
          className="hero-bg absolute inset-0 h-[115%] w-full object-cover opacity-25 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
        <div className="hero-orb pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary opacity-25 blur-[100px]" />
        <div className="hero-orb pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-sun opacity-15 blur-[100px]" />
        <div className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.35] mix-blend-overlay" />

        <div className="relative z-20 mx-auto w-full max-w-[1300px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
          <p className="blur-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {c.heroBadge}
          </p>

          <h1 className="font-display text-[clamp(3.4rem,13vw,11.5rem)] uppercase leading-[0.88] tracking-tight">
            {c.heroTitle.split('\n').map((line, i, arr) => (
              <span key={i}>
                <span className="inline-block overflow-hidden align-top">
                  <span className="hero-word inline-block will-change-transform">{fmtAccent(line)}</span>
                </span>
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>

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

            <div className="blur-in flex flex-wrap gap-4 md:gap-5">
              <StatCard value={settings.statProjects} suffix="+" label="Projects Done" bg="bg-primary" tilt={-3} />
              <StatCard value={settings.statYears} suffix="+" label="Years Experience" bg="bg-white" tilt={2} />
              <StatCard value={settings.statClients} suffix="%" label="Happy Clients" bg="bg-sun" tilt={-2} />
            </div>
          </div>
        </div>

        <a
          href={telHref(settings.phone1)}
          className="blur-in group absolute bottom-6 right-5 z-20 hidden items-center gap-2 font-display text-[clamp(1.4rem,3.5vw,3rem)] uppercase leading-none text-white/90 transition-colors duration-300 hover:text-primary lg:flex"
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
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-2">{c.aboutText}</p>
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

            <Reveal delay={0.15}>
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
      <section className="bg-mist py-24 text-ink md:py-32">
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
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary opacity-20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sun opacity-10 blur-[100px]" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />

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
