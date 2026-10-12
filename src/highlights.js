// Draws a chapter's Key Highlights 2025 from src/data/highlights.js, with
// one builder per `layout`. Headline numbers (built with counter() or
// `counts`) count up from 0 (src/count-up.js); supporting ones stay still
// so that, beside the cover's transition, only a few things move at once.
import { ArcElement, Chart, DoughnutController, Tooltip } from 'chart.js'
import { countUp } from './count-up.js'

Chart.register(DoughnutController, ArcElement, Tooltip)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// By a value's `unit` in highlights.js; its `decimals` overrides. Words
// are lower case; the accent variant capitalises them on values (CSS).
const units = {
  count: { decimals: 0 },
  percent: { decimals: 1, symbol: '%' },
  million: { decimals: 2, word: 'million' },
  billion: { decimals: 2, word: 'billion' },
  mbps: { decimals: 1, word: 'Mbps' },
  rmBillion: { decimals: 2, prefix: 'RM', word: 'billion' },
}

const formatNumber = (value, decimals = 0) =>
  value.toLocaleString('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

const formatValue = (value, unit = 'count', decimals = units[unit].decimals) => {
  const { prefix = '', symbol = '', word } = units[unit]
  return `${prefix}${formatNumber(value, decimals)}${symbol}${word ? ` ${word}` : ''}`
}

const element = (tag, className, text) => {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (text !== undefined) el.textContent = text
  return el
}

const image = (className, src) => {
  const img = element('img', className)
  img.src = src
  img.alt = ''
  return img
}

const counter = (className, value, decimals = 0) => {
  const el = element('span', className, formatNumber(value, decimals))
  el.dataset.count = value.toFixed(decimals)
  return el
}

// The unit's word gets its own span so headline figures can shrink it.
// `counts` makes the number count up.
const valueWithUnit = (value, unit = 'count', decimals = units[unit].decimals, { counts = false } = {}) => {
  const { prefix = '', symbol = '', word } = units[unit]
  const el = element('span', 'hl-value')
  const number = counts
    ? counter('hl-value__number', value, decimals)
    : element('span', 'hl-value__number', formatNumber(value, decimals))
  el.append(prefix, number, symbol)
  if (word) el.append(' ', element('span', 'hl-value__word', word))
  return el
}

// An item's own unit and decimals, or else its block's.
const unitOf = (item, block = {}) =>
  item.unit ? [item.unit, item.decimals] : [block.unit, item.decimals ?? block.decimals]

// **text** comes out bold.
const richText = (className, text) => {
  const el = element('p', className)
  el.append(...text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? element('strong', '', part) : part)))
  return el
}

// `change` as given, or else worked out from `previous`.
const percentChange = (item) => item.change ?? ((item.value - item.previous) / item.previous) * 100

// "↑1.5%", with "up"/"down" for screen readers in place of the arrow.
const arrowChange = (percent) => {
  const arrow = element('span', '', percent < 0 ? '↓' : '↑')
  arrow.setAttribute('aria-hidden', 'true')
  return [
    element('span', 'visually-hidden', percent < 0 ? 'down ' : 'up '),
    arrow,
    `${formatNumber(Math.abs(percent), 1)}%`,
  ]
}

// By the layout's `changeStyle`. badge: "↑1.5%" for beside the value,
// "(2024: …)" under it. inline: "+0.6% from 2024" on one line. arrow:
// "↓9.1%", then "(2024: …)" under it.
const changeParts = (item, unit, decimals, { compareYear, changeStyle }) => {
  if (item.change === undefined && item.previous === undefined) return { lines: [] }
  const percent = percentChange(item)
  const previous =
    item.previous === undefined
      ? null
      : `${compareYear}: ${item.previousLabel ?? formatValue(item.previous, unit, decimals)}`

  if (changeStyle === 'inline') {
    const line = element('p', 'hl-trend')
    line.append(
      element('span', 'hl-trend__change', `${percent < 0 ? '−' : '+'}${formatNumber(Math.abs(percent), 1)}%`),
      ' ',
      element('span', 'hl-trend__from', previous ?? `from ${compareYear}`)
    )
    return { lines: [line] }
  }

  if (changeStyle === 'arrow') {
    const line = element('p', 'hl-trend hl-trend--arrow')
    line.append(...arrowChange(percent))
    const lines = [line]
    if (previous) lines.push(element('p', 'hl-previous hl-previous--muted', `(${previous})`))
    return { lines }
  }

  const badge = element('span', percent < 0 ? 'hl-change hl-change--down' : 'hl-change')
  badge.append(...arrowChange(percent))
  return { badge, lines: previous ? [element('p', 'hl-previous', `(${previous})`)] : [] }
}

const heading = (block, fallback) => {
  if (block.title) return element('h3', 'hl-block__title', block.title)
  const text = block.label ?? fallback
  if (!text) return null
  const el = element('h3', 'hl-block__label', text)
  if (block.sublabel) el.append(element('span', 'hl-block__sublabel', block.sublabel))
  return el
}

const ratio = ({ label, value, previous, unit = 'percent' }, compareYear) => {
  const el = element('div', 'hl-ratio')
  const figure = element('p', 'hl-ratio__figure')
  figure.append(valueWithUnit(value, unit))
  if (previous !== undefined) {
    figure.append(' ', element('span', 'hl-ratio__previous', `(${compareYear}: ${formatValue(previous, unit)})`))
  }
  el.append(element('p', 'hl-ratio__label', label), figure)
  return el
}

// An item's picture, such as logos; `imageAlt` says what it shows.
// `reveal` fades it in with the site's .reveal (main.js only finds those
// present at load, so this adds .is-visible itself).
const itemImage = (item, context) => {
  const img = image('hl-item__image', item.image)
  img.alt = item.imageAlt ?? ''
  if (item.reveal) {
    img.classList.add('reveal')
    revealOnView([img], context, 'is-visible')
  }
  return img
}

const items = (block, spec, context) => {
  const style = spec.style ?? 'list'
  const list = element('ul', `hl-items hl-items--${style}`)
  if (spec.columns) list.style.setProperty('--columns', spec.columns)
  list.append(
    ...spec.items.map((item) => {
      const [unit, decimals] = unitOf(item, block)
      const row = element('li', item.wide ? 'hl-item hl-item--wide' : 'hl-item')
      let value = null
      if (item.value !== undefined || item.text !== undefined) {
        value = element('p', 'hl-item__value')
        // Only `figures` items are headline numbers.
        value.append(
          item.value === undefined
            ? item.text
            : valueWithUnit(item.value, unit, decimals, { counts: style === 'figures' })
        )
      }
      const label = item.label && element('p', 'hl-item__label', item.label)

      // Bullets read "Label: value". list and cards place their parts
      // by grid area; the other styles stack them in this order.
      if (style === 'bullets') {
        row.append(label, value)
      } else {
        const { badge, lines } = changeParts(item, unit, decimals, context)
        row.append(
          ...[
            item.heading && element('p', 'hl-item__heading', item.heading),
            value,
            badge,
            ...lines,
            item.image && itemImage(item, context),
            label,
            item.note && element('p', 'hl-item__note', item.note),
            item.ratio && ratio(item.ratio, context.compareYear),
          ].filter(Boolean)
        )
      }
      return row
    })
  )
  return list
}

// A Chart.js doughnut of % shares, each item with a `color`, over a
// legend in the items' own order. The chart is built empty straight away,
// so Chart.js's setup is done before the cover's transition, and sweeps in
// when the stage starts it, alongside the block's numbers counting up. The
// legend's values are what screen readers get.
const donut = (spec, { stage, cleanups }) => {
  const el = element('div', 'hl-donut')
  const frame = element('div', 'hl-donut__chart')
  const canvas = element('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  frame.append(canvas)

  // Chart.js runs clockwise from the top: largest slice first.
  const slices = [...spec.items].sort((a, b) => b.value - a.value)
  const values = slices.map((item) => item.value)
  let chart = null
  let started = false

  // Hovering a legend row highlights its slice.
  const highlight = (item) => {
    if (!started) return
    const active = item ? [{ datasetIndex: 0, index: slices.indexOf(item) }] : []
    chart.setActiveElements(active)
    chart.tooltip.setActiveElements(active, { x: chart.width / 2, y: chart.height / 2 })
    chart.update()
  }

  const legend = element('ul', 'hl-legend')
  legend.append(
    ...spec.items.map((item) => {
      const row = element('li', 'hl-legend__item')
      row.style.setProperty('--swatch', item.color)
      const value = element('span', 'hl-legend__value')
      value.append(valueWithUnit(item.value, 'percent', item.decimals ?? 0))
      row.append(element('span', 'hl-legend__label', item.label), value)
      row.addEventListener('mouseenter', () => highlight(item))
      row.addEventListener('mouseleave', () => highlight(null))
      return row
    })
  )

  // Needs `el` on the page, for its styles.
  const build = () => {
    const { fontFamily } = getComputedStyle(el)
    chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: slices.map((item) => item.label),
        datasets: [
          {
            data: values.map(() => 0),
            backgroundColor: slices.map((item) => item.color),
            // Gaps between slices in the card's own colour.
            borderColor: getComputedStyle(el.closest('.hl-block')).backgroundColor,
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: '50%',
        layout: { padding: 6 }, // room for hoverOffset
        // The counters' length and ease (count-up.js), so they finish together.
        animation: reducedMotion ? false : { duration: 1400, easing: 'easeOutQuart' },
        plugins: {
          tooltip: {
            titleFont: { family: fontFamily },
            bodyFont: { family: fontFamily },
            callbacks: { label: (context) => ` ${context.label}: ${context.formattedValue}%` },
          },
        },
      },
    })
  }

  // Filling in the values animates the slices out from zero.
  const sweep = () => {
    chart.data.datasets[0].data = values
    chart.update()
    started = true
  }

  queueMicrotask(build)
  let timer = 0
  stage.add(frame, (delay) => {
    timer = setTimeout(sweep, delay)
  })
  cleanups.push(() => {
    clearTimeout(timer)
    chart?.destroy()
  })

  el.append(frame, legend)
  return el
}

// `lists`, or the block's own `items` as its one list.
const listsOf = (block) =>
  block.lists ??
  (block.items ? [{ label: block.itemsLabel, style: block.itemStyle, icon: block.icon, items: block.items }] : [])

const figure = (block, context) => {
  const [unit, decimals] = unitOf(block)
  const parts = [heading(block)].filter(Boolean)
  if (block.intro) parts.push(richText('hl-block__intro', block.intro))
  if (block.photo) parts.push(image('hl-block__photo', block.photo))

  if (block.value !== undefined) {
    const lead = element('p', 'hl-block__lead')
    lead.append(valueWithUnit(block.value, unit, decimals, { counts: true }))
    parts.push(lead)
    if (block.caption) parts.push(element('p', 'hl-block__caption', block.caption))
    const { badge: pill, lines } = changeParts(block, unit, decimals, context)
    if (pill) lead.append(pill)
    parts.push(...lines)
  }

  if (block.description) parts.push(richText('hl-block__description', block.description))
  if (block.ratio) parts.push(ratio(block.ratio, context.compareYear))

  for (const spec of listsOf(block)) {
    if (spec.label) parts.push(element('p', 'hl-block__items-label', spec.label))
    const list = items(block, spec, context)
    if (spec.icon) {
      const media = element('div', 'hl-media')
      media.append(image('hl-media__icon', spec.icon), list)
      parts.push(media)
    } else {
      parts.push(list)
    }
  }

  if (block.source) parts.push(element('p', 'hl-block__source', `Source: ${block.source}`))
  return parts
}

// One of a stack's `parts`, by which key it has.
const stackPart = (part, block, context) => {
  if (part.columns) {
    const el = element('div', 'hl-columns')
    el.append(
      ...part.columns.map((column) => {
        const col = element('div', 'hl-columns__column')
        col.append(...column.map((inner) => stackPart(inner, block, context)))
        return col
      })
    )
    return el
  }
  if (part.list) {
    return part.list === 'donut' ? donut(part, context) : items(block, { ...part, style: part.list }, context)
  }
  if (part.value !== undefined) {
    const [unit, decimals] = unitOf(part, block)
    const el = element('div', 'hl-figure')
    const value = element('p', 'hl-figure__value')
    value.append(valueWithUnit(part.value, unit, decimals, { counts: true }))
    el.append(value)
    if (part.label) el.append(richText('hl-figure__label', part.label))
    return el
  }
  if (part.image) {
    const img = image(part.size === 'logo' ? 'hl-part-image hl-part-image--logo' : 'hl-part-image', part.image)
    img.alt = part.alt ?? ''
    return img
  }
  if (part.heading) return element('p', 'hl-part-heading', part.heading)
  if (part.note) return richText('hl-part-note', part.note)
  const modifiers = [part.strong && 'hl-part-text--strong', part.large && 'hl-part-text--large']
  return richText(['hl-part-text', ...modifiers].filter(Boolean).join(' '), part.text)
}

const stack = (block, context) =>
  [heading(block), ...block.parts.map((part) => stackPart(part, block, context))].filter(Boolean)

// Each bar grows in once its row is on screen, like chapter 1's.
const shares = (block, context) => {
  const list = element('ul', 'hl-shares')
  list.append(
    ...block.items.map((item) => {
      const row = element('li', 'hl-share')
      const share = element('p', 'hl-share__percent')
      share.append(valueWithUnit(item.share, 'percent'))
      const bar = element('span', 'hl-share__bar')
      bar.setAttribute('aria-hidden', 'true')
      bar.style.setProperty('--share', `${item.share}%`)
      row.append(
        element('p', 'hl-share__label', item.label),
        share,
        element('p', 'hl-share__value', formatValue(item.value, block.unit)),
        bar
      )
      return row
    })
  )
  revealOnView([...list.children], context)
  return [heading(block), list]
}

const banner = (block) => {
  const stats = element('div', 'hl-banner__stats')
  stats.append(
    ...block.stats.map((stat) => {
      const el = element('p', stat.inline ? 'hl-stat hl-stat--inline' : 'hl-stat')
      el.append(
        valueWithUnit(stat.value, stat.unit, undefined, { counts: true }),
        element('span', 'hl-stat__text', stat.text)
      )
      return el
    })
  )
  const parts = [heading(block)]
  if (block.source) parts.push(element('p', 'hl-banner__source', `Source: ${block.source}`))
  return [...parts, stats]
}

const statement = (block) => [
  element('h3', 'hl-statement__label', block.label),
  richText('hl-statement__text', block.text),
]

const notes = (block) => {
  const list = element('ol', 'hl-notes')
  list.append(...block.items.map((note) => element('li', '', note)))
  return [heading(block, 'Note'), list]
}

// Each type's default tone and width; a block can override either.
const blockTypes = {
  figure: { build: figure, tone: 'plain' },
  stack: { build: stack, tone: 'card' },
  divider: { build: () => [], tone: 'rule', wide: true },
  shares: { build: shares, tone: 'tint' },
  banner: { build: banner, tone: 'dark', wide: true },
  statement: { build: statement, tone: 'tint', wide: true },
  notes: { build: notes, tone: 'tint', wide: true },
}

const grid = ({ compareYear, variant, changeStyle, blocks }, runtime) => {
  const context = {
    ...runtime,
    compareYear,
    changeStyle: changeStyle ?? (variant === 'accent' ? 'inline' : 'badge'),
  }
  return blocks.map((block) => {
    const type = blockTypes[block.type]
    const section = element('section', `hl-block hl-block--${block.type} hl-block--${block.tone ?? type.tone}`)
    if (block.wide ?? type.wide) section.classList.add('hl-block--wide')
    if (block.neutralValues) section.classList.add('hl-block--neutral-values')
    section.append(...type.build(block, context))
    return section
  })
}

// Adds `className` to each element when the stage starts it, with its
// place in the stagger as --reveal-delay.
const revealOnView = (elements, { stage }, className = 'is-revealed') => {
  elements.forEach((el) =>
    stage.add(el, (delay) => {
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.classList.add(className)
    })
  )
}

// Each item's row also gets a bar of its share of the group total, and
// that share in words, which CSS swaps in for the previous value on hover.
const breakdown = ({ compareYear, groups }, runtime) => {
  const rows = []
  const sections = groups.map((group) => {
    const section = element('section', 'highlights__group')

    const header = element('div', 'highlights__total')
    const total = element('p', 'highlights__total-value')
    total.append(
      counter('highlights__total-number', group.value),
      element('span', 'highlights__previous', `${compareYear}: ${formatNumber(group.previous)}`)
    )
    header.append(total, element('h3', 'highlights__total-title', group.title))

    const list = element('ul', 'highlights__items')
    list.append(
      ...group.items.map((item) => {
        const row = element('li', 'highlights__item')
        const text = element('div', 'highlights__item-text')
        text.append(
          element('p', 'highlights__item-label', item.label),
          element('p', 'highlights__item-description', item.description)
        )
        const share = (item.value / group.value) * 100
        const compare = element('span', 'highlights__compare')
        compare.append(
          element('span', 'highlights__previous', `${compareYear}: ${formatNumber(item.previous)}`),
          // "of total" fits the space of the 2024 value it stands in for.
          element('span', 'highlights__share-text', `${formatNumber(share)}% of total`)
        )
        const bar = element('span', 'highlights__share')
        bar.setAttribute('aria-hidden', 'true')
        bar.style.setProperty('--share', `${share}%`)

        // The share bar is this row's motion; its number stays still.
        row.append(element('span', 'highlights__item-value', formatNumber(item.value)), text, compare, bar)
        rows.push(row)
        return row
      })
    )

    section.append(header, list)
    return section
  })

  revealOnView(rows, runtime)
  return sections
}

const layouts = { breakdown, grid }

// One observer for everything that animates in (counters, bars, the
// donut, revealed images), so what comes into view together starts
// together: in page order, STAGGER apart, each by the start function it
// was added with. It starts watching once `ready` settles.
const STAGGER = 80

const createStage = ({ ready, cleanups }) => {
  const starts = new Map()
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, index) => {
          observer.unobserve(el)
          starts.get(el)(index * STAGGER)
        })
    },
    // Like the site's .reveal: once its top clears the bottom 15% of the screen.
    { rootMargin: '0px 0px -15% 0px' }
  )
  let watching = false
  let stopped = false
  ready.then(() => {
    if (stopped) return
    watching = true
    starts.forEach((_, el) => observer.observe(el))
  })
  cleanups.push(() => {
    stopped = true
    observer.disconnect()
  })
  return {
    add: (el, start) => {
      starts.set(el, start)
      if (watching) observer.observe(el)
    },
  }
}

// Stop the previous chapter's counters, charts and stage.
let cleanups = []

// Empties the container when the chapter has no highlights.
export const renderHighlights = (container, data) => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []

  // On first load, everything waits for the page intro to fade in; on a
  // chapter switch it has long finished.
  const intro = container.closest('.page-intro')?.getAnimations() ?? []
  const ready = Promise.allSettled(intro.map((animation) => animation.finished))
  const stage = createStage({ ready, cleanups })

  container.dataset.layout = data?.layout ?? ''
  container.dataset.variant = data?.variant ?? ''
  container.replaceChildren(...(data ? layouts[data.layout](data, { stage, cleanups }) : []))
  cleanups.push(countUp(container.querySelectorAll('[data-count]'), { schedule: stage.add }))

  // Each change badge waits for the value beside it to finish counting,
  // then lands (CSS); with reduced motion nothing counts, so none waits.
  if (reducedMotion) return
  container.querySelectorAll('.hl-change').forEach((badge) => {
    const value = badge.parentElement.querySelector('[data-count]')
    if (!value) return
    badge.classList.add('is-pending')
    value.addEventListener('countend', () => badge.classList.remove('is-pending'), { once: true })
  })
}
