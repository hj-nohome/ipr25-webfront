// Chapter detail page: chapter.html is one template for all 8 chapters,
// filled in from src/data/chapters.js by the #chapter-N hash.
import './main.js'
import { chapters } from './data/chapters.js'

const section = document.querySelector('.chapter-detail')
const title = document.querySelector('#chapter-title')
const name = document.querySelector('#chapter-name')
const intro = document.querySelector('#chapter-intro')
const image = document.querySelector('#chapter-image')
const background = document.querySelector('#chapter-bg')
const cta = document.querySelector('#chapter-cta')

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
  image.src = chapter.image
  background.src = chapter.background
}

window.addEventListener('hashchange', () => {
  render()
  window.scrollTo(0, 0)
})

render()
