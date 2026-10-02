// Statistics page: figure grid + search + click-to-expand modal.
import './main.js'
import { Chart, registerables } from 'chart.js'
import { figures } from './data/figures.js'

Chart.register(...registerables)
// Charts only render in the light modal panel, so use dark text and grid lines.
Chart.defaults.color = 'rgba(23, 19, 31, 0.75)'
Chart.defaults.borderColor = 'rgba(23, 19, 31, 0.12)'
Chart.defaults.font.family = "system-ui, 'Segoe UI', Roboto, sans-serif"

// Series colours, in order. Datasets in figures.js that don't set their own
// colours take the next one from this list.
const palette = ['#1e9a8b', '#6fcfc7', '#c8c8c8', '#0e6b62']

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const easeOutQuart = (t) => 1 - (1 - t) ** 4

// Entrance timing. On first open the chart waits for the modal panel's 0.5s
// slide-in to settle; stepping with prev/next starts straight away and runs
// shorter.
const entranceTiming = (isStepping) => ({
  wait: isStepping ? 0 : 300,
  duration: isStepping ? 400 : 700,
})

// Chart.js options for the entrance. Bars rise from the axis one after
// another; doughnuts keep Chart.js's clockwise sweep. Lines don't use this,
// they're uncovered by revealPlugin instead.
const chartAnimation = (type, isStepping) => {
  if (reducedMotion.matches) return { animation: false }

  const stagger = type === 'bar' ? 40 : 0

  return {
    animation: {
      duration: entranceTiming(isStepping).duration,
      easing: 'easeOutQuart',
      // Resizes and legend toggles use other modes, so they don't stagger.
      delay: (ctx) => (ctx.type === 'data' && ctx.mode === 'default' ? ctx.dataIndex * stagger : 0),
    },
  }
}

// Clips the datasets to a strip that widens from the left as chart.$reveal
// goes from 0 to 1, so lines draw themselves left to right. Unlike animating
// the points, this can't be disturbed by a resize mid-way.
const revealPlugin = {
  id: 'reveal',
  beforeDatasetsDraw(chart) {
    if (chart.$reveal === undefined) return
    const { left, right } = chart.chartArea
    // The extra 8px keeps the last point whole at the end.
    const edge = left + (right + 8 - left) * chart.$reveal
    chart.ctx.save()
    chart.ctx.beginPath()
    chart.ctx.rect(0, 0, edge, chart.height)
    chart.ctx.clip()
  },
  afterDatasetsDraw(chart) {
    if (chart.$reveal !== undefined) chart.ctx.restore()
  },
}

const revealLine = (chart, duration) => {
  const start = performance.now()
  const frame = (now) => {
    if (chart !== activeChart) return
    const t = Math.min((now - start) / duration, 1)
    chart.$reveal = easeOutQuart(t)
    if (t === 1) delete chart.$reveal
    chart.render()
    if (t < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

// Chart.js sizes a new chart with 'resize' updates, which skip animation and
// leave it fully drawn. So the chart stays hidden until those have landed
// (the ResizeObserver reports a frame after creation) and, on first open, the
// panel has slid in; then it plays from its starting state.
const playEntrance = (chart, type, isStepping) => {
  if (reducedMotion.matches) return

  const { wait, duration } = entranceTiming(isStepping)
  chart.canvas.style.visibility = 'hidden'

  const start = () => {
    if (chart !== activeChart) return
    chart.canvas.style.visibility = ''
    if (type === 'line') {
      chart.update('none')
      revealLine(chart, duration)
    } else {
      chart.reset()
      chart.update()
    }
  }
  const afterLayout = () => requestAnimationFrame(() => requestAnimationFrame(start))

  if (wait) setTimeout(afterLayout, wait)
  else afterLayout()
}

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
        <p class="figure-card__caption">${figure.caption}</p>
        <h3 class="figure-card__name">Figure ${figure.id}</h3>
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
const modalPrev = document.querySelector('#figure-modal-prev')
const modalNext = document.querySelector('#figure-modal-next')

let activeChart = null
let activeFigure = null

const renderChart = (figure, isStepping) => {
  if (activeChart) {
    activeChart.destroy()
    activeChart = null
  }

  modalMedia.innerHTML = '<canvas></canvas>'
  const isDoughnut = figure.chart.type === 'doughnut'
  const isLine = figure.chart.type === 'line'
  const isBar = figure.chart.type === 'bar'
  // Opt-in per figure (chart.stacked: true); otherwise bars sit side by side.
  const isStacked = isBar && figure.chart.stacked === true

   let finalDatasets;

   if (figure.chart.datasets) {
    finalDatasets = figure.chart.datasets.map((dataset, i) => ({
      backgroundColor: palette[i % palette.length],
      borderColor: palette[i % palette.length],
      ...dataset,
    }));
  } else {
    // Fallback: Convert the old single 'values' array format into a Chart.js dataset format
    finalDatasets = [
      {
        label: figure.id,
        data: figure.chart.values,
        backgroundColor: isDoughnut
          ? palette
          : isLine
            ? 'rgba(30, 154, 139, 0.12)'
            : palette[0],
        borderColor: isDoughnut ? '#ffffff' : palette[0],
        borderWidth: isLine ? 2 : isDoughnut ? 2 : 0,
        tension: 0.35,
        fill: isLine,
        pointRadius: isLine ? 3 : undefined,
        pointBackgroundColor: isLine ? palette[0] : undefined,
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
      ...chartAnimation(figure.chart.type, isStepping),
      plugins: { legend: { display: figure.chart.datasets ? true : !isDoughnut } }, 
      scales: isDoughnut ? {} : { 
        x: { 
          grid: { display: false },
          stacked: isStacked
        },
        y: {
          beginAtZero: true,
          stacked: isStacked
        }
    },
  },
  plugins: [revealPlugin],
})

  playEntrance(activeChart, figure.chart.type, isStepping)
}

// The pager steps through the figures currently shown in the grid,
// so it follows the active chapter filter and search.
const visibleFigures = () =>
  Array.from(figuresGrid.querySelectorAll('.figure-card:not([hidden])'), (card) =>
    figures.find((item) => item.id === card.dataset.figureId)
  )

const openModal = (figure) => {
  activeFigure = figure
  // Text first, so the panel's layout is final before the chart sizes itself.
  modalTag.textContent = `Chapter ${figure.chapter} — ${figure.chapterName}`
  modalTitle.textContent = `Figure ${figure.id}`
  modalCaption.textContent = figure.caption
  renderChart(figure, modal.classList.contains('is-open'))

  const siblings = visibleFigures()
  const index = siblings.indexOf(figure)
  modalPrev.disabled = index <= 0
  modalNext.disabled = index === -1 || index >= siblings.length - 1

  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
}

const stepModal = (offset) => {
  const siblings = visibleFigures()
  const next = siblings[siblings.indexOf(activeFigure) + offset]
  if (next) openModal(next)
}

modalPrev.addEventListener('click', () => stepModal(-1))
modalNext.addEventListener('click', () => stepModal(1))

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
