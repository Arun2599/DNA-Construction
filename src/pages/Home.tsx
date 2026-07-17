import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal, { prefersReducedMotion } from '../components/Reveal'
import Magnetic from '../components/Magnetic'

gsap.registerPlugin(ScrollTrigger)

const rotatingWords = ['BLUEPRINTS', 'IDEAS', 'SPACES', 'DREAMS']

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % rotatingWords.length), 2000)
    return () => clearInterval(id)
  }, [])
  return (
    <span key={i} className="animate-word-in inline-block font-display text-primary">
      {rotatingWords[i]}
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

const services = [
  {
    title: 'Construction',
    desc: 'End-to-end construction from planning to completion — highest quality builds, on time and within budget.',
    tags: ['Quality Assurance', 'On-Time Delivery', 'Budget Control'],
    bg: 'bg-primary',
    tilt: -2,
  },
  {
    title: '3D & 2D Drawings',
    desc: 'Detailed architectural drawings that let you walk through your project before a single brick is laid.',
    tags: ['3D Visualization', 'Floor Plans', 'Accurate Measurements'],
    bg: 'bg-sun',
    tilt: 1.5,
  },
  {
    title: 'Interior Design',
    desc: 'Stunning, functional interiors that reflect your style — from layout planning to materials and finishes.',
    tags: ['Custom Design', 'Material Selection', 'Space Optimization'],
    bg: 'bg-coral',
    tilt: -1,
  },
]

const featuredProjects = [
  { title: 'Edakuppam Residential', tag: 'Interior · Construction', img: '/images/project.jpg', span: 'md:col-span-7', sticker: 'bg-sun' },
  { title: 'Commercial Complex', tag: 'Architecture · Construction', img: '/images/we-offer.jpg', span: 'md:col-span-5', sticker: 'bg-leaf' },
  { title: 'Modern Office Space', tag: 'Interior · Renovation', img: '/images/home-sub.svg', span: 'md:col-span-5', sticker: 'bg-rose' },
  { title: 'Luxury Residence', tag: 'Architecture · Interior', img: '/images/home-hero.svg', span: 'md:col-span-7', sticker: 'bg-sky' },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)

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
      {/* ============ HERO — poster style ============ */}
      <section ref={heroRef} className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink text-white">
        <img
          src="/images/home-hero.svg"
          alt=""
          className="hero-bg absolute inset-0 h-[115%] w-full object-cover opacity-25 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
        <div className="hero-orb pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary opacity-25 blur-[100px]" />
        <div className="hero-orb pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-coral opacity-20 blur-[100px]" />
        <div className="hero-orb pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-sun opacity-15 blur-[100px]" />
        <div className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.35] mix-blend-overlay" />

        <div className="relative z-20 mx-auto w-full max-w-[1300px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
          <p className="blur-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Construction · Architecture · Interiors
          </p>

          <h1 className="font-display text-[clamp(3.4rem,13vw,11.5rem)] uppercase leading-[0.88] tracking-tight">
            <span className="inline-block overflow-hidden align-top">
              <span className="hero-word inline-block will-change-transform">WE&nbsp;BUILD</span>
            </span>
            <br />
            <span className="inline-block overflow-hidden align-top">
              <span className="hero-word inline-block text-primary will-change-transform">YOUR&nbsp;DREAM</span>
            </span>
            <br />
            <span className="inline-block overflow-hidden align-top">
              <span className="hero-word inline-block will-change-transform">HOUSE</span>
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <p className="blur-in text-lg font-semibold text-white/90">
                TURNING <RotatingWord /> INTO REALITY.
              </p>
              <p className="blur-in mt-3 leading-relaxed text-white/60">
                Expert craftsmanship and innovative design — we deliver construction that exceeds expectations.
              </p>
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

            {/* tilted stat stickers */}
            <div className="blur-in flex flex-wrap gap-4 md:gap-5">
              <StatCard value={20} suffix="+" label="Projects Done" bg="bg-coral" tilt={-3} />
              <StatCard value={3} suffix="+" label="Years Experience" bg="bg-leaf" tilt={2} />
              <StatCard value={100} suffix="%" label="Happy Clients" bg="bg-sun" tilt={-2} />
            </div>
          </div>
        </div>

        {/* giant call link, bottom right */}
        <a
          href="tel:+917305693530"
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
      <section className="overflow-hidden bg-mist py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal stagger={0.1}>
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
              <span className="h-px w-10 bg-primary" />
              About us
            </p>
            <h2 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-tight">
              Building dreams, <span className="text-primary">shaping</span> futures
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-2">
              At DNA Constructions and Architecture, we don't just build structures — we create living spaces that
              reflect your vision. With expertise in both construction and design, we handle projects of all sizes,
              ensuring quality and excellence from start to finish.
            </p>
          </Reveal>

          <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
            <Reveal delay={0.15}>
              <div className="group relative mx-auto w-fit">
                <div className="absolute -inset-3 rotate-[-2deg] rounded-3xl bg-primary transition-transform duration-500 group-hover:rotate-0" />
                <img
                  src="/images/about-sub.svg"
                  alt="About DNA Constructions"
                  className="relative h-[380px] w-full rotate-[1.5deg] rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:rotate-0 lg:h-[480px]"
                />
                <div className="absolute -bottom-5 -right-4 rotate-[3deg] rounded-2xl bg-sun px-5 py-3 font-display text-xl uppercase text-ink shadow-xl transition-transform duration-500 group-hover:rotate-0">
                  Since 2022
                </div>
              </div>
            </Reveal>

            <Reveal stagger={0.12} className="flex flex-col gap-6">
              {[
                {
                  h: 'Vision',
                  p: 'Ingenious solutions in the green energy domain — fine-tuning the balance between cost optimization and energy conservation.',
                  bg: 'bg-sky',
                  tilt: -1.5,
                },
                {
                  h: 'Mission',
                  p: 'We embrace technologies for a brighter future, delivering solutions that empower and transform lives through sustainability and excellence.',
                  bg: 'bg-leaf',
                  tilt: 1.5,
                },
                {
                  h: 'Goals',
                  p: 'Quality and excellence in every project — delivered on time, on budget, and beyond expectations.',
                  bg: 'bg-coral',
                  tilt: -1,
                },
              ].map((item) => (
                <div
                  key={item.h}
                  className={`${item.bg} rounded-3xl p-7 text-ink shadow-lg transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] md:p-8`}
                  style={{ rotate: `${item.tilt}deg` }}
                >
                  <h3 className="mb-2 font-display text-2xl uppercase tracking-wide">{item.h}</h3>
                  <p className="font-medium leading-relaxed text-ink/75">{item.p}</p>
                </div>
              ))}
            </Reveal>
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
              Crafting spaces, <span className="text-primary">elevating</span> experiences
            </h2>
          </Reveal>

          <div className="grid gap-7 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div
                  className={`${s.bg} group flex h-full flex-col rounded-3xl p-8 text-ink shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-2xl`}
                  style={{ rotate: `${s.tilt}deg` }}
                >
                  <h3 className="font-display text-3xl uppercase leading-none">{s.title}</h3>
                  <p className="mt-4 flex-1 font-medium leading-relaxed text-ink/75">{s.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-full bg-ink/10 px-3.5 py-1.5 text-xs font-bold text-ink/80">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/what-we-offer"
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-all duration-300 group-hover:gap-3 hover:scale-105"
                  >
                    Learn more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
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
                Featured <span className="text-primary">projects</span>
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

          <div className="grid gap-7 md:grid-cols-12">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.1} className={p.span}>
                <Link to="/projects" className="group relative block overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <span
                    className={`${p.sticker} absolute left-5 top-5 rotate-[-3deg] rounded-full px-4 py-1.5 text-xs font-bold uppercase text-ink shadow-md transition-transform duration-300 group-hover:rotate-0`}
                  >
                    {p.tag}
                  </span>
                  <div className="flex items-center justify-between p-6">
                    <h3 className="font-display text-2xl uppercase leading-none">{p.title}</h3>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-ink">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL ============ */}
      <section className="overflow-hidden bg-white py-24 text-ink md:py-32">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <Reveal>
            <div className="rotate-[-1.5deg] rounded-[2rem] bg-sun p-9 shadow-2xl transition-transform duration-500 hover:rotate-0 md:p-14">
              <span className="font-display text-6xl leading-none text-ink/20">❝</span>
              <p className="mt-2 text-xl font-semibold leading-relaxed md:text-2xl">
                They make it so easy to help you build your dream home! The kind of personal comfort and relationship
                they share with their customers makes the most tedious journey of building one's home the most joyful
                and happy experience.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg text-white">A</span>
                <div>
                  <p className="font-display text-xl uppercase leading-none">Mr. Arunkumar</p>
                  <p className="mt-1 text-sm font-bold text-ink/60">Chennai</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA — giant text link ============ */}
      <section className="relative overflow-hidden bg-ink py-28 text-white md:py-36">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary opacity-20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-coral opacity-15 blur-[100px]" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />

        <div className="relative mx-auto max-w-[1300px] px-5 text-center md:px-10">
          <Reveal stagger={0.12}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Have a project in mind?</p>
            <Link
              to="/contact"
              className="group mt-6 block font-display text-[clamp(2.8rem,9vw,8rem)] uppercase leading-[0.95] tracking-tight transition-colors duration-300 hover:text-primary"
            >
              Let's build
              <br />
              together
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
                href="tel:+917305693530"
                className="rotate-[-2deg] rounded-2xl bg-sun px-7 py-4 font-display text-lg uppercase text-ink shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105"
              >
                +91 73056 93530
              </a>
              <a
                href="mailto:dnaconstructions@gmail.com"
                className="rotate-[2deg] rounded-2xl bg-leaf px-7 py-4 font-display text-lg uppercase text-ink shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105"
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
