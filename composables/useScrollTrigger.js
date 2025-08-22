// GSAP is provided by the client plugin (plugins/gsap.client.ts)

// Store all registered animations
const registeredAnimations = new Map()

// Global state to track if scroll animations are enabled
let scrollAnimationsEnabled = false

export const useScrollTrigger = () => {
  // Enable scroll animations (called after preloader completes)
  const enableScrollAnimations = () => {
    if (typeof window === 'undefined') return
    
    scrollAnimationsEnabled = true
    console.log('[ScrollTrigger] Animations enabled')
    
    // Resume all paused timelines
    registeredAnimations.forEach((animation, sectionId) => {
      if (animation.resumeCallback) {
        animation.resumeCallback()
        // Remove the resume callback after use
        delete animation.resumeCallback
      }
    })
    
    // Refresh all ScrollTriggers to activate them
    if (typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger) {
      window.gsap.ScrollTrigger.refresh()
    }
  }

  // Check if scroll animations are enabled
  const areAnimationsEnabled = () => scrollAnimationsEnabled

  // Register a section's animation
  const registerSection = (sectionId, config) => {
    if (typeof window === 'undefined') return
    
    // Ensure GSAP and ScrollTrigger are available
    if (typeof window.gsap === 'undefined') {
      console.warn('GSAP not loaded yet')
      return null
    }
    
    const gsap = window.gsap
    
    const {
      trigger,
      start = 'top 80%',
      end = 'bottom 20%',
      toggleActions = 'play none none reverse',
      immediateRender = false,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
      delay = 0
    } = config

    // Create the timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions,
        immediateRender,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack
      }
    })

    // If animations aren't enabled yet, pause the timeline
    if (!scrollAnimationsEnabled) {
      tl.pause()
      
      // Store a callback to resume when animations are enabled
      const resumeCallback = () => {
        if (scrollAnimationsEnabled) {
          tl.resume()
        }
      }
      
      // Store the animation with resume callback
      registeredAnimations.set(sectionId, {
        timeline: tl,
        config,
        resumeCallback
      })
    } else {
      // Store the animation normally
      registeredAnimations.set(sectionId, {
        timeline: tl,
        config
      })
    }

    return tl
  }

  // Unregister a section's animation
  const unregisterSection = (sectionId) => {
    if (typeof window === 'undefined') return
    
    const animation = registeredAnimations.get(sectionId)
    if (animation) {
      // Kill the ScrollTrigger
      if (animation.timeline.scrollTrigger) {
        animation.timeline.scrollTrigger.kill()
      }
      // Kill the timeline
      animation.timeline.kill()
      // Remove from registry
      registeredAnimations.delete(sectionId)
    }
  }

  // Get a registered animation
  const getSection = (sectionId) => {
    return registeredAnimations.get(sectionId)
  }

  // Clean up all animations
  const cleanupAll = () => {
    if (typeof window === 'undefined') return
    
    registeredAnimations.forEach((animation, sectionId) => {
      unregisterSection(sectionId)
    })
  }

  // Refresh all ScrollTriggers (useful for dynamic content)
  const refreshAll = () => {
    if (typeof window === 'undefined') return
    
    if (typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger) {
      window.gsap.ScrollTrigger.refresh()
    }
  }

  return {
    registerSection,
    unregisterSection,
    getSection,
    cleanupAll,
    refreshAll,
    enableScrollAnimations,
    areAnimationsEnabled
  }
}
