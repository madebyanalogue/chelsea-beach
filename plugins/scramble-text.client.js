import { defineNuxtPlugin } from '#app'

// Global variables for managing scramble effects
let currentPageTitle = ''
let isAnimating = false
let hoverAnimation = null
let pageTitleElement = null
let titleUpdateBlocked = false

export default defineNuxtPlugin(() => {
  if (process.server) return

  console.log('🔴 ScrambleText plugin: Starting...')
  console.log('🔴 Document ready state:', document.readyState)
  console.log('🔴 Body classes:', document.body.className)

  // Wait for preloader to be ready
  const waitForPreloader = () => {
    console.log('🔴 waitForPreloader called')
    console.log('🔴 Body classes in waitForPreloader:', document.body.className)
    console.log('🔴 preloader-ready class exists:', document.body.classList.contains('preloader-ready'))
    
    if (document.body.classList.contains('preloader-ready')) {
      console.log('🔴 Preloader ready, waiting for GSAP...')
      waitForGSAP()
    } else {
      console.log('🔴 Waiting for preloader to be ready...')
      document.addEventListener('preloader-ready', () => {
        console.log('🔴 preloader-ready event fired!')
        waitForGSAP()
      }, { once: true })
      
      // Also try a fallback - wait a bit and check again
      setTimeout(() => {
        if (document.body.classList.contains('preloader-ready')) {
          console.log('🔴 Preloader ready after timeout, waiting for GSAP...')
          waitForGSAP()
        } else {
          console.log('🔴 Preloader still not ready after timeout, proceeding anyway...')
          waitForGSAP()
        }
      }, 2000)
    }
  }

  // Wait for GSAP and plugins to be available
  const waitForGSAP = () => {
    console.log('🔴 waitForGSAP called')
    const hasGsap = !!window.gsap
    const hasPluginOnWindow = !!window.ScrambleTextPlugin
    const hasPluginOnGsap = !!(window.gsap && window.gsap.plugins && window.gsap.plugins.ScrambleTextPlugin)
    console.log('🔴 Checking GSAP availability:', {
      gsap: hasGsap,
      ScrambleTextPlugin_window: hasPluginOnWindow,
      ScrambleTextPlugin_gsap: hasPluginOnGsap
    })

    // If plugin is on window but not registered into GSAP yet, register it
    if (hasGsap && hasPluginOnWindow && !hasPluginOnGsap) {
      try {
        window.gsap.registerPlugin(window.ScrambleTextPlugin)
        console.log('🔴 Registered ScrambleTextPlugin with GSAP')
      } catch (e) {
        console.log('🔴 Failed to register ScrambleTextPlugin with GSAP', e)
      }
    }

    if (hasGsap && (hasPluginOnWindow || (window.gsap && window.gsap.plugins && window.gsap.plugins.ScrambleTextPlugin))) {
      console.log('🔴 GSAP plugins found, waiting for page title...')
      waitForPageTitle()
    } else {
      console.log('🔴 Waiting for GSAP plugins...')
      setTimeout(waitForGSAP, 100)
    }
  }

  // Wait for page title element to exist
  const waitForPageTitle = () => {
    console.log('🔴 waitForPageTitle called')
    const pageTitle = document.querySelector('.page-title')
    if (pageTitle) {
      console.log('🔴 Page title found, initializing...')
      console.log('🔴 Page title element:', pageTitle)
      console.log('🔴 Page title text content:', pageTitle.textContent)
      console.log('🔴 Page title innerHTML:', pageTitle.innerHTML)
      initScrambleText()
    } else {
      console.log('🔴 Page title not found yet, waiting...')
      console.log('🔴 Available elements with "page" in class:', document.querySelectorAll('[class*="page"]'))
      console.log('🔴 All elements with classes:', Array.from(document.querySelectorAll('*')).filter(el => el.className).map(el => ({ tag: el.tagName, class: el.className })).slice(0, 10))
      setTimeout(waitForPageTitle, 100)
    }
  }

  function initScrambleText() {
    console.log('🔴 ScrambleText plugin: Initializing...')
    
    // Capture the page title element and its original textContent descriptor
    pageTitleElement = document.querySelector('.page-title')
    if (pageTitleElement) {
      console.log('🔴 [ScrambleText] Page title element found')
    } else {
      console.log('🔴 [ScrambleText] No page title element found')
      return
    }

    // Function to generate random string with specified length
    function generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    // Function to set up hover effects on page title
    function setupPageTitleHover() {
      if (!pageTitleElement) {
        console.log('🔴 [ScrambleText] No page title element found for hover setup')
        return
      }

      console.log('🔴 [ScrambleText] Setting up hover for page title:', pageTitleElement)
      
      let originalText = pageTitleElement.textContent.trim()
      let isHovering = false
      console.log('🔴 [ScrambleText] Setting up hover for text:', originalText)

      pageTitleElement.addEventListener('mouseenter', () => {
        console.log('🔴 [ScrambleText] Mouse enter on page title')
        
        // Prevent multiple hover animations
        if (isHovering) {
          console.log('🔴 [ScrambleText] Already hovering, ignoring')
          return
        }
        
        isHovering = true
        
        // Cancel any existing hover animation
        if (hoverAnimation) {
          hoverAnimation.kill()
        }
        
        try {
          // Always get the current text content for hover effect
          const currentText = pageTitleElement.textContent.trim()
          console.log('🔴 [ScrambleText] Current text for hover:', currentText)
          
          // Generate random characters with the same length as current text
          const randomChars = generateRandomString(currentText.length)
          console.log('🔴 [ScrambleText] Hover scramble to:', randomChars, 'length:', randomChars.length)
          console.log('🔴 [ScrambleText] Will return to:', currentText)
          
          // Create a single timeline for the entire hover effect - maintain character count
          const tl = window.gsap.timeline({
            onComplete: () => {
              isHovering = false
              console.log('🔴 [ScrambleText] Hover animation complete, reset flag')
            }
          })
          
          // Step 1: Scramble to random characters (same length)
          tl.to(pageTitleElement, {
            duration: 0.3,
            scrambleText: {
              text: randomChars,
              chars: 'upperCase',
              speed: 2.0,
            }
          })
          
          // Step 2: Return to original text (same length)
          .to(pageTitleElement, {
            duration: 0.3,
            scrambleText: {
              text: currentText,
              chars: 'upperCase',
              speed: 2.0,
            }
          })
          
          hoverAnimation = tl
          
        } catch (error) {
          console.error('🔴 [ScrambleText] Error on hover enter:', error)
          isHovering = false
        }
      })
    }

    // Set up route change listener to handle page transitions
    function setupRouteChangeListener() {
      console.log('🔴 [ScrambleText] Setting up route change listener')
      
      // Listen for navigation events
      window.addEventListener('popstate', () => {
        console.log('🔴 [ScrambleText] Popstate event detected')
        setTimeout(handlePageTransition, 0)
      })
      
      // Listen for pushstate events (programmatic navigation)
      const originalPushState = history.pushState
      history.pushState = function(...args) {
        console.log('🔴 [ScrambleText] PushState event detected')
        originalPushState.apply(this, args)
        setTimeout(handlePageTransition, 0)
      }
      
      // Also check periodically for title changes (reduced frequency)
      setInterval(checkForTitleChange, 3000)
    }
    
    // Function to handle page transitions
    function handlePageTransition() {
      console.log('🔴 [ScrambleText] ===== HANDLE PAGE TRANSITION START =====')
      console.log('🔴 [ScrambleText] isAnimating:', isAnimating)
      
      if (isAnimating) {
        console.log('🔴 [ScrambleText] Already animating, skipping...')
        return
      }

      // Re-capture the page title element in case Vue recreated it
      const currentPageTitleElement = document.querySelector('.page-title')
      if (!currentPageTitleElement) {
        console.log('🔴 [ScrambleText] No page title element found during transition')
        return
      }
      
      console.log('🔴 [ScrambleText] pageTitleElement exists:', !!currentPageTitleElement)

      const currentText = currentPageTitleElement.textContent
      console.log('🔴 [ScrambleText] Current text:', currentText)
      console.log('🔴 [ScrambleText] currentPageTitle:', currentPageTitle)
      
      // Start the animation immediately - don't wait for text changes
      // The current text will be what we scramble down from
      console.log('🔴 [ScrambleText] Starting page transition animation...')
      
      // Block title updates during animation
      titleUpdateBlocked = true
      console.log('🔴 [ScrambleText] Title updates blocked')
      
      // Store the current text so we can restore it if needed
      const originalText = currentPageTitleElement.textContent
      
      console.log('🔴 [ScrambleText] Starting scramble down animation...')
      
      // Animate the current text down to empty
      animateTitleTransition(currentText, null, () => {
        console.log('🔴 [ScrambleText] ===== SCRAMBLE DOWN COMPLETE =====')
        console.log('🔴 [ScrambleText] Unblocking title updates...')
        
        // Unblock title updates
        titleUpdateBlocked = false
        
        // Wait for the new title using a MutationObserver (handles node replacement)
        const finishWithNewTitle = (freshEl, newText) => {
          console.log('🔴 [ScrambleText] New title confirmed:', newText)
          freshEl.textContent = ''
          animateTitleTransition("", newText, () => {
            console.log('🔴 [ScrambleText] ===== PAGE TRANSITION COMPLETE =====')
            currentPageTitle = newText
          }, freshEl)
        }

        const checkNow = () => {
          const freshEl = document.querySelector('.page-title')
          const textContentCandidate = (freshEl?.textContent || '').trim()
          const attrCandidateRaw = freshEl?.getAttribute('data-page-title') || ''
          const attrCandidate = attrCandidateRaw.trim()
          const attrLooksValid = attrCandidate && attrCandidate !== '{{ pageTitle }}'

          // Prefer attribute when it looks valid, otherwise textContent
          const candidate = attrLooksValid ? attrCandidate : textContentCandidate

          if (freshEl && candidate && candidate !== currentText) {
            if (attrLooksValid) {
              console.log('🔴 [ScrambleText] Using data-page-title attribute for new title:', candidate)
            }
            finishWithNewTitle(freshEl, candidate)
            return true
          }
          return false
        }

        if (!checkNow()) {
          console.log('🔴 [ScrambleText] Waiting for new title via MutationObserver...')
          const observer = new MutationObserver(() => {
            if (checkNow()) {
              observer.disconnect()
            }
          })
          observer.observe(document.body, { childList: true, characterData: true, subtree: true })

          // Safety timeout (up to 5s) then fallback
          setTimeout(() => {
            observer.disconnect()
            if (!checkNow()) {
              console.log('🔴 [ScrambleText] New title not detected in time, restoring previous text')
              const fallbackEl = document.querySelector('.page-title')
              if (fallbackEl) fallbackEl.textContent = originalText
            }
          }, 5000)
        }
      }, currentPageTitleElement)
    }
    
    // Function to check for title changes (simplified)
    function checkForTitleChange() {
      if (!pageTitleElement) { // originalTextContentDescriptor is no longer needed
        return // Silent return to avoid console spam
      }

      try {
        const currentText = pageTitleElement.textContent
        if (currentText && currentText !== currentPageTitle) {
          console.log('🔴 [ScrambleText] Title change detected via check:', currentPageTitle, '→', currentText)
          currentPageTitle = currentText
        }
      } catch (error) {
        // Silent error handling to avoid console spam
        console.debug('🔴 [ScrambleText] Error in checkForTitleChange:', error)
      }
    }

    // Function to animate title transition
    function animateTitleTransition(fromText, toText, onComplete, targetElement = null) {
      if (isAnimating) {
        console.log('🔴 [ScrambleText] Already animating, skipping')
        return
      }
      
      // Use the provided target element or fall back to the global one
      const elementToAnimate = targetElement || pageTitleElement
      if (!elementToAnimate) {
        console.error('🔴 [ScrambleText] No page title element found for animation')
        return
      }
      
      isAnimating = true
      console.log('🔴 [ScrambleText] Animating title transition:', fromText, '→', toText || 'unknown')
      
      try {
        // Create timeline for page transition
        const tl = window.gsap.timeline({
          onComplete: () => {
            isAnimating = false
            if (onComplete) onComplete()
            console.log('🔴 [ScrambleText] Title transition animation complete')
          }
        })
        
        if (fromText && fromText !== "") {
          // Step 1: Scramble current title down to 0 characters (only if we have a fromText)
          console.log('🔴 [ScrambleText] Scrambling down from:', fromText)
          tl.to(elementToAnimate, {
            duration: 0.6,
            scrambleText: {
              text: "",
              chars: 'upperCase',
              speed: 1.2,
            }
          })
          // Log explicitly when the scramble-down reaches zero characters
          .call(() => {
            console.log('🔴 [ScrambleText] Scramble down complete (now at 0 characters)')
          })
        }
        
        // Step 2: If we have a new title, change the DOM content and build up
        if (toText) {
          if (fromText && fromText !== "") {
            // Change the actual DOM content to new title (this happens instantly after scramble down)
            tl.call(() => {
              elementToAnimate.textContent = toText
              console.log('🔴 [ScrambleText] DOM content changed to:', toText)
            })
          }
          // For build-up animations, don't change the DOM content - let GSAP handle the transition
          
          // Step 3: Build up new title from current state, scrambling as it builds
          console.log('🔴 [ScrambleText] Building up to:', toText)
          tl.to(elementToAnimate, {
            duration: 0.8,
            scrambleText: {
              text: toText,
              chars: 'upperCase',
              speed: 1.5,
            }
          })
        }
        
      } catch (error) {
        console.error('🔴 [ScrambleText] Error animating title transition:', error)
        isAnimating = false
        if (onComplete) onComplete()
      }
    }
    
    // Make function globally available for testing
    window.animateTitleTransition = animateTitleTransition

    // Initial setup
    function setup() {
      console.log('🔴 [ScrambleText] Setting up scramble text system...')
      
      // Set up hover effects
      setupPageTitleHover()
      
      // Set up route change listener
      setupRouteChangeListener()
      
      // Initial page title animation
      setTimeout(() => {
        if (pageTitleElement) {
          currentPageTitle = pageTitleElement.textContent.trim()
          console.log('🔴 [ScrambleText] Initial page title set:', currentPageTitle)
        } else {
          console.log('🔴 [ScrambleText] No page title element found for initial setup')
        }
      }, 500)
      
      // Clean up function
      return () => {
        if (hoverAnimation) {
          hoverAnimation.kill()
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

  // Add global test function for debugging
  window.testScrambleFromConsole = () => {
    console.log('🔴 Testing scramble from console...')
    if (window.gsap && (window.ScrambleTextPlugin || (window.gsap.plugins && window.gsap.plugins.ScrambleTextPlugin))) {
      console.log('🔴 GSAP and ScrambleTextPlugin available in console test')
      const pageTitle = document.querySelector('.page-title')
      if (pageTitle) {
        console.log('🔴 Page title found in console test:', pageTitle.textContent)
        window.gsap.to(pageTitle, {
          duration: 1.2,
          scrambleText: {
            text: "CONSOLE TEST",
            chars: 'upperCase',
            speed: 0.85,
          }
        })
      } else {
        console.log('🔴 No page title found in console test')
      }
    } else {
      console.log('🔴 GSAP or ScrambleTextPlugin not available in console test')
    }
  }
  
  // Add global test function for page transition
  window.testPageTransition = () => {
    console.log('🔴 Testing page transition from console...')
    if (window.gsap && (window.ScrambleTextPlugin || (window.gsap.plugins && window.gsap.plugins.ScrambleTextPlugin))) {
      const pageTitle = document.querySelector('.page-title')
      if (pageTitle) {
        const currentText = pageTitle.textContent.trim()
        console.log('🔴 Current page title:', currentText)
        
        // Test the transition effect
        if (window.animateTitleTransition) {
          window.animateTitleTransition(currentText, "TEST TRANSITION")
        } else {
          console.log('🔴 animateTitleTransition function not available')
        }
      }
    }
  }
  
  console.log('🔴 Global test functions added:')
  console.log('🔴 - window.testScrambleFromConsole()')
  console.log('🔴 - window.testPageTransition()')
})
