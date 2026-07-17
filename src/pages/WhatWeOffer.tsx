import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const services = [
  {
    title: 'Construction Services',
    desc: 'End-to-end construction solutions from planning to completion. Our experienced team delivers highest quality builds on time and within budget.',
    features: ['Quality Assurance', 'On-Time Delivery', 'Budget Management'],
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    featured: true,
  },
  {
    title: '3D & 2D Drawings',
    desc: 'Detailed architectural drawings that bring your vision to life with clear and accurate designs to visualize your project before construction.',
    features: ['3D Visualization', 'Detailed Floor Plans', 'Accurate Measurements'],
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    featured: false,
  },
  {
    title: 'Interior Design',
    desc: 'Stunning, functional interiors that reflect your style. From layout planning to materials and finishes, we enhance every detail of your space.',
    features: ['Custom Design', 'Material Selection', 'Space Optimization'],
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    featured: false,
  },
  {
    title: 'Renovation & Remodeling',
    desc: 'Transform existing spaces with our renovation expertise. We modernize and upgrade while preserving structural integrity and character.',
    features: ['Modern Upgrades', 'Structural Assessment', 'Value Enhancement'],
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    featured: false,
  },
  {
    title: 'Project Consultation',
    desc: 'Expert guidance from initial concept to final execution. Our consultants help you make informed decisions for successful project outcomes.',
    features: ['Expert Advice', 'Cost Estimation', 'Timeline Planning'],
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    featured: false,
  },
  {
    title: 'Permit & Documentation',
    desc: 'Navigate complex regulatory requirements with ease. We handle all permits, approvals, and documentation for seamless project execution.',
    features: ['Permit Processing', 'Legal Compliance', 'Document Management'],
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    featured: false,
  },
]

export default function WhatWeOffer() {
  return (
    <main>
      <PageHero
        crumb="Services"
        eyebrow="Our services"
        title={
          <>
            Comprehensive solutions for <span className="gradient-text font-display font-normal italic">every need</span>
          </>
        }
        description="From concept to completion, we offer a full range of construction and design services tailored to bring your vision to life."
      />

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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.1}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl border p-9 transition-all hover:-translate-y-2 hover:shadow-2xl ${
                    s.featured ? 'border-primary/30 bg-gradient-to-b from-primary/5 to-white' : 'border-black/5 bg-white'
                  }`}
                >
                  {s.featured && (
                    <span className="accent-gradient absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold text-ink">
                      Most Popular
                    </span>
                  )}
                  <span className="mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary-dark transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.icon} />
                    </svg>
                  </span>
                  <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                  <p className="mb-7 flex-1 leading-relaxed text-muted-2">{s.desc}</p>
                  <ul className="flex flex-col gap-2.5 border-t border-black/5 pt-6">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-muted-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 overflow-hidden rounded-3xl bg-ink p-12 text-center text-white md:p-16">
            <h3 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              Ready to start your <span className="font-display font-normal italic text-primary">project?</span>
            </h3>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-white/60">
              Let's discuss how we can bring your vision to life with our comprehensive services.
            </p>
            <Link
              to="/contact"
              className="accent-gradient mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
