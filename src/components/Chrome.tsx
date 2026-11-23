import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './Reveal'

/* Site-wide "agency" chrome that lives outside the smooth-scroll wrapper:
   page-transition curtain, custom cursor and scroll progress bar. */

const pageName = (path: string) =>
  ({ '/': 'Home', '/home': 'Home', '/what-we-offer': 'Services', '/projects': 'Projects', '/contact': 'Contact' })[path] ??
  (path.startsWith('/projects/') ? 'Project' : 'DNA')

/** Curtain wipe between routes: internal link clicks are held until the curtain covers the screen. */
export function PageTransition() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const wrap = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)
  const first = useRef(true)

  // reveal: runs after every route change (link click or back/forward)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const q = gsap.utils.selector(wrap)
    if (prefersReducedMotion()) {
      gsap.set(wrap.current, { autoAlpha: 0 })
      busy.current = false
      return
    }
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .set(wrap.current, { autoAlpha: 1 })
      .set(q('.pt-panel'), { yPercent: 0 })
      .to(q('.pt-label'), { yPercent: -110, duration: 0.45, ease: 'power3.in' }, 0.1)
      .to(q('.pt-panel'), { yPercent: -100, duration: 0.9, stagger: 0.08, ease: 'expo.inOut' }, 0.25)
      .set(wrap.current, { autoAlpha: 0 })
  }, [pathname])

  // cover: intercept plain left-clicks on internal links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a')
      const href = a?.getAttribute('href')
      if (!a || !href || !href.startsWith('/') || a.target === '_blank' || href.startsWith('/admin')) return
      if (href === location.pathname) return // same page: let the router no-op
      e.preventDefault()
      if (busy.current) return
      busy.current = true
      if (prefersReducedMotion()) return navigate(href)
      const q = gsap.utils.selector(wrap)
      if (label.current) label.current.textContent = pageName(href)
      gsap
        .timeline({ onComplete: () => navigate(href) })
        .set(wrap.current, { autoAlpha: 1 })
        .fromTo(q('.pt-panel'), { yPercent: 100 }, { yPercent: 0, duration: 0.7, stagger: -0.08, ease: 'expo.inOut' })
        .fromTo(q('.pt-label'), { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.35)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[100]">
      <div className="pt-panel absolute inset-0 bg-primary" />
      <div className="pt-panel absolute inset-0 grid place-items-center bg-ink">
        <div className="grain absolute inset-0 opacity-[0.35]" />
        <span className="overflow-hidden">
          <span ref={label} className="pt-label block font-display text-[clamp(3rem,12vw,10rem)] uppercase leading-none text-white">
            DNA
          </span>
        </span>
      </div>
    </div>
  )
}

/** Dot + trailing ring. The ring swells over links and shows `data-cursor` text (e.g. "View"). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 })
    let seen = false
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    let state = ''
    const onMove = (e: PointerEvent) => {
      if (!seen) {
        // first move: jump into place, then fade in (no flash at the top-left corner)
        seen = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      const t = e.target as HTMLElement
      const tagged = t.closest<HTMLElement>('[data-cursor]')
      const next = tagged ? `label:${tagged.dataset.cursor}` : t.closest('a, button, [role=button], input, textarea, select') ? 'link' : ''
      if (next === state) return
      state = next
      if (text.current) text.current.textContent = tagged?.dataset.cursor ?? ''
      gsap.to(ring.current, {
        scale: next.startsWith('label') ? 2.6 : next === 'link' ? 1.6 : 1,
        backgroundColor: next.startsWith('label') ? '#F5B841' : 'rgba(76,201,240,0)',
        borderColor: next.startsWith('label') ? '#F5B841' : '#4cc9f0',
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(dot.current, { scale: next ? 0 : 1, duration: 0.25 })
      gsap.to(text.current, { autoAlpha: next.startsWith('label') ? 1 : 0, duration: 0.2 })
    }
    const hide = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 })
    const show = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 })
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', hide)
    document.addEventListener('pointerenter', show)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', hide)
      document.removeEventListener('pointerenter', show)
    }
  }, [])

  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none invisible fixed left-0 top-0 z-[90] grid h-9 w-9 place-items-center rounded-full border-2 border-primary">
        <span ref={text} className="invisible scale-[0.4] whitespace-nowrap font-display text-[11px] uppercase tracking-wide text-ink" />
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none invisible fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-primary" />
    </>
  )
}

/** Thin bar along the top edge that fills as you scroll the page. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const tween = gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [pathname])
  useEffect(() => void ScrollTrigger.refresh(), [pathname])
  return <div ref={bar} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary via-sun to-[#F4845F]" />
}
