import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import { fallbackServices, useList, type Service } from '../lib/content'

/* Content comes from Firestore (editable at /admin); the style cycle keeps the poster look. */
const styles = [
  { bg: 'bg-ink', dark: true, tilt: -2 },
  { bg: 'bg-primary', dark: false, tilt: 1.5 },
  { bg: 'bg-sun', dark: false, tilt: -1 },
  { bg: 'bg-sun', dark: false, tilt: 2 },
  { bg: 'bg-ink', dark: true, tilt: -1.5 },
  { bg: 'bg-primary', dark: false, tilt: 1 },
]

export default function WhatWeOffer() {
  const services: Service[] = useList('services', fallbackServices)
  return (
    <main>
      <PageHero
        crumb="Services"
        eyebrow="Our services"
        title={
          <>
            Everything your <span className="text-primary">build needs</span>
          </>
        }
        description="From concept to completion, we offer a full range of construction and design services tailored to bring your vision to life."
      />

      <section className="bg-mist py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid gap-7 lg:grid-cols-3">
            {services.map((s, i) => {
              const st = styles[i % styles.length]
              return (
              <Reveal key={s.id ?? s.title} delay={(i % 3) * 0.1} stackTop={96 + (i % 6) * 8}>
                <div
                  className={`${st.bg} ${st.dark ? 'text-white' : 'text-ink'} flex h-full flex-col rounded-3xl p-8 shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-2xl`}
                  style={{ rotate: `${st.tilt}deg` }}
                >
                  <span className={`font-display text-lg ${st.dark ? 'text-white/30' : 'text-ink/30'}`}>0{i + 1}</span>
                  <h3 className="mt-2 font-display text-3xl uppercase leading-none">{s.title}</h3>
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
                </div>
              </Reveal>
            )})}
          </div>

          {/* CTA */}
          <Reveal className="relative mt-24 overflow-hidden rounded-[2.5rem] bg-ink py-20 text-center text-white md:py-24">
            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary opacity-20 blur-[100px]" />
            <div className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />
            <div className="relative px-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Ready to start?</p>
              <h3 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] uppercase leading-[0.95] tracking-tight">
                Let's talk about
                <br />
                your <span className="text-primary">project</span>
              </h3>
              <Magnetic className="mt-10">
                <Link
                  to="/contact"
                  className="shine group inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Get started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
