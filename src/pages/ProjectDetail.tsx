import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import { fallbackProjects, useList, type Project } from '../lib/content'

export default function ProjectDetail() {
  const { id } = useParams()
  const projects: Project[] = useList('projects', fallbackProjects)
  const p = projects.find((x) => x.id === id)

  /* ponytail: on a direct visit this can flash briefly while Firestore loads —
     add a loading flag to useList if it ever bothers anyone. */
  if (!p)
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-mist px-5 pt-24 text-ink">
        <h1 className="font-display text-4xl uppercase">Project not found</h1>
        <Link
          to="/projects"
          className="rounded-full bg-ink px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-105"
        >
          ← All projects
        </Link>
      </main>
    )

  const gallery = (p.gallery ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden bg-ink text-white">
        <img src={p.img} alt={p.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
        <div className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.35] mix-blend-overlay" />

        <div className="relative z-20 mx-auto w-full max-w-[1300px] px-5 pb-14 pt-36 md:px-10">
          <Reveal stagger={0.08}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-primary"
            >
              ← All projects
            </Link>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.92] tracking-tight">
              {p.title}
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rotate-[-2deg] rounded-full bg-sun px-5 py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-lg">
                {p.category}
              </span>
              {p.location && (
                <span className="rotate-[1.5deg] rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-lg">
                  📍 {p.location}
                </span>
              )}
              {p.year && (
                <span className="rotate-[-1deg] rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-lg">
                  {p.year}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WRITE-UP ============ */}
      <section className="bg-mist py-20 text-ink md:py-28">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal stagger={0.1} className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
              <span className="h-px w-10 bg-primary" />
              About this project
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] tracking-tight">{p.desc}</h2>
            {p.longDesc && (
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-2">{p.longDesc}</p>
            )}
          </Reveal>

          {/* ============ GALLERY ============ */}
          {gallery.length > 0 && (
            <div className="mt-16 grid gap-7 lg:grid-cols-12">
              {gallery.map((src, i) => (
                <Reveal
                  key={src}
                  delay={(i % 2) * 0.08}
                  y={30}
                  className={[7, 5, 5, 7][i % 4] === 7 ? 'lg:col-span-7' : 'lg:col-span-5'}
                >
                  <div className="group relative h-[280px] overflow-hidden rounded-[2rem] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[400px]">
                    <img
                      src={src}
                      alt={`${p.title} — photo ${i + 1}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute -bottom-2 right-4 font-display text-7xl leading-none text-white/20">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* ============ CTA ============ */}
          <Reveal className="relative mt-24 overflow-hidden rounded-[2.5rem] bg-ink py-16 text-center text-white md:py-20">
            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary opacity-20 blur-[100px]" />
            <div className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />
            <div className="relative px-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Like this project?</p>
              <h3 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.95] tracking-tight">
                Let's build <span className="text-primary">yours</span>
              </h3>
              <Magnetic className="mt-8">
                <Link
                  to="/contact"
                  className="shine inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Get in touch
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
