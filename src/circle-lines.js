// Op-art "circle lines": rings of radial bars swept clockwise, neighbouring
// rings half a turn apart so mid-sweep they read as one spiral.
// createCircleLines loops it; revealWithCircleLines plays it once, drawing
// an image in through the bars.

const BARS_PER_RING = 36
// Ring edges as fractions of the outer radius; inside the last is the empty core.
const RING_EDGES = [1, 0.59, 0.345, 0.2, 0.12]

// widthAt(sweep) gives a bar's width as a fraction of its ring's outer
// radius; `sweep` runs 0 to 1 in the order the sweep reaches the bars.
const traceBars = (ctx, cx, cy, radius, widthAt) => {
  const step = (Math.PI * 2) / BARS_PER_RING

  for (let ring = 0; ring < RING_EDGES.length - 1; ring++) {
    const rOut = RING_EDGES[ring] * radius
    const rIn = RING_EDGES[ring + 1] * radius
    const startBar = ring % 2 === 0 ? 0 : BARS_PER_RING / 2 // odd rings start at 6 o'clock

    for (let bar = 0; bar < BARS_PER_RING; bar++) {
      // The sweep ends on startBar.
      const order = (bar - startBar - 1 + BARS_PER_RING * 2) % BARS_PER_RING
      const half = (widthAt(order / (BARS_PER_RING - 1)) * rOut) / 2
      if (half <= 0) continue

      // Clockwise from 12 o'clock; u runs along the bar, v across it.
      const angle = bar * step
      const ux = Math.sin(angle)
      const uy = -Math.cos(angle)
      const vx = -uy
      const vy = ux

      // One path, filled once, so overlaps don't double up under a translucent fill.
      ctx.moveTo(cx + ux * rIn - vx * half, cy + uy * rIn - vy * half)
      ctx.lineTo(cx + ux * rOut - vx * half, cy + uy * rOut - vy * half)
      ctx.lineTo(cx + ux * rOut + vx * half, cy + uy * rOut + vy * half)
      ctx.lineTo(cx + ux * rIn + vx * half, cy + uy * rIn + vy * half)
      ctx.closePath()
    }
  }
}

// False if the size was already right: setting it would only clear the canvas.
const fitCanvas = (canvas) => {
  const dpr = window.devicePixelRatio || 1
  const { width, height } = canvas.getBoundingClientRect()
  const w = Math.round(width * dpr)
  const h = Math.round(height * dpr)
  if (canvas.width === w && canvas.height === h) return false
  canvas.width = w
  canvas.height = h
  return true
}

// Looping animation

// Rest width, relative to the ring's outer radius: neighbours meet at the inner edge.
const BAR_WIDTH = 0.128
const MIN_WIDTH = 0.06 // thinnest, as a fraction of rest width

const LOOP_MS = 3750
const SWEEP_START_MS = 130 // when the first bar starts thinning
const SWEEP_MS = 2550 // first bar to last
const THIN_MS = 200 // full width -> hairline
const RECOVER_MS = 1000 // hairline -> full width
const STILL_MS = 1500 // reduced-motion still: mid-sweep, where the spiral is clearest

// A bar's width (fraction of rest) `elapsed` ms after the sweep reaches it.
const barWidth = (elapsed) => {
  if (elapsed <= 0 || elapsed >= THIN_MS + RECOVER_MS) return 1
  if (elapsed < THIN_MS) {
    const p = elapsed / THIN_MS
    return 1 - (1 - MIN_WIDTH) * p * p * (3 - 2 * p)
  }
  const p = (elapsed - THIN_MS) / RECOVER_MS
  return MIN_WIDTH + (1 - MIN_WIDTH) * p ** 2
}

const drawLoop = (ctx, color, t) => {
  const { width, height } = ctx.canvas
  const radius = (Math.min(width, height) / 2) * 0.98 // room for antialiasing

  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  traceBars(ctx, width / 2, height / 2, radius, (sweep) => {
    const startsAt = SWEEP_START_MS + sweep * SWEEP_MS
    // The last bars are still recovering as the next loop begins.
    return BAR_WIDTH * Math.min(barWidth(t - startsAt), barWidth(t + LOOP_MS - startsAt))
  })
  ctx.fillStyle = color
  ctx.fill()
}

// Loops in the container's CSS `color` (or options.color). The container
// needs a size, e.g. aspect-ratio: 1.
export const createCircleLines = (container, options = {}) => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.append(canvas)

  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let color = options.color
  let loopTime = 0
  let lastFrame = null
  let frameId = null
  let onScreen = false

  const render = () => drawLoop(ctx, color, reducedMotion.matches ? STILL_MS : loopTime)

  const tick = (now) => {
    // Capped so a throttled frame doesn't skip ahead.
    if (lastFrame !== null) loopTime = (loopTime + Math.min(now - lastFrame, 100)) % LOOP_MS
    lastFrame = now
    render()
    frameId = requestAnimationFrame(tick)
  }

  const start = () => {
    if (frameId !== null || !onScreen || reducedMotion.matches) return
    lastFrame = null
    frameId = requestAnimationFrame(tick)
  }

  const stop = () => {
    if (frameId !== null) cancelAnimationFrame(frameId)
    frameId = null
  }

  const resizeObserver = new ResizeObserver(() => {
    fitCanvas(canvas)
    color = options.color ?? getComputedStyle(container).color
    render()
  })
  resizeObserver.observe(canvas)

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    if (onScreen) start()
    else stop()
  })
  visibilityObserver.observe(canvas)

  const onMotionChange = () => {
    if (reducedMotion.matches) {
      stop()
      render()
    } else {
      start()
    }
  }
  reducedMotion.addEventListener('change', onMotionChange)

  return {
    destroy() {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      reducedMotion.removeEventListener('change', onMotionChange)
      canvas.remove()
    },
  }
}

// One-shot reveal

// Just wide enough for neighbouring bars to overlap out to the ring's outer edge.
const COVER_WIDTH = 2 * Math.sin(Math.PI / BARS_PER_RING) * 1.05
const HAIRLINE = 0.04 // first visible width, as a fraction of COVER_WIDTH

const REVEAL_SWEEP_MS = 2000 // first bar to last
const REVEAL_APPEAR_MS = 150 // nothing -> hairline
const REVEAL_GROW_MS = 1000 // hairline -> covering
const REVEAL_MS = REVEAL_SWEEP_MS + REVEAL_APPEAR_MS + REVEAL_GROW_MS
const REVEAL_CORE_MS = 600 // the core fills in over the last stretch
// Caps one frame's step, so a slow frame slows the reveal instead of skipping it.
const MAX_STEP_MS = 1000 / 30

// A bar's width (fraction of COVER_WIDTH) `elapsed` ms after the sweep
// reaches it. Smoothstep, so each bar settles into place rather than
// stopping dead at full width.
const revealWidth = (elapsed) => {
  if (elapsed <= 0) return 0
  if (elapsed < REVEAL_APPEAR_MS) return HAIRLINE * (elapsed / REVEAL_APPEAR_MS)
  const p = Math.min((elapsed - REVEAL_APPEAR_MS) / REVEAL_GROW_MS, 1)
  return HAIRLINE + (1 - HAIRLINE) * p * p * (3 - 2 * p)
}

const clamp01 = (x) => Math.min(Math.max(x, 0), 1)

// How a reveal plays: its length, each bar's width (fraction of
// COVER_WIDTH) at time t, and how far the core has filled in (0 to 1).
const classicReveal = {
  durationMs: REVEAL_MS,
  widthAt: (t, sweep) => revealWidth(t - sweep * REVEAL_SWEEP_MS),
  coreAt: (t) => 1 - (1 - clamp01((t - (REVEAL_MS - REVEAL_CORE_MS)) / REVEAL_CORE_MS)) ** 3,
}

// CSS cubic-bezier(x1, y1, x2, y2) as a function: progress 0..1 -> eased 0..1.
const cubicBezier = (x1, y1, x2, y2) => {
  const curve = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    // x(t) only ever increases, so bisect for the t that gives x.
    let lo = 0
    let hi = 1
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2
      if (curve(x1, x2, mid) < x) lo = mid
      else hi = mid
    }
    return curve(y1, y2, (lo + hi) / 2)
  }
}

// The smooth reveal eases everything out (Emil Kowalski's design
// engineering guidance: ease-out for anything entering, never ease-in): bars
// grow from nothing with a strong ease-out, the sweep slows as it comes
// round, and the core opens up while the bars are still sweeping in.
const STRONG_EASE_OUT = cubicBezier(0.23, 1, 0.32, 1)
const SWEEP_EASE_OUT = cubicBezier(0.25, 0.46, 0.45, 0.94) // gentler, so the spiral stays readable
// Same overall length as the classic reveal (REVEAL_MS).
const SMOOTH_SWEEP_MS = 2000 // first bar to last
const SMOOTH_GROW_MS = 1150 // nothing -> covering
const SMOOTH_MS = SMOOTH_SWEEP_MS + SMOOTH_GROW_MS
// The core opens while the sweep is still going, so the centre never sits empty.
const SMOOTH_CORE_START_MS = 600
const SMOOTH_CORE_MS = 1600

// When the eased sweep reaches each bar: the inverse of SWEEP_EASE_OUT, by
// bisection, for the BARS_PER_RING sweep positions traceBars asks about.
const smoothStarts = Array.from({ length: BARS_PER_RING }, (_, i) => {
  const sweep = i / (BARS_PER_RING - 1)
  let lo = 0
  let hi = 1
  for (let j = 0; j < 20; j++) {
    const mid = (lo + hi) / 2
    if (SWEEP_EASE_OUT(mid) < sweep) lo = mid
    else hi = mid
  }
  return ((lo + hi) / 2) * SMOOTH_SWEEP_MS
})

const smoothReveal = {
  durationMs: SMOOTH_MS,
  widthAt: (t, sweep) => {
    const startsAt = smoothStarts[Math.round(sweep * (BARS_PER_RING - 1))]
    return STRONG_EASE_OUT((t - startsAt) / SMOOTH_GROW_MS)
  },
  coreAt: (t) => STRONG_EASE_OUT((t - SMOOTH_CORE_START_MS) / SMOOTH_CORE_MS),
}

// Draws `image` (as object-fit: cover) in through the bars on a canvas over
// `container`, which needs a position. Resolves with the canvas removed once
// the image covers it, or straight away when `signal` aborts. `durationMs`
// plays the same motion faster or slower; the timing's own length otherwise.
const reveal = (timing) => (container, image, { signal, durationMs = timing.durationMs } = {}) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    container.append(canvas)

    const ctx = canvas.getContext('2d')
    let fill = null
    let t = 0
    let lastFrame = null
    let frameId = null

    // A pattern, so filling the bars' path paints the image inside them.
    const resize = () => {
      // Skips the observer's first callback, which follows this first call.
      if (!fitCanvas(canvas) && fill) return
      const layer = document.createElement('canvas')
      layer.width = canvas.width
      layer.height = canvas.height
      const scale = Math.max(layer.width / image.naturalWidth, layer.height / image.naturalHeight)
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      layer.getContext('2d').drawImage(image, (layer.width - width) / 2, (layer.height - height) / 2, width, height)
      fill = ctx.createPattern(layer, 'no-repeat')
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const finish = () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      canvas.remove()
      resolve()
    }
    signal?.addEventListener('abort', finish, { once: true })

    // The first frame carries the setup, so counting starts on the second.
    const frame = (now) => {
      if (lastFrame !== null) t += Math.min(now - lastFrame, MAX_STEP_MS)
      lastFrame = now
      // Where the timing is at, stretched or squeezed to last durationMs.
      const at = (t / durationMs) * timing.durationMs
      const { width, height } = canvas
      const cx = width / 2
      const cy = height / 2
      const radius = (Math.hypot(width, height) / 2) * 1.05 // reaches the corners

      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      traceBars(ctx, cx, cy, radius, (sweep) => COVER_WIDTH * timing.widthAt(at, sweep))

      const core = timing.coreAt(at)
      if (core > 0) {
        // 5% past the innermost ring's edge, so no seam shows.
        const coreRadius = RING_EDGES.at(-1) * radius * 1.05 * core
        ctx.moveTo(cx + coreRadius, cy)
        ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2)
      }

      ctx.fillStyle = fill
      ctx.fill()

      if (t >= durationMs) finish()
      else frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)
  })

export const revealWithCircleLines = reveal(classicReveal)
export const revealWithSmoothCircleLines = reveal(smoothReveal)
