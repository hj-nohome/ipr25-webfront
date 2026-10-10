// Swirling dashes: the image comes in as a lattice of short dashes,
// twisted into a vortex around the centre. They sweep in from the top left
// as dots, stretch into streaks and fatten into bricks while the vortex
// unwinds, until they cover the frame. Meanwhile the picture underneath
// smears sideways, like a long exposure.
//
// revealWithSwirlDashes(containerEl, img, { from }) draws the image in
// through the dashes, over a smeared copy of `from` (the picture it
// replaces), until the image covers the container.

const REVEAL_MS = 3200
const CELL = 12 // lattice spacing, CSS px
// A dash's full size, relative to CELL: big enough to cover its cell
// whichever way it's turned.
const COVER = Math.SQRT2 * 1.05
// Share of the reveal the sweep takes to cross the frame, plus a random
// head start for each dash; each dash grows over the rest.
const SWEEP = 0.45
const JITTER = 0.08
// The vortex turns the lattice by up to TWIST radians at the centre,
// falling off with distance (VORTEX_RADIUS, as a share of the frame's
// half-diagonal), and unwinds to nothing by the end.
const TWIST = 2.4
const VORTEX_RADIUS = 0.6
// Dashes run this far (radians) off the circles round the centre, so
// together they read as a spiral flow.
const PITCH = -0.5
const SMEAR = 0.85 // how far the picture underneath fades to its smeared copy
const SMEAR_SQUEEZE = 40 // the smeared copy is made by squeezing the picture this many times narrower

const easeInOut = (p) => (1 - Math.cos(Math.PI * p)) / 2

// A dash's length and width, as shares of its full size, `q` of the way
// through its growth: a dot, then a streak, then a brick, then solid.
const dashLength = (q) => Math.min(q / 0.6, 1) ** 0.7
const dashWidth = (q) => 0.18 * Math.min(q / 0.15, 1) + 0.82 * Math.max((q - 0.5) / 0.5, 0) ** 2.5

// Same random number in [0, 1) for the same lattice cell every frame.
const hash = (i, j) => {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return x - Math.floor(x)
}

// Adds every dash to the current path, `p` of the way through the reveal.
const traceDashes = (ctx, width, height, cell, p) => {
  const cx = width / 2
  const cy = height / 2
  const halfDiagonal = Math.hypot(width, height) / 2
  const twist = TWIST * (1 - easeInOut(p))
  const reach = Math.ceil(halfDiagonal / cell) + 1
  const full = cell * COVER

  // Lattice points out to the corners, wherever the vortex turns them.
  for (let i = -reach; i <= reach; i++) {
    for (let j = -reach; j <= reach; j++) {
      const dx = i * cell
      const dy = j * cell
      const r = Math.hypot(dx, dy)
      if (r > halfDiagonal + full) continue

      // The sweep runs diagonally by where the point sits before the twist,
      // timed by the share of the frame it has passed so far, so it
      // uncovers the frame at an even rate.
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
      // (ux, uy) points along the dash, (vx, vy) across it.
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

// Sizes the canvas to its CSS box at the screen's pixel density.
const fitCanvas = (canvas) => {
  const dpr = window.devicePixelRatio || 1
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
}

// A canvas the given size with `image` drawn on it like object-fit: cover.
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

// Overlays a canvas on the container (which needs a position) and draws
// `image` through the dashes, sized like object-fit: cover, until it
// covers the container. Resolves once it does, with the canvas removed, so
// the caller can show the image itself in its place. Aborting `signal`
// stops it early and resolves straight away.
export const revealWithSwirlDashes = (container, image, { signal, from } = {}) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    container.append(canvas)

    const ctx = canvas.getContext('2d')
    let fill = null
    let smeared = null
    let startTime = null
    let frameId = null

    // The fill is the image as a pattern, so filling the dashes' path
    // paints the image only inside them. The smeared copy of `from` is it
    // squeezed narrow and stretched back, which streaks it sideways.
    const resize = () => {
      fitCanvas(canvas)
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

    const frame = (now) => {
      startTime ??= now
      const p = Math.min((now - startTime) / REVEAL_MS, 1)
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
