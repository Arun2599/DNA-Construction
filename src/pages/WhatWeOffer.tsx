import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import Fmt from '../components/Fmt'
import ServiceList from '../components/ServiceList'
import { fallbackServices, useContent, useList, type Service } from '../lib/content'

export default function WhatWeOffer() {
  const c = useContent()
  const services: Service[] = useList('services', fallbackServices)
  return (
    <main>
      <PageHero
        crumb="Services"
        eyebrow="Our services"
        title={<Fmt text={c.offerTitle} />}
        description={c.offerDesc}
      />

      <section className="bg-mist pb-24 pt-16 text-ink md:pb-32 md:pt-24">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal y={60}>
            <ServiceList services={services} />
          </Reveal>

          {/* CTA */}
          <Reveal className="relative mt-24 overflow-hidden rounded-[2.5rem] bg-ink py-20 text-center text-white md:py-24">
            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full text-primary opacity-20 orb" />
            <div className="grain pointer-events-none absolute inset-0 opacity-[0.35]" />
            <div className="relative px-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{c.offerCtaEyebrow}</p>
              <h3 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] uppercase leading-[0.95] tracking-tight">
                <Fmt text={c.offerCtaTitle} />
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
