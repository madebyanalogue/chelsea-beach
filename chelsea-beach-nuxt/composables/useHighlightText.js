import { onMounted, onUnmounted } from 'vue'

export function useHighlightText() {
  let contexts = []

  function initHighlightText() {
    // Always wait for preloader to complete before initializing
    if (!document.body.classList.contains('preloader-ready')) {
      // Listen for preloader completion
      document.addEventListener('preloader-complete', () => {
        initHighlightText()
      })
      return
    }

    // Check if SplitText is available
    if (!gsap.SplitText) {
      console.warn('SplitText plugin not available. Using fallback animation.')
      initFallbackAnimation()
      return
    }

    // Clear any existing contexts
    contexts.forEach(ctx => ctx.revert())
    contexts = []

    let splitHeadingTargets = document.querySelectorAll("[data-highlight-text]")
    
    splitHeadingTargets.forEach((heading) => {
      const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%"
      const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%"
      const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2
      const staggerValue = heading.getAttribute("data-highlight-stagger") || 0.1
      
      // Create SplitText instance
      const splitText = new gsap.SplitText(heading, {
        type: "words, chars",
        autoSplit: true,
        onSplit(self) {
          let ctx = gsap.context(() => {
            let tl = gsap.timeline({
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
    })
  }

  function initFallbackAnimation() {
    let targets = document.querySelectorAll("[data-highlight-text]")
    
    targets.forEach((target) => {
      const scrollStart = target.getAttribute("data-highlight-scroll-start") || "top 90%"
      const scrollEnd = target.getAttribute("data-highlight-scroll-end") || "center 40%"
      const fadedValue = target.getAttribute("data-highlight-fade") || 0.2
      
      let ctx = gsap.context(() => {
        let tl = gsap.timeline({
          scrollTrigger: {
            scrub: true,
            trigger: target, 
            start: scrollStart,
            end: scrollEnd,
          }
        })
        
        tl.from(target, {
          autoAlpha: fadedValue,
          y: 30,
          ease: "power2.out"
        })
      })
      
      contexts.push(ctx)
    })
  }

  function cleanup() {
    contexts.forEach(ctx => ctx.revert())
    contexts = []
  }

  onMounted(() => {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
      initHighlightText()
    }, 100)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    initHighlightText,
    cleanup
  }
}
