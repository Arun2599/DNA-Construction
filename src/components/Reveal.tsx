import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Fades + slides content in once it scrolls into view.
 * With `stagger`, animates direct children one after another instead of the block.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 40,
  stagger = 0,
  blur = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  stagger?: number
  blur?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = stagger > 0 ? Array.from(el.children) : el
    if (prefersReducedMotion()) {
      gsap.set(targets, { autoAlpha: 1 })
      return
    }
    const tween = gsap.fromTo(
      targets,
      { autoAlpha: 0, y, ...(blur ? { filter: 'blur(8px)' } : {}) },
      {
        autoAlpha: 1,
        y: 0,
        ...(blur ? { filter: 'blur(0px)' } : {}),
        duration: 1,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [delay, y, stagger, blur])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
