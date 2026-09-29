import './style.css'
import bgVideoUrl from '../images/ipr-background-video.webm'

// Looping background video, shared by every page. Skipped when the
// reader has asked the browser to save data; with reduced motion it
// loads but stays paused, showing its first frame as a still image.
const saveData = navigator.connection?.saveData === true

if (!saveData) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bgVideo = document.createElement('video')
  bgVideo.className = 'bg-video'
  bgVideo.src = bgVideoUrl
  bgVideo.muted = true // required for autoplay
  bgVideo.loop = true
  bgVideo.playsInline = true
  bgVideo.autoplay = !reducedMotion
  bgVideo.preload = 'auto'
  bgVideo.disablePictureInPicture = true
  bgVideo.setAttribute('aria-hidden', 'true')
  bgVideo.addEventListener('loadeddata', () => document.body.classList.add('bg-loaded'), { once: true })
  document.body.prepend(bgVideo)
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
