import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.server) return

  //console.log('🔴 [PreloaderGated] Plugin starting...')

  // Global utility function for preloader-gated animations
  window.handlePreloaderGatedAnimation = (animationFunction, options = {}) => {
    const {
      element = null,
      waitForScroll = true,
      immediateIfInView = false
    } = options

    //console.log('🔴 [PreloaderGated] Animation requested, checking preloader status...')

    // Function to check if element is in view
    const isElementInView = (el) => {
      if (!el) return false
      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight
      return rect.top < windowHeight * 0.8 && rect.bottom > 0
    }

    // Function to execute animation based on options
    const executeAnimation = () => {
      if (immediateIfInView && element && isElementInView(element)) {
        //console.log('🔴 [PreloaderGated] Element is in view, executing animation immediately')
        animationFunction()
      } else if (waitForScroll) {
        //console.log('🔴 [PreloaderGated] Waiting for scroll trigger...')
        // Wait for scroll trigger using the section-triggers system
        if (window.gsap && window.gsap.ScrollTrigger) {
          // Check if element is already in view when page loads
          if (element && isElementInView(element)) {
            //console.log('🔴 [PreloaderGated] Element already in view, executing animation immediately')
            animationFunction()
          } else {
            // Create scroll trigger for when element comes into view
            const trigger = window.gsap.ScrollTrigger.create({
              trigger: element || document.body,
              start: 'top 80%',
              onEnter: () => {
                //console.log('🔴 [PreloaderGated] Scroll trigger activated, executing animation')
                animationFunction()
                trigger.kill() // Remove trigger after use
              }
            })
          }
        } else {
          //console.warn('🔴 [PreloaderGated] ScrollTrigger not available, executing animation immediately')
          animationFunction()
        }
      } else {
        //console.log('🔴 [PreloaderGated] Executing animation immediately')
        animationFunction()
      }
    }

    // Check if preloader is already complete
    if (!document.body.classList.contains('preloader-complete')) {
      //console.log('🔴 [PreloaderGated] Preloader not complete yet, waiting for it to finish...')
      document.addEventListener('preloader-complete', () => {
        //console.log('🔴 [PreloaderGated] Preloader animation finished, checking animation options...')
        executeAnimation()
      }, { once: true })
    } else {
      //console.log('🔴 [PreloaderGated] Preloader already complete, checking animation options...')
      executeAnimation()
    }
  }

  //console.log('🔴 [PreloaderGated] Global animation function added:')
  //console.log('🔴 [PreloaderGated] - window.handlePreloaderGatedAnimation(animationFunction, options)')
})
