// Spiral reveal: one arm, wound tight round the centre, unwinds and widens
// until it covers the frame, drawing the image in through it.

const REVEAL_MS = 2800
// Radians the arm turns per e-fold of radius: ~10 turns deep at the start,
// a soft curve by the end.
const TWIST_START = 14
const TWIST_END = 0.6
const START_ANGLE = -Math.PI / 2 // 12 o'clock
const SPIN = Math.PI / 2
// Below this radius (canvas px) the turns are sub-pixel.
const MIN_RADIUS = 0.5
// Caps one frame's step, so a slow frame slows the reveal instead of skipping it.
const MAX_STEP_MS = 1000 / 30

const easeInOut = (p) => (1 - Math.cos(Math.PI * p)) / 2

// `width` is the share of each turn the arm covers, 0 to 1.
const traceArm = (ctx, cx, cy, radius, frameRadius, twist, angle, width) => {
  const edgeAngle = (r) => angle + twist * Math.log(frameRadius / r)
  const span = Math.PI * 2 * width

  // Steps short enough to stay within ~1/4 px of the true curve.
  const radii = []
  for (let r = MIN_RADIUS; r < radius; r *= Math.exp(Math.min(0.05, Math.sqrt(2 / r) / Math.hypot(1, twist)))) {
    radii.push(r)
  }
  radii.push(radius)

  radii.forEach((r) => {
    const a = edgeAngle(r)
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
  })
  ctx.arc(cx, cy, radius, edgeAngle(radius), edgeAngle(radius) + span)
  for (let i = radii.length - 1; i >= 0; i--) {
    const a = edgeAngle(radii[i]) + span
    ctx.lineTo(cx + radii[i] * Math.cos(a), cy + radii[i] * Math.sin(a))
  }
  ctx.closePath()
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

// Draws `image` (as object-fit: cover) in through the arm on a canvas over
// `container`, which needs a position. Resolves with the canvas removed once
// the image covers it, or straight away when `signal` aborts.
export const revealWithSpiral = (container, image, { signal } = {}) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    container.append(canvas)

    const ctx = canvas.getContext('2d')
    let fill = null
    let elapsed = 0
    let lastFrame = null
    let frameId = null

    // A pattern, so filling the arm's path paints the image inside it.
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
      if (lastFrame !== null) elapsed += Math.min(now - lastFrame, MAX_STEP_MS)
      lastFrame = now
      const p = Math.min(elapsed / REVEAL_MS, 1)
      const { width, height } = canvas
      const eased = easeInOut(p)

      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      traceArm(
        ctx,
        width / 2,
        height / 2,
        (Math.hypot(width, height) / 2) * 1.05, // reaches the corners
        Math.min(width, height) / 2,
        TWIST_END + (TWIST_START - TWIST_END) * (1 - eased),
        START_ANGLE + SPIN * eased,
        eased
      )
      ctx.fillStyle = fill
      ctx.fill()

      if (p >= 1) finish()
      else frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)
  })
