import { watch } from 'vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

export function useFavicon(isDark) {
  const { faviconUrl, faviconPngUrl, faviconDarkPngUrl, appleTouchIconUrl, androidIconUrl } = useSiteSettings()

  function updateFavicon(dark) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // Select best favicon by mode
    let baseFavicon = dark
      ? (faviconDarkPngUrl.value || faviconPngUrl.value || faviconUrl.value || '/favicon-dark.png')
      : (faviconPngUrl.value || faviconUrl.value || '/favicon-light.png')

    // Cache-bust so browsers swap immediately when mode changes
    const sep = baseFavicon.includes('?') ? '&' : '?'
    const favicon = `${baseFavicon}${sep}v=${dark ? 'dark' : 'light'}`

    // Clean up any old icon links that might take precedence
    removeExistingIconLinks()

    // Add standard favicon links
    setFaviconLinkExact('icon', favicon, getMimeTypeFromUrl(favicon), '32x32')
    // Legacy support
    setFaviconLinkExact('shortcut icon', favicon, getMimeTypeFromUrl(favicon))

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

  // Prefer browser setting over app state
  if (typeof window !== 'undefined' && typeof matchMedia !== 'undefined') {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    // Initial
    updateFavicon(mq.matches)
    // React to OS/browser theme changes
    const handler = (e) => updateFavicon(e.matches)
    try { mq.addEventListener('change', handler) } catch { mq.addListener(handler) }
  } else {
    // Fallback to provided isDark ref when matchMedia is unavailable
    updateFavicon(!!(isDark && isDark.value))
    if (isDark && typeof isDark === 'object') {
      watch(isDark, (val) => updateFavicon(!!val), { immediate: false })
    }
  }
}

function removeExistingIconLinks() {
  const links = document.querySelectorAll('link[rel*="icon"]')
  links.forEach(link => link.parentNode && link.parentNode.removeChild(link))
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

function setFaviconLinkExact(rel, href, type = null, sizes = null) {
  const link = document.createElement('link')
  link.rel = rel
  if (type) link.type = type
  if (sizes) link.sizes = sizes
  link.href = href
  document.head.appendChild(link)
}

function getMimeTypeFromUrl(url) {
  const lower = url.split('?')[0].toLowerCase()
  if (lower.endsWith('.ico')) return 'image/x-icon'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  return undefined
}