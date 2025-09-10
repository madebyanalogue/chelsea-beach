import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.server) return

  // IntersectionObserver to reveal elements when scrolled into view
  let observer
  const ensureObserver = () => {
    if (observer) return observer
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0.1 })
    return observer
  }

  const observeFadeInTargets = (rootEl = document) => {
    const obs = ensureObserver()
    const targets = rootEl.querySelectorAll('[data-fade-in]:not(.is-visible)')
    targets.forEach((el) => obs.observe(el))
  }

  function revealElementsInSection(sectionEl) {
    if (!sectionEl) return
    const targets = sectionEl.querySelectorAll('[data-fade-in]:not([data-fade-in="disabled"])')
    if (!targets || targets.length === 0) return
    targets.forEach((el, index) => {
      // Staggered reveal using global CSS var fallback
      const computed = getComputedStyle(document.documentElement)
      const globalStagger = parseInt(computed.getPropertyValue('--fade-stagger')) || 120
      const globalInitialDelay = parseInt(computed.getPropertyValue('--fade-initial-delay')) || 50
      const delayMs = Number(el.getAttribute('data-fade-in-delay')) || (globalInitialDelay + (index * globalStagger))
      
      // Add visible class after delay (CSS handles the transition)
      setTimeout(() => {
        el.classList.add('is-visible')
      }, delayMs)
    })
  }

  // When a section becomes visible, reveal its targets
  document.addEventListener('section-visible', (e) => {
    const sectionEl = e?.detail?.section
    revealElementsInSection(sectionEl)
  })

  // In case the first sections are marked visible on preloader completion
  if (document.body.classList.contains('preloader-complete')) {
    // No-op; section-triggers will already have fired events for top sections
  } else {
    document.addEventListener('preloader-complete', () => {
      // section-triggers fires visibility for top sections afterward
    }, { once: true })
  }

  // Observe fade-in targets on initial load and after each page transition
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => observeFadeInTargets())
  } else {
    observeFadeInTargets()
  }
  document.addEventListener('page-transition-in-complete', () => {
    // Reconnect and rescan targets on new page
    observeFadeInTargets()
  })
  document.addEventListener('route-changed', () => {
    // In case some navigations bypass the page transition hook
    observeFadeInTargets()
  })
})


