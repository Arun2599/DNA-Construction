import { useState } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const categories = ['all', 'construction', 'architecture', 'building', 'renovation', 'interior'] as const

/* ponytail: original project photos (project1–9.jpg) were never added to the repo,
   so cycle the four images that exist. Swap in real photos when available. */
const imgs = ['/images/project.jpg', '/images/we-offer.jpg', '/images/home-sub.svg', '/images/home-hero.svg']

const projects = [
  { title: 'Modern Office Building', desc: 'Interior work', category: 'interior' },
  { title: 'Luxury Apartment', desc: 'Construction work', category: 'construction' },
  { title: 'Shopping Complex', desc: 'Architecture design', category: 'architecture' },
  { title: 'Residential Villa', desc: 'Building work', category: 'building' },
  { title: 'Heritage Building', desc: 'Renovation work', category: 'renovation' },
  { title: 'Corporate Office', desc: 'Interior design', category: 'interior' },
  { title: 'Modern House', desc: 'Construction work', category: 'construction' },
  { title: 'Commercial Complex', desc: 'Architecture design', category: 'architecture' },
  { title: 'Beach House', desc: 'Building work', category: 'building' },
].map((p, i) => ({ ...p, img: imgs[i % imgs.length] }))

export default function Projects() {
  const [filter, setFilter] = useState<(typeof categories)[number]>('all')
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <main>
      <PageHero
        crumb="Projects"
        eyebrow="Our portfolio"
        title={
          <>
            Showcase of our <span className="gradient-text font-display font-normal italic">best projects</span>
          </>
        }
        description="Explore our collection of completed construction and design projects that showcase our commitment to quality and excellence."
      />

      <section className="bg-mist py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <Reveal className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition-all duration-300 active:scale-95 ${
                  filter === c
                    ? 'accent-gradient scale-105 text-ink shadow-lg shadow-primary/30'
                    : 'border border-black/10 bg-white text-muted-2 hover:-translate-y-0.5 hover:border-primary hover:text-primary-dark hover:shadow-md'
                }`}
              >
                {c === 'all' ? 'All Works' : c}
              </button>
            ))}
          </Reveal>

          <div key={filter} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.08} y={30}>
                <div className="shine group relative overflow-hidden rounded-3xl border border-black/5 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-4 py-1.5 text-xs font-semibold capitalize text-white backdrop-blur-md">
                    {p.category}
                  </span>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-7 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <h3 className="text-xl font-bold text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{p.desc}</p>
                  </div>
                  <div className="p-6 transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-2">
                      <span className="accent-gradient h-1.5 w-1.5 rounded-full" />
                      {p.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-muted-2">No projects found — try a different category.</p>
          )}
        </div>
      </section>
    </main>
  )
}
