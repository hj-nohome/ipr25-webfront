// Always-on value labels for the figure charts, so every number reads
// without hovering, tiny ones included. statistics.js registers each
// chart's settings with setValueLabels(canvas, config) before creating it:
//   units       - the unit to follow each dataset's values, by dataset index
//   stacked     - bars are stacked: label each segment (inside when it fits,
//                 beside the bar when it doesn't)
//   stackTotals - true to add up each stack, or the report's totals by index
//   badges      - { dataset, text, color }: a pill after each of that
//                 dataset's bars (e.g. a year-on-year change)
//   size        - font size in px (default 11), smaller for small charts

const TEXT = 'rgba(23, 19, 31, 0.8)'
const font = (size, weight = 400) => `${weight} ${size}px system-ui, 'Segoe UI', Roboto, sans-serif`
const LINE_HEIGHT = 12

// Every label in a series gets the same decimals (the most any of its values
// has, up to 2), so 13.0% doesn't show as 13% beside 13.9%.
const decimalsOf = (value) => Math.min((String(value).split('.')[1] ?? '').length, 2)
const formatter = (values) => {
  const decimals = Math.max(0, ...values.filter((v) => typeof v === 'number').map(decimalsOf))
  const format = new Intl.NumberFormat('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (value) => format.format(value)
}

const configs = new WeakMap()

export const setValueLabels = (canvas, config) => configs.set(canvas, config)

// Dark text on light fills, white on dark ones.
const textOn = (color) => {
  const hex = typeof color === 'string' && color.match(/^#([0-9a-f]{6})/i)
  if (!hex) return TEXT
  const n = parseInt(hex[1], 16)
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150 ? TEXT : '#ffffff'
}

// Side by side, labels need a 2px gap to stay legible.
const overlaps = (a, b) => a.x1 < b.x2 + 2 && b.x1 < a.x2 + 2 && a.y1 < b.y2 && b.y1 < a.y2

export const valueLabelsPlugin = {
  id: 'valueLabels',
  // Runs inside the line reveal's clip (see revealPlugin), so labels
  // uncover along with their lines.
  afterDatasetsDraw(chart) {
    const config = configs.get(chart.canvas)
    if (!config) return

    const { ctx } = chart
    const horizontal = chart.options.indexAxis === 'y'
    const baseSize = config.size ?? 11
    const FONT = font(baseSize)
    const BOLD_FONT = font(baseSize, 600)
    const placed = []
    // The height of the current font's digits, for the collision boxes.
    let textHeight = baseSize * 0.8

    // The text's box for a given anchor, matching canvas align/baseline.
    const box = (text, x, y, align, baseline) => {
      const width = ctx.measureText(text).width
      const x1 = align === 'left' ? x : align === 'right' ? x - width : x - width / 2
      const y1 = baseline === 'top' ? y : baseline === 'bottom' ? y - textHeight : y - textHeight / 2
      return { x1, y1, x2: x1 + width, y2: y1 + textHeight }
    }
    // halo: a white outline so the text reads over bars and lines.
    const draw = (text, x, y, align, baseline, color = TEXT, halo = false) => {
      ctx.textAlign = align
      ctx.textBaseline = baseline
      if (halo) {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        ctx.lineJoin = 'round'
        ctx.strokeText(text, x, y)
      }
      ctx.fillStyle = color
      ctx.fillText(text, x, y)
      placed.push(box(text, x, y, align, baseline))
    }
    const isFree = (text, x, y, align, baseline) => !placed.some((b) => overlaps(b, box(text, x, y, align, baseline)))
    // Rotated a quarter turn, reading upwards from (x, y); downwards for
    // negative values.
    const drawUpright = (text, x, y, downwards) => {
      const width = ctx.measureText(text).width
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(-Math.PI / 2)
      ctx.textAlign = downwards ? 'right' : 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = TEXT
      ctx.fillText(text, 0, 0)
      ctx.restore()
      const y1 = downwards ? y : y - width
      placed.push({ x1: x - textHeight / 2, y1, x2: x + textHeight / 2, y2: y1 + width })
    }

    // Stacked segments too small to hold their labels (see below).
    const small = []

    ctx.save()
    ctx.font = FONT

    // Lines first: they're drawn over the bars, so their labels win any
    // clash with a stacked segment's.
    const order = chart.data.datasets
      .map((_, d) => d)
      .sort((a, b) => (chart.getDatasetMeta(b).type === 'line') - (chart.getDatasetMeta(a).type === 'line'))

    order.forEach((d) => {
      const dataset = chart.data.datasets[d]
      if (!chart.isDatasetVisible(d)) return
      const meta = chart.getDatasetMeta(d)
      const unit = config.units[d] ?? ''
      const format = formatter(dataset.data)

      meta.data.forEach((el, i) => {
        const value = dataset.data[i]
        if (value === null || value === undefined) return
        const text = `${format(value)}${unit}`
        const fill = el.options.backgroundColor

        if (meta.type === 'doughnut') {
          const { x, y, startAngle, endAngle, innerRadius, outerRadius } = el
          const mid = (startAngle + endAngle) / 2
          const radius = (innerRadius + outerRadius) / 2
          const width = ctx.measureText(text).width
          if ((endAngle - startAngle) * radius >= width + 6 && outerRadius - innerRadius >= LINE_HEIGHT + 2) {
            draw(text, x + Math.cos(mid) * radius, y + Math.sin(mid) * radius, 'center', 'middle', textOn(fill))
            return
          }
          // Too small to hold its label: put it just outside the ring,
          // nudged down past any neighbour already there.
          const align = Math.cos(mid) >= 0 ? 'left' : 'right'
          const px = x + Math.cos(mid) * (outerRadius + 6)
          let py = y + Math.sin(mid) * (outerRadius + 6)
          for (let tries = 0; tries < 4 && !isFree(text, px, py, align, 'middle'); tries += 1) py += LINE_HEIGHT
          draw(text, px, py, align, 'middle')
          return
        }

        if (meta.type === 'line') {
          // Above the point, or below it, stepping further out while those
          // spots are taken by another line's labels.
          const spots = [0, 1, 2].flatMap((step) => [
            [el.y - 6 - step * LINE_HEIGHT, 'bottom'],
            [el.y + 6 + step * LINE_HEIGHT, 'top'],
          ])
          const [y, baseline] = spots.find(([sy, sb]) => isFree(text, el.x, sy, 'center', sb)) ?? spots[0]
          // In the line's own colour, so a label is easy to tie to its line,
          // unless that colour is too light to read.
          const color = textOn(dataset.borderColor) === '#ffffff' ? dataset.borderColor : TEXT
          draw(text, el.x, y, 'center', baseline, color, true)
          return
        }

        // Bars. Stacked segments are labelled inside when the label fits
        // and no line label is there; the rest wait in `small` until the
        // stack totals are down. Other bars' labels sit past the bar's end.
        if (config.stacked) {
          const width = ctx.measureText(text).width
          const length = Math.abs((horizontal ? el.x : el.y) - el.base)
          const thickness = horizontal ? el.height : el.width
          const fits = horizontal
            ? length >= width + 6 && thickness >= LINE_HEIGHT
            : length >= LINE_HEIGHT + 2 && thickness >= width + 2
          const cx = horizontal ? (el.x + el.base) / 2 : el.x
          const cy = horizontal ? el.y : (el.y + el.base) / 2
          if (fits && isFree(text, cx, cy, 'center', 'middle')) draw(text, cx, cy, 'center', 'middle', textOn(fill))
          else small.push({ text, el, fill })
          return
        }
        const negative = value < 0
        const length = Math.abs((horizontal ? el.x : el.y) - el.base)

        if (horizontal) {
          // Thin bars get smaller text, so neighbouring labels don't overlap.
          const size = Math.max(8, Math.min(baseSize, Math.floor(el.height) + 1))
          ctx.font = font(size)
          textHeight = size * 0.8
          const width = ctx.measureText(text).width
          const outside = [el.x + (negative ? -4 : 4), negative ? 'right' : 'left']
          const inside = [el.x + (negative ? 4 : -4), negative ? 'left' : 'right']
          // Past the bar's end, or just inside it when that spot is taken
          // (by a line's label, say) and the bar is long enough.
          if (isFree(text, outside[0], el.y, outside[1], 'middle') || length < width + 8) {
            draw(text, outside[0], el.y, outside[1], 'middle')
          } else {
            draw(text, inside[0], el.y, inside[1], 'middle', textOn(fill))
          }
          ctx.font = FONT
          textHeight = baseSize * 0.8
          return
        }

        // Above the bar's end; just inside it when that spot is taken and
        // the bar is long enough; otherwise, or when the label is wider than
        // its bar, running upwards from the bar's end.
        const width = ctx.measureText(text).width
        const outsideY = el.y + (negative ? 4 : -4)
        const outsideBaseline = negative ? 'top' : 'bottom'
        if (width > el.width + 2) {
          drawUpright(text, el.x, outsideY, negative)
        } else if (isFree(text, el.x, outsideY, 'center', outsideBaseline)) {
          draw(text, el.x, outsideY, 'center', outsideBaseline)
        } else if (length >= LINE_HEIGHT + 8) {
          draw(text, el.x, el.y + (negative ? -4 : 4), 'center', negative ? 'bottom' : 'top', textOn(fill))
        } else {
          drawUpright(text, el.x, outsideY, negative)
        }
      })
    })

    // Each stack's total, past its far end.
    if (config.stacked && config.stackTotals) {
      ctx.font = BOLD_FONT
      const bars = chart.data.datasets
        .map((dataset, d) => ({ dataset, d, meta: chart.getDatasetMeta(d) }))
        .filter(({ d, meta }) => meta.type === 'bar' && chart.isDatasetVisible(d))
      const unit = bars.length ? config.units[bars[0].d] ?? '' : ''
      const totals = Array.isArray(config.stackTotals)
        ? config.stackTotals
        : chart.data.labels.map((_, i) =>
            Math.round(bars.reduce((sum, { dataset }) => sum + (dataset.data[i] ?? 0), 0) * 100) / 100
          )
      const format = formatter(totals)
      totals.forEach((total, i) => {
        const ends = bars.map(({ meta }) => meta.data[i]).filter(Boolean)
        if (!ends.length) return
        const text = `${format(total)}${unit}`
        if (horizontal) {
          draw(text, Math.max(...ends.map((el) => el.x)) + 4, ends[0].y, 'left', 'middle', TEXT, true)
        } else {
          draw(text, ends[0].x, Math.min(...ends.map((el) => el.y)) - 4, 'center', 'bottom', TEXT, true)
        }
      })
    }

    // Small stacked segments, zeros included, still get their labels: beside
    // the bar level with the segment (nudged along while that's taken), in
    // the segment's colour when it's dark enough to read. Failing that, over
    // the segment's end; failing that, on the segment itself.
    if (small.length) {
      ctx.font = FONT
      const area = chart.chartArea
      const barRect = (el) =>
        horizontal
          ? { x1: Math.min(el.x, el.base), x2: Math.max(el.x, el.base), y1: el.y - el.height / 2, y2: el.y + el.height / 2 }
          : { x1: el.x - el.width / 2, x2: el.x + el.width / 2, y1: Math.min(el.y, el.base), y2: Math.max(el.y, el.base) }
      const bars = chart.data.datasets.flatMap((_, d) => {
        const meta = chart.getDatasetMeta(d)
        return meta.type === 'bar' && chart.isDatasetVisible(d) ? meta.data.map(barRect) : []
      })
      const intersects = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2
      const inBounds = (b) => b.x1 >= area.left && b.x2 <= area.right + 2 && b.y1 >= area.top - LINE_HEIGHT && b.y2 <= area.bottom
      const clearOfLabels = (spot) => inBounds(box(...spot)) && !placed.some((p) => overlaps(p, box(...spot)))
      const clearOfAll = (spot) => clearOfLabels(spot) && !bars.some((r) => intersects(r, box(...spot)))
      const steps = [0, -1, 1, -2, 2, -3, 3]

      small.forEach(({ text, el, fill }) => {
        const rect = barRect(el)
        const width = ctx.measureText(text).width
        const beside = horizontal
          ? steps.flatMap((k) => [
              [text, (rect.x1 + rect.x2) / 2 + k * (width + 4), rect.y1 - 2, 'center', 'bottom'],
              [text, (rect.x1 + rect.x2) / 2 + k * (width + 4), rect.y2 + 2, 'center', 'top'],
            ])
          : [
              ...steps.map((k) => [text, rect.x2 + 3, (rect.y1 + rect.y2) / 2 + k * (textHeight + 2), 'left', 'middle']),
              ...steps.map((k) => [text, rect.x1 - 3, (rect.y1 + rect.y2) / 2 + k * (textHeight + 2), 'right', 'middle']),
            ]
        const overEnd = horizontal
          ? [[text, rect.x2 + 3, el.y, 'left', 'middle'], [text, rect.x1 - 3, el.y, 'right', 'middle']]
          : [[text, el.x, rect.y1 - 2, 'center', 'bottom'], [text, el.x, rect.y2 + 2, 'center', 'top']]
        // Level with the segment first; then over its own end, which keeps
        // the label on its own bar; only then nudged along the bar's far side
        // (a nudge on the near side would sit by the previous bar's labels).
        const level = horizontal ? beside.slice(0, 2) : [beside[0], beside[steps.length]]
        const nudged = horizontal ? beside : beside.slice(0, steps.length)
        const spot =
          level.find(clearOfAll) ??
          overEnd.find(clearOfLabels) ??
          nudged.find(clearOfAll) ??
          [text, (rect.x1 + rect.x2) / 2, (rect.y1 + rect.y2) / 2, 'center', 'middle']
        const color = textOn(fill) === '#ffffff' ? fill : TEXT
        draw(...spot, color, true)
      })
    }

    // Badges: a filled pill after the value label of each of one dataset's bars.
    const badges = config.badges
    if (badges && chart.isDatasetVisible(badges.dataset)) {
      const dataset = chart.data.datasets[badges.dataset]
      const unit = config.units[badges.dataset] ?? ''
      const format = formatter(dataset.data)
      chart.getDatasetMeta(badges.dataset).data.forEach((el, i) => {
        const text = badges.text[i]
        if (!text) return
        ctx.font = FONT
        const valueWidth = ctx.measureText(`${format(dataset.data[i])}${unit}`).width
        ctx.font = BOLD_FONT
        const width = ctx.measureText(text).width + 12
        const height = LINE_HEIGHT + 6
        const x = horizontal ? el.x + 4 + valueWidth + 8 : el.x - width / 2
        const y = horizontal ? el.y - height / 2 : el.y - 4 - LINE_HEIGHT - 6 - height
        ctx.fillStyle = badges.color
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, height / 2)
        ctx.fill()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = textOn(badges.color)
        ctx.fillText(text, x + width / 2, y + height / 2 + 0.5)
      })
    }

    ctx.restore()
  },
}
