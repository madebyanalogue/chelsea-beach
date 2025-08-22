import { watch } from 'vue'

export function useFavicon(isDark) {
  watch(isDark, (dark) => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      setFavicon(dark ? '/favicon-dark.png' : '/favicon-light.png')
    }
  }, { immediate: true })
}

function setFavicon(href) {
  let link = document.querySelector('link[rel*="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
} 