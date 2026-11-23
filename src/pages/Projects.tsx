import { useRef, useState } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Fmt from '../components/Fmt'
import ProjectCard from '../components/ProjectCard'
import { CATEGORIES, fallbackProjects, useContent, useList, type Project } from '../lib/content'

const categories = ['all', ...CATEGORIES]

export default function Projects() {
  const c = useContent()
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
        title={<Fmt text={c.projectsHeroTitle} />}
        description={c.projectsHeroDesc}
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
                  <sup className="ml-1 text-[9px] opacity-60">{c === 'all' ? projects.length : projects.filter((p) => p.category === c).length}</sup>
                </button>
              ))}
            </div>
          </Reveal>

          {/* two editorial columns, the right one dropped lower */}
          <div key={filter} className="grid gap-y-16 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-24 lg:pb-40">
            {filtered.map((p, i) => (
              <Reveal key={p.id ?? p.title} clip delay={(i % 2) * 0.1} className={i % 2 ? 'lg:translate-y-40' : ''} stackTop={152 + (i % 5) * 10}>
                <ProjectCard p={p} i={i} tall={i % 4 === 0 || i % 4 === 3} />
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
