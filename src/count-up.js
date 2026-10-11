// Counts numbers up from 0 the first time they scroll into view. Each
// element is marked data-count="<value>" and its text must be just that
// number, formatted like the counter does it (en-MY, value's decimals).
const DURATION = 1400
const STAGGER = 80 // between numbers that come into view together

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const easeOutQuart = (t) => 1 - (1 - t) ** 4

// Shows 0 straight away; the final value stays in, unseen, holding the
// number's finished width (and is what screen readers read).
const prepare = (el) => {
  const final = el.textContent
  const target = Number(el.dataset.count)
  const decimals = el.dataset.count.split('.')[1]?.length ?? 0
  const format = new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  const box = document.createElement('span')
  box.className = 'count-up'
  const sizer = document.createElement('span')
  sizer.className = 'count-up__sizer'
  sizer.textContent = final
  const value = document.createElement('span')
  value.setAttribute('aria-hidden', 'true')
  value.textContent = format.format(0)
  box.append(sizer, value)
  el.replaceChildren(box)

  return {
    start: 0,
    show: (progress) => {
      value.textContent = format.format(target * progress)
    },
    finish: () => {
      el.textContent = final
    },
  }
}

// Starts watching once `after` settles (e.g. an entrance animation).
// Returns a stop function that puts every number back to its final value.
export const countUp = (elements, { after = Promise.resolve() } = {}) => {
  if (reducedMotion || !elements.length) return () => {}

  const counters = new Map([...elements].map((el) => [el, prepare(el)]))
  const running = new Set()
  let frame = 0
  let stopped = false

  const tick = (now) => {
    for (const counter of running) {
      const progress = Math.min(Math.max((now - counter.start) / DURATION, 0), 1)
      counter.show(easeOutQuart(progress))
      if (progress === 1) {
        counter.finish()
        running.delete(counter)
      }
    }
    frame = running.size ? requestAnimationFrame(tick) : 0
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const now = performance.now()
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          observer.unobserve(entry.target)
          const counter = counters.get(entry.target)
          counter.start = now + index * STAGGER
          running.add(counter)
        })
      if (running.size && !frame) frame = requestAnimationFrame(tick)
    },
    { threshold: 0.5 }
  )

  after.then(() => {
    if (!stopped) counters.forEach((_, el) => observer.observe(el))
  })

  return () => {
    stopped = true
    observer.disconnect()
    cancelAnimationFrame(frame)
    counters.forEach((counter) => counter.finish())
  }
}
