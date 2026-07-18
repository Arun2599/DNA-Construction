import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { auth, db, firebaseReady } from '../lib/firebase'
import { CATEGORIES, fallbackContent, fallbackSettings, uploadImage } from '../lib/content'

type Row = Record<string, string | number | boolean | undefined> & { id?: string }

type Field = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'image' | 'gallery'
  options?: string[]
  maxLength?: number
}

const inputCls =
  'w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary'
const btnDark =
  'rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50'
const btnPrimary =
  'rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-all hover:scale-105 active:scale-95 disabled:opacity-50'

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field
  value: unknown
  onChange: (v: string | number | boolean) => void
}) {
  const [uploading, setUploading] = useState(false)

  if (field.type === 'textarea')
    return (
      <div>
        <textarea
          className={`${inputCls} min-h-24`}
          maxLength={field.maxLength}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.maxLength && (
          <span className="mt-1 block text-right text-[11px] font-bold text-ink/40">
            {String(value ?? '').length}/{field.maxLength}
          </span>
        )}
      </div>
    )

  if (field.type === 'checkbox')
    return (
      <label className="flex h-11 items-center gap-2 text-sm font-semibold text-ink/70">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[#4cc9f0]"
        />
        Yes
      </label>
    )

  if (field.type === 'select')
    return (
      <select className={inputCls} value={String(value ?? field.options?.[0] ?? '')} onChange={(e) => onChange(e.target.value)}>
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    )

  if (field.type === 'gallery') {
    const urls = String(value ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      try {
        onChange([...urls, await uploadImage(file)].join(', '))
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    }
    return (
      <div className="flex flex-col gap-2">
        <textarea
          className={`${inputCls} min-h-20`}
          placeholder="Image URLs, comma separated (or upload below to add)"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" accept="image/*" onChange={onFile} className="text-xs font-semibold text-ink/60" />
          {uploading && <span className="text-xs font-bold text-primary-dark">Uploading…</span>}
          {urls.map((u) => (
            <img key={u} src={u} alt="" className="h-10 w-14 rounded-lg object-cover shadow" />
          ))}
        </div>
      </div>
    )
  }

  if (field.type === 'image') {
    const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      try {
        onChange(await uploadImage(file))
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    }
    return (
      <div className="flex flex-col gap-2">
        <input
          className={inputCls}
          placeholder="Image URL (or upload below)"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onFile} className="text-xs font-semibold text-ink/60" />
          {uploading && <span className="text-xs font-bold text-primary-dark">Uploading…</span>}
          {typeof value === 'string' && value && (
            <img src={value} alt="" className="h-10 w-14 rounded-lg object-cover shadow" />
          )}
        </div>
      </div>
    )
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      className={inputCls}
      maxLength={field.maxLength}
      value={String(value ?? '')}
      onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
    />
  )
}

function CollectionEditor({
  name,
  fields,
  rowTitle,
  rowSub,
}: {
  name: string
  fields: Field[]
  rowTitle: string
  rowSub?: string
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const snap = await getDocs(query(collection(db, name), orderBy('order', 'asc')))
    setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  }, [name])

  useEffect(() => {
    load().catch(() => setRows([]))
  }, [load])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setBusy(true)
    try {
      const { id, ...data } = editing
      if (id) await updateDoc(doc(db, name, id), data)
      else await addDoc(collection(db, name), data)
      setEditing(null)
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (row: Row) => {
    if (!row.id || !confirm(`Delete "${String(row[rowTitle])}"?`)) return
    await deleteDoc(doc(db, name, row.id))
    await load()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink/50">
          {rows.length} item{rows.length === 1 ? '' : 's'}
        </p>
        <button
          className={btnPrimary}
          onClick={() => setEditing({ order: rows.length + 1 })}
        >
          + Add new
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="rounded-3xl border-2 border-primary/40 bg-white p-5 shadow-xl md:p-7">
          <h3 className="mb-5 font-display text-xl uppercase text-ink">{editing.id ? 'Edit item' : 'New item'}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''}>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">{f.label}</span>
                <FieldInput field={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
              </label>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={busy} className={btnDark}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink/60 transition-all hover:border-ink hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            {typeof r.img === 'string' && r.img && (
              <img src={r.img} alt="" className="h-12 w-16 rounded-lg object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg uppercase leading-tight text-ink">{String(r[rowTitle] ?? '')}</p>
              {rowSub && <p className="truncate text-xs font-semibold text-ink/50">{String(r[rowSub] ?? '')}</p>}
            </div>
            {r.featured === true && (
              <span className="rounded-full bg-sun px-3 py-1 text-[10px] font-bold uppercase text-ink">Featured</span>
            )}
            <div className="flex gap-2">
              <button className={btnDark} onClick={() => setEditing(r)}>
                Edit
              </button>
              <button
                className="rounded-full border-2 border-red-200 px-4 py-2.5 text-xs font-bold uppercase text-red-500 transition-all hover:border-red-500"
                onClick={() => remove(r)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && !editing && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-ink/40">
            Nothing here yet — the website is showing its built-in fallback content. Add your first item.
          </p>
        )}
      </div>
    </div>
  )
}

type DocField =
  | { key: string; label: string; type?: 'number' | 'textarea' }
  | { heading: string }

const settingsFields: DocField[] = [
  { key: 'statProjects', label: 'Stat: projects done', type: 'number' },
  { key: 'statYears', label: 'Stat: years experience', type: 'number' },
  { key: 'statClients', label: 'Stat: happy clients %', type: 'number' },
  { key: 'phone1', label: 'Phone 1' },
  { key: 'phone2', label: 'Phone 2' },
  { key: 'email1', label: 'Email 1' },
  { key: 'email2', label: 'Email 2' },
  { key: 'address', label: 'Office address' },
  { key: 'hoursWeek', label: 'Hours (Mon–Sat)' },
  { key: 'hoursSunday', label: 'Hours (Sunday)' },
  { key: 'whatsapp', label: 'WhatsApp link' },
  { key: 'instagram', label: 'Instagram link' },
  { key: 'youtube', label: 'YouTube link' },
]

const contentFields: DocField[] = [
  { heading: 'Home — hero' },
  { key: 'heroBadge', label: 'Top badge' },
  { key: 'heroTitle', label: 'Big headline', type: 'textarea' },
  { key: 'rotatingWords', label: 'Rotating words (comma separated)' },
  { key: 'taglinePrefix', label: 'Tagline before rotating word' },
  { key: 'taglineSuffix', label: 'Tagline after rotating word' },
  { key: 'heroDesc', label: 'Hero description', type: 'textarea' },
  { heading: 'Home — about us' },
  { key: 'aboutTitle', label: 'About heading', type: 'textarea' },
  { key: 'aboutText', label: 'About paragraph', type: 'textarea' },
  { key: 'aboutChips', label: 'Chips (comma separated)' },
  { key: 'aboutBadgeTeam', label: 'Photo badge (top)' },
  { key: 'aboutBadgeSince', label: 'Photo badge (bottom)' },
  { heading: 'Home — vision / mission / goals' },
  { key: 'visionTitle', label: 'Card 1 title' },
  { key: 'visionText', label: 'Card 1 text', type: 'textarea' },
  { key: 'missionTitle', label: 'Card 2 title' },
  { key: 'missionText', label: 'Card 2 text', type: 'textarea' },
  { key: 'goalsTitle', label: 'Card 3 title' },
  { key: 'goalsText', label: 'Card 3 text', type: 'textarea' },
  { heading: 'Home — section headings' },
  { key: 'servicesTitle', label: 'Services heading' },
  { key: 'projectsTitle', label: 'Featured projects heading' },
  { key: 'testimonialsTitle', label: 'Testimonials heading' },
  { key: 'ctaEyebrow', label: 'Bottom CTA small line' },
  { key: 'ctaTitle', label: 'Bottom CTA headline', type: 'textarea' },
  { heading: 'Services page' },
  { key: 'offerTitle', label: 'Page heading' },
  { key: 'offerDesc', label: 'Page intro', type: 'textarea' },
  { key: 'offerCtaEyebrow', label: 'CTA small line' },
  { key: 'offerCtaTitle', label: 'CTA headline', type: 'textarea' },
  { heading: 'Projects page' },
  { key: 'projectsHeroTitle', label: 'Page heading' },
  { key: 'projectsHeroDesc', label: 'Page intro', type: 'textarea' },
  { heading: 'Contact page' },
  { key: 'contactHeroTitle', label: 'Page heading' },
  { key: 'contactHeroDesc', label: 'Page intro', type: 'textarea' },
  { key: 'contactPanelTitle', label: 'Assistance panel heading' },
  { key: 'contactPanelText', label: 'Assistance panel text', type: 'textarea' },
  { heading: 'Footer' },
  { key: 'footerTagline', label: 'Footer tagline' },
  { key: 'footerMarquee', label: 'Scrolling marquee words (comma separated)' },
]

/** Edits one settings/<docId> document as a flat form. */
function DocForm({
  docId,
  fields,
  fallback,
  hint,
}: {
  docId: string
  fields: DocField[]
  fallback: Record<string, string | number>
  hint?: string
}) {
  const [values, setValues] = useState<Record<string, string | number>>(fallback)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', docId))
      .then((snap) => {
        if (snap.exists()) setValues({ ...fallback, ...(snap.data() as Record<string, string | number>) })
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await setDoc(doc(db, 'settings', docId), values)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
      {hint && <p className="mb-5 rounded-2xl bg-mist p-4 text-xs font-semibold text-ink/60">{hint}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) =>
          'heading' in f ? (
            <h3 key={f.heading} className="mt-3 font-display text-lg uppercase text-ink sm:col-span-2 lg:col-span-3">
              {f.heading}
            </h3>
          ) : (
            <label key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">{f.label}</span>
              {f.type === 'textarea' ? (
                <textarea
                  className={`${inputCls} min-h-20`}
                  value={String(values[f.key] ?? '')}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  className={inputCls}
                  value={String(values[f.key] ?? '')}
                  onChange={(e) =>
                    setValues({ ...values, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })
                  }
                />
              )}
            </label>
          ),
        )}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button type="submit" disabled={busy} className={btnDark}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        {saved && <span className="text-sm font-bold text-green-600">Saved ✓</span>}
      </div>
    </form>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Wrong email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="font-display text-3xl uppercase text-ink">
          DNA <span className="text-primary-dark">Admin</span>
        </h1>
        <p className="mb-6 mt-1 text-sm font-semibold text-ink/50">Sign in to manage the website</p>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">Email</span>
          <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mb-6 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">Password</span>
          <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="mb-4 text-sm font-bold text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full py-3`}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

function SetupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="font-display text-3xl uppercase text-ink">
          Admin <span className="text-primary-dark">setup needed</span>
        </h1>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm font-medium leading-relaxed text-ink/80">
          <li>
            Create (or open) a project at <b>console.firebase.google.com</b>.
          </li>
          <li>
            Enable <b>Firestore Database</b> and <b>Authentication → Email/Password</b>, and add an admin user under
            Authentication → Users.
          </li>
          <li>
            Project settings → Your apps → add a <b>Web app</b> and copy its config values.
          </li>
          <li>
            In the project folder, copy <b>.env.example</b> to <b>.env</b> and paste the values.
          </li>
          <li>Restart the dev server (or rebuild) and reload this page.</li>
        </ol>
        <p className="mt-6 rounded-2xl bg-mist p-4 text-xs font-semibold text-ink/60">
          Until then the website keeps working with its built-in content — nothing is broken.
        </p>
      </div>
    </div>
  )
}

const tabs = [
  { key: 'projects', label: 'Projects' },
  { key: 'services', label: 'Services' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'pages', label: 'Page text' },
  { key: 'site', label: 'Site info' },
] as const

export default function AdminPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('projects')

  useEffect(() => {
    if (!firebaseReady) return
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])

  if (!firebaseReady) return <SetupScreen />
  if (user === undefined) return <div className="min-h-screen bg-ink" />
  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-mist pb-20 font-body text-ink">
      <header className="bg-ink px-5 py-5 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/dna-logo.svg" alt="" className="h-9 w-9" />
            <h1 className="font-display text-2xl uppercase leading-none">
              DNA <span className="text-primary">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-bold uppercase tracking-wide text-white/60 transition-colors hover:text-primary">
              View site ↗
            </a>
            <button onClick={() => signOut(auth)} className={btnPrimary}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 md:px-5">
        <div className="sticky top-0 z-30 -mx-4 bg-mist/90 px-4 py-4 backdrop-blur-md md:-mx-5 md:px-5">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
                  tab === t.key ? 'bg-ink text-white shadow-md' : 'bg-white text-ink/60 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'projects' && (
          <CollectionEditor
            name="projects"
            rowTitle="title"
            rowSub="category"
            fields={[
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
              { key: 'desc', label: 'Short description', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'year', label: 'Year', type: 'text' },
              { key: 'order', label: 'Order', type: 'number' },
              { key: 'img', label: 'Main image', type: 'image' },
              { key: 'longDesc', label: 'Full write-up (detail page)', type: 'textarea' },
              { key: 'gallery', label: 'Gallery images (detail page)', type: 'gallery' },
              { key: 'featured', label: 'Show on home page', type: 'checkbox' },
            ]}
          />
        )}
        {tab === 'services' && (
          <CollectionEditor
            name="services"
            rowTitle="title"
            fields={[
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'order', label: 'Order', type: 'number' },
              { key: 'desc', label: 'Description', type: 'textarea' },
              { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
            ]}
          />
        )}
        {tab === 'testimonials' && (
          <CollectionEditor
            name="testimonials"
            rowTitle="name"
            rowSub="place"
            fields={[
              { key: 'name', label: 'Client name', type: 'text', maxLength: 40 },
              { key: 'place', label: 'Place', type: 'text', maxLength: 30 },
              { key: 'order', label: 'Order', type: 'number' },
              { key: 'quote', label: 'Review (max 300 characters)', type: 'textarea', maxLength: 300 },
            ]}
          />
        )}
        {tab === 'pages' && (
          <DocForm
            docId="content"
            fields={contentFields}
            fallback={fallbackContent}
            hint="Tip: wrap a word in stars to color it — *dream* — and press Enter in a headline box for a line break. Comma-separated fields become individual chips/words."
          />
        )}
        {tab === 'site' && <DocForm docId="site" fields={settingsFields} fallback={fallbackSettings} />}
      </main>
    </div>
  )
}
