// Op-art "circle lines": rings of radial bars around a hollow core, swept
// clockwise ring by ring. Neighbouring rings start half a turn apart, so
// mid-sweep the rings read as one spiral.
//
// createCircleLines(containerEl) loops it: each bar thins to a hairline and
// eases back. revealWithCircleLines(containerEl, img) plays it once as a
// transition: the image grows in through the bars until it covers the
// container.

const BARS_PER_RING = 36
// Ring edges as a fraction of the outer radius, outermost first. Each ring
// is ~0.59x the one outside it; inside the last edge is the empty core.
const RING_EDGES = [1, 0.59, 0.345, 0.2, 0.12]

// Adds every bar to the current path, each centred on its spoke and running
// across its ring. widthAt(sweep) gives a bar's width as a fraction of its
// ring's outer radius; `sweep` runs from 0 for the first bar the sweep
// reaches to 1 for the last.
const traceBars = (ctx, cx, cy, radius, widthAt) => {
  const step = (Math.PI * 2) / BARS_PER_RING

  for (let ring = 0; ring < RING_EDGES.length - 1; ring++) {
    const rOut = RING_EDGES[ring] * radius
    const rIn = RING_EDGES[ring + 1] * radius
    // Every other ring starts its sweep at 6 o'clock instead of 12.
    const startBar = ring % 2 === 0 ? 0 : BARS_PER_RING / 2

    for (let bar = 0; bar < BARS_PER_RING; bar++) {
      // The sweep starts with the bar just clockwise of startBar and ends on startBar.
      const order = (bar - startBar - 1 + BARS_PER_RING * 2) % BARS_PER_RING
      const half = (widthAt(order / (BARS_PER_RING - 1)) * rOut) / 2
      if (half <= 0) continue

      // Angle clockwise from 12 o'clock; (ux, uy) points out along the bar,
      // (vx, vy) across it.
      const angle = bar * step
      const ux = Math.sin(angle)
      const uy = -Math.cos(angle)
      const vx = -uy
      const vy = ux

      // One path for every bar, filled once, so the overlaps near each
      // ring's inner edge don't double up if the fill is translucent.
      ctx.moveTo(cx + ux * rIn - vx * half, cy + uy * rIn - vy * half)
      ctx.lineTo(cx + ux * rOut - vx * half, cy + uy * rOut - vy * half)
      ctx.lineTo(cx + ux * rOut + vx * half, cy + uy * rOut + vy * half)
      ctx.lineTo(cx + ux * rIn + vx * half, cy + uy * rIn + vy * half)
      ctx.closePath()
    }
  }
}

// Sizes the canvas to its CSS box at the screen's pixel density.
const fitCanvas = (canvas) => {
  const dpr = window.devicePixelRatio || 1
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
}

// Looping animation

// Bar width at rest, relative to the ring's outer radius. Wide enough that
// neighbouring bars meet near the ring's inner edge.
const BAR_WIDTH = 0.128
const MIN_WIDTH = 0.06 // narrowest point of the sweep, as a fraction of rest width

const LOOP_MS = 3750
const SWEEP_START_MS = 130 // when the first bar starts thinning
const SWEEP_MS = 2550 // from the first bar starting to the last
const THIN_MS = 200 // full width -> hairline
const RECOVER_MS = 1000 // hairline -> full width, easing in
// Shown instead of the animation for prefers-reduced-motion: mid-sweep,
// where the spiral is clearest.
const STILL_MS = 1500

// Width of one bar (as a fraction of its rest width) `elapsed` ms after
// the sweep reaches it.
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
  const radius = (Math.min(width, height) / 2) * 0.98 // a little room for antialiasing

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

// Appends a canvas that fills the container and loops the animation in the
// container's CSS `color` (or options.color). Give the container a size,
// e.g. aspect-ratio: 1.
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
    // Cap the step so a dropped or throttled frame doesn't skip ahead.
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

  // Only animate while on screen.
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

// Just wide enough for each bar to overlap its neighbours all the way to
// the ring's outer edge, so together they cover the ring.
const COVER_WIDTH = 2 * Math.sin(Math.PI / BARS_PER_RING) * 1.05
const HAIRLINE = 0.04 // first width a bar shows at, as a fraction of COVER_WIDTH

const REVEAL_SWEEP_MS = 2000 // from the first bar appearing to the last
const REVEAL_APPEAR_MS = 150 // nothing -> hairline
const REVEAL_GROW_MS = 1000 // hairline -> covering, easing in
const REVEAL_MS = REVEAL_SWEEP_MS + REVEAL_APPEAR_MS + REVEAL_GROW_MS
const REVEAL_CORE_MS = 600 // the empty core fills in over the last stretch

// Width of one bar (as a fraction of COVER_WIDTH) `elapsed` ms after the
// sweep reaches it.
const revealWidth = (elapsed) => {
  if (elapsed <= 0) return 0
  if (elapsed < REVEAL_APPEAR_MS) return HAIRLINE * (elapsed / REVEAL_APPEAR_MS)
  const p = Math.min((elapsed - REVEAL_APPEAR_MS) / REVEAL_GROW_MS, 1)
  return HAIRLINE + (1 - HAIRLINE) * p ** 2
}

// Overlays a canvas on the container (which needs a position) and draws
// `image` through the bars, sized like object-fit: cover, until it covers
// the container. Resolves once it does, with the canvas removed, so the
// caller can show the image itself in its place. Aborting `signal` stops
// it early and resolves straight away.
export const revealWithCircleLines = (container, image, { signal } = {}) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    container.append(canvas)

    const ctx = canvas.getContext('2d')
    let fill = null
    let startTime = null
    let frameId = null

    // The fill is the image scaled to cover the canvas, as a pattern, so
    // filling the bars' path paints the image only inside them.
    const resize = () => {
      fitCanvas(canvas)
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

    const frame = (now) => {
      startTime ??= now
      const t = now - startTime
      const { width, height } = canvas
      const cx = width / 2
      const cy = height / 2
      // Big enough for the outer ring to reach the corners.
      const radius = (Math.hypot(width, height) / 2) * 1.05

      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      traceBars(ctx, cx, cy, radius, (sweep) => COVER_WIDTH * revealWidth(t - sweep * REVEAL_SWEEP_MS))

      const core = (t - (REVEAL_MS - REVEAL_CORE_MS)) / REVEAL_CORE_MS
      if (core > 0) {
        // Slightly past the innermost ring's edge so no seam shows.
        const coreRadius = RING_EDGES.at(-1) * radius * 1.05 * (1 - (1 - Math.min(core, 1)) ** 3)
        ctx.moveTo(cx + coreRadius, cy)
        ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2)
      }

      ctx.fillStyle = fill
      ctx.fill()

      if (t >= REVEAL_MS) finish()
      else frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)
  })
