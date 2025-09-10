import { defineNuxtPlugin } from '#app'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

function initBasicGSAPSlider(root) {
  if (!root || root._sliderInitialized) return
  root._sliderInitialized = true

  if (root._sliderDraggable) {
    try { root._sliderDraggable.kill() } catch (e) {}
  }

  const collection = root.querySelector('[data-gsap-slider-collection]')
  const track      = root.querySelector('[data-gsap-slider-list]')
  const items      = Array.from(root.querySelectorAll('[data-gsap-slider-item]'))
  const controls   = Array.from(root.querySelectorAll('[data-gsap-slider-control]'))

  if (!track || items.length === 0) {
    root.setAttribute('data-gsap-slider-status', 'not-active')
    return
  }

  // Accessibility attributes
  root.setAttribute('role','region')
  root.setAttribute('aria-roledescription','carousel')
  root.setAttribute('aria-label','Slider')
  if (collection) {
    collection.setAttribute('role','group')
    collection.setAttribute('aria-roledescription','Slides List')
    collection.setAttribute('aria-label','Slides')
  }
  items.forEach((slide,i) => {
    slide.setAttribute('role','group')
    slide.setAttribute('aria-roledescription','Slide')
    slide.setAttribute('aria-label',`Slide ${i+1} of ${items.length}`)
    slide.setAttribute('aria-hidden','true')
    slide.setAttribute('aria-selected','false')
    slide.setAttribute('tabindex','-1')
  })
  controls.forEach(btn => {
    const dir = btn.getAttribute('data-gsap-slider-control')
    btn.setAttribute('role','button')
    btn.setAttribute('aria-label', dir==='prev' ? 'Previous Slide' : 'Next Slide')
    btn.disabled = true
    btn.setAttribute('aria-disabled','true')
  })

  // Compute whether slider is enabled
  const styles      = getComputedStyle(root)
  const statusVar   = styles.getPropertyValue('--slider-status').trim()
  let   spvVar      = parseFloat(styles.getPropertyValue('--slider-spv'))
  const firstItem   = items[0]
  const rect        = firstItem.getBoundingClientRect()
  const marginRight = parseFloat((getComputedStyle(firstItem).marginRight) || '0')
  const slideW      = rect.width + Math.max(marginRight, 0.01)
  if (isNaN(spvVar)) {
    spvVar = collection?.clientWidth ? (collection.clientWidth / slideW) : 1
  }
  const status        = statusVar || 'on'
  const spv           = Math.max(1, Math.min(spvVar, items.length))
  const sliderEnabled = status==='on' && spv < items.length
  root.setAttribute('data-gsap-slider-status', sliderEnabled ? 'active' : 'not-active')
  if (!sliderEnabled) return

  // Hover state
  track.onmouseenter = () => track.setAttribute('data-gsap-slider-list-status','grab')
  track.onmouseleave = () => track.removeAttribute('data-gsap-slider-list-status')
  track.style.touchAction = 'pan-x'

  // Bounds and snap points
  const vw        = (collection || root).clientWidth
  const tw        = track.scrollWidth
  const maxScroll = Math.max(tw - vw, 0)
  const minX      = -maxScroll
  const maxX      = 0
  const maxIndex  = slideW > 0 ? (maxScroll / slideW) : 0
  const full      = Math.floor(maxIndex)
  const snapPoints = []
  for (let i = 0; i <= full; i++) snapPoints.push(-i * slideW)
  if (full < maxIndex) snapPoints.push(-maxIndex * slideW)

  let activeIndex    = 0
  const setX         = gsap.quickSetter(track,'x','px')
  let collectionRect = (collection || root).getBoundingClientRect()

  function updateStatus(x) {
    if (x > maxX || x < minX) return
    const calcX = x > maxX ? maxX : (x < minX ? minX : x)
    let closest = snapPoints[0]
    snapPoints.forEach(pt => { if (Math.abs(pt - calcX) < Math.abs(closest - calcX)) closest = pt })
    activeIndex = snapPoints.indexOf(closest)

    items.forEach((slide,i) => {
      const r           = slide.getBoundingClientRect()
      const leftEdge    = r.left - collectionRect.left
      const slideCenter = leftEdge + r.width/2
      const inView      = slideCenter > 0 && slideCenter < collectionRect.width
      const status      = i === activeIndex ? 'active' : inView ? 'inview' : 'not-active'
      slide.setAttribute('data-gsap-slider-item-status', status)
      slide.setAttribute('aria-selected',    i === activeIndex ? 'true' : 'false')
      slide.setAttribute('aria-hidden',      inView ? 'false' : 'true')
      slide.setAttribute('tabindex',         i === activeIndex ? '0'    : '-1')
    })

    controls.forEach(btn => {
      const dir = btn.getAttribute('data-gsap-slider-control')
      const can = dir === 'prev' ? activeIndex > 0 : activeIndex < snapPoints.length - 1
      btn.disabled = !can
      btn.setAttribute('aria-disabled', can ? 'false' : 'true')
      btn.setAttribute('data-gsap-slider-control-status', can ? 'active' : 'not-active')
    })
  }

  controls.forEach(btn => {
    const dir = btn.getAttribute('data-gsap-slider-control')
    btn.addEventListener('click', () => {
      if (btn.disabled) return
      const delta = dir === 'next' ? 1 : -1
      const target = activeIndex + delta
      gsap.to(track, { duration: 0.4, x: snapPoints[target], onUpdate: () => updateStatus(gsap.getProperty(track,'x')) })
    })
  })

  // Draggable
  root._sliderDraggable = Draggable.create(track, {
    type: 'x',
    inertia: true,
    bounds: {minX, maxX},
    throwResistance: 2000,
    dragResistance: 0.05,
    maxDuration: 0.6,
    minDuration: 0.2,
    edgeResistance: 0.75,
    snap: {x: snapPoints, duration: 0.4},
    onPress() {
      track.setAttribute('data-gsap-slider-list-status','grabbing')
      collectionRect = (collection || root).getBoundingClientRect()
    },
    onDrag() {
      setX(this.x)
      updateStatus(this.x)
    },
    onThrowUpdate() {
      setX(this.x)
      updateStatus(this.x)
    },
    onThrowComplete() {
      setX(this.endX)
      updateStatus(this.endX)
      track.setAttribute('data-gsap-slider-list-status','grab')
    },
    onRelease() {
      setX(this.x)
      updateStatus(this.x)
      track.setAttribute('data-gsap-slider-list-status','grab')
    }
  })[0]

  // Initial state
  setX(0)
  updateStatus(0)
}

function initAllSliders() {
  if (typeof window === 'undefined') return
  if (!gsap.core?.globals?.().Draggable) {
    try { gsap.registerPlugin(Draggable, InertiaPlugin) } catch (e) {}
  }
  const roots = document.querySelectorAll('[data-gsap-slider-init]')
  roots.forEach(root => initBasicGSAPSlider(root))
}

export default defineNuxtPlugin(() => {
  if (process.server) return

  // Expose globally for manual calls
  window.initGsapSliders = initAllSliders

  const run = () => {
    // Delay to allow content hydration/transition
    requestAnimationFrame(() => initAllSliders())
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }

  // Re-init after route transitions (app.vue dispatches 'route-changed')
  document.addEventListener('route-changed', () => run())
  document.addEventListener('page-transition-in-complete', () => run())
})


