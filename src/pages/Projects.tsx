import { useState } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const categories = ['all', 'construction', 'architecture', 'building', 'renovation', 'interior'] as const

const stickers = ['bg-sun', 'bg-leaf', 'bg-coral', 'bg-sky', 'bg-rose']

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
].map((p, i) => ({ ...p, img: imgs[i % imgs.length], sticker: stickers[i % stickers.length] }))

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
            Built with <span className="text-primary">pride</span>
          </>
        }
        description="Explore our collection of completed construction and design projects that showcase our commitment to quality and excellence."
      />

      <section className="bg-mist py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal className="mb-14 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 active:scale-95 ${
                  filter === c
                    ? 'scale-105 bg-ink text-white shadow-xl'
                    : 'bg-white text-ink/60 shadow-sm hover:-translate-y-0.5 hover:text-ink hover:shadow-md'
                }`}
              >
                {c === 'all' ? 'All Works' : c}
              </button>
            ))}
          </Reveal>

          <div key={filter} className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.08} y={30}>
                <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <span
                    className={`${p.sticker} absolute left-5 top-5 rotate-[-3deg] rounded-full px-4 py-1.5 text-xs font-bold uppercase text-ink shadow-md transition-transform duration-300 group-hover:rotate-0`}
                  >
                    {p.category}
                  </span>
                  <div className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-display text-xl uppercase leading-none">{p.title}</h3>
                      <p className="mt-1.5 text-sm font-semibold text-muted-2">{p.desc}</p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-ink">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-20 text-center font-semibold text-muted-2">No projects found — try a different category.</p>
          )}
        </div>
      </section>
    </main>
  )
}
