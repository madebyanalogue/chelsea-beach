import { onMounted, onUnmounted, ref } from 'vue'

export function useSectionVisibility() {
  const sections = ref([])
  const preloaderComplete = ref(false)

  function addSectionTrigger(sectionElement) {
    if (!sectionElement) return

    // Create the trigger element
    const trigger = document.createElement('div')
    trigger.className = 'section-trigger'
    trigger.style.cssText = `
      position: absolute;
      top: 50%;
      left: 0;
      width: 0px;
      height: 0px;
      background-color: red;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1000;
      pointer-events: none;
    `

    // Add the trigger to the section
    sectionElement.style.position = 'relative'
    sectionElement.appendChild(trigger)

    // Store section info
    const sectionInfo = {
      element: sectionElement,
      trigger,
      isVisible: false,
      isTopSection: false
    }

    // Check if this is a top section (first few sections)
    const rect = sectionElement.getBoundingClientRect()
    const isTopSection = rect.top < window.innerHeight * 0.8
    sectionInfo.isTopSection = isTopSection

    sections.value.push(sectionInfo)

    // If preloader is complete and this is a top section, show immediately
    if (preloaderComplete.value && isTopSection) {
      showSectionTrigger(sectionInfo)
    }

    return sectionInfo
  }

  function showSectionTrigger(sectionInfo) {
    if (sectionInfo.isVisible) return
    
    sectionInfo.isVisible = true
    sectionInfo.trigger.style.opacity = '1'
    
    // Emit event for section visibility
    const event = new CustomEvent('section-visible', {
      detail: {
        section: sectionInfo.element,
        sectionId: sectionInfo.element.id || 'unknown'
      }
    })
    document.dispatchEvent(event)
  }

  function hideSectionTrigger(sectionInfo) {
    if (!sectionInfo.isVisible) return
    
    sectionInfo.isVisible = false
    sectionInfo.trigger.style.opacity = '0'
  }

  function checkSectionVisibility() {
    sections.value.forEach(sectionInfo => {
      const rect = sectionInfo.element.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0

      if (isVisible && !sectionInfo.isVisible) {
        showSectionTrigger(sectionInfo)
      } else if (!isVisible && sectionInfo.isVisible) {
        hideSectionTrigger(sectionInfo)
      }
    })
  }

  function onPreloaderComplete() {
    preloaderComplete.value = true
    
    // Show triggers for top sections immediately
    sections.value.forEach(sectionInfo => {
      if (sectionInfo.isTopSection && !sectionInfo.isVisible) {
        showSectionTrigger(sectionInfo)
      }
    })
  }

  function cleanup() {
    sections.value.forEach(sectionInfo => {
      if (sectionInfo.trigger && sectionInfo.trigger.parentNode) {
        sectionInfo.trigger.parentNode.removeChild(sectionInfo.trigger)
      }
    })
    sections.value = []
  }

  onMounted(() => {
    // Listen for preloader completion
    document.addEventListener('preloader-complete', onPreloaderComplete)
    
    // Check visibility on scroll
    window.addEventListener('scroll', checkSectionVisibility)
    
    // Initial check
    setTimeout(checkSectionVisibility, 100)
  })

  onUnmounted(() => {
    document.removeEventListener('preloader-complete', onPreloaderComplete)
    window.removeEventListener('scroll', checkSectionVisibility)
    cleanup()
  })

  return {
    addSectionTrigger,
    onPreloaderComplete,
    cleanup
  }
}
