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

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`

export async function uploadImage(file: File): Promise<string> {
  if (!storage) throw new Error('Storage is not enabled on this Firebase project — paste an image URL instead.')
  const r = ref(storage, `uploads/${Date.now()}-${file.name}`)
  await uploadBytes(r, file)
  return getDownloadURL(r)
}
