import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, firebaseReady, storage } from './firebase'

export type Project = {
  id?: string
  title: string
  desc: string
  category: string
  img: string
  featured?: boolean
  order?: number
  location?: string
  year?: string
  /** full write-up shown on the detail page */
  longDesc?: string
  /** comma-separated image URLs for the detail-page gallery */
  gallery?: string
}

export type Service = {
  id?: string
  title: string
  desc: string
  /** comma-separated tag list */
  tags: string
  order?: number
}

export type Testimonial = {
  id?: string
  quote: string
  name: string
  place: string
  order?: number
}

export type Settings = {
  statProjects: number
  statYears: number
  statClients: number
  phone1: string
  phone2: string
  email1: string
  email2: string
  address: string
  hoursWeek: string
  hoursSunday: string
  whatsapp: string
  instagram: string
  youtube: string
}

export const CATEGORIES = ['construction', 'architecture', 'building', 'renovation', 'interior']

/* Every static text block on the site, editable from the admin "Page text" tab.
   Markup: *word* renders in the accent color, a new line becomes a line break,
   comma-separated fields (chips, words, marquee) are split where used. */
export const fallbackContent = {
  heroBadge: 'Construction · Architecture · Interiors',
  heroTitle: 'We build\n*your dream*\nhouse',
  rotatingWords: 'BLUEPRINTS, IDEAS, SPACES, DREAMS',
  taglinePrefix: 'TURNING',
  taglineSuffix: 'INTO REALITY.',
  heroDesc: 'Expert craftsmanship and innovative design — we deliver construction that exceeds expectations.',
  aboutTitle: 'Building dreams,\n*shaping* futures',
  aboutText:
    "At DNA Constructions and Architecture, we don't just build structures — we create living spaces that reflect your vision. With expertise in both construction and design, we handle projects of all sizes, ensuring quality and excellence from start to finish.",
  aboutChips: 'Residential, Commercial, Architecture, Interiors, Renovation',
  aboutBadgeTeam: 'The DNA Team',
  aboutBadgeSince: 'Since 2022',
  visionTitle: 'Vision',
  visionText:
    'Ingenious solutions in the green energy domain — fine-tuning the balance between cost optimization and energy conservation.',
  missionTitle: 'Mission',
  missionText:
    'We embrace technologies for a brighter future, delivering solutions that empower and transform lives through sustainability and excellence.',
  goalsTitle: 'Goals',
  goalsText: 'Quality and excellence in every project — delivered on time, on budget, and beyond expectations.',
  servicesTitle: 'Crafting spaces, *elevating* experiences',
  projectsTitle: 'Featured *projects*',
  testimonialsTitle: 'Our clients *say*',
  ctaEyebrow: 'Have a project in mind?',
  ctaTitle: "Let's build\ntogether",
  offerTitle: 'Everything your *build needs*',
  offerDesc:
    'From concept to completion, we offer a full range of construction and design services tailored to bring your vision to life.',
  offerCtaEyebrow: 'Ready to start?',
  offerCtaTitle: "Let's talk about\nyour *project*",
  projectsHeroTitle: 'Built with *pride*',
  projectsHeroDesc:
    'Explore our collection of completed construction and design projects that showcase our commitment to quality and excellence.',
  contactHeroTitle: "Let's talk about your *project*",
  contactHeroDesc:
    "Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.",
  contactPanelTitle: 'Need immediate *assistance?*',
  contactPanelText: "Connect with our team instantly. We're here to help you with all your construction needs.",
  footerTagline: 'We build your *dream house*',
  footerMarquee: 'BUILDING YOUR DREAM HOUSE, CONSTRUCTION, ARCHITECTURE, INTERIORS',
}

export type SiteContent = typeof fallbackContent

/* Fallback content: what the site shows until Firestore is connected and seeded. */

export const fallbackProjects: Project[] = [
  { id: 'f1', title: 'Modern Office Building', desc: 'Interior work', category: 'interior', img: '/images/project.jpg', featured: true, order: 1, location: 'Neyveli', year: '2024' },
  { id: 'f2', title: 'Luxury Apartment', desc: 'Construction work', category: 'construction', img: '/images/we-offer.jpg', featured: true, order: 2, location: 'Cuddalore', year: '2024' },
  { id: 'f3', title: 'Shopping Complex', desc: 'Architecture design', category: 'architecture', img: '/images/home-sub.svg', featured: true, order: 3, location: 'Chennai', year: '2023' },
  { id: 'f4', title: 'Residential Villa', desc: 'Building work', category: 'building', img: '/images/home-hero.svg', featured: true, order: 4, location: 'Neyveli', year: '2023' },
  { id: 'f5', title: 'Heritage Building', desc: 'Renovation work', category: 'renovation', img: '/images/project.jpg', order: 5, location: 'Cuddalore', year: '2023' },
  { id: 'f6', title: 'Corporate Office', desc: 'Interior design', category: 'interior', img: '/images/we-offer.jpg', order: 6, location: 'Chennai', year: '2024' },
  { id: 'f7', title: 'Modern House', desc: 'Construction work', category: 'construction', img: '/images/home-sub.svg', order: 7, location: 'Neyveli', year: '2025' },
  { id: 'f8', title: 'Commercial Complex', desc: 'Architecture design', category: 'architecture', img: '/images/home-hero.svg', order: 8, location: 'Cuddalore', year: '2022' },
  { id: 'f9', title: 'Beach House', desc: 'Building work', category: 'building', img: '/images/project.jpg', order: 9, location: 'Pondicherry', year: '2025' },
]

export const fallbackServices: Service[] = [
  {
    title: 'Construction',
    desc: 'End-to-end construction solutions from planning to completion. Our experienced team delivers highest quality builds on time and within budget.',
    tags: 'Quality Assurance, On-Time Delivery, Budget Management',
    order: 1,
  },
  {
    title: '3D & 2D Drawings',
    desc: 'Detailed architectural drawings that bring your vision to life — visualize your project before construction begins.',
    tags: '3D Visualization, Floor Plans, Accurate Measurements',
    order: 2,
  },
  {
    title: 'Interior Design',
    desc: 'Stunning, functional interiors that reflect your style. From layout planning to materials and finishes, we enhance every detail.',
    tags: 'Custom Design, Material Selection, Space Optimization',
    order: 3,
  },
  {
    title: 'Renovation',
    desc: 'Transform existing spaces with our renovation expertise. We modernize and upgrade while preserving structural integrity and character.',
    tags: 'Modern Upgrades, Structural Assessment, Value Enhancement',
    order: 4,
  },
  {
    title: 'Consultation',
    desc: 'Expert guidance from initial concept to final execution. We help you make informed decisions for successful project outcomes.',
    tags: 'Expert Advice, Cost Estimation, Timeline Planning',
    order: 5,
  },
  {
    title: 'Permits & Docs',
    desc: 'Navigate complex regulatory requirements with ease. We handle all permits, approvals, and documentation for seamless execution.',
    tags: 'Permit Processing, Legal Compliance, Documentation',
    order: 6,
  },
]

export const fallbackTestimonials: Testimonial[] = [
  {
    quote:
      'They make it so easy to help you build your dream home! The personal comfort and relationship they share with their customers makes building a home a joyful experience.',
    name: 'Mr. Arunkumar',
    place: 'Chennai',
    order: 1,
  },
  {
    quote:
      'From the first drawing to the final handover, everything was on schedule. The 3D plans helped us see our house before it existed.',
    name: 'Mr. Dhanush',
    place: 'Neyveli',
    order: 2,
  },
  {
    quote: 'The interior work exceeded our expectations. Every material was chosen with care and the finish is flawless.',
    name: 'Mrs. Priya',
    place: 'Cuddalore',
    order: 3,
  },
  {
    quote: 'Transparent budgeting, quality materials, and a team that actually listens. Our renovation felt effortless.',
    name: 'Mr. Karthik',
    place: 'Chennai',
    order: 4,
  },
]

export const fallbackSettings: Settings = {
  statProjects: 20,
  statYears: 3,
  statClients: 100,
  phone1: '+91 73056 93530',
  phone2: '+91 82207 10738',
  email1: 'dnaconstructions@gmail.com',
  email2: 'dhanushguna@gmail.com',
  address: 'No 8, Ambedkar Nagar, Neyveli, Cuddalore - 607804',
  hoursWeek: '9:00 AM – 6:00 PM',
  hoursSunday: 'Closed',
  whatsapp: 'https://wa.me/917305693530',
  instagram: 'https://www.instagram.com',
  youtube: 'https://www.youtube.com',
}

/* Content cache: the site content rarely changes, so Firestore results live in
   localStorage for a day and pages render them instantly without re-reading the
   database. Any page reload (F5 / hard refresh) bypasses the TTL and refetches,
   so an admin edit is one reload away for the visitor. */
const TTL_MS = 24 * 60 * 60 * 1000
const reloaded =
  typeof performance !== 'undefined' &&
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload'

function cacheGet<T>(key: string): { value: T; fresh: boolean } | null {
  try {
    const raw = localStorage.getItem(`dna-cache:${key}`)
    if (!raw) return null
    const { t, v } = JSON.parse(raw) as { t: number; v: T }
    return { value: v, fresh: !reloaded && Date.now() - t < TTL_MS }
  } catch {
    return null
  }
}

function cacheSet(key: string, v: unknown) {
  try {
    localStorage.setItem(`dna-cache:${key}`, JSON.stringify({ t: Date.now(), v }))
  } catch {
    /* storage full or blocked — cache is best-effort */
  }
}

/** Reads a Firestore collection sorted by `order`; returns the fallback until data exists. */
export function useList<T>(name: string, fallback: T[]): T[] {
  const [data, setData] = useState<T[]>(() => cacheGet<T[]>(name)?.value ?? fallback)
  useEffect(() => {
    if (!firebaseReady) return
    if (cacheGet<T[]>(name)?.fresh) return
    getDocs(query(collection(db, name), orderBy('order', 'asc')))
      .then((snap) => {
        if (!snap.empty) {
          const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[]
          setData(rows)
          cacheSet(name, rows)
        }
      })
      .catch(() => {})
  }, [name])
  return data
}

/** Reads the settings/site document; returns the fallback until it exists. */
export function useSettings(): Settings {
  const [data, setData] = useState<Settings>(
    () => cacheGet<Settings>('settings')?.value ?? fallbackSettings,
  )
  useEffect(() => {
    if (!firebaseReady) return
    if (cacheGet<Settings>('settings')?.fresh) return
    getDoc(doc(db, 'settings', 'site'))
      .then((snap) => {
        if (snap.exists()) {
          const merged = { ...fallbackSettings, ...(snap.data() as Partial<Settings>) }
          setData(merged)
          cacheSet('settings', merged)
        }
      })
      .catch(() => {})
  }, [])
  return data
}

/** Reads the settings/content document (all static page text); falls back per key. */
export function useContent(): SiteContent {
  const [data, setData] = useState<SiteContent>(
    () => cacheGet<SiteContent>('content')?.value ?? fallbackContent,
  )
  useEffect(() => {
    if (!firebaseReady) return
    if (cacheGet<SiteContent>('content')?.fresh) return
    getDoc(doc(db, 'settings', 'content'))
      .then((snap) => {
        if (snap.exists()) {
          const merged = { ...fallbackContent, ...(snap.data() as Partial<SiteContent>) }
          setData(merged)
          cacheSet('content', merged)
        }
      })
      .catch(() => {})
  }, [])
  return data
}

/** Splits a comma-separated admin field into trimmed non-empty items. */
export const splitList = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`

export async function uploadImage(file: File): Promise<string> {
  if (!storage) throw new Error('Storage is not enabled on this Firebase project — paste an image URL instead.')
  const r = ref(storage, `uploads/${Date.now()}-${file.name}`)
  await uploadBytes(r, file)
  return getDownloadURL(r)
}
