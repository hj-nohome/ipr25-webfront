import './style.css'

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

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.15 }
)

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))
