import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.server) return

  // Check if GSAP is available before proceeding
  if (typeof window === 'undefined' || !window.gsap) {
    console.warn('GSAP not available, highlight text plugin disabled')
    return
  }

  console.log('Highlight text plugin loaded and enabled')
  let contexts = []

  function splitTextIntoChars(element) {
    const text = element.textContent
    const chars = text.split('').map(char => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char // Use non-breaking space for spaces
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      return span
    })
    
    element.textContent = ''
    chars.forEach(char => element.appendChild(char))
    
    return chars
  }

  function initHighlightText() {
    // Clear any existing contexts
    contexts.forEach(ctx => ctx.revert())
    contexts = []

    let splitHeadingTargets = document.querySelectorAll("[data-highlight-text]")
    
    splitHeadingTargets.forEach((heading) => {
      const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%"
      const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%"
      const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2
      const staggerValue = parseFloat(heading.getAttribute("data-highlight-scroll-end")) || 0.1
      
      // Check if SplitText plugin is available
      if (window.gsap?.SplitText) {
        // Use the official SplitText plugin
        const splitText = new window.gsap.SplitText(heading, {
          type: "words, chars",
          autoSplit: true,
          onSplit(self) {
            let ctx = window.gsap.context(() => {
              let tl = window.gsap.timeline({
                scrollTrigger: {
                  scrub: true,
                  trigger: heading, 
                  start: scrollStart,
                  end: scrollEnd,
                }
              })
              
              tl.from(self.chars, {
                autoAlpha: fadedValue,
                stagger: staggerValue,
                ease: "linear"
              })
            })
            
            contexts.push(ctx)
            return ctx
          }
        })
      } else {
        // Fallback to custom text splitting
        const chars = splitTextIntoChars(heading)
        
        let ctx = window.gsap.context(() => {
          let tl = window.gsap.timeline({
            scrollTrigger: {
              scrub: true,
              trigger: heading, 
              start: scrollStart,
              end: scrollEnd,
            }
          })
          
          tl.from(chars, {
            opacity: fadedValue,
            y: 20,
            stagger: staggerValue,
            ease: "power2.out"
          })
        })
        
        contexts.push(ctx)
      }
    })
  }

  function cleanup() {
    contexts.forEach(ctx => ctx.revert())
    contexts = []
  }

  // Initialize after a short delay to ensure DOM is ready
  setTimeout(() => {
    initHighlightText()
  }, 500)

  // Re-initialize when content changes (useful for dynamic content)
  const observer = new MutationObserver(() => {
    initHighlightText()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup)

  // Expose functions globally if needed
  window.initHighlightText = initHighlightText
  window.cleanupHighlightText = cleanup
})
