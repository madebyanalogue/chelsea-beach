import { defineNuxtPlugin } from '#app'

// Global variables for managing page title transitions
let currentPageTitle = ''
let isAnimating = false
let pageTitleElement = null

export default defineNuxtPlugin(() => {
  if (process.server) return

  // Wait for preloader to be ready
  const waitForPreloader = () => {
    if (document.body.classList.contains('preloader-ready')) {
      waitForPageTitle()
    } else {
      document.addEventListener('preloader-ready', () => {
        waitForPageTitle()
      }, { once: true })
      
      // Fallback timeout
      setTimeout(() => {
        waitForPageTitle()
      }, 2000)
    }
  }

  // Wait for page title element to exist
  const waitForPageTitle = () => {
    const pageTitle = document.querySelector('.page-title')
    if (pageTitle) {
      initPageTitleTransition()
    } else {
      setTimeout(waitForPageTitle, 100)
    }
  }

  function initPageTitleTransition() {
    // Capture the page title element
    pageTitleElement = document.querySelector('.page-title')
    if (!pageTitleElement) {
      return
    }

    // Store the initial title
    currentPageTitle = pageTitleElement.textContent.trim()

    // Function to handle page title transitions
    function handlePageTitleTransition(newTitle, element, displayTitleRef) {
      if (isAnimating) {
        return
      }

      if (!newTitle || newTitle === currentPageTitle) {
        return
      }

      // Start the animation
      isAnimating = true
      
      // Disable any CSS transitions to prevent cross-fading
      gsap.set(element, { transition: "none" })
      
      // Step 1: Fade out current title (keep old text)
      gsap.to(element, {
        duration: 1,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => {
          // Step 2: Update the reactive displayTitle (only when opacity is 0)
          if (displayTitleRef) {
            displayTitleRef.value = newTitle
          }
          currentPageTitle = newTitle
          
          // Step 3: Fade in new title
          gsap.to(element, {
            duration: 1.5,
            opacity: 1,
            ease: "power2.out",
            onComplete: () => {
              // Step 4: Add delay after fade in completes
              gsap.delayedCall(0.3, () => {
                isAnimating = false
              })
            }
          })
        }
      })
    }

    // Make the function globally available for the Header component
    window.handlePageTitleTransition = handlePageTitleTransition

    // Initial setup
    function setup() {
      // Clean up function
      return () => {
        // Cleanup if needed
        if (window.handlePageTitleTransition) {
          delete window.handlePageTitleTransition
        }
      }
    }

    // Start the system
    const cleanup = setup()
    
    // Clean up on page unload
    window.addEventListener('beforeunload', cleanup)
  }

  // Start waiting for preloader
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForPreloader)
  } else {
    waitForPreloader()
  }
})
