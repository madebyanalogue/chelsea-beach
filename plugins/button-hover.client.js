import { defineNuxtPlugin } from '#app'
import { initButtonHover } from '~/assets/js/button-hover.js'

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return

  let retryCount = 0
  const maxRetries = 10

  // Initialize button hover effects with retry mechanism
  const initButtonHoverWithRetry = () => {
    if (retryCount >= maxRetries) {
      console.log('Max retries reached for button hover')
      return
    }

    // Look for buttons with data-btn-hover attribute
    const buttons = document.querySelectorAll('[data-btn-hover]')
    console.log('Looking for buttons with data-btn-hover, found:', buttons.length)
    
    if (buttons.length > 0) {
      console.log('Found buttons, initializing button hover effects')
      try {
        initButtonHover()
        console.log('Button hover function called successfully')
        retryCount = 0 // Reset retry count on success
      } catch (error) {
        console.error('Error calling initButtonHover:', error)
      }
    } else {
      retryCount++
      console.log(`No buttons found, retry ${retryCount}/${maxRetries} in 500ms...`)
      // Retry after a delay
      setTimeout(initButtonHoverWithRetry, 500)
    }
  }

  // Function to re-initialize button hover effects after route changes
  const reinitializeButtonHover = () => {
    console.log('Route change detected, re-initializing button hover effects...')
    retryCount = 0 // Reset retry count
    setTimeout(initButtonHoverWithRetry, 100) // Small delay for DOM to update
  }

  // Wait for preloader to complete before initializing button hover effects
  // This ensures Footer component (with buttons) is rendered
  if (document.body.classList.contains('preloader-complete')) {
    // Preloader already complete, initialize immediately
    setTimeout(initButtonHoverWithRetry, 100)
  } else {
    // Wait for preloader to complete
    document.addEventListener('preloader-complete', () => {
      setTimeout(initButtonHoverWithRetry, 100)
    }, { once: true })
  }

  // Listen for route changes to re-initialize button hover effects
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', reinitializeButtonHover)
    
    // Also listen for pushState changes (programmatic navigation)
    const originalPushState = history.pushState
    history.pushState = function(...args) {
      originalPushState.apply(this, args)
      reinitializeButtonHover()
    }
    
    // Listen for page transition completion to re-initialize button hover
    // This ensures Footer component (with buttons) is fully rendered
    document.addEventListener('page-transition-in-complete', reinitializeButtonHover)
  }
})
