import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { CATEGORIES, fallbackProjects, useList, type Project } from '../lib/content'

const categories = ['all', ...CATEGORIES]

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const topRef = useRef<HTMLDivElement>(null)
  const projects: Project[] = useList('projects', fallbackProjects)
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  const changeFilter = (c: string) => {
    setFilter(c)
    // jump back to the top of the results so the new list starts in view
    const marker = topRef.current
    if (!marker) return
    const y = marker.getBoundingClientRect().top + window.scrollY - 88
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' })
  }

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
          <div ref={topRef} />
          {/* sticky filter bar — stays reachable however deep you scroll */}
          <Reveal className="sticky top-20 z-30 mb-12 lg:top-24">
            <div className="mx-auto flex gap-2 overflow-x-auto rounded-full border border-black/5 bg-white/85 p-2 shadow-lg shadow-black/10 backdrop-blur-xl lg:w-fit">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => changeFilter(c)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 active:scale-95 md:px-6 ${
                    filter === c
                      ? 'bg-ink text-white shadow-md'
                      : 'text-ink/60 hover:bg-black/5 hover:text-ink'
                  }`}
                >
                  {c === 'all' ? 'All Works' : c}
                </button>
              ))}
            </div>
          </Reveal>

          <div key={filter} className="grid gap-7 lg:grid-cols-12">
            {filtered.map((p, i) => (
              <Reveal
                key={p.id ?? p.title}
                delay={(i % 2) * 0.08}
                y={30}
                className={[7, 5, 5, 7][i % 4] === 7 ? 'lg:col-span-7' : 'lg:col-span-5'}
                stackTop={152 + (i % 5) * 10}
              >
                <Link
                  to={`/projects/${p.id}`}
                  className="group relative block h-[300px] overflow-hidden rounded-[2rem] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[400px]"
                >
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
                </Link>
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
