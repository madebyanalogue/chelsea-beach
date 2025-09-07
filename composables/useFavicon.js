import { watch } from 'vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

export function useFavicon(isDark) {
  const { faviconUrl, faviconPngUrl, appleTouchIconUrl, androidIconUrl } = useSiteSettings()

  watch(isDark, (dark) => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Use Sanity favicon if available, otherwise fall back to hardcoded files
      const favicon = faviconUrl.value || (dark ? '/favicon-dark.png' : '/favicon-light.png')
      setFavicon(favicon)
      
      // Set other favicon types if available
      if (faviconPngUrl.value) {
        setFaviconLink('icon', faviconPngUrl.value, '32x32')
      }
      if (appleTouchIconUrl.value) {
        setFaviconLink('apple-touch-icon', appleTouchIconUrl.value)
      }
      if (androidIconUrl.value) {
        setFaviconLink('icon', androidIconUrl.value, '192x192')
      }
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

function setFaviconLink(rel, href, sizes = null) {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    if (sizes) {
      link.sizes = sizes
    }
    document.head.appendChild(link)
  }
  link.href = href
} 