import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.server) return

  console.log('🔴 [MomentumHover] Plugin starting...')

  // Simple function to initialize momentum hover effects
  function initMomentumBasedHover() {
    // If this device can't hover with a fine pointer, stop here
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      console.log('🔴 [MomentumHover] Device does not support fine pointer hover, skipping initialization')
      return
    }
    
    console.log('🔴 [MomentumHover] Initializing advanced momentum hover effects...')
    
    // Check if GSAP and InertiaPlugin are available
    if (!window.gsap) {
      console.log('🔴 [MomentumHover] GSAP not available, waiting...')
      return
    }
    
    // Check if InertiaPlugin is available
    if (!window.InertiaPlugin) {
      console.log('🔴 [MomentumHover] InertiaPlugin not available, waiting...')
      return
    }
    
    console.log('🔴 [MomentumHover] Both GSAP and InertiaPlugin available, proceeding...')
    
    // Configuration (tweak these for feel)
    const xyMultiplier       = 60;  // multiplies pointer velocity for x/y movement
    const rotationMultiplier = 20;  // multiplies normalized torque for rotation speed
    const inertiaResistance  = 300; // higher = stops sooner

    // Pre-build clamp functions for performance
    const clampXY  = window.gsap.utils.clamp(-1080, 1080)
    const clampRot = window.gsap.utils.clamp(-60, 60)

    // Initialize each root container
    const containers = document.querySelectorAll('[data-momentum-hover-init]')
    console.log(`🔴 [MomentumHover] Found ${containers.length} momentum hover containers`)
    
    if (containers.length === 0) {
      console.log('🔴 [MomentumHover] No containers found!')
      return
    }
    
    containers.forEach((root, index) => {
      // Skip if this container was already initialized
      if (root.dataset.momentumHoverInitialized === '1') {
        // console.log('🔴 [MomentumHover] Container already initialized, skipping')
        return
      }
      root.dataset.momentumHoverInitialized = '1'

      console.log(`🔴 [MomentumHover] Setting up momentum hover for container ${index + 1}`)
      
      // Create a visual marker for the hover area (centered and inset) if not present
      let hoverMarker = root.querySelector('.momentum-hover-marker')
      if (!hoverMarker) {
        hoverMarker = document.createElement('div')
        hoverMarker.className = 'momentum-hover-marker'
        hoverMarker.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 60%;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          pointer-events: none;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        `
        // Add the marker to the container
        root.style.position = 'relative'
        root.appendChild(hoverMarker)
      }
      
      // Show/hide marker on hover
      root.addEventListener('mouseenter', () => {
        hoverMarker.style.opacity = '0'
      })
      
      root.addEventListener('mouseleave', () => {
        hoverMarker.style.opacity = '0'
      })
      
      let prevX = 0, prevY = 0
      let velX  = 0, velY  = 0
      let rafId = null
      let isInBox = false

      // Track pointer velocity (throttled to RAF)
      root.addEventListener('mousemove', e => {
        if (rafId) return
        rafId = requestAnimationFrame(() => {
          velX = e.clientX - prevX
          velY = e.clientY - prevY
          prevX = e.clientX
          prevY = e.clientY
          rafId = null
        })
      })

      // Check if mouse is inside the marked box area
      const checkBoxBoundary = (e) => {
        const rect = root.getBoundingClientRect()
        const boxWidth = rect.width * 0.6  // 60% of container width
        const boxHeight = rect.height * 0.6 // 60% of container height
        const boxLeft = rect.left + (rect.width - boxWidth) / 2
        const boxTop = rect.top + (rect.height - boxHeight) / 2
        const boxRight = boxLeft + boxWidth
        const boxBottom = boxTop + boxHeight
        
        const mouseX = e.clientX
        const mouseY = e.clientY
        
        const wasInBox = isInBox
        isInBox = mouseX >= boxLeft && mouseX <= boxRight && mouseY >= boxTop && mouseY <= boxBottom
        
        // Trigger momentum effects only on enter (disable mouse-out/exit effects)
        if (isInBox !== wasInBox && isInBox) {
          console.log('🔴 [MomentumHover] Entered marked box area')
          triggerMomentumEffects('enter', e)
        }
      }

      // Function to trigger momentum effects on all targets
      const triggerMomentumEffects = (direction, e) => {
        const elements = root.querySelectorAll('[data-momentum-hover-element]')
        console.log(`🔴 [MomentumHover] Triggering ${direction} effects for ${elements.length} elements`)
        
        elements.forEach((el, elIndex) => {
          const targets = el.querySelectorAll('[data-momentum-hover-target]')
          console.log(`🔴 [MomentumHover] Found ${targets.length} targets in element ${elIndex + 1}`)
          
          if (targets.length === 0) return

          // Animate all targets for this element
          targets.forEach((target, targetIndex) => {
            console.log(`🔴 [MomentumHover] Animating target ${targetIndex + 1}`)

            // Compute offset from center to pointer
            const { left, top, width, height } = target.getBoundingClientRect()
            const centerX = left + width / 2
            const centerY = top + height / 2
            const offsetX = e.clientX - centerX
            const offsetY = e.clientY - centerY

            // Compute raw torque (px²/frame)
            const rawTorque = offsetX * velY - offsetY * velX

            // Normalize torque so rotation ∝ pointer speed (deg/sec)
            const leverDist    = Math.hypot(offsetX, offsetY) || 1
            const angularForce = rawTorque / leverDist

            // Calculate and clamp velocities
            const velocityX        = clampXY(velX * xyMultiplier)
            const velocityY        = clampXY(velY * xyMultiplier)
            const rotationVelocity = clampRot(angularForce * rotationMultiplier)

            // Adjust velocities based on direction (enter vs exit)
            const directionMultiplier = direction === 'enter' ? 1 : -0.5
            const finalVelocityX = velocityX * directionMultiplier
            const finalVelocityY = velocityY * directionMultiplier
            const finalRotationVelocity = rotationVelocity * directionMultiplier

            console.log(`🔴 [MomentumHover] Target ${targetIndex + 1} ${direction} velocities - X: ${finalVelocityX.toFixed(1)}, Y: ${finalVelocityY.toFixed(1)}, Rotation: ${finalRotationVelocity.toFixed(1)}`)

            // Apply GSAP inertia tween
            window.gsap.to(target, {
              inertia: {
                x:        { velocity: finalVelocityX,        end: 0 },
                y:        { velocity: finalVelocityY,        end: 0 },
                rotation: { velocity: finalRotationVelocity, end: 0 },
                resistance: inertiaResistance
              }
            })
          })
        })
      }

      // Listen for mouse movement to check box boundaries
      root.addEventListener('mousemove', checkBoxBoundary)
    })
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait for preloader to complete before initializing
      if (document.body.classList.contains('preloader-complete')) {
        console.log('🔴 [MomentumHover] DOM ready and preloader complete, initializing...')
        initMomentumBasedHover()
      } else {
        console.log('🔴 [MomentumHover] DOM ready, waiting for preloader...')
        document.addEventListener('preloader-complete', initMomentumBasedHover, { once: true })
      }
    })
  } else {
    // DOM already ready, wait for preloader completion
    if (document.body.classList.contains('preloader-complete')) {
      console.log('🔴 [MomentumHover] DOM already ready and preloader complete, initializing...')
      initMomentumBasedHover()
    } else {
      console.log('🔴 [MomentumHover] DOM already ready, waiting for preloader...')
      document.addEventListener('preloader-complete', initMomentumBasedHover, { once: true })
    }
  }
  
  // Re-initialize when new SVGs are loaded (for page navigation)
  if (typeof window !== 'undefined') {
    window.addEventListener('svg-loaded', () => {
      console.log('🔴 [MomentumHover] SVG loaded event received, initializing any new containers...')
      setTimeout(initMomentumBasedHover, 100) // Small delay for DOM to settle
    })
  }

  // Re-initialize on route changes
  if (typeof window !== 'undefined') {
    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      console.log('🔴 [MomentumHover] Route change detected (popstate), initializing any new containers...')
      setTimeout(() => {
        initMomentumBasedHover()
      }, 200) // Small delay for DOM to update
    })

    // Intercept pushState to detect programmatic navigation
    const originalPushState = history.pushState
    history.pushState = function(...args) {
      originalPushState.apply(this, args)
      console.log('🔴 [MomentumHover] Route change detected (pushState), initializing any new containers...')
      setTimeout(() => {
        initMomentumBasedHover()
      }, 200) // Small delay for DOM to update
    }
  }

  // Global function to manually initialize momentum hover
  if (typeof window !== 'undefined') {
    window.initializeMomentumHover = () => {
      console.log('🔴 [MomentumHover] Manual initialization requested...')
      initMomentumBasedHover()
    }
  }

  console.log('🔴 [MomentumHover] Advanced momentum hover plugin loaded with:')
  console.log('🔴 [MomentumHover] - window.initializeMomentumHover() for manual initialization')
})


