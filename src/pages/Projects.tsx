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

          <div key={filter} className="grid gap-7 lg:grid-cols-12">
            {filtered.map((p, i) => (
              <Reveal
                key={p.title}
                delay={(i % 2) * 0.08}
                y={30}
                className={[7, 5, 5, 7][i % 4] === 7 ? 'lg:col-span-7' : 'lg:col-span-5'}
                stackTop={96 + (i % 5) * 10}
              >
                <div className="group relative block h-[300px] overflow-hidden rounded-[2rem] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[400px]">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/95" />

                  <span className="absolute left-5 top-5 rotate-[-3deg] rounded-full bg-sun px-4 py-1.5 text-xs font-bold uppercase text-ink shadow-md transition-transform duration-300 group-hover:rotate-0">
                    {p.category}
                  </span>

                  <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>

                  <span className="pointer-events-none absolute -bottom-2 right-4 font-display text-7xl leading-none text-white/10 transition-colors duration-500 group-hover:text-primary/30 md:text-8xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                    <h3 className="font-display text-2xl uppercase leading-none transition-transform duration-500 group-hover:-translate-y-1 md:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-white/70 transition-transform duration-500 group-hover:-translate-y-1">
                      {p.desc}
                    </p>
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
