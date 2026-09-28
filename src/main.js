import './style.css'
import bgCoverUrl from '../images/bg-cover.png'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
Chart.defaults.color = 'rgba(255, 255, 255, 0.75)'
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.15)'
Chart.defaults.font.family = "system-ui, 'Segoe UI', Roboto, sans-serif"

const bgPreload = new Image()
bgPreload.onload = () => document.body.classList.add('bg-loaded')
bgPreload.src = bgCoverUrl

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

const navEl = document.querySelector('.nav')
const scrollSentinel = document.querySelector('#scroll-sentinel')

if (navEl && scrollSentinel) {
  const stickyNavObserver = new IntersectionObserver(([entry]) => {
    navEl.classList.toggle('nav--scrolled', !entry.isIntersecting)
  })

  stickyNavObserver.observe(scrollSentinel)
}

// Statistics page: figure grid + search + click-to-expand modal.
// Only runs when #figures-grid exists on the current page.
const figuresGrid = document.querySelector('#figures-grid')

if (figuresGrid) {
  // Placeholder data — extend this array with the real Figures 1.1–8.5 and
  // swap in real datasets once available; the grid/modal/search/chart all
  // read from it. Where possible the sample values below anchor to the real
  // headline stats already quoted on the homepage (5G subscriptions, fibre
  // premises passed, market cap, industry revenue).
  const figures = [
    {
      id: '1.1',
      chapter: 1,
      chapterName: 'Licensing',
      caption: 'Number of licences issued by category',
      chart: { type: 'bar', labels: ['Network', 'Applications', 'Content', 'Other'], values: [420, 610, 275, 90] },
    },
    {
      id: '1.2',
      chapter: 1,
      chapterName: 'Licensing',
      caption: 'Licence renewal trends, 2021–2025',
      chart: {
        type: 'line',
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [3100, 3250, 3400, 3600, 3800],
      },
    },
    {
      id: '2.1',
      chapter: 2,
      chapterName: 'Economic Performance of the C&M Industry',
      caption: 'Industry revenue by segment',
      chart: {
        type: 'doughnut',
        labels: ['Telecommunications', 'Broadcasting', 'Postal', 'Digital Services'],
        values: [28.4, 6.2, 3.1, 11.75],
      },
    },
    {
      id: '2.2',
      chapter: 2,
      chapterName: 'Economic Performance of the C&M Industry',
      caption: 'Market capitalisation of listed companies',
      chart: {
        type: 'line',
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [88.2, 94.5, 101.3, 106.8, 110.63],
      },
    },
    {
      id: '3.1',
      chapter: 3,
      chapterName: 'Services and Connectivity',
      caption: '4G LTE and 5G coverage by state',
      chart: {
        type: 'bar',
        labels: ['Selangor', 'KL', 'Johor', 'Penang', 'Sabah', 'Sarawak'],
        values: [99.9, 99.8, 99.5, 99.6, 97.2, 96.8],
      },
    },
    {
      id: '3.2',
      chapter: 3,
      chapterName: 'Services and Connectivity',
      caption: 'Fixed broadband subscription growth',
      chart: {
        type: 'line',
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [8.1, 8.6, 9.0, 9.4, 9.81],
      },
    },
    {
      id: '4.1',
      chapter: 4,
      chapterName: 'Content Services',
      caption: 'Streaming service adoption rates',
      chart: {
        type: 'doughnut',
        labels: ['Video streaming', 'Music streaming', 'Live TV', 'Gaming'],
        values: [45, 25, 20, 10],
      },
    },
    {
      id: '5.1',
      chapter: 5,
      chapterName: 'Online and Community Services',
      caption: 'Social media usage by age group',
      chart: {
        type: 'bar',
        labels: ['13–17', '18–24', '25–34', '35–44', '45+'],
        values: [88, 95, 90, 78, 55],
      },
    },
    {
      id: '6.1',
      chapter: 6,
      chapterName: 'Postal and Courier',
      caption: 'Parcel delivery volume, 2021–2025',
      chart: {
        type: 'line',
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [210, 245, 280, 310, 335],
      },
    },
    {
      id: '7.1',
      chapter: 7,
      chapterName: 'Quality of Services',
      caption: 'Network complaint resolution time',
      chart: { type: 'bar', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [3.2, 2.8, 2.5, 2.1] },
    },
    {
      id: '8.1',
      chapter: 8,
      chapterName: 'Outlook',
      caption: 'Projected 5G subscription growth, 2026–2030',
      chart: {
        type: 'line',
        labels: ['2026', '2027', '2028', '2029', '2030'],
        values: [29.0, 34.5, 40.2, 46.8, 53.5],
      },
    },
  ]

  figuresGrid.innerHTML = figures
    .map(
      (figure) => `
        <button type="button" class="figure-card" data-figure-id="${figure.id}">
          <h3 class="figure-card__name">Figure ${figure.id}</h3>
          <p class="figure-card__caption">${figure.caption}</p>
        </button>
      `
    )
    .join('')

  const filtersEl = document.querySelector('#figures-filters')
  const selectedChapters = new Set()

  filtersEl.innerHTML = Array.from({ length: 8 }, (_, i) => i + 1)
    .map((chapter) => `<button type="button" class="figures__filter" data-chapter="${chapter}">Chapter ${chapter}</button>`)
    .join('')

  const modal = document.querySelector('#figure-modal')
  const modalMedia = document.querySelector('#figure-modal-media')
  const modalTag = document.querySelector('#figure-modal-tag')
  const modalTitle = document.querySelector('#figure-modal-title')
  const modalCaption = document.querySelector('#figure-modal-caption')

  let activeChart = null

  const renderChart = (figure) => {
    if (activeChart) {
      activeChart.destroy()
      activeChart = null
    }

    modalMedia.innerHTML = '<canvas></canvas>'
    const isDoughnut = figure.chart.type === 'doughnut'

    activeChart = new Chart(modalMedia.querySelector('canvas'), {
      type: figure.chart.type,
      data: {
        labels: figure.chart.labels,
        datasets: [
          {
            label: figure.id,
            data: figure.chart.values,
            backgroundColor: isDoughnut
              ? ['#a99bff', '#7b6ef6', '#e3dff6', '#5a4fc7']
              : 'rgba(169, 155, 255, 0.6)',
            borderColor: '#a99bff',
            borderWidth: figure.chart.type === 'line' ? 2 : 1,
            tension: 0.35,
            fill: figure.chart.type === 'line',
            pointRadius: figure.chart.type === 'line' ? 3 : undefined,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: isDoughnut ? {} : { x: { grid: { display: false } }, y: { beginAtZero: true } },
      },
    })
  }

  const openModal = (figure) => {
    renderChart(figure)
    modalTag.textContent = `Chapter ${figure.chapter} — ${figure.chapterName}`
    modalTitle.textContent = `Figure ${figure.id}`
    modalCaption.textContent = figure.caption
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
  }

  const closeModal = () => {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
  }

  figuresGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.figure-card')
    if (!card) return
    const figure = figures.find((item) => item.id === card.dataset.figureId)
    if (figure) openModal(figure)
  })

  modal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal()
  })

  const searchInput = document.querySelector('#figures-search')
  const emptyState = document.querySelector('#figures-empty')

  const applyFilters = () => {
    const query = searchInput.value.trim().toLowerCase()
    let visibleCount = 0

    figuresGrid.querySelectorAll('.figure-card').forEach((card) => {
      const figure = figures.find((item) => item.id === card.dataset.figureId)
      const matchesQuery =
        !query ||
        figure.id.toLowerCase().includes(query) ||
        figure.caption.toLowerCase().includes(query) ||
        figure.chapterName.toLowerCase().includes(query)
      const matchesChapter = selectedChapters.size === 0 || selectedChapters.has(figure.chapter)
      const matches = matchesQuery && matchesChapter
      card.hidden = !matches
      if (matches) visibleCount += 1
    })

    emptyState.hidden = visibleCount > 0
  }

  searchInput.addEventListener('input', applyFilters)

  filtersEl.addEventListener('click', (event) => {
    const button = event.target.closest('.figures__filter')
    if (!button) return

    const chapter = Number(button.dataset.chapter)
    const isActive = button.classList.toggle('is-active')
    if (isActive) {
      selectedChapters.add(chapter)
    } else {
      selectedChapters.delete(chapter)
    }

    applyFilters()
  })
}
