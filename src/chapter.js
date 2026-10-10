// Chapter detail page: chapter.html is one template for all 8 chapters,
// filled in from src/data/chapters.js by the #chapter-N hash.
import './main.js'
import { chapters } from './data/chapters.js'
import { revealWithCircleLines } from './circle-lines.js'
import { revealWithSpiral } from './spiral.js'
import { revealWithSwirlDashes } from './swirl-dashes.js'

// By each chapter's `transition` in chapters.js.
const transitions = {
  'circle-lines': revealWithCircleLines,
  spiral: revealWithSpiral,
  'swirl-dashes': revealWithSwirlDashes,
}

const section = document.querySelector('.chapter-detail')
const title = document.querySelector('#chapter-title')
const name = document.querySelector('#chapter-name')
const intro = document.querySelector('#chapter-intro')
const media = document.querySelector('.chapter-detail__media')
const image = document.querySelector('#chapter-image')
const photo = document.querySelector('#chapter-photo')
const background = document.querySelector('#chapter-bg')
const cta = document.querySelector('#chapter-cta')

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let photoReveal = null

const onScreen = (el) =>
  new Promise((resolve) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        resolve()
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
  })

// Plays the image -> photo transition once, as soon as both images have
// loaded and are on screen; a new chapter (hashchange) cancels any
// transition still running and starts over.
const revealPhoto = async (transition) => {
  photoReveal?.abort()
  const controller = new AbortController()
  photoReveal = controller
  media.classList.remove('is-photo-shown')

  if (reducedMotion) {
    media.classList.add('is-photo-shown')
    return
  }

  try {
    await Promise.all([image.decode(), photo.decode(), onScreen(media)])
  } catch {
    return // an image failed to load: stay on the chapter image
  }
  if (controller.signal.aborted) return
  await transition(media, photo, { signal: controller.signal, from: image })
  if (!controller.signal.aborted) media.classList.add('is-photo-shown')
}

// Fades the background and its dark overlay in once the image is ready,
// like the video on the other pages (see body.bg-loaded in style.css).
background.addEventListener('load', () => document.body.classList.add('bg-loaded'))

// Falls back to Chapter 1 when the hash is missing or doesn't match a chapter.
const chapterFromHash = () => {
  const match = location.hash.match(/^#chapter-(\d+)$/)
  return chapters.find((chapter) => chapter.number === Number(match?.[1])) ?? chapters[0]
}

const render = () => {
  const chapter = chapterFromHash()

  document.title = `Chapter ${chapter.number}: ${chapter.name} | ipr25-testing`
  // Picks the chapter's accent colours (see .chapter-detail in style.css).
  section.dataset.chapter = chapter.number
  title.textContent = `Chapter ${chapter.number}`
  name.textContent = chapter.name
  intro.replaceChildren(
    ...chapter.intro.map((text) => {
      const paragraph = document.createElement('p')
      paragraph.textContent = text
      return paragraph
    })
  )
  cta.textContent = `Explore ${chapter.shortName}`
  // The column starts on the first and the transition reveals the second.
  const [first, second] = chapter.reverse
    ? [chapter.background, chapter.image]
    : [chapter.image, chapter.background]
  image.src = first
  photo.src = second
  background.src = chapter.background
  revealPhoto(transitions[chapter.transition ?? 'circle-lines'])
}

window.addEventListener('hashchange', () => {
  render()
  window.scrollTo(0, 0)
})

render()
