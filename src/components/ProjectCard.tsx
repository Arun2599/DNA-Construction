import { Link } from 'react-router-dom'
import type { Project } from '../lib/content'

/** Editorial project card: clean photo on top, caption + meta underneath (no dark overlay). */
export default function ProjectCard({ p, i, tall = false }: { p: Project; i: number; tall?: boolean }) {
  return (
    <Link to={p.id ? `/projects/${p.id}` : '/projects'} data-cursor="View" className="group block bg-mist">
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-ink ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
        <span className="absolute left-4 top-4 rotate-[-3deg] rounded-full bg-sun px-4 py-1.5 text-xs font-bold uppercase text-ink shadow-md transition-transform duration-300 group-hover:rotate-0 md:left-5 md:top-5">
          {p.category}
        </span>
        <span className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100 md:bottom-5 md:right-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-5 border-t-2 border-ink pt-4">
        <div className="flex min-w-0 gap-4">
          <span className="pt-1 font-display text-sm text-ink/40">{String(i + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <h3 className="break-words font-display text-2xl uppercase leading-none transition-colors duration-300 group-hover:text-primary-dark md:text-4xl">
              {p.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-ink/55">{p.desc}</p>
          </div>
        </div>
        <div className="shrink-0 pt-1 text-right text-[11px] font-bold uppercase leading-relaxed tracking-[0.2em] text-ink/45">
          {p.location && <p>{p.location}</p>}
          {p.year && <p>{p.year}</p>}
        </div>
      </div>
    </Link>
  )
}
