// Site language, EN or BM ('ms'), remembered across visits. Each page's
// <head> script sets <html lang> from it before paint. Text in both
// languages is a { en, ms } pair; where the BM is still to come, English
// shows.
const STORAGE_KEY = 'ipr25-lang'
const languages = ['en', 'ms']

// Off for now: the toggle still animates (main.js), but the site stays in
// English and a stored BM choice is ignored.
export const translationEnabled = false

const stored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export let lang = translationEnabled && languages.includes(stored()) ? stored() : 'en'
document.documentElement.lang = lang

export const t = (text) => (text?.constructor === Object ? text[lang] ?? text.en : text)

// A copy of `data` with every { en, ms } pair in it resolved by t().
export const localize = (data) => {
  if (Array.isArray(data)) return data.map(localize)
  if (data?.constructor !== Object) return data
  if ('en' in data) return t(data)
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, localize(value)]))
}

export const setLang = (next) => {
  if (!translationEnabled || next === lang || !languages.includes(next)) return
  lang = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {}
  document.documentElement.lang = next
  document.dispatchEvent(new Event('langchange'))
}

export const onLangChange = (render) => document.addEventListener('langchange', render)
