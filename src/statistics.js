// Statistics page: figure grid + search + click-to-expand modal.
import './main.js'
import { Chart, registerables } from 'chart.js'
import { chapterPalettes, figures } from './data/figures.generated.js'
import { setValueLabels, valueLabelsPlugin } from './value-labels.js'

Chart.register(...registerables)
// Charts only render in the light modal panel, so use dark text and grid lines.
Chart.defaults.color = 'rgba(23, 19, 31, 0.75)'
Chart.defaults.borderColor = 'rgba(23, 19, 31, 0.12)'
Chart.defaults.font.family = "system-ui, 'Segoe UI', Roboto, sans-serif"

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
    if (!activeCharts.includes(chart)) return
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
    if (!activeCharts.includes(chart)) return
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
const modalNote = document.querySelector('#figure-modal-note')
const modalSource = document.querySelector('#figure-modal-source')
const modalPrev = document.querySelector('#figure-modal-prev')
const modalNext = document.querySelector('#figure-modal-next')

// Every chart in the open figure: one, or one per chart panel.
let activeCharts = []
let activeFigure = null

// Table figures: the first cell of each row is its label, the rest are
// numbers formatted per column. Rows fade in top to bottom (see
// .figure-table--enter), after the panel's slide-in on first open.
// Per column: align: 'left' for text, and merge: true to join a run of
// repeated values into one cell spanning those rows.
const tableHtml = (table, isStepping) => {
  const formatCell = (value, i) =>
    typeof value === 'number'
      ? value.toLocaleString('en-MY', {
          minimumFractionDigits: table.columns[i].decimals ?? 0,
          maximumFractionDigits: table.columns[i].decimals ?? 0,
        })
      : (value ?? '') // null: no value, e.g. a share on a subtotal row
  const alignClass = (i) => (table.columns[i].align === 'left' ? ' class="figure-table__cell--left"' : '')

  // How many rows each merged cell spans; 0 where an earlier row's cell covers it.
  const spans = table.rows.map(() => table.columns.map(() => 1))
  table.columns.forEach((column, c) => {
    if (!column.merge) return
    table.rows.forEach((row, r) => {
      if (r === 0 || row[c] !== table.rows[r - 1][c]) return
      let first = r - 1
      while (spans[first][c] === 0) first -= 1
      spans[first][c] += 1
      spans[r][c] = 0
    })
  })

  const rowCells = (row, rowSpans) =>
    row
      .map((value, i) => {
        const span = rowSpans?.[i] ?? 1
        if (span === 0) return ''
        const rowspan = span > 1 ? ` rowspan="${span}"` : ''
        return i === 0
          ? `<th scope="${span > 1 ? 'rowgroup' : 'row'}"${rowspan}${alignClass(i)}>${value}</th>`
          : `<td${rowspan}${alignClass(i)}>${formatCell(value, i)}</td>`
      })
      .join('')

  return `
    <table class="figure-table figure-table--enter" style="--wait: ${entranceTiming(isStepping).wait}ms">
      <thead>
        <tr>${table.columns.map((column, i) => `<th scope="col"${alignClass(i)}>${column.label}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${table.rows.map((row, i) => `<tr style="--row: ${i}">${rowCells(row, spans[i])}</tr>`).join('')}
      </tbody>
      ${table.total ? `<tfoot><tr style="--row: ${table.rows.length}">${rowCells(table.total)}</tr></tfoot>` : ''}
    </table>
  `
}

// Colours come from the report: a dataset's color (one per series, or one
// per bar) or chart.colors (one per doughnut slice). Anything without its
// own takes the chapter's palette in order.
const seriesColor = (dataset, i, palette) => dataset.color ?? palette[i % palette.length]

// Draws one chart spec (figure.chart, or a panel's chart) on the canvas.
// showLegend: false when the figure shares one legend across its panels.
const createChart = (canvas, chart, figure, isStepping, showLegend = true) => {
  const isDoughnut = chart.type === 'doughnut'
  const isLine = chart.type === 'line'
  const isBar = chart.type === 'bar'
  // Opt-in per chart (chart.stacked: true); otherwise bars sit side by side.
  const isStacked = isBar && chart.stacked === true
  const palette = chapterPalettes[figure.chapter]

  let finalDatasets

  if (chart.datasets) {
    finalDatasets = chart.datasets.map(({ color, ...dataset }, i) => ({
      backgroundColor: seriesColor({ color }, i, palette),
      borderColor: seriesColor({ color }, i, palette),
      // Chart.js draws lower orders last, so a line laid over bars stays on top.
      ...(isBar && dataset.type === 'line' && { order: -1 }),
      ...dataset,
    }))
  } else {
    // Fallback: Convert the old single 'values' array format into a Chart.js dataset format
    const colors = chart.colors ?? palette
    finalDatasets = [
      {
        label: figure.id,
        data: chart.values,
        backgroundColor: isDoughnut
          ? colors
          : isLine
            ? `${colors[0]}1f` // ~12% alpha under the line
            : colors[0],
        borderColor: isDoughnut ? '#ffffff' : colors[0],
        borderWidth: isLine ? 2 : isDoughnut ? 2 : 0,
        tension: 0.35,
        fill: isLine,
        pointRadius: isLine ? 3 : undefined,
        pointBackgroundColor: isLine ? colors[0] : undefined,
      },
    ]
  }

  // A dataset with yAxisID: 'y1' reads against a second y axis on the right.
  // With two axes, each is titled with its series so it's clear which line
  // reads against which scale; chart.yTitle / chart.y1Title override that,
  // e.g. when several stacked series share the left axis.
  const hasSecondAxis = finalDatasets.some((dataset) => dataset.yAxisID === 'y1')
  const axisTitle = (axisId) => ({
    display: hasSecondAxis,
    text: chart[`${axisId}Title`] ?? finalDatasets.find((dataset) => (dataset.yAxisID ?? 'y') === axisId)?.label,
  })

  // Optional per chart: chart.unit (e.g. '%') follows the values on the
  // value axis and in tooltips; chart.yMin / chart.yMax set its range.
  // chart.y1Unit, chart.y1Min and chart.y1Max do the same for the right axis.
  // chart.horizontal turns bars sideways, putting the values on the x axis;
  // chart.reverse flips the category order (largest bar at the bottom).
  // chart.tooltip: false turns off hover values and value labels, e.g. for
  // estimated figures.
  const unit = chart.unit
  const y1Unit = chart.y1Unit
  const unitFor = (dataset) => (dataset.yAxisID === 'y1' ? y1Unit : unit) ?? ''
  // Tick labels carry the axis's unit; chart.yStep / chart.y1Step fix the
  // spacing between ticks.
  const axisTicks = (axisUnit, step) => ({
    ticks: {
      ...(axisUnit && { callback: (value) => `${value}${axisUnit}` }),
      // Every step is drawn; Chart.js would otherwise thin them out.
      ...(step && { stepSize: step, autoSkip: false }),
    },
  })
  const isHorizontal = chart.horizontal === true
  const categoryScale = {
    grid: { display: false },
    stacked: isStacked,
    reverse: chart.reverse === true,
    // Half a step in from each end, so the end points' labels clear the axes.
    ...(isLine && { offset: true }),
  }
  // Value labels sit past the ends of bars and above points, so value axes
  // without a set maximum get headroom for them; more over upright bars,
  // whose labels may turn to run upwards (see value-labels.js).
  const showValues = chart.tooltip !== false
  const grace = !showValues ? 0 : isBar && !isHorizontal ? '15%' : '10%'
  const valueScale = {
    beginAtZero: chart.yMin === undefined,
    min: chart.yMin,
    max: chart.yMax,
    // A set maximum is kept exactly (headroom would also coarsen the steps).
    grace: chart.yMax === undefined ? grace : 0,
    stacked: isStacked,
    title: axisTitle('y'),
    ...axisTicks(unit, chart.yStep),
  }

  // chart.labelSize shrinks the value labels for small charts.
  // chart.badges ({ label, color, dataset, text }) adds a pill after each of
  // one dataset's bars, with its own legend item that doesn't toggle anything.
  const badges = chart.badges
  if (showValues) {
    setValueLabels(canvas, {
      units: finalDatasets.map(unitFor),
      stacked: isStacked,
      stackTotals: chart.stackTotals,
      badges,
      size: chart.labelSize,
    })
  }
  const legendLabels = {
    ...(!isDoughnut && { sort: (a, b) => a.datasetIndex - b.datasetIndex }),
    ...(badges && {
      generateLabels: (legendChart) => [
        ...Chart.defaults.plugins.legend.labels.generateLabels(legendChart),
        {
          text: badges.label,
          fillStyle: badges.color,
          strokeStyle: badges.color,
          lineWidth: 0,
          datasetIndex: legendChart.data.datasets.length,
          isBadge: true,
        },
      ],
    }),
  }

  const instance = new Chart(canvas, {
    type: chart.type,
    data: {
      labels: chart.labels,
      datasets: finalDatasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...chartAnimation(chart.type, isStepping),
      indexAxis: isHorizontal ? 'y' : 'x',
      // Without tooltips, hovering does nothing either; clicks still toggle the legend.
      ...(chart.tooltip === false && { events: ['click'] }),
      // Room for labels outside small doughnut slices, above bars and
      // points that reach the top of the axis (so they clear the legend),
      // past small stacked segments, and for badges.
      layout: {
        padding: !showValues
          ? 0
          : isDoughnut
            ? 24
            : !isHorizontal
              ? { top: 14 }
              : isStacked
                ? { right: 12 }
                : badges ? { right: 64 } : 0,
      },
      plugins: {
        // A filled line laid over bars (e.g. 2.1's share line) shades the
        // area behind the bars, not over them.
        ...(isBar && { filler: { drawTime: 'beforeDatasetsDraw' } }),
        // A single series is named by the figure caption, and its bars may
        // each have their own colour, so it gets no legend. Doughnuts keep
        // theirs, since it names the slices.
        // Legend and tooltip keep the data's order, whatever the draw order.
        legend: {
          display: showLegend && (isDoughnut || finalDatasets.length > 1),
          labels: legendLabels,
          onClick: (event, item, legend) => {
            if (!item.isBadge) Chart.defaults.plugins.legend.onClick(event, item, legend)
          },
        },
        tooltip: {
          enabled: chart.tooltip !== false,
          itemSort: (a, b) => a.datasetIndex - b.datasetIndex,
          ...((unit || y1Unit) && {
            callbacks: {
              label: (ctx) =>
                `${isDoughnut ? ctx.label : ctx.dataset.label}: ${ctx.formattedValue}${unitFor(ctx.dataset)}`,
            },
          }),
        },
      },
      scales: isDoughnut
        ? {}
        : {
            x: isHorizontal ? valueScale : categoryScale,
            y: isHorizontal ? categoryScale : valueScale,
            ...(hasSecondAxis && {
              y1: {
                // chart.y1Display: false hides the right axis when the
                // line's own labels carry its values.
                display: chart.y1Display !== false,
                position: 'right',
                beginAtZero: chart.y1Min === undefined,
                min: chart.y1Min,
                max: chart.y1Max,
                grace: chart.y1Max === undefined ? grace : 0,
                // Only the left axis draws grid lines, so the two don't clash.
                grid: { drawOnChartArea: false },
                title: axisTitle('y1'),
                ...axisTicks(y1Unit, chart.y1Step),
              },
            }),
          },
    },
    // valueLabelsPlugin first, so its labels draw inside revealPlugin's clip.
    plugins: [valueLabelsPlugin, revealPlugin],
  })

  activeCharts.push(instance)
  playEntrance(instance, chart.type, isStepping)
}

// One legend above the panels, for figures whose panels share their series
// (figure.sharedLegend): taken from the first chart panel.
const sharedLegendHtml = (figure) => {
  const chart = figure.panels.find((panel) => panel.chart).chart
  const palette = chapterPalettes[figure.chapter]
  const items = chart.datasets
    ? chart.datasets.map((dataset, i) => {
        const color = seriesColor(dataset, i, palette)
        return [dataset.label, Array.isArray(color) ? color[0] : color]
      })
    : chart.labels.map((label, i) => [label, (chart.colors ?? palette)[i % (chart.colors ?? palette).length]])
  return `
    <ul class="figure-panels__legend">
      ${items.map(([label, color]) => `<li><span style="background: ${color}"></span>${label}</li>`).join('')}
    </ul>
  `
}

// Figures with panels show several charts and tables together, each with an
// optional short title. The grid holds up to figure.panelColumns (default 2) columns,
// each at least figure.panelMinWidth px (default 240) wide, so it drops to
// fewer on narrow screens. Charts take figure.panelRatio (or the panel's own
// ratio) as width / height; a panel with wide: true spans the full row.
const renderPanels = (figure, isStepping) => {
  const layout = [
    `--cols: ${figure.panelColumns ?? 2}`,
    `--min: ${figure.panelMinWidth ?? 240}px`,
    `--ratio: ${figure.panelRatio ?? '4/3'}`,
  ].join('; ')

  modalMedia.innerHTML = `
    <div class="figure-panels" style="${layout}">
      ${figure.sharedLegend ? sharedLegendHtml(figure) : ''}
      ${figure.panels
        .map(
          (panel) => `
            <section class="figure-panel${panel.wide ? ' figure-panel--wide' : ''}">
              ${panel.title ? `<h3 class="figure-panel__title">${panel.title}</h3>` : ''}
              ${
                panel.chart
                  ? `<div class="figure-panel__chart"${panel.ratio ? ` style="--ratio: ${panel.ratio}"` : ''}><canvas></canvas></div>`
                  : tableHtml(panel.table, isStepping)
              }
            </section>
          `
        )
        .join('')}
    </div>
  `

  const canvases = modalMedia.querySelectorAll('.figure-panel canvas')
  figure.panels
    .filter((panel) => panel.chart)
    .forEach((panel, i) => createChart(canvases[i], panel.chart, figure, isStepping, !figure.sharedLegend))
}

const renderFigure = (figure, isStepping) => {
  activeCharts.forEach((chart) => chart.destroy())
  activeCharts = []

  modalMedia.classList.toggle('figure-modal__media--table', Boolean(figure.table))
  modalMedia.classList.toggle('figure-modal__media--panels', Boolean(figure.panels))

  if (figure.table) {
    modalMedia.innerHTML = tableHtml(figure.table, isStepping)
  } else if (figure.panels) {
    renderPanels(figure, isStepping)
  } else {
    modalMedia.innerHTML = '<canvas></canvas>'
    createChart(modalMedia.querySelector('canvas'), figure.chart, figure, isStepping)
  }
  watchScrollHints()
}

// Fades the right edge of a box that scrolls sideways (see .has-more in
// style.css) until it's scrolled to the end, so the cut-off column reads
// as more to see. The boxes are the figure's own and, in panel figures,
// each table panel.
const updateScrollHint = (box) => {
  const hiddenRight = box.scrollWidth - box.clientWidth - box.scrollLeft
  box.classList.toggle('has-more', hiddenRight > 1)
}

const scrollHintObserver = new ResizeObserver((entries) =>
  entries.forEach((entry) => updateScrollHint(entry.target))
)

// Observing a box also checks it once straight away.
const watchScrollHints = () => {
  const boxes = [modalMedia, ...modalMedia.querySelectorAll('.figure-panel:has(> .figure-table)')]
  scrollHintObserver.disconnect()
  boxes.forEach((box) => scrollHintObserver.observe(box))
}

// Scroll events don't bubble, so this listens in the capture phase to
// catch the panels' as well as the box's own.
modalMedia.addEventListener('scroll', (event) => updateScrollHint(event.target), { passive: true, capture: true })

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
  modalNote.textContent = figure.note ? `Note: ${figure.note}` : ''
  modalNote.hidden = !figure.note
  modalSource.textContent = figure.source ? `Source: ${figure.source}` : ''
  modalSource.hidden = !figure.source
  renderFigure(figure, modal.classList.contains('is-open'))

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
