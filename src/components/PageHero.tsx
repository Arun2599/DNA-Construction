import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

/** Shared dark hero for inner pages, with a GSAP blur-in entrance. */
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
    <section ref={ref} className="relative overflow-hidden bg-ink pb-24 pt-40 text-white md:pb-32 md:pt-48">
      {/* glow shapes */}
      <div className="accent-gradient animate-float-slow pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#667eea] opacity-10 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="ph-item mb-8 flex items-center gap-2 text-sm text-white/50">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-white/80">{crumb}</span>
        </div>

        <p className="ph-item mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>

        <h1 className="ph-item max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">{title}</h1>

        <p className="ph-item mt-6 max-w-xl text-lg leading-relaxed text-white/60">{description}</p>

        {children && <div className="ph-item mt-10">{children}</div>}
      </div>
    </section>
  )
}
