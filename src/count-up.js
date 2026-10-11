// Counts numbers up from 0. Each element is marked data-count="<value>"
// and its text must be just that number, formatted like the counter does
// it (en-MY, value's decimals). When each starts is up to the caller's
// `schedule(el, start)`, which calls start(delay) when it's time; each
// fires a 'countend' event once it has counted all the way up. Whole
// numbers under POP_BELOW fade and scale in instead (CSS .count-pop):
// counting 0 to 7 is a few jerky steps, not a count.
const DURATION = 1400
const POP_BELOW = 20
const POP_MS = 400 // matches .count-pop's transition

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const easeOutQuart = (t) => 1 - (1 - t) ** 4

const isSmall = (el) => !el.dataset.count.includes('.') && Number(el.dataset.count) < POP_BELOW

// Hidden until it pops in; its text never changes.
const preparePop = (el) => {
  el.classList.add('count-pop', 'is-waiting')
  return {
    el,
    pop: true,
    finish: () => {
      el.classList.remove('is-waiting')
    },
  }
}

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
    el,
    start: 0,
    show: (progress) => {
      value.textContent = format.format(target * progress)
    },
    finish: () => {
      el.textContent = final
    },
  }
}

// Returns a stop function that puts every number back to its final value.
export const countUp = (elements, { schedule }) => {
  if (reducedMotion || !elements.length) return () => {}

  const running = new Set()
  const timers = []
  let frame = 0

  const tick = (now) => {
    for (const counter of running) {
      const progress = Math.min(Math.max((now - counter.start) / DURATION, 0), 1)
      counter.show(easeOutQuart(progress))
      if (progress === 1) {
        counter.finish()
        running.delete(counter)
        counter.el.dispatchEvent(new Event('countend'))
      }
    }
    frame = running.size ? requestAnimationFrame(tick) : 0
  }

  const counters = [...elements].map((el) => {
    const counter = isSmall(el) ? preparePop(el) : prepare(el)
    schedule(el, (delay = 0) => {
      if (counter.pop) {
        el.style.transitionDelay = `${delay}ms`
        counter.finish()
        timers.push(setTimeout(() => el.dispatchEvent(new Event('countend')), delay + POP_MS))
        return
      }
      counter.start = performance.now() + delay
      running.add(counter)
      if (!frame) frame = requestAnimationFrame(tick)
    })
    return counter
  })

  return () => {
    cancelAnimationFrame(frame)
    timers.forEach(clearTimeout)
    counters.forEach((counter) => counter.finish())
  }
}
