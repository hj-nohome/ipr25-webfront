import './style.css'
import bgVideoUrl from '../images/ipr-background-video.webm'

// Looping background video, shared by every page.
//
// The video's last frame doesn't match its first, so the native `loop`
// visibly jumps. Instead two copies take turns and crossfade to make
// the transition smoother
const BG_CROSSFADE_MS = 1000
// timeupdate only fires every ~250ms, so start the fade with enough
// margin to finish before the outgoing copy reaches its last frame.
const BG_CROSSFADE_MARGIN_S = 0.3
const saveData = navigator.connection?.saveData === true

const createBgVideo = () => {
  const video = document.createElement('video')
  video.className = 'bg-video'
  video.src = bgVideoUrl
  video.muted = true // required for autoplay
  video.playsInline = true
  video.preload = 'auto'
  video.disablePictureInPicture = true
  video.setAttribute('aria-hidden', 'true')
  return video
}

if (!saveData) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.documentElement.style.setProperty('--bg-crossfade', `${BG_CROSSFADE_MS}ms`)

  let current = createBgVideo()
  current.classList.add('is-visible', 'is-front')
  current.autoplay = !reducedMotion
  current.addEventListener('loadeddata', () => document.body.classList.add('bg-loaded'), { once: true })
  document.body.prepend(current)

  if (!reducedMotion) {
    let next = createBgVideo()
    document.body.prepend(next)
    let crossfading = false

    const crossfade = () => {
      crossfading = true
      next.currentTime = 0
      next.play().catch(() => {})
      current.classList.remove('is-front')
      next.classList.add('is-front', 'is-visible')

      setTimeout(() => {
        // The old copy is fully covered now: hide it and rewind it so
        // it's ready to take over again next time.
        current.pause()
        current.classList.remove('is-visible')
        current.currentTime = 0
        ;[current, next] = [next, current]
        crossfading = false
      }, BG_CROSSFADE_MS)
    }

    const onTimeUpdate = (event) => {
      if (event.target !== current || crossfading) return
      const { duration, currentTime } = current
      if (!Number.isFinite(duration)) return
      // Too short to crossfade meaningfully: fall back to a plain loop.
      if (duration < (BG_CROSSFADE_MS / 1000) * 3) {
        current.loop = true
        return
      }
      if (duration - currentTime <= BG_CROSSFADE_MS / 1000 + BG_CROSSFADE_MARGIN_S) crossfade()
    }

    // Safety net: if timeupdate was missed (e.g. a throttled background
    // tab), start the handover as soon as the current copy ends.
    const onEnded = (event) => {
      if (event.target === current && !crossfading) crossfade()
    }

    for (const video of [current, next]) {
      video.addEventListener('timeupdate', onTimeUpdate)
      video.addEventListener('ended', onEnded)
    }
  }
}

const toggle = document.querySelector('#nav-toggle')
const links = document.querySelector('#nav-links')

toggle.addEventListener('click', () => {
  const isOpen = links.classList.toggle('is-open')
  toggle.setAttribute('aria-expanded', String(isOpen))
})

document.querySelectorAll('.accordion__question').forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.accordion__item')
    const isOpen = item.classList.toggle('is-open')
    question.setAttribute('aria-expanded', String(isOpen))
  })
})

// .reveal--stagger items that come into view together (e.g. a grid of
// cards on page load) cascade in one after another, in DOM order.
const STAGGER_BASE_MS = 150
const STAGGER_STEP_MS = 70

const revealObserver = new IntersectionObserver(
  (entries) => {
    let staggerIndex = 0
    for (const entry of entries) {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal--stagger')) {
          entry.target.style.transitionDelay = `${STAGGER_BASE_MS + staggerIndex * STAGGER_STEP_MS}ms`
          staggerIndex += 1
        }
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.15 }
)

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

// Line-draw sections wait until 30% of the section is in view, so the
// lines start drawing once the reader is actually looking at them.

const LINE_DRAW_SPEED = 900 // px per second, on average

const startVerticalLine = (el) => {
  if (el.classList.contains('line-drawing')) return
  el.style.setProperty('--line-duration', `${el.offsetHeight / LINE_DRAW_SPEED}s`)
  el.classList.add('line-drawing')

  const next = el.nextElementSibling
  if (!next?.classList.contains('draw-lines')) return
  const onEnd = (event) => {
    // transitionend bubbles up from child lines too; only this element's own line counts.
    if (event.target !== el || event.pseudoElement !== '::after' || event.propertyName !== 'transform') return
    el.removeEventListener('transitionend', onEnd)
    startVerticalLine(next)
  }
  el.addEventListener('transitionend', onEnd)
}

// The first element of a chain; starting there keeps the stroke continuous
// even if the reader lands mid-chain (e.g. jumping straight to #chapters).
const chainStart = (el) => {
  let start = el
  while (start.previousElementSibling?.classList.contains('draw-lines')) start = start.previousElementSibling
  return start
}

const drawLinesObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        startVerticalLine(chainStart(entry.target))
        drawLinesObserver.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.3 }
)

document.querySelectorAll('.draw-lines').forEach((el) => drawLinesObserver.observe(el))

// Row index within each list, for staggering each row's line-draw.
for (const list of document.querySelectorAll('.chapters__list, .accordion')) {
  ;[...list.children].forEach((el, i) => el.style.setProperty('--i', i))
}

const navEl = document.querySelector('.nav')
const scrollSentinel = document.querySelector('#scroll-sentinel')

if (navEl && scrollSentinel) {
  const stickyNavObserver = new IntersectionObserver(([entry]) => {
    navEl.classList.toggle('nav--scrolled', !entry.isIntersecting)
  })

  stickyNavObserver.observe(scrollSentinel)
}

// Hide the nav while scrolling down, bring it back on any scroll up.
// Always shown near the top of the page, while the mobile menu is open,
// or while keyboard focus is inside it.
if (navEl) {
  const SCROLL_DELTA = 8 // px; ignores tiny trackpad jitters
  let lastScrollY = Math.max(0, window.scrollY)
  let ticking = false

  const updateNavVisibility = () => {
    ticking = false
    const scrollY = Math.max(0, window.scrollY) // clamp iOS overscroll bounce
    const delta = scrollY - lastScrollY
    if (Math.abs(delta) < SCROLL_DELTA) return

    const nearTop = scrollY < navEl.offsetHeight
    const menuOpen = links.classList.contains('is-open')
    // :focus-visible so a mouse click on a nav link doesn't pin the nav open.
    const keyboardFocusInside = navEl.querySelector(':focus-visible') !== null
    const hide = delta > 0 && !nearTop && !menuOpen && !keyboardFocusInside

    navEl.classList.toggle('nav--hidden', hide)
    lastScrollY = scrollY
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateNavVisibility)
      }
    },
    { passive: true }
  )

  // Tabbing into a hidden nav should reveal it.
  navEl.addEventListener('focusin', (event) => {
    if (event.target.matches(':focus-visible')) navEl.classList.remove('nav--hidden')
  })
}
