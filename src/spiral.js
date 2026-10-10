// Hypnotic spiral: one spiral arm wound tight around the centre unwinds,
// widening as it goes, until it covers the frame. After a looping
// black-and-white spiral GIF, played once as a transition instead.
//
// revealWithSpiral(containerEl, img) draws the image in through the arm,
// with whatever is under the container showing between its turns, until
// the image covers the container.

const REVEAL_MS = 2800
// How far the arm turns, in radians, as the radius shrinks by a factor of
// e. It starts ~10 turns deep across the frame and unwinds to a soft curve.
const TWIST_START = 14
const TWIST_END = 0.6
// Where the arm's leading edge crosses the frame's inscribed circle:
// 12 o'clock, turning a little clockwise as it unwinds.
const START_ANGLE = -Math.PI / 2
const SPIN = Math.PI / 2
// Inside this radius (in canvas pixels) the arm's endless turns are
// smaller than a pixel, so it stops there.
const MIN_RADIUS = 0.5

const easeInOut = (p) => (1 - Math.cos(Math.PI * p)) / 2

// Adds the arm to the current path. Its leading edge sits at `angle` on a
// circle of `frameRadius` and winds clockwise towards the centre by `twist`
// (see TWIST_START); `width` is the share of each turn it covers, 0 to 1.
const traceArm = (ctx, cx, cy, radius, frameRadius, twist, angle, width) => {
  const edgeAngle = (r) => angle + twist * Math.log(frameRadius / r)
  const span = Math.PI * 2 * width

  // Steps short enough that the edge stays within ~1/4 px of the true curve.
  const radii = []
  for (let r = MIN_RADIUS; r < radius; r *= Math.exp(Math.min(0.05, Math.sqrt(2 / r) / Math.hypot(1, twist)))) {
    radii.push(r)
  }
  radii.push(radius)

  // Out along the leading edge, round the outside, back in along the
  // trailing edge.
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

// Sizes the canvas to its CSS box at the screen's pixel density.
const fitCanvas = (canvas) => {
  const dpr = window.devicePixelRatio || 1
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
}

// Overlays a canvas on the container (which needs a position) and draws
// `image` through the arm, sized like object-fit: cover, until it covers
// the container. Resolves once it does, with the canvas removed, so the
// caller can show the image itself in its place. Aborting `signal` stops
// it early and resolves straight away.
export const revealWithSpiral = (container, image, { signal } = {}) =>
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
    // filling the arm's path paints the image only inside it.
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
      const p = Math.min((now - startTime) / REVEAL_MS, 1)
      const { width, height } = canvas
      const eased = easeInOut(p)

      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      traceArm(
        ctx,
        width / 2,
        height / 2,
        // Big enough for the arm to reach the corners.
        (Math.hypot(width, height) / 2) * 1.05,
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
