import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const cards = [
  {
    title: 'Call us',
    label: 'Direct contact numbers',
    bg: 'bg-sun',
    dark: false,
    tilt: -2,
    links: [
      { href: 'tel:+917305693530', text: '+91 73056 93530' },
      { href: 'tel:+918220710738', text: '+91 82207 10738' },
    ],
  },
  {
    title: 'Email us',
    label: 'Drop a message anytime',
    bg: 'bg-primary',
    dark: false,
    tilt: 1.5,
    links: [
      { href: 'mailto:dnaconstructions@gmail.com', text: 'dnaconstructions@gmail.com' },
      { href: 'mailto:dhanushguna@gmail.com', text: 'dhanushguna@gmail.com' },
    ],
  },
  {
    title: 'Visit us',
    label: 'Come say hello',
    bg: 'bg-ink',
    dark: true,
    tilt: -1,
    links: [
      {
        href: 'https://maps.google.com/?q=Neyveli,Cuddalore',
        text: 'No 8, Ambedkar Nagar, Neyveli, Cuddalore - 607804',
      },
    ],
  },
]

export default function Contact() {
  return (
    <main>
      <PageHero
        crumb="Contact"
        eyebrow="Get in touch"
        title={
          <>
            Let's talk about your <span className="text-primary">project</span>
          </>
        }
        description="Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible."
      />

      <section className="bg-mist py-24 text-ink md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid gap-7 md:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <div
                  className={`${c.bg} ${c.dark ? 'text-white' : 'text-ink'} flex h-full flex-col rounded-3xl p-8 shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-2xl`}
                  style={{ rotate: `${c.tilt}deg` }}
                >
                  <h3 className="font-display text-3xl uppercase leading-none">{c.title}</h3>
                  <p className={`mb-6 mt-2 text-sm font-bold ${c.dark ? 'text-white/60' : 'text-ink/60'}`}>{c.label}</p>
                  <div className="flex flex-col items-start gap-2.5">
                    {c.links.map((l) => (
                      <a
                        key={l.text}
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                        className={`link-underline break-words font-semibold transition-colors ${
                          c.dark ? 'text-white/85 hover:text-primary' : 'text-ink/85 hover:text-ink'
                        }`}
                      >
                        {l.text}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-ink p-10 text-white md:grid-cols-2 md:p-14">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary opacity-20 blur-[100px]" />
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />
              <div className="relative">
                <h3 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] uppercase leading-[0.95] tracking-tight">
                  Need immediate <span className="text-primary">assistance?</span>
                </h3>
                <p className="mt-4 leading-relaxed text-white/60">
                  Connect with our team instantly. We're here to help you with all your construction needs.
                </p>
                <div className="mt-7 flex items-start gap-3 text-white/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    <strong className="text-white">Mon – Sat:</strong> 9:00 AM – 6:00 PM
                    <br />
                    <strong className="text-white">Sunday:</strong> Closed
                  </p>
                </div>
                <a
                  href="https://wa.me/917305693530"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex rotate-[-2deg] items-center gap-2 rounded-2xl bg-[#25D366] px-7 py-4 font-display text-lg uppercase text-ink shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
              <img src="/images/we-offer.jpg" alt="DNA Constructions engineer reviewing plans on site" className="relative hidden h-80 w-full rounded-[2rem] object-cover shadow-2xl md:block" />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
