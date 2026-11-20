import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { prefersReducedMotion } from './components/Reveal'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const AdminPage = lazy(() => import('./admin/AdminPage'))
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import WhatWeOffer from './pages/WhatWeOffer'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'

/* Butter-smooth inertia scrolling on desktop (mouse/trackpad). Rendered as the first
   child so its layout effect runs before any page creates its ScrollTriggers.
   ponytail: decided once at load — touch and <1024px keep native scroll because the
   mobile sticky stack cards (Reveal stackTop) need it; resizing across 1024 needs a reload. */
function SmoothScroll() {
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return
    const smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: false })
    return () => smoother.kill()
  }, [])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const smoother = ScrollSmoother.get()
    if (smoother) smoother.scrollTop(0)
    else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    // new page = new height; let ScrollTrigger re-measure once it has rendered
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()

  // /admin gets its own chrome — no site navbar/footer
  if (pathname.startsWith('/admin'))
    return (
      <Suspense fallback={<div className="min-h-screen bg-ink" />}>
        <AdminPage />
      </Suspense>
    )

  return (
    <>
      <SmoothScroll />
      <ScrollToTop />
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/what-we-offer" element={<WhatWeOffer />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
        </div>
      </div>
    </>
  )
}
