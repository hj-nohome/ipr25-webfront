// Chapter detail page: chapter.html is one template for all 8 chapters,
// filled in from src/data/chapters.js by the #chapter-N hash.
import './main.js'
import { chapters } from './data/chapters.js'
import { highlights } from './data/highlights.js'
import { renderHighlights } from './highlights.js'
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
const name = document.querySelector('#chapter-name')
const number = document.querySelector('#chapter-number')
const intro = document.querySelector('#chapter-intro')
const highlightsLabel = document.querySelector('#chapter-highlights-label')
const highlightsList = document.querySelector('#chapter-highlights')
const media = document.querySelector('.chapter-detail__media')
const image = document.querySelector('#chapter-image')
const photo = document.querySelector('#chapter-photo')
const background = document.querySelector('#chapter-bg')
const cta = document.querySelector('#chapter-cta')
const rationaleTitle = document.querySelector('#chapter-rationale-title')
const rationaleText = document.querySelector('#chapter-rationale-text')

// Between the image fading in and the transition, so it registers.
const HOLD_MS = 300

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let photoReveal = null

const settled = (el) => Promise.allSettled(el.getAnimations({ subtree: true }).map((a) => a.finished))
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

// Fades the image in once it has loaded and the column is on screen, then
// plays the image -> photo transition; a new chapter (hashchange) hides it
// again and starts over.
const revealPhoto = async (name) => {
  photoReveal?.abort()
  const controller = new AbortController()
  photoReveal = controller
  media.classList.remove('is-loaded', 'is-photo-shown')

  if (reducedMotion) {
    media.classList.add('is-loaded', 'is-photo-shown')
    return
  }

  const [loaded] = await Promise.all([image.decode().then(() => true, () => false), onScreen(media)])
  if (controller.signal.aborted) return
  media.classList.add('is-loaded')
  if (!loaded) return

  try {
    await Promise.all([photo.decode(), settled(media).then(() => wait(HOLD_MS))])
  } catch {
    return // the photo failed to load: stay on the image
  }
  if (controller.signal.aborted) return
  await transitions[name](media, photo, { signal: controller.signal, from: image })
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

const toParagraph = (text) => {
  const paragraph = document.createElement('p')
  paragraph.textContent = text
  return paragraph
}

const render = () => {
  const chapter = chapterFromHash()

  document.title = `Chapter ${chapter.number}: ${chapter.name} | ipr25-testing`
  // Picks the chapter's accent colours (see .chapter-detail in style.css).
  section.dataset.chapter = chapter.number
  name.textContent = chapter.name
  number.textContent = `Chapter ${chapter.number}`
  intro.replaceChildren(...chapter.intro.map(toParagraph))
  rationaleTitle.textContent = chapter.rationale.title
  rationaleText.replaceChildren(...chapter.rationale.text.map(toParagraph))
  const chapterHighlights = highlights[chapter.number]
  highlightsLabel.hidden = !chapterHighlights
  highlightsList.hidden = !chapterHighlights
  renderHighlights(highlightsList, chapterHighlights)
  cta.textContent = `Explore ${chapter.shortName}`
  // The column starts on the first and the transition reveals the second.
  const [first, second] = chapter.reverse
    ? [chapter.background, chapter.image]
    : [chapter.image, chapter.background]
  image.src = first
  photo.src = second
  background.src = chapter.background
  revealPhoto(chapter.transition ?? 'circle-lines')
}

window.addEventListener('hashchange', () => {
  render()
  window.scrollTo(0, 0)
})

render()
