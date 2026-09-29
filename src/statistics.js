// Statistics page: figure grid + search + click-to-expand modal.
import './main.js'
import { Chart, registerables } from 'chart.js'
import { figures } from './data/figures.js'

Chart.register(...registerables)
Chart.defaults.color = 'rgba(255, 255, 255, 0.75)'
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.15)'
Chart.defaults.font.family = "system-ui, 'Segoe UI', Roboto, sans-serif"

const figuresGrid = document.querySelector('#figures-grid')

figuresGrid.innerHTML = figures
  .map(
    (figure) => `
      <button 
        type="button" 
        class="figure-card" 
        data-figure-id="${figure.id}"
        style="view-transition-name: fig-${figure.id.replace('.', '-')}"
      >
        <h3 class="figure-card__name">Figure ${figure.id}</h3>
        <p class="figure-card__caption">${figure.caption}</p>
      </button>
    `
  )
  .join('')

const filtersEl = document.querySelector('#figures-filters')
const chapterHeading = document.querySelector('#figures-chapter')
const chapterNames = new Map(figures.map((figure) => [figure.chapter, figure.chapterName]))

// One chapter at a time; null means "All".
let selectedChapter = null

filtersEl.innerHTML = [
  '<button type="button" class="figures__filter" data-chapter="all">All</button>',
  ...Array.from({ length: 8 }, (_, i) => i + 1).map(
    (chapter) => `<button type="button" class="figures__filter" data-chapter="${chapter}">Chapter ${chapter}</button>`
  ),
].join('')

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
  const isLine = figure.chart.type === 'line'
  const isBar = figure.chart.type === 'bar'

   let finalDatasets;

   if (figure.chart.datasets) {
    finalDatasets = figure.chart.datasets;
  } else {
    // Fallback: Convert the old single 'values' array format into a Chart.js dataset format
    finalDatasets = [
      {
        label: figure.id,
        data: figure.chart.values,
        backgroundColor: isDoughnut
          ? ['#a99bff', '#7b6ef6', '#e3dff6', '#5a4fc7']
          : 'rgba(169, 155, 255, 0.6)',
        borderColor: '#a99bff',
        borderWidth: isLine ? 2 : 1,
        tension: 0.35,
        fill: isLine,
        pointRadius: isLine ? 3 : undefined,
      },
    ];
  }

  activeChart = new Chart(modalMedia.querySelector('canvas'), {
    type: figure.chart.type,
    data: {
      labels: figure.chart.labels,
      datasets: finalDatasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: figure.chart.datasets ? true : !isDoughnut } }, 
      scales: isDoughnut ? {} : { 
        x: { 
          grid: { display: false },
          stacked: isBar // Stacks the bar chart horizontally
        }, 
        y: { 
          beginAtZero: true,
          stacked: isBar // Stacks the bar chart vertically
        } 
    },
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
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const updateGrid = () => {
  const query = searchInput.value.trim().toLowerCase()
  let visibleCount = 0

  figuresGrid.querySelectorAll('.figure-card').forEach((card) => {
    const figure = figures.find((item) => item.id === card.dataset.figureId)
    const matchesQuery =
      !query ||
      figure.id.toLowerCase().includes(query) ||
      figure.caption.toLowerCase().includes(query) ||
      figure.chapterName.toLowerCase().includes(query)
    const matchesChapter = selectedChapter === null || figure.chapter === selectedChapter
    const matches = matchesQuery && matchesChapter
    card.hidden = !matches
    if (matches) visibleCount += 1
  })

  emptyState.hidden = visibleCount > 0
}

// Animates the grid change where View Transitions are supported;
// otherwise (or with reduced motion) the grid updates instantly as before.
const applyFilters = () => {
  if (!document.startViewTransition || reducedMotion.matches) {
    updateGrid()
    return
  }
  document.startViewTransition(updateGrid)
}

let searchTimer

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(applyFilters, 150)
})

// Syncs the filter buttons and chapter heading to selectedChapter.
const renderChapterState = () => {
  const activeKey = selectedChapter === null ? 'all' : String(selectedChapter)

  filtersEl.querySelectorAll('.figures__filter').forEach((button) => {
    const isActive = button.dataset.chapter === activeKey
    button.classList.toggle('is-active', isActive)
    button.setAttribute('aria-pressed', String(isActive))
  })

  chapterHeading.textContent =
    selectedChapter === null
      ? 'All chapters'
      : `Chapter ${selectedChapter} — ${chapterNames.get(selectedChapter) ?? ''}`
}

const selectChapter = (chapter) => {
  selectedChapter = chapter
  renderChapterState()
  applyFilters()
}

// Deep links: statistics.html#chapter-3 opens with Chapter 3 selected.
const chapterFromHash = () => {
  const match = location.hash.match(/^#chapter-([1-8])$/)
  return match ? Number(match[1]) : null
}

filtersEl.addEventListener('click', (event) => {
  const button = event.target.closest('.figures__filter')
  if (!button) return

  const chapter = button.dataset.chapter === 'all' ? null : Number(button.dataset.chapter)
  // Clicking the active chapter again returns to All.
  const nextChapter = chapter === selectedChapter ? null : chapter

  // replaceState keeps the URL shareable without stacking back-button entries.
  history.replaceState(null, '', nextChapter === null ? location.pathname + location.search : `#chapter-${nextChapter}`)
  selectChapter(nextChapter)
})

window.addEventListener('hashchange', () => selectChapter(chapterFromHash()))

// Initial state: no animation on page load.
selectedChapter = chapterFromHash()
renderChapterState()
updateGrid()
