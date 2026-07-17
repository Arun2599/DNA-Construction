import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'

gsap.registerPlugin(ScrollTrigger)

const rotatingWords = ['blueprints', 'ideas', 'spaces', 'dreams']

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % rotatingWords.length), 2000)
    return () => clearInterval(id)
  }, [])
  return (
    <span key={i} className="animate-word-in inline-block font-display italic text-primary">
      {rotatingWords[i]}
    </span>
  )
}

function Stat({ value, suffix, label, dark = true }: { value: number; suffix: string; label: string; dark?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: 'power2.out',
      snap: { v: 1 },
      onUpdate: () => {
        el.textContent = `${obj.v}${suffix}`
      },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, suffix])
  return (
    <div>
      <h3 ref={ref} className="gradient-text text-4xl font-extrabold md:text-5xl">
        0{suffix}
      </h3>
      <p className={`mt-1 text-sm font-medium ${dark ? 'text-white/60' : 'text-muted-2'}`}>{label}</p>
    </div>
  )
}

const services = [
  {
    title: 'Construction Services',
    desc: 'End-to-end construction solutions from planning to completion. Our experienced team delivers highest quality builds on time and within budget.',
    icon: '/images/construction-icon.svg',
    featured: true,
  },
  {
    title: '3D & 2D Drawings',
    desc: 'Detailed architectural drawings that bring your vision to life with clear and accurate designs to visualize your project before construction.',
    icon: '/images/drawing-icon.svg',
    featured: false,
  },
  {
    title: 'Interior Design',
    desc: 'Stunning, functional interiors that reflect your style. From layout planning to materials and finishes, we enhance every detail of your space.',
    icon: '/images/interior-icon.svg',
    featured: false,
  },
]

const featuredProjects = [
  { title: 'Edakuppam Residential', tag: 'Interior Design & Construction', img: '/images/project.jpg', span: 'md:col-span-7' },
  { title: 'Commercial Complex', tag: 'Architecture & Construction', img: '/images/we-offer.jpg', span: 'md:col-span-5' },
  { title: 'Modern Office Space', tag: 'Interior & Renovation', img: '/images/home-sub.svg', span: 'md:col-span-5' },
  { title: 'Luxury Residence', tag: 'Architecture & Interior', img: '/images/home-hero.svg', span: 'md:col-span-7' },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero-reveal', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.1 })
        .fromTo(
          '.blur-in',
          { autoAlpha: 0, y: 20, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.12 },
          '-=0.8',
        )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <main>
      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden bg-ink text-white">
        <img src="/images/home-hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
        <div className="accent-gradient animate-float-slow pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#667eea] opacity-10 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pb-28 pt-40 md:px-10">
          <p className="blur-in mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary backdrop-blur-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Premium Construction &amp; Design
          </p>

          <h1 className="hero-reveal text-6xl font-extrabold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
            WE BUILD YOUR
            <br />
            <span className="gradient-text font-display font-normal italic">dream house</span>
          </h1>

          <p className="blur-in mt-8 text-lg text-white/70 md:text-xl">
            Turning <RotatingWord /> into reality.
          </p>

          <p className="blur-in mt-4 max-w-xl leading-relaxed text-white/60">
            Transform your vision into reality with expert craftsmanship and innovative design. We deliver exceptional
            construction solutions that exceed expectations.
          </p>

          <div className="blur-in mt-10 flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="accent-gradient group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Start Exploring
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold backdrop-blur-md transition-all hover:border-primary hover:text-primary"
            >
              Reach out
            </Link>
          </div>

          <div className="blur-in mt-16 flex flex-wrap items-center gap-8 md:gap-12">
            <Stat value={20} suffix="+" label="Projects Completed" />
            <span className="hidden h-12 w-px bg-white/10 md:block" />
            <Stat value={3} suffix="+" label="Years Experience" />
            <span className="hidden h-12 w-px bg-white/10 md:block" />
            <Stat value={100} suffix="%" label="Client Satisfaction" />
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <div className="flex h-10 w-[26px] justify-center rounded-full border-2 border-white/20 pt-2">
            <span className="animate-wheel h-2 w-[3px] rounded-full bg-primary" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Scroll</p>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 md:px-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                <span className="accent-gradient h-px w-10" />
                About us
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                Building dreams,
                <br />
                <span className="font-display font-normal italic text-primary">shaping futures</span>
              </h2>
              <p className="mt-6 max-w-xl border-l-4 border-primary/60 pl-5 leading-relaxed text-muted-2">
                At DNA Constructions and Architecture, we don't just build structures—we create living spaces that
                reflect your vision. With expertise in both construction and design, we handle projects of all sizes,
                ensuring quality and excellence from start to finish.
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-4">
              {[
                {
                  h: 'Vision',
                  p: 'Rooted in the delivery of ingenious solutions within the green energy domain, fine-tuning the balance between cost optimization and energy conservation.',
                },
                {
                  h: 'Mission',
                  p: 'We embrace technologies for a brighter future, delivering solutions that empower and transform lives, through sustainability and excellence.',
                },
                {
                  h: 'Goals',
                  p: 'Quality and excellence in every project — delivered on time, on budget, and beyond expectations.',
                },
              ].map((item, i) => (
                <Reveal key={item.h} delay={i * 0.1}>
                  <div className="group rounded-3xl border border-primary/10 bg-mist p-7 transition-all hover:translate-x-2 hover:border-primary/30 hover:shadow-xl">
                    <h3 className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em]">
                      {item.h}
                      <span className="accent-gradient h-0.5 w-8" />
                    </h3>
                    <p className="leading-relaxed text-muted-2">{item.p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} className="group relative overflow-hidden rounded-3xl">
            <img
              src="/images/about-sub.svg"
              alt="About DNA Constructions"
              className="h-[420px] w-full rounded-3xl object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[560px]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES PREVIEW ============ */}
      <section className="bg-mist py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">What we offer</p>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Crafting spaces, <span className="font-display font-normal italic text-primary">elevating experiences</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted-2">
              Comprehensive solutions for your construction and design needs, delivered with expertise and precision.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl border p-9 transition-all hover:-translate-y-2 hover:shadow-2xl ${
                    s.featured ? 'border-primary/30 bg-gradient-to-b from-primary/5 to-white' : 'border-black/5 bg-white'
                  }`}
                >
                  {s.featured && (
                    <span className="accent-gradient absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold text-ink">
                      Popular
                    </span>
                  )}
                  <span className="mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <img src={s.icon} alt="" className="h-9 w-9" />
                  </span>
                  <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                  <p className="mb-8 flex-1 leading-relaxed text-muted-2">{s.desc}</p>
                  <Link
                    to="/what-we-offer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-dark transition-all group-hover:gap-3"
                  >
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS (bento) ============ */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                <span className="accent-gradient h-px w-10" />
                Our work
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                Featured <span className="font-display font-normal italic text-primary">projects</span>
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition-all hover:border-primary hover:text-primary-dark"
            >
              View all work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-12">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.1} className={p.span}>
                <Link to="/projects" className="group relative block overflow-hidden rounded-3xl border border-black/5 bg-mist">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                    <span className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink">
                      View — <span className="font-display italic">{p.title}</span>
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-7 pt-16 text-white transition-opacity duration-500 group-hover:opacity-0">
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{p.tag}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL ============ */}
      <section className="bg-ink py-24 text-white md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
          <Reveal>
            <span className="font-display text-7xl italic text-primary/40">❝</span>
            <p className="font-display text-2xl italic leading-relaxed text-white/85 md:text-4xl">
              They make it so easy to help you build your dream home! The kind of personal comfort and relationship they
              share with their customers makes the most tedious journey of building one's home the most joyful and happy
              experience.
            </p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">Mr. Arunkumar</p>
            <p className="mt-1 text-sm text-white/50">Chennai</p>
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10">
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">Contact us</p>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Have a project <span className="font-display font-normal italic text-primary">in mind?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-2">
              You can contact us if you have any query — we'd love to talk about your next build.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="accent-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-105"
              >
                Get in touch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+917305693530"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-8 py-4 text-sm font-semibold transition-all hover:border-primary hover:text-primary-dark"
              >
                +91 73056 93530
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
