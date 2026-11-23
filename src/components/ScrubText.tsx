import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from './Reveal'

/** Big statement copy that "reads itself": each word lights up as you scroll past.
    *word* (admin accent markup) lights up in the accent color instead of white/ink. */
export default function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      el.querySelectorAll('.st-w'),
      { opacity: 0.12 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [text])

  let accent = false
  return (
    <p ref={ref} className={className}>
      {text.split(/\s+/).filter(Boolean).map((raw, i) => {
        const start = raw.startsWith('*')
        const end = raw.endsWith('*')
        if (start) accent = true
        const word = raw.replace(/\*/g, '')
        const cls = accent ? 'text-primary' : ''
        if (end) accent = false
        return (
          <span key={i} className={`st-w ${cls}`}>
            {word}{' '}
          </span>
        )
      })}
    </p>
  )
}
