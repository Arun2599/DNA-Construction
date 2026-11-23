import { useState } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Fmt from '../components/Fmt'
import { telHref, useContent, useSettings } from '../lib/content'

export default function Contact() {
  const c = useContent()
  const s = useSettings()

  const [copied, setCopied] = useState('')
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(''), 1600)
    })
  }
  const maps = (a: string) => `https://maps.google.com/?q=${encodeURIComponent(a)}`
  /* each map image is placed so its office point (x%, y% of the image) sits dead-centre of the section.
     ponytail: the Chennai pin marks Guduvancheri (the building isn't on OpenStreetMap);
     "Get directions" always uses the exact address. */
  const branches = [
    { city: 'Neyveli', tag: 'Head office', area: 'Neyveli, Cuddalore', address: s.address, img: '/images/map-area.png', x: 45.4, y: 47.4 },
    { city: 'Chennai', tag: 'Branch', area: 'Nandivaram-Guduvancheri', address: s.address2, img: '/images/map-chennai.png', x: 50, y: 50 },
  ].filter((b) => b.address)
  const [bi, setBi] = useState(0)
  const branch = branches[bi] ?? branches[0]
  const phones = [s.phone1, s.phone2].filter(Boolean)
  const emails = [s.email1, s.email2].filter(Boolean)
  const tile = 'group relative h-full overflow-hidden rounded-[2rem] p-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 md:p-9'
  const Arrow = ({ className = '' }: { className?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-500 group-hover:rotate-45 ${className}`}>
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )

  return (
    <main>
      <PageHero
        crumb="Contact"
        eyebrow="Get in touch"
        title={<Fmt text={c.contactHeroTitle} />}
        description={c.contactHeroDesc}
      />

      <section className="bg-mist py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          {/* bento: one glance answers "how do I reach them?" — biggest tile = the fastest channel */}
          <div className="grid auto-rows-auto gap-5 md:grid-cols-6 md:gap-6">
            {/* call — the hero tile */}
            <Reveal className="md:col-span-6 lg:col-span-4 lg:row-span-2" y={50}>
              <div className={`${tile} flex min-h-[340px] flex-col justify-between bg-sun text-ink lg:min-h-[460px]`}>
                <span aria-hidden className="pointer-events-none absolute -bottom-[0.18em] -right-3 select-none font-display text-[clamp(7rem,20vw,16rem)] uppercase leading-none text-ink/[0.07]">
                  Call
                </span>
                <div className="relative flex items-start justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Call us · fastest reply</p>
                  <span className="flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" /> Tap to call
                  </span>
                </div>
                <div className="relative mt-10 flex flex-col gap-1">
                  {phones.map((ph) => (
                    <a key={ph} href={telHref(ph)} className="flex w-fit items-center gap-3 font-display text-[clamp(2.2rem,6vw,4.75rem)] uppercase leading-[1] transition-colors hover:text-white">
                      {ph}
                      <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* email */}
            <Reveal className="md:col-span-3 lg:col-span-2" delay={0.1} y={50}>
              <div className={`${tile} flex flex-col justify-between bg-primary text-ink`}>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Email us</p>
                <div className="mt-8 flex flex-col gap-3">
                  {emails.map((em) => (
                    <div key={em} className="flex items-center justify-between gap-3">
                      <a href={`mailto:${em}`} className="link-underline min-w-0 break-all text-sm font-semibold sm:text-base">
                        {em}
                      </a>
                      <button
                        onClick={() => copy(em)}
                        className="shrink-0 rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-white"
                      >
                        {copied === em ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* whatsapp */}
            <Reveal className="md:col-span-3 lg:col-span-2" delay={0.2} y={50}>
              <a href={s.whatsapp} target="_blank" rel="noreferrer" className={`${tile} flex flex-col justify-between bg-[#25D366] text-ink`}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Chat on</p>
                  <Arrow />
                </div>
                <p className="mt-8 flex items-center gap-3 font-display text-[clamp(2.2rem,4vw,3.2rem)] uppercase leading-none">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </p>
              </a>
            </Reveal>

            {/* visit — both offices over the map */}
            <Reveal className="md:col-span-3" clip delay={0.1}>
              <div className={`${tile} flex min-h-[300px] flex-col justify-end bg-ink text-white`}>
                <img src="/images/map-area.png" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50 saturate-[.6] transition-transform duration-[1.2s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
                <p className="relative mb-auto text-xs font-bold uppercase tracking-[0.3em] text-primary">Visit us · {branches.length} offices</p>
                <div className="relative mt-10 grid gap-5 sm:grid-cols-2">
                  {branches.map((br) => (
                    <a key={br.city} href={maps(br.address)} target="_blank" rel="noreferrer" className="group/a flex flex-col gap-2">
                      <span className="flex items-center gap-2 font-display text-2xl uppercase leading-none">
                        {br.city}
                        <span className="rounded-full bg-sun px-2 py-0.5 font-body text-[10px] font-bold tracking-wide text-ink">{br.tag}</span>
                      </span>
                      <span className="text-sm leading-snug text-white/75 transition-colors group-hover/a:text-white">{br.address}</span>
                      <span className="text-xs font-bold uppercase tracking-wide text-primary">Directions ↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* hours + the "need help now" note */}
            <Reveal className="md:col-span-3" delay={0.2} y={50}>
              <div className={`${tile} flex min-h-[300px] flex-col justify-between bg-white text-ink shadow-[inset_0_0_0_2px_#111]`}>
                <div>
                  <h3 className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] uppercase leading-[0.95]">
                    <Fmt text={c.contactPanelTitle} />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{c.contactPanelText}</p>
                </div>
                <dl className="mt-8 grid grid-cols-2 gap-4 border-t-2 border-ink pt-5 text-sm">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink/45">Mon – Sat</dt>
                    <dd className="mt-1 font-semibold">{s.hoursWeek}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink/45">Sunday</dt>
                    <dd className="mt-1 font-semibold">{s.hoursSunday}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MAP — full-bleed, switch between offices; the active office sits dead-centre ============ */}
      <section className="relative h-[70vh] overflow-hidden bg-mist md:h-[90vh]">
        {branches.map((br, i) => (
          <div
            key={br.city}
            className={`absolute left-1/2 top-1/2 aspect-[7/4] w-[max(100vw,160vh)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === bi ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
            }`}
            style={{ translate: `-${br.x}% -${br.y}%`, transformOrigin: `${br.x}% ${br.y}%` }}
          >
            <img
              src={br.img}
              alt={`Map of the ${br.city} area showing the DNA Constructions ${br.tag.toLowerCase()}`}
              loading={i ? 'lazy' : undefined}
              className="h-full w-full saturate-[.65] contrast-[.95]"
            />
          </div>
        ))}

        {/* site-palette wash + grain so the map sits with the rest of the design */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-primary/10 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mist to-transparent" />
        <div className="grain pointer-events-none absolute inset-0 opacity-20" />

        {/* pin — the office point is always the section's centre */}
        <svg key={branch.city} className="map-pin absolute left-1/2 top-1/2 z-10" width="40" height="52" viewBox="0 0 40 52" fill="none" aria-hidden>
          <path d="M20 1C9.5 1 1 9.5 1 20c0 13.5 19 31 19 31s19-17.5 19-31C39 9.5 30.5 1 20 1z" fill="#F5B841" stroke="#111111" strokeWidth="2" />
          <circle cx="20" cy="20" r="7" fill="#111111" />
        </svg>

        {/* label → thin line down to the pin */}
        <div className="absolute left-1/2 top-0 flex h-[calc(50%-60px)] -translate-x-1/2 flex-col items-center">
          <p className="pt-10 text-center text-sm font-bold uppercase tracking-wide text-ink md:text-base">
            DNA Constructions &amp; Architects
            <span className="block text-xs font-semibold normal-case tracking-normal text-ink/50 md:text-sm">
              {branch.area} · {branch.tag}
            </span>
          </p>
          <span className="mt-3 w-px flex-1 bg-ink/30" />
        </div>

        {/* office switcher */}
        {branches.length > 1 && (
          <div className="absolute bottom-6 left-4 flex gap-1 rounded-full bg-white/90 p-1.5 shadow-xl backdrop-blur md:left-8">
            {branches.map((br, i) => (
              <button
                key={br.city}
                onClick={() => setBi(i)}
                aria-pressed={i === bi}
                className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors md:px-5 ${
                  i === bi ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {br.city}
              </button>
            ))}
          </div>
        )}

        <a
          href={maps(branch.address)}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-6 right-4 rotate-[2deg] rounded-2xl bg-ink px-5 py-3.5 shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105 md:right-8 md:px-6"
        >
          <span className="font-display text-base uppercase leading-none text-sun">Directions ↗</span>
        </a>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-ink/35">© OpenStreetMap contributors © CARTO</span>
      </section>
    </main>
  )
}
