import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  // Import core GSAP and free plugins
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  const { SplitText } = await import('gsap/SplitText')

  // Register free plugins
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // Load club plugins from local files (since they require GSAP Club access)
  const loadClubPlugin = (name, globalName) => {
    return new Promise((resolve) => {
      if (window[globalName]) {
        resolve(window[globalName])
        return
      }

      const script = document.createElement('script')
      script.src = `/lib/${name}.min.js`
      script.onload = () => {
        if (window[globalName]) {
          gsap.registerPlugin(window[globalName])
          resolve(window[globalName])
        }
      }
      script.onerror = () => {
        console.warn(`🔴 [GSAP Plugin] Failed to load ${name}`)
        resolve(null)
      }
      document.head.appendChild(script)
    })
  }

  // Load club plugins
  await Promise.all([
    loadClubPlugin('InertiaPlugin', 'InertiaPlugin')
  ])

  // Make GSAP globally available for other plugins
  window.gsap = gsap



  return {
    provide: {
      gsap
    }
  }
})
