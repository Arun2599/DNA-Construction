import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Fades + slides content in once it scrolls into view.
 * With `stagger`, animates direct children one after another instead of the block.
 * With `stackTop`, below lg the element becomes a sticky stacking card: it pins at
 * `stackTop` px and scales back slightly as the next card scrolls over it.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 40,
  stagger = 0,
  blur = false,
  stackTop,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  stagger?: number
  blur?: boolean
  stackTop?: number
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

  // deck effect: once stuck, scale back while the next card slides over
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || stackTop == null) return
    if (prefersReducedMotion() || !window.matchMedia('(max-width: 1023px)').matches) return
    const tween = gsap.to(el, {
      scale: 0.94,
      transformOrigin: 'center top',
      ease: 'none',
      scrollTrigger: { trigger: el, start: `top ${stackTop + 10}px`, end: '+=350', scrub: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [stackTop])

  return (
    <div
      ref={ref}
      className={`${stackTop != null ? 'max-lg:sticky' : ''} ${className}`}
      style={stackTop != null ? { top: stackTop } : undefined}
    >
      {children}
    </div>
  )
}
