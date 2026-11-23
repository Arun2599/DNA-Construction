import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import Fmt from './Fmt'
import { fallbackContent, useContent } from '../lib/content'

/* A real 3D house in plain CSS 3D (no WebGL, no extra library): every surface is a div in a
   preserve-3d world, so the GPU composites it. Scroll drives a camera around it while it is
   built — blueprint wireframe → foundation → frame → walls → lit at dusk → fly into the living room.

   Rule that keeps it glitch-free: never fade an element that has preserve-3d (opacity flattens
   it). Fades target `.face` leaves; wrappers only get transforms. */

const W = 420 // footprint width (x)
const D = 300 // footprint depth (z)
const H = 130 // floor height
const PL = 16 // plinth height
const NAVY = '#071a2e'

const CONCRETE: Shade = ['#aab0b7', '#8a9097', '#c4c9ce']
const BRICK_BG = (base: string) =>
  `repeating-linear-gradient(0deg, #6e2f20 0 1px, transparent 1px 11px), repeating-linear-gradient(90deg, #6e2f20 0 1px, transparent 1px 26px), ${base}`

type Shade = [front: string, side: string, top: string]
type Faces = { front?: ReactNode; back?: ReactNode; left?: ReactNode; right?: ReactNode }

/** A box standing on (x, y, z) — y is its bottom (CSS y points down, so "up" is negative). */
function Box({
  w,
  h,
  d,
  x = 0,
  y = 0,
  z = 0,
  c = CONCRETE,
  className = '',
  wire = false,
  faces = {},
}: {
  w: number
  h: number
  d: number
  x?: number
  y?: number
  z?: number
  c?: Shade
  className?: string
  wire?: boolean
  faces?: Faces
}) {
  const face = (key: string, fw: number, fh: number, transform: string, bg: string, child?: ReactNode) => (
    <div
      key={key}
      className={`face absolute overflow-hidden ${wire ? 'p3-gf border border-[#8fe3ff]/70' : ''}`}
      style={{ width: fw, height: fh, left: -fw / 2, top: -fh / 2, transform, background: wire ? 'rgba(143,227,255,0.05)' : bg }}
    >
      {child}
    </div>
  )
  return (
    <div className={`absolute left-0 top-0 ${className}`} style={{ translate: `${x}px ${y}px ${z}px`, transformStyle: 'preserve-3d' }}>
      {face('f', w, h, `translateY(${-h / 2}px) translateZ(${d / 2}px)`, c[0], faces.front)}
      {face('b', w, h, `translateY(${-h / 2}px) rotateY(180deg) translateZ(${d / 2}px)`, c[0], faces.back)}
      {face('r', d, h, `translateY(${-h / 2}px) rotateY(90deg) translateZ(${w / 2}px)`, c[1], faces.right)}
      {face('l', d, h, `translateY(${-h / 2}px) rotateY(-90deg) translateZ(${w / 2}px)`, c[1], faces.left)}
      {face('t', w, d, `translateY(${-h}px) rotateX(90deg)`, c[2])}
    </div>
  )
}

/** A flat plane lying on the ground at height y (for floors, rugs, glows). */
function Floor({ w, d, y = 0, x = 0, z = 0, bg, className = '' }: { w: number; d: number; y?: number; x?: number; z?: number; bg: string; className?: string }) {
  return (
    <div
      className={`face absolute ${className}`}
      style={{ width: w, height: d, left: -w / 2, top: -d / 2, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(90deg)`, background: bg }}
    />
  )
}

/** Window: dark glass that lights up warm at handover. */
function Win({ l, t, w, h }: { l: number; t: number; w: number; h: number }) {
  return (
    <div className="absolute border-[3px] border-[#2a2f36] bg-[#1c2c3e]" style={{ left: l, top: t, width: w, height: h }}>
      <div className="p3-glow absolute inset-0 bg-gradient-to-b from-[#ffd27a] to-[#F5B841]" />
      <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[#2a2f36]" />
    </div>
  )
}

/** Wall surface: brick underneath, plaster that fades in at handover, then the windows. */
function Skin({ plaster, children }: { plaster: string; children?: ReactNode }) {
  return (
    <>
      <div className="p3-paint absolute inset-0" style={{ background: plaster }} />
      {children}
    </>
  )
}

/** Two crossed planes read as a round tree from any camera angle. */
function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  const plane = (r: number) => (
    <div
      key={r}
      className="face absolute"
      style={{
        width: 100 * s,
        height: 140 * s,
        left: (-100 * s) / 2,
        top: -140 * s,
        transform: `rotateY(${r}deg)`,
        background:
          'radial-gradient(circle at 50% 36%, #3a9460 0 33%, #2f7d4f 34% 38%, transparent 39%), linear-gradient(#4a3424, #4a3424) 50% 100% / 8% 42% no-repeat',
      }}
    />
  )
  return (
    <div className="p3-tree absolute left-0 top-0" style={{ translate: `${x}px 0px ${z}px`, transformStyle: 'preserve-3d' }}>
      {plane(0)}
      {plane(90)}
    </div>
  )
}

const parseStages = (raw: string) => {
  const fallback = fallbackContent.buildStages.split('\n')
  const lines = raw.split('\n').filter((l) => l.trim())
  return fallback.map((f, i) => {
    const [title, text = ''] = (lines[i] ?? f).split('|').map((s) => s.trim())
    return { title, text }
  })
}

// poster sticker colour per stage (house palette)
const STICKERS = ['bg-white', 'bg-primary', 'bg-sun', 'bg-[#F4845F]', 'bg-[#6BBF7A]']

export default function Scene3D({ className = '' }: { className?: string }) {
  const c = useContent()
  const stages = parseStages(c.buildStages)
  const floorY = (f: number) => -(PL + f * H) // bottom of floor f
  const wallH = H - 12
  const plasterFront = '#f1ede6'
  const plasterSide = '#d8d1c6'

  return (
    <div className={`p3-scene overflow-hidden ${className}`}>
      <div className="p3-dusk pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1b2a4a] via-[#33284a]/90 to-[#071a2e]" />

      <div className="absolute inset-0" style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}>
        <div className="p3-world absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
          {/* ground: blueprint grid fading into the navy, with the plot marked out */}
          <div
            className="p3-ground face absolute"
            style={{
              width: 1500,
              height: 1500,
              left: -750,
              top: -750,
              transform: 'rotateX(90deg)',
              background: `radial-gradient(closest-side, transparent 55%, ${NAVY} 98%), linear-gradient(rgba(143,227,255,0.14) 1px, transparent 1px) 0 0 / 50px 50px, linear-gradient(90deg, rgba(143,227,255,0.14) 1px, transparent 1px) 0 0 / 50px 50px`,
            }}
          >
            <div className="p3-plot absolute left-1/2 top-1/2 -ml-[280px] -mt-[210px] h-[420px] w-[560px] border-2 border-dashed border-sun/80" />
          </div>
          <Floor className="p3-halo" w={900} d={900} y={-1} bg="radial-gradient(closest-side, rgba(245,184,65,0.45), transparent)" />

          {/* survey stakes at the plot corners */}
          {[
            [-280, 210],
            [280, 210],
            [-280, -210],
            [280, -210],
          ].map(([x, z]) => (
            <Box key={`${x}${z}`} className="p3-stake" w={6} h={46} d={6} x={x} z={z} c={['#F5B841', '#d99a2b', '#ffd27a']} />
          ))}

          {/* blueprint wireframe of the finished house */}
          <div className="p3-ghost absolute left-0 top-0" style={{ transformStyle: 'preserve-3d' }}>
            <Box wire w={W} h={2 * H + PL} d={D} />
            <Box wire w={W} h={H + PL} d={D} />
          </div>

          {/* 1 · foundation */}
          <Box className="p3-found" w={W + 24} h={PL} d={D + 24} />

          {/* 2 · RCC frame: columns + slabs (front ones fade for the fly-in) */}
          {[-W / 2 + 8, 0, W / 2 - 8].flatMap((x) =>
            [D / 2 - 8, -D / 2 + 8].map((z) => (
              <Box
                key={`${x}${z}`}
                className={`p3-col ${z > 0 ? 'p3-front' : ''}`}
                w={14}
                h={2 * H - 12}
                d={14}
                x={x}
                y={-PL}
                z={z}
                c={['#c9ccd1', '#a9adb3', '#dfe2e5']}
              />
            )),
          )}
          {[1, 2].map((f) => (
            <Box key={f} className="p3-slab" w={W + 12} h={12} d={D + 12} y={floorY(f) + 12} c={['#d7dade', '#b9bdc2', '#e9ebed']} />
          ))}

          {/* 3 · walls, per floor (front walls fade for the fly-in) */}
          {[0, 1].map((f) => (
            <Fragment key={f}>
              <Box
                className="p3-wall p3-front"
                w={W - 28}
                h={wallH}
                d={8}
                y={floorY(f)}
                z={D / 2 - 10}
                c={[BRICK_BG('#b5563a'), BRICK_BG('#9a4630'), '#b5563a']}
                faces={{
                  front: (
                    <Skin plaster={plasterFront}>
                      {f === 0 ? (
                        <>
                          <Win l={40} t={30} w={76} h={56} />
                          <div className="absolute bottom-0 left-1/2 h-[92px] w-[44px] -translate-x-1/2 bg-[#6b3f24]">
                            <div className="p3-glow absolute inset-x-[30%] top-2 h-3 bg-[#ffd27a]" />
                          </div>
                          <Win l={W - 28 - 116} t={30} w={76} h={56} />
                        </>
                      ) : (
                        <>
                          <Win l={40} t={30} w={76} h={56} />
                          <Win l={(W - 28) / 2 - 40} t={24} w={80} h={70} />
                          <Win l={W - 28 - 116} t={30} w={76} h={56} />
                        </>
                      )}
                    </Skin>
                  ),
                }}
              />
              <Box
                className="p3-wall"
                w={W - 28}
                h={wallH}
                d={8}
                y={floorY(f)}
                z={-D / 2 + 10}
                c={[BRICK_BG('#b5563a'), BRICK_BG('#9a4630'), '#b5563a']}
                faces={{
                  // inward face of the back wall: the living-room wall you see after the fly-in
                  front: (
                    <Skin plaster={f === 0 ? '#e9e2d6' : plasterFront}>
                      {f === 0 && (
                        <>
                          <div className="absolute left-[18%] top-[22%] h-[44px] w-[70px] border-4 border-[#2a2f36] bg-gradient-to-br from-[#4cc9f0] to-[#6BBF7A]" />
                          <div className="absolute left-[40%] top-[16%] h-[58px] w-[46px] border-4 border-[#2a2f36] bg-gradient-to-br from-[#F4845F] to-[#F5B841]" />
                        </>
                      )}
                    </Skin>
                  ),
                  back: (
                    <Skin plaster={plasterFront}>
                      <Win l={70} t={30} w={70} h={52} />
                      <Win l={W - 28 - 140} t={30} w={70} h={52} />
                    </Skin>
                  ),
                }}
              />
              {[-1, 1].map((side) => (
                <Box
                  key={side}
                  className="p3-wall"
                  w={8}
                  h={wallH}
                  d={D - 28}
                  x={side * (W / 2 - 10)}
                  y={floorY(f)}
                  c={[BRICK_BG('#9a4630'), BRICK_BG('#9a4630'), '#b5563a']}
                  faces={{
                    [side > 0 ? 'right' : 'left']: (
                      <Skin plaster={plasterSide}>
                        <Win l={(D - 28) / 2 - 34} t={30} w={68} h={52} />
                      </Skin>
                    ),
                    // inner face: plastered room wall for the fly-in
                    [side > 0 ? 'left' : 'right']: <Skin plaster="#e9e2d6" />,
                  }}
                />
              ))}
            </Fragment>
          ))}

          {/* 4 · roof parapet in the brand blue */}
          <Box className="p3-roof" w={W + 12} h={22} d={D + 12} y={floorY(2)} c={['#4cc9f0', '#2fa3cc', '#8fe3ff']} />

          {/* tower crane: arrives for the frame, leaves before handover */}
          <div className="p3-crane absolute left-0 top-0" style={{ transformStyle: 'preserve-3d' }}>
            <Box
              w={18}
              h={470}
              d={18}
              x={W / 2 + 150}
              z={-170}
              c={[
                'repeating-linear-gradient(45deg, #F5B841 0 3px, transparent 3px 16px), linear-gradient(90deg, #F5B841 3px, transparent 3px calc(100% - 3px), #F5B841 0)',
                'repeating-linear-gradient(-45deg, #d99a2b 0 3px, transparent 3px 16px), linear-gradient(90deg, #d99a2b 3px, transparent 3px calc(100% - 3px), #d99a2b 0)',
                '#F5B841',
              ]}
            />
            <Box w={400} h={10} d={12} x={W / 2 + 30} y={-470} z={-170} c={['#F5B841', '#d99a2b', '#ffd27a']} />
            <Box w={44} h={30} d={22} x={W / 2 + 210} y={-450} z={-170} c={['#2a2f36', '#1d2228', '#3a4048']} />
            <Box w={3} h={120} d={3} x={W / 2 - 120} y={-350} z={-170} c={['#c9ccd1', '#c9ccd1', '#c9ccd1']} />
          </div>

          <Tree x={-W / 2 - 90} z={90} />
          <Tree x={W / 2 + 80} z={110} s={1.25} />
          <Tree x={-W / 2 - 40} z={-150} s={0.9} />

          {/* living room, revealed when the camera flies through the front wall */}
          <div className="p3-int absolute left-0 top-0" style={{ transformStyle: 'preserve-3d' }}>
            <Floor w={W - 30} d={D - 30} y={-PL - 1} bg="repeating-linear-gradient(90deg, #a87447 0 38px, #9c6a3f 38px 40px)" />
            <Floor w={220} d={130} y={-PL - 2} z={10} bg="#F5B841" />
            <Box w={160} h={34} d={56} x={-20} y={-PL} z={-D / 2 + 62} c={['#F4845F', '#d96a47', '#ff9b78']} />
            <Box w={160} h={66} d={16} x={-20} y={-PL} z={-D / 2 + 34} c={['#e57653', '#c95f3e', '#ff9b78']} />
            <Box w={76} h={20} d={42} x={-20} y={-PL} z={20} c={['#7a5232', '#5f3f26', '#8d6240']} />
            <Box w={4} h={104} d={4} x={120} y={-PL} z={-D / 2 + 50} c={['#2a2f36', '#2a2f36', '#2a2f36']} />
            <Box w={36} h={28} d={36} x={120} y={-PL - 104} z={-D / 2 + 50} c={['#ffd27a', '#F5B841', '#fff1c9']} />
            <Floor w={260} d={200} y={-PL - 3} x={60} z={-40} bg="radial-gradient(closest-side, rgba(255,210,122,0.55), transparent)" />
          </div>
        </div>
      </div>

      {/* laser scan that sweeps across while the blueprint appears */}
      <div className="p3-scanw pointer-events-none invisible absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-[#c9f3ff] shadow-[0_0_40px_10px_rgba(143,227,255,0.45)]" />
      </div>

      {/* stage stickers + progress */}
      <div className="bs-chips pointer-events-none absolute bottom-8 left-5 right-5 grid max-w-sm md:bottom-12 md:left-10">
        {stages.map((st, i) => (
          <div
            key={i}
            className={`bs-txt col-start-1 row-start-1 rounded-2xl px-5 py-3 text-ink shadow-2xl shadow-black/40 ${STICKERS[i % STICKERS.length]}`}
            style={{ rotate: `${i % 2 ? 2 : -2.5}deg` }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl uppercase leading-none md:text-2xl">{st.title}</h3>
              <span className="font-display text-sm text-ink/40">0{i + 1}/05</span>
            </div>
            <p className="mt-1 text-xs font-medium leading-snug text-ink/75 md:text-sm">{st.text}</p>
          </div>
        ))}
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
          <div className="bs-bar h-full origin-left bg-primary" />
        </div>
      </div>

      {/* finale: inside the living room */}
      <div className="p3-finale absolute inset-x-0 top-[13%] z-10 px-5 text-center">
        <h2 className="font-display text-[clamp(3.4rem,12vw,10rem)] uppercase leading-[0.85] tracking-tight text-white [text-shadow:0_8px_40px_rgba(0,0,0,0.45)]">
          <Fmt text={c.buildFinale} />
        </h2>
        <Link
          to="/contact"
          className="mt-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-2xl bg-sun px-7 py-4 font-display text-lg uppercase text-ink shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-105"
        >
          {c.buildFinaleCta} →
        </Link>
      </div>
    </div>
  )
}

/* ---------------- motion ---------------- */

type Cam = { rx: number; ry: number; zoom: number; s: number; sxv: number; sy: number; fx: number; fy: number; fz: number; idle: number }

const writeCamera = (scene: HTMLElement, world: HTMLElement, cam: Cam, extraRx = 0, extraRy = 0) => {
  const k = Math.min(scene.clientWidth / 700, scene.clientHeight / 800) * cam.s
  world.style.transform =
    `translate3d(${cam.sxv * scene.clientWidth}px, ${cam.sy}px, ${cam.zoom}px) scale3d(${k}, ${k}, ${k}) ` +
    `rotateX(${cam.rx + extraRx}deg) rotateY(${cam.ry + extraRy}deg) translate3d(${-cam.fx}px, ${-cam.fy}px, ${-cam.fz}px)`
}

/** Static finished view for reduced motion. */
export function staticScene(scene: HTMLElement) {
  const q = gsap.utils.selector(scene)
  gsap.set(q('.p3-ghost .face, .p3-crane .face, .p3-stake .face, .p3-finale, .p3-int .face, .p3-plot'), { autoAlpha: 0 })
  writeCamera(scene, q('.p3-world')[0] as HTMLElement, { rx: -16, ry: 28, zoom: 0, s: 1, sxv: 0, sy: 40, fx: 0, fy: -140, fz: 0, idle: 0 })
}

/**
 * Wires the camera + build timeline. `sxv` frames the house off-centre at rest (desktop: right of
 * the headline). `onStart` lets the caller add its own tweens at the very start (e.g. fade the hero copy).
 * `finale` overrides the end camera. `inside: false` skips the fly-through and ends on the lit house
 * instead — portrait screens can't frame the wide, low living room without the slabs looming in.
 * `entry` scrubs a camera swoop while the stage scrolls into view, before it pins (phones).
 * Returns a cleanup.
 */
export function playScene(
  scene: HTMLElement,
  scrollTrigger: ScrollTrigger.Vars,
  {
    sxv = 0,
    onStart,
    finale,
    entry = false,
    inside = true,
  }: { sxv?: number; onStart?: (tl: gsap.core.Timeline) => void; finale?: Partial<Cam>; entry?: boolean; inside?: boolean } = {},
) {
  const q = gsap.utils.selector(scene)
  const world = q('.p3-world')[0] as HTMLElement
  const cam: Cam = { rx: -22, ry: -35, zoom: 0, s: 0.95, sxv, sy: 40, fx: 0, fy: -140, fz: 0, idle: 1 }
  const sway = { ry: -6 }
  const mouse = { rx: 0, ry: 0 }
  // entry swoop: p = 1 while the stage is still below the fold, 0 once it pins
  const enter = { p: entry ? 1 : 0 }

  // camera is written once per frame from three sources: scroll (cam), idle sway, pointer
  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(scene)
  const tick = () => {
    if (!visible) return
    if (enter.p) {
      const e = enter.p
      writeCamera(scene, world, { ...cam, s: cam.s * (1 - 0.3 * e), sy: cam.sy + 160 * e }, mouse.rx - 38 * e, sway.ry * cam.idle - 50 * e)
    } else writeCamera(scene, world, cam, mouse.rx, sway.ry * cam.idle + mouse.ry)
  }
  gsap.ticker.add(tick)
  tick()
  const swayTw = gsap.to(sway, { ry: 6, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  const enterTw = entry
    ? gsap.to(enter, { p: 0, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top top', scrub: true } })
    : undefined

  let onMove: ((e: PointerEvent) => void) | undefined
  if (matchMedia('(pointer: fine)').matches) {
    const mx = gsap.quickTo(mouse, 'ry', { duration: 1.4, ease: 'power3' })
    const my = gsap.quickTo(mouse, 'rx', { duration: 1.4, ease: 'power3' })
    onMove = (e) => {
      mx((e.clientX / innerWidth - 0.5) * 14)
      my((e.clientY / innerHeight - 0.5) * -8)
    }
    window.addEventListener('pointermove', onMove)
  }

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger })
  gsap.set(q('.bs-txt:not(:first-child)'), { autoAlpha: 0, yPercent: 60 })
  const text = (i: number) =>
    tl
      .to(q(`.bs-txt:nth-child(${i})`), { autoAlpha: 0, yPercent: -60, duration: 0.3 }, `s${i}`)
      .to(q(`.bs-txt:nth-child(${i + 1})`), { autoAlpha: 1, yPercent: 0, duration: 0.4 }, `s${i}+=0.15`)

  // 0 · plot: camera swings round to centre the plot, stickers arrive
  tl.addLabel('s0')
  onStart?.(tl)
  tl.to(cam, { sxv: 0, rx: -28, ry: -18, s: 1, sy: 30, duration: 1, ease: 'power2.inOut' }, 's0')
    .from(q('.bs-chips'), { autoAlpha: 0, y: 30, duration: 0.5 }, 's0+=0.3')

  // 1 · foundation
  tl.addLabel('s1')
  text(1)
  tl.to(q('.p3-stake .face'), { autoAlpha: 0, duration: 0.3 }, 's1')
    .from(q('.p3-found'), { scaleY: 0, duration: 0.6 }, 's1')
    .to(cam, { ry: 0, rx: -26, duration: 1 }, 's1')

  // 2 · frame: crane swings in, columns rise, slabs drop into place
  tl.addLabel('s2')
  text(2)
  tl.from(q('.p3-crane'), { x: 700, duration: 0.7 }, 's2')
    .from(q('.p3-crane .face'), { autoAlpha: 0, duration: 0.3 }, 's2')
    .from(q('.p3-col'), { scaleY: 0, stagger: 0.05, duration: 0.6 }, 's2+=0.2')
    .from(q('.p3-slab'), { y: -420, stagger: 0.3, duration: 0.6, ease: 'power4.out' }, '>-0.1')
    .from(q('.p3-slab .face'), { autoAlpha: 0, stagger: 0.3, duration: 0.2 }, '<')
    .to(cam, { ry: 26, rx: -22, duration: 1.6 }, 's2')

  // 3 · walls go up course by course
  tl.addLabel('s3')
  text(3)
  tl.from(q('.p3-wall'), { scaleY: 0, stagger: 0.06, duration: 0.5 }, 's3')
    .to(cam, { ry: 40, rx: -18, s: 1.05, duration: 1.2 }, 's3')

  // 4 · handover: crane leaves, plaster, roof, trees, dusk and the lights come on
  tl.addLabel('s4')
  text(4)
  tl.to(q('.p3-crane'), { x: 700, duration: 0.6 }, 's4')
    .to(q('.p3-crane .face, .p3-ghost .face, .p3-plot'), { autoAlpha: 0, duration: 0.5 }, 's4')
    .from(q('.p3-paint'), { opacity: 0, stagger: 0.015, duration: 0.5 }, 's4+=0.1')
    .from(q('.p3-roof'), { scaleY: 0, duration: 0.4 }, '<')
    .from(q('.p3-tree'), { scale: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(2)' }, '<0.1')
    .from(q('.p3-dusk'), { autoAlpha: 0, duration: 0.6 }, '<')
    .from(q('.p3-glow'), { opacity: 0, stagger: 0.03, duration: 0.4 }, '<0.2')
    .from(q('.p3-halo'), { opacity: 0, duration: 0.6 }, '<')
    .to(cam, { ry: 16, rx: -12, s: 1, duration: 1 }, 's4')

  // 5 · fly through the front wall into the lit living room (or, inside: false, a hero shot of the lit house)
  tl.addLabel('s5')
  tl.to(q('.bs-chips'), { autoAlpha: 0, duration: 0.3 }, 's5')
  if (inside)
    tl.from(q('.p3-int .face'), { autoAlpha: 0, duration: 0.3 }, 's5')
      .to(cam, { ry: 0, rx: -6, zoom: 640, fy: -80, fz: 30, sy: 60, idle: 0.2, ...finale, duration: 1.6, ease: 'power2.inOut' }, 's5')
      .to(q('.p3-front .face'), { autoAlpha: 0, duration: 0.5 }, 's5+=0.35')
  else tl.to(cam, { ry: 20, rx: -16, s: 1, sy: 120, idle: 0.6, ...finale, duration: 1.6, ease: 'power2.inOut' }, 's5')
  tl.from(q('.p3-finale'), { autoAlpha: 0, y: 50, duration: 0.6 }, 's5+=1.1').to({}, { duration: 0.5 })

  tl.fromTo(q('.bs-bar'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.labels.s5 }, 0)

  return () => {
    gsap.ticker.remove(tick)
    io.disconnect()
    swayTw.kill()
    enterTw?.scrollTrigger?.kill()
    enterTw?.kill()
    if (onMove) window.removeEventListener('pointermove', onMove)
    tl.scrollTrigger?.kill()
    tl.revert()
  }
}

/** Intro beats for the landing (runs once on load, before any scrolling). */
export function introScene(intro: gsap.core.Timeline, scene: HTMLElement, at: number) {
  const q = gsap.utils.selector(scene)
  intro
    .fromTo(q('.p3-ground'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, at)
    .fromTo(q('.p3-scanw'), { xPercent: -5, autoAlpha: 1 }, { xPercent: 100, duration: 1.9, ease: 'power2.inOut' }, at)
    .to(q('.p3-scanw'), { autoAlpha: 0, duration: 0.3 }, at + 1.9)
    .fromTo(q('.p3-plot'), { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'expo.out' }, at + 0.3)
    .fromTo(q('.p3-gf'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.06 }, at + 0.5)
    .fromTo(q('.p3-stake'), { scaleY: 0 }, { scaleY: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(2)' }, at + 0.9)
}
