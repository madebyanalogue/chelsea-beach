import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  // Import core GSAP and free plugins
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  const { SplitText } = await import('gsap/SplitText')

  // Register free plugins
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // Load club plugins from npm (since CDN failed)
  try {
    const { Draggable } = await import('gsap/Draggable')
    const { InertiaPlugin } = await import('gsap/InertiaPlugin')
    
    gsap.registerPlugin(Draggable, InertiaPlugin)
    
    // Make them globally available
    window.Draggable = Draggable
    window.InertiaPlugin = InertiaPlugin
    
    console.log('✅ [GSAP Plugin] Successfully loaded Draggable and InertiaPlugin from npm')
  } catch (error) {
    console.warn('🔴 [GSAP Plugin] Failed to load club plugins from npm:', error)
  }

  // Make GSAP globally available for other plugins
  window.gsap = gsap

  return {
    provide: {
      gsap
    }
  }
})
