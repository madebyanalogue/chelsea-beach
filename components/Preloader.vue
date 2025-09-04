<template>
  <div 
    v-if="showPreloader" 
    class="preloader-container"
    data-loading-container
  >
    <div class="preloader-content">
      <!-- Image sequence container -->
      <div 
        class="image-sequence"
        data-loading-words
      >
        <div class="image-container">
          <img 
            v-if="currentImageSource && currentImageIndex < preloaderImages.length"
            :src="getImageUrl(currentImageSource)"
            :alt="(preloaderImages[currentImageIndex]?.alt) || 'Preloader image'"
            class="preloader-image"
          />
        </div>
      </div>

      <div class="website-icon-container">
        <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159.07 43">
          <g>
            <path d="M0,29.51c0-6.11,4.09-11.4,9.87-13C9.92,7.45,17.3.09,26.38.09c6.14,0,11.8,3.49,14.62,8.85,1.44-.92,3.11-1.41,4.85-1.41,4.96,0,9,4.01,9.06,8.96,5.83,1.57,9.95,6.86,9.95,13.02,0,7.44-6.05,13.49-13.49,13.49H13.49c-7.44,0-13.49-6.05-13.49-13.49M41.45,12.14l-1.52,1.5-.77-1.99c-2.03-5.24-7.17-8.76-12.78-8.76-7.56,0-13.71,6.15-13.71,13.7,0,.3.01.62.03.93l.08,1.25-1.23.22c-5.08.93-8.76,5.35-8.76,10.52,0,5.89,4.79,10.69,10.69,10.69h37.88c5.9,0,10.69-4.79,10.69-10.69,0-5.22-3.73-9.65-8.86-10.53l-1.33-.23.18-1.33c.04-.28.05-.56.05-.82,0-3.45-2.81-6.26-6.26-6.26-1.66,0-3.22.64-4.4,1.81"/>
          </g>
          <g>
            <path d="M90.23,0c-11.85,0-21.48,9.65-21.48,21.49s9.63,21.48,21.48,21.48h0c11.84-.01,21.48-9.65,21.48-21.49S102.08,0,90.23,0ZM90.23,40.17c-10.3,0-18.68-8.39-18.68-18.69S79.93,2.8,90.23,2.8s18.69,8.37,18.69,18.68-8.39,18.69-18.69,18.69Z"/>
            <path d="M93.73,21.14c1.48-.56,2.59-1.96,2.59-3.68,0-2.9-2.38-4.62-5.99-4.62h-5.96v17.21h6.53c3.87,0,6.32-1.79,6.32-4.88,0-1.98-1.51-3.75-3.49-4.03ZM88.14,16.02h1.84c1.68,0,2.64.45,2.64,1.89s-.9,2.1-2.64,2.1h-1.84v-3.99ZM90.9,26.87h-2.76v-3.68h2.76c1.56,0,2.43.57,2.43,1.77s-.66,1.91-2.43,1.91Z"/>
          </g>
          <g>
            <path d="M116.07,0v43h43V0h-43ZM156.18,40.09h-37.22V2.87h37.22v37.22Z"/>
            <path d="M134.78,25.71h5.24l1.32,4.34h4.15l-6.25-17.21h-3.63l-6.16,17.21h3.99l1.34-4.34ZM137.06,18.33h.01c.19-.63.35-1.39.35-1.39,0,0,.19.78.38,1.39l1.27,4.2h-3.3l1.29-4.2Z"/>
          </g>
        </svg>
      </div>
      
      <!-- Website title container -->
      <div 
        class="title-sequence"
        data-loading-words
      >
        <div class="title-container">
          <h1 class="website-title">{{ websiteTitle }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { useSanityImage } from '~/composables/useSanityImage'

const props = defineProps({
  autoHide: {
    type: Boolean,
    default: true
  },
  imageDuration: {
    type: Number,
    default: 0 // milliseconds per image (instant transitions)
  },
  titleDuration: {
    type: Number,
    default: 0 // milliseconds for title display (instant)
  }
})

const emit = defineEmits(['preloader-complete', 'preloader-ready'])

const { getImageUrl } = useSanityImage()
const { settings: siteSettings } = useSiteSettings()

// Preloader state - always show initially
const showPreloader = ref(true)
const currentImageIndex = ref(0)
const animationInitialized = ref(false)

// Computed properties
const preloaderImages = computed(() => siteSettings.value?.preloaderImages || [])
const websiteTitle = computed(() => siteSettings.value?.title || 'Chelsea Beach')
// Support two data shapes: [{ image, alt }] or directly [image]
const currentImageSource = computed(() => {
  const item = preloaderImages.value?.[currentImageIndex.value]
  if (!item) return null
  // API returns objects with normalized image field
  if (item?.image) return item.image
  // If array of images was returned
  return item
})

// Animation timeline
let animationTimeline = null

// Initialize preloader animation
const initPreloaderAnimation = () => {
  if (typeof window === 'undefined' || animationInitialized.value) return
  // gsap is provided by plugin
  // @ts-ignore
  const gsap = window.gsap

  // Prevent page scrolling during intro
  const htmlEl = document.documentElement
  const bodyEl = document.body
  if (htmlEl && bodyEl) {
    htmlEl.style.overflow = 'hidden'
    bodyEl.style.overflow = 'hidden'
  }
  
  // Create timeline
  animationTimeline = gsap.timeline({
    onComplete: () => {
      if (props.autoHide) {
        hidePreloader()
      }
      emit('preloader-complete')
    }
  })
  
  if (preloaderImages.value.length > 0) {
    // Ensure container starts visible (no fades between images)
    animationTimeline.set('.image-sequence', { opacity: 1 })

    // Instantly switch images on each interval with no fade
    preloaderImages.value.forEach((_, index) => {
      const start = index * (props.imageDuration / 1000)
      animationTimeline.call(() => { currentImageIndex.value = index }, null, start)
    })
  }
  
  // Calculate timing for SVG stages
  const imageSequenceEnd = preloaderImages.value.length * (props.imageDuration / 1000)
  const svgStage1 = imageSequenceEnd + 0.2
  const svgStage2 = svgStage1 + 0.3
  const svgStage3 = svgStage2 + 0.3
  
  // Hide image sequence and show SVG container
  animationTimeline.set('.image-sequence', { opacity: 0 }, imageSequenceEnd)
  animationTimeline.set('.website-icon-container', { opacity: 1, visibility: 'visible' }, imageSequenceEnd)
  
  // SVG reveal stages
  // Stage 1: Show first group (transparent to visible)
  animationTimeline.set('.website-icon-container g:nth-child(1)', { opacity: 0 }, imageSequenceEnd)
  animationTimeline.to('.website-icon-container g:nth-child(1)', { opacity: 1, duration: 0, ease: 'power2.out' }, svgStage1)
  
  // Stage 2: Show second group
  animationTimeline.set('.website-icon-container g:nth-child(2)', { opacity: 0 }, imageSequenceEnd)
  animationTimeline.to('.website-icon-container g:nth-child(2)', { opacity: 1, duration: 0, ease: 'power2.out' }, svgStage2)
  
  // Stage 3: Show third group
  animationTimeline.set('.website-icon-container g:nth-child(3)', { opacity: 0 }, imageSequenceEnd)
  animationTimeline.to('.website-icon-container g:nth-child(3)', { opacity: 1, duration: 0, ease: 'power2.out' }, svgStage3)
  
  // Fade out SVG and entire preloader after SVG reveal
  const svgHoldTime = svgStage3 + 0 // SVG holds for 0 seconds after animation completes
  const preloaderEndTime = svgHoldTime + 0 // Then SVG fades out
  // Hide SVG container
  animationTimeline.set('.website-icon-container', { opacity: 0 }, preloaderEndTime)
  // Then fade out entire preloader
  animationTimeline.to('.preloader-container', {
    autoAlpha: 0,
    duration: 0,
    ease: "Power1.easeInOut",
    onComplete: () => {
      // Emit preloader complete event for section triggers
      document.dispatchEvent(new CustomEvent('preloader-complete'))
      // Add class to body so plugins can detect completion
      document.body.classList.add('preloader-complete')
    }
  }, preloaderEndTime + 0) // Instant completion
}

// Hide preloader manually
const hidePreloader = () => {
  showPreloader.value = false
  // Re-enable scrolling
  const htmlEl = document.documentElement
  const bodyEl = document.body
  if (htmlEl && bodyEl) {
    htmlEl.style.overflow = ''
    bodyEl.style.overflow = ''
  }
}

// Watch for site settings to be loaded
watch(siteSettings, (newSettings) => {
  if (newSettings && !animationInitialized.value) {
    // Preloader is ready
    // eslint-disable-next-line no-console
    console.log('[Preloader] Ready - starting animation')
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Emit ready event before starting animation
      emit('preloader-ready')
      initPreloaderAnimation()
      animationInitialized.value = true
    }, 100)
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  if (animationTimeline) {
    animationTimeline.kill()
    animationTimeline = null
  }
  animationInitialized.value = false
})
</script>

<style scoped>
.preloader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  background: rgba(255, 255, 255, 1); /* Temporary 0.5 opacity for debugging */
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader-content {
  text-align: center;
}

.image-sequence,
.title-sequence {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-sequence {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.image-container {
  width: 10vw;
  height: 10vw;
  min-width: 120px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.website-icon-container {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
}

.website-icon-container svg {
  width: auto;
  height: 10vw;
  min-height: 120px;
}

.preloader-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.website-title {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 400;
  color: var(--color-text, #000000);
  margin: 0;
  text-align: center;
}

/* Hide preloader in design mode */
:is(.wf-design-mode, .w-editor) .preloader-container {
  display: none;
}

/* Ensure preloader covers everything */
.preloader-container {
  background: rgba(255, 255, 255, 1) !important; /* Force 0.5 opacity for debugging */
}

/* Dark mode support */
:root.dark-mode .preloader-container {
  background: rgba(0, 0, 0, 1) !important; /* Force 0.5 opacity for debugging */
}
</style>
