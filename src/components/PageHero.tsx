import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { prefersReducedMotion } from './Reveal'

/** Shared dark poster-style hero for inner pages. */
export default function PageHero({
  crumb,
  eyebrow,
  title,
  description,
  children,
}: {
  crumb: string
  eyebrow: string
  title: ReactNode
  description: string
  children?: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ph-item',
        { autoAlpha: 0, y: 24, filter: 'blur(10px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15 },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink pb-20 pt-36 text-white md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary opacity-20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-coral opacity-15 blur-[100px]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />

      <div className="relative mx-auto max-w-[1300px] px-5 md:px-10">
        <div className="ph-item mb-8 flex items-center gap-2 text-sm text-white/50">
          <Link to="/" className="link-underline transition-colors hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-white/80">{crumb}</span>
        </div>

        <p className="ph-item mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-10 bg-primary" />
          {eyebrow}
        </p>

        <h1 className="ph-item max-w-5xl font-display text-[clamp(2.8rem,9vw,7rem)] uppercase leading-[0.92] tracking-tight">
          {title}
        </h1>

        <p className="ph-item mt-6 max-w-xl text-lg leading-relaxed text-white/60">{description}</p>

        {children && <div className="ph-item mt-10">{children}</div>}
      </div>
    </section>
  )
}
