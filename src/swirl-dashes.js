// Swirling-dashes reveal: a lattice of dashes, twisted into a vortex, sweeps
// in from the top left, growing from dots to streaks to bricks as the vortex
// unwinds, until it covers the frame. Meanwhile the picture underneath
// (`from`) smears sideways, like a long exposure.

const REVEAL_MS = 3200
const CELL = 12 // lattice spacing, CSS px
// A dash's full size, relative to CELL: covers its cell at any angle.
const COVER = Math.SQRT2 * 1.05
// Shares of the reveal: the sweep across the frame, and each dash's random head start.
const SWEEP = 0.45
const JITTER = 0.08
// Twist at the centre (radians), falling off over VORTEX_RADIUS (share of the half-diagonal).
const TWIST = 2.4
const VORTEX_RADIUS = 0.6
// Tilt (radians) off the circles round the centre, so the dashes read as a spiral.
const PITCH = -0.5
const SMEAR = 0.85 // final opacity of the smeared copy
const SMEAR_SQUEEZE = 40 // how much narrower the picture is squeezed to smear it
// Caps one frame's step, so a slow frame slows the reveal instead of skipping it.
const MAX_STEP_MS = 1000 / 30

const easeInOut = (p) => (1 - Math.cos(Math.PI * p)) / 2

// Shares of the full size, `q` of the way through a dash's growth.
const dashLength = (q) => Math.min(q / 0.6, 1) ** 0.7
const dashWidth = (q) => 0.18 * Math.min(q / 0.15, 1) + 0.82 * Math.max((q - 0.5) / 0.5, 0) ** 2.5

// Stable random number in [0, 1) per lattice cell.
const hash = (i, j) => {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const traceDashes = (ctx, width, height, cell, p) => {
  const cx = width / 2
  const cy = height / 2
  const halfDiagonal = Math.hypot(width, height) / 2
  const twist = TWIST * (1 - easeInOut(p))
  const reach = Math.ceil(halfDiagonal / cell) + 1
  const full = cell * COVER

  for (let i = -reach; i <= reach; i++) {
    for (let j = -reach; j <= reach; j++) {
      const dx = i * cell
      const dy = j * cell
      const r = Math.hypot(dx, dy)
      if (r > halfDiagonal + full) continue

      // Timed by position before the twist, eased so the sweep uncovers the
      // frame at an even rate.
      const diagonal = Math.min(Math.max(((cx + dx) / width + (cy + dy) / height) / 2, 0), 1)
      const sweep = diagonal < 0.5 ? 2 * diagonal ** 2 : 1 - 2 * (1 - diagonal) ** 2
      const q =(p - sweep * SWEEP - hash(i, j) * JITTER) / (1 - SWEEP - JITTER)
      if (q <= 0) continue

      const turn = twist * Math.exp(-r / (VORTEX_RADIUS * halfDiagonal))
      const x = cx + dx * Math.cos(turn) - dy * Math.sin(turn)
      const y = cy + dx * Math.sin(turn) + dy * Math.cos(turn)
      if (x < -full || x > width + full || y < -full || y > height + full) continue

      const growth = Math.min(q, 1)
      const halfLength = (full * dashLength(growth)) / 2
      const halfWidth = (full * dashWidth(growth)) / 2
      // u runs along the dash, v across it.
      const angle = Math.atan2(y - cy, x - cx) + Math.PI / 2 + PITCH
      const ux = Math.cos(angle)
      const uy = Math.sin(angle)
      const vx = -uy
      const vy = ux

      ctx.moveTo(x - ux * halfLength - vx * halfWidth, y - uy * halfLength - vy * halfWidth)
      ctx.lineTo(x + ux * halfLength - vx * halfWidth, y + uy * halfLength - vy * halfWidth)
      ctx.lineTo(x + ux * halfLength + vx * halfWidth, y + uy * halfLength + vy * halfWidth)
      ctx.lineTo(x - ux * halfLength + vx * halfWidth, y - uy * halfLength + vy * halfWidth)
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

// `image` drawn as object-fit: cover.
const coverLayer = (image, width, height) => {
  const layer = document.createElement('canvas')
  layer.width = width
  layer.height = height
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const w = image.naturalWidth * scale
  const h = image.naturalHeight * scale
  layer.getContext('2d').drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
  return layer
}

// Draws `image` (as object-fit: cover) in through the dashes on a canvas over
// `container`, which needs a position. Resolves with the canvas removed once
// the image covers it, or straight away when `signal` aborts.
export const revealWithSwirlDashes = (container, image, { signal, from } = {}) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    container.append(canvas)

    const ctx = canvas.getContext('2d')
    let fill = null
    let smeared = null
    let elapsed = 0
    let lastFrame = null
    let frameId = null

    // A pattern, so filling the dashes' path paints the image inside them.
    // Squeezing `from` narrow and stretching it back streaks it sideways.
    const resize = () => {
      // Skips the observer's first callback, which follows this first call.
      if (!fitCanvas(canvas) && fill) return
      fill = ctx.createPattern(coverLayer(image, canvas.width, canvas.height), 'no-repeat')
      if (!from) return
      const squeezed = document.createElement('canvas')
      squeezed.width = Math.max(1, Math.round(canvas.width / SMEAR_SQUEEZE))
      squeezed.height = canvas.height
      squeezed.getContext('2d').drawImage(coverLayer(from, canvas.width, canvas.height), 0, 0, squeezed.width, squeezed.height)
      smeared = document.createElement('canvas')
      smeared.width = canvas.width
      smeared.height = canvas.height
      smeared.getContext('2d').drawImage(squeezed, 0, 0, canvas.width, canvas.height)
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

    const cell = CELL * (window.devicePixelRatio || 1)

    // The first frame carries the setup, so counting starts on the second.
    const frame = (now) => {
      if (lastFrame !== null) elapsed += Math.min(now - lastFrame, MAX_STEP_MS)
      lastFrame = now
      const p = Math.min(elapsed / REVEAL_MS, 1)
      const { width, height } = canvas

      ctx.clearRect(0, 0, width, height)
      if (smeared) {
        ctx.globalAlpha = SMEAR * easeInOut(Math.min(p / SWEEP, 1))
        ctx.drawImage(smeared, 0, 0)
        ctx.globalAlpha = 1
      }
      ctx.beginPath()
      traceDashes(ctx, width, height, cell, p)
      ctx.fillStyle = fill
      ctx.fill()

      if (p >= 1) finish()
      else frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)
  })
