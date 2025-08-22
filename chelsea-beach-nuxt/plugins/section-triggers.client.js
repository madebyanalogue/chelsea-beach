import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.server) return

  let sections = []
  let isInitialized = false

  function addTriggersToSections() {
    if (isInitialized) return
    
    const main = document.querySelector('main')
    if (!main) return

    const sectionElements = main.querySelectorAll('section')
    
    sectionElements.forEach((section, index) => {
      // Create the trigger element
      const trigger = document.createElement('div')
      trigger.className = 'section-trigger'
      trigger.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        background-color: transparent;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      `

      // Add the trigger to the section
      section.style.position = 'relative'
      section.appendChild(trigger)

      // Store section info
      const sectionInfo = {
        element: section,
        trigger,
        isVisible: false,
        isTopSection: false,
        index
      }

      // Check if this is a top section
      const rect = section.getBoundingClientRect()
      sectionInfo.isTopSection = rect.top < window.innerHeight * 0.8

      sections.push(sectionInfo)
    })

    isInitialized = true
    checkSectionVisibility()
  }

  function resetSections() {
    // Clean up old sections
    sections.forEach(sectionInfo => {
      if (sectionInfo.trigger && sectionInfo.trigger.parentNode) {
        sectionInfo.trigger.parentNode.removeChild(sectionInfo.trigger)
      }
    })
    
    // Reset state
    sections = []
    isInitialized = false
    
    // Re-initialize as soon as the page fade-in completes or fall back quickly
    const reinit = () => {
      addTriggersToSections()
      setTimeout(checkSectionVisibility, 0)
    }
    const onPageIn = () => { document.removeEventListener('page-transition-in-complete', onPageIn); reinit() }
    document.addEventListener('page-transition-in-complete', onPageIn, { once: true })
    setTimeout(() => { reinit() }, 150)
  }

  function showSectionTrigger(sectionInfo) {
    if (sectionInfo.isVisible) return
    
    sectionInfo.isVisible = true
    sectionInfo.trigger.style.opacity = '1'
    
    // Emit event for section visibility
    const event = new CustomEvent('section-visible', {
      detail: {
        section: sectionInfo.element,
        sectionId: sectionInfo.element.id || `section-${sectionInfo.index}`,
        index: sectionInfo.index
      }
    })
    document.dispatchEvent(event)
  }

  function checkSectionVisibility() {
    sections.forEach(sectionInfo => {
      const rect = sectionInfo.element.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0

      if (isVisible && !sectionInfo.isVisible) {
        showSectionTrigger(sectionInfo)
      }
    })
  }

  function onPreloaderComplete() {
    // Show triggers for top sections immediately
    sections.forEach(sectionInfo => {
      if (sectionInfo.isTopSection && !sectionInfo.isVisible) {
        showSectionTrigger(sectionInfo)
      }
    })
  }

  function init() {
    const waitForReady = () => {
      const main = document.querySelector('main')
      
      if (main) {
        addTriggersToSections()
        
        // Listen for preloader completion event
        document.addEventListener('preloader-complete', onPreloaderComplete)
        
        // Check visibility on scroll
        window.addEventListener('scroll', checkSectionVisibility)
        window.addEventListener('resize', checkSectionVisibility)
        
        // Initial check
        setTimeout(checkSectionVisibility, 100)
      } else {
        setTimeout(waitForReady, 200)
      }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForReady)
    } else {
      setTimeout(waitForReady, 100)
    }
  }

  // Initialize
  init()

  // Listen for route changes to re-initialize sections
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      resetSections()
    })
    
    // Also listen for pushState changes (programmatic navigation)
    const originalPushState = history.pushState
    history.pushState = function(...args) {
      originalPushState.apply(this, args)
      resetSections()
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    sections.forEach(sectionInfo => {
      if (sectionInfo.trigger && sectionInfo.trigger.parentNode) {
        sectionInfo.trigger.parentNode.removeChild(sectionInfo.trigger)
      }
    })
  })

  // Expose functions globally for debugging
  window.sectionTriggers = {
    addTriggersToSections,
    checkSectionVisibility,
    resetSections,
    sections: () => sections
  }
})
