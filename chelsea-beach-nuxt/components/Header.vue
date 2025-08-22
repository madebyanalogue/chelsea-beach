<template>
  <header ref="headerRef" :class="['header-bar', 'flex', 'flex-row', 'flex-center', 'flex-middle', 'px2', 'py1']">
    <div class="header-left">
      <div class="page-title-container">
        <div class="page-title mono" :data-page-title="pageTitle">{{ pageTitle }}</div>
      </div>
    </div>
    <NuxtLink
      v-if="!pageData?.hideHeaderLogo"
      to="/"
      class="logo-center"
    >
      <div id="logo">{{ websiteTitle }}</div>
    </NuxtLink>
    <div v-else class="logo-center">
      <div class="logo">
        <!-- Empty div to maintain layout when logo is hidden -->
      </div>
    </div>
    
    <div class="header-right flex flex-row flex-center">
      
    </div>
    
    <HamburgerNav />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { gsap } from 'gsap';
import { useRoute } from '#app';
import { useHeaderScroll } from '~/composables/useHeaderScroll';
import { useSiteSettings } from '~/composables/useSiteSettings';
import Logo from '~/components/Logo.vue';
import HamburgerNav from '~/components/HamburgerNav.vue';

const props = defineProps({
  pageData: {
    type: Object,
    required: false,
    default: null
  }
});

// Header animation state
const headerAnimated = ref(false)

const route = useRoute();
const headerRef = ref(null);
const { isHeaderVisible } = useHeaderScroll()
const { settings: siteSettings } = useSiteSettings()

// Website title from Sanity
const websiteTitle = computed(() => siteSettings.value?.title || 'Chelsea Beach')

// Deprecated local menu control (kept for layout logic only)
const menuOpen = ref(false)
const isAnimating = ref(false)

// Simple computed property for page title
const pageTitle = computed(() => {
  // Use the page title from Sanity if available
  if (props.pageData?.title) {
    return props.pageData.title;
  }
  
  // Fallback to route meta (for older pages)
  if (route.meta.pageTitle) {
    return route.meta.pageTitle;
  }
  
  // Default to 'Home' for the root path
  if (route.path === '/') {
    return 'Home';
  }
  
  return '';
});

const updateHeights = () => {
  if (headerRef.value) {
    const headerHeight = headerRef.value.offsetHeight;
    //document.body.style.setProperty('--header-height', `${headerHeight}px`);
  }
};

const initializeMomentumHover = () => {
  if (typeof window !== 'undefined' && window.initializeMomentumHover) {
    console.log('🔴 [Header] Calling momentum hover initialization...')
    window.initializeMomentumHover()
  } else {
    console.log('🔴 [Header] Momentum hover function not available')
  }
}


onMounted(() => {
  // Set initial state - header hidden above viewport
  if (headerRef.value) {
    gsap.set(headerRef.value, { y: '-100%' })
  }
  
  window.addEventListener('resize', updateHeights);
  nextTick(updateHeights);

  // Listen for preloader completion to animate header in
  const onPreloaderComplete = () => {
    if (!headerAnimated.value && headerRef.value) {
      headerAnimated.value = true
      
      // Animate header down with smooth easing (only translateY)
      gsap.to(headerRef.value, { 
        y: '0%', 
        duration: 0.8, 
        delay: 0.1,
        ease: 'power3.out'
      })
    }
  }

  // Always wait for preloader completion event
  document.addEventListener('preloader-complete', onPreloaderComplete)

  // Watch for title changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target.tagName === 'TITLE') {
        // Title changed
      }
    });
  });

  const titleElement = document.querySelector('title');
  if (titleElement) {
    observer.observe(titleElement, { childList: true });
  }

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeights);
    observer.disconnect();
    document.removeEventListener('preloader-complete', onPreloaderComplete);
  });
});

watch(() => route.path, () => {
  nextTick(updateHeights);
});

// Watch for header visibility changes and animate smoothly
watch(isHeaderVisible, (newValue) => {
  if (headerRef.value && headerAnimated.value) {
    if (newValue) {
      // Animate header in
      gsap.to(headerRef.value, {
        y: '0%',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
    } else {
      // Animate header out
      gsap.to(headerRef.value, {
        y: '-100%',
        opacity: 0.8,
        duration: 0.4,
        ease: 'power2.in'
      })
    }
  }
})

// Menu functions
const toggleMenu = () => {
  if (isAnimating.value) return
  
  if (!menuOpen.value) {
    openMenu()
  } else {
    closeMenu()
  }
}

const openMenu = () => {
  isAnimating.value = true
  menuOpen.value = true
  
  // Stop scrolling
  document.body.style.overflow = 'hidden'
  
  // Animate content push
  const pageContainer = document.querySelector('.page-container')
  if (pageContainer) {
    gsap.to(pageContainer, {
      y: '100vh',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const closeMenu = () => {
  isAnimating.value = true
  
  // Animate content back
  const pageContainer = document.querySelector('.page-container')
  if (pageContainer) {
    gsap.to(pageContainer, {
      y: '0vh',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  setTimeout(() => {
    menuOpen.value = false
    isAnimating.value = false
    document.body.style.overflow = ''
  }, 300)
}
</script>

<style scoped>


#logo {
  text-transform: uppercase;
  text-align: center;
  font-size: clamp(17px, 3.5vw, 70px);
  font-weight: 400;
}
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background 0.3s ease, color 0.3s ease;
  background: transparent;
  justify-content: space-between;
  display:grid;
  grid-template-areas:
        "leftTop right"
        "leftBottom right";
  gap: 10px;
  grid-template-rows: auto;
  /* Initial state will be handled entirely by GSAP */
}
@media all and (min-width: 1024px) {
  .header-bar {
    grid-template-areas:
        "left center right";
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    grid-template-rows: auto;
  }
}
.header-bar.dark {
  color: var(--color-text, #fff);
  background: transparent;
}
.header-bar.header-hidden {
  /* This will be handled by GSAP for smooth transitions */
}
.header-left, .header-right {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
}
.logo-center {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: leftTop;
  margin-left: calc(var(--pad-1) * -0.12);
}
@media all and (min-width: 1024px) {
  .logo-center {
    grid-area: center;
    margin-left: calc(var(--pad-1) * -0);
  }
  
}
.logo {
  z-index: 1003;
  position: relative;
}
.header-left {
  justify-content: flex-start;
  grid-area: leftBottom;
}
@media all and (min-width: 1024px) {
  .header-left {
    grid-area: left;
  }
}
.header-right {
  justify-content: flex-end;
  grid-area: right;
  align-self: stretch;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1002;
}

.hamburger span {
  display: block;
  width: 28px;
  height: 2px;
  background: currentColor;
  border-radius: 0px;
  transition: all 0.3s;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span.open:nth-child(2),
.hamburger span:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.hamburger.menu-active span {
  background: white;
}

/* Replacing the previous CSS rule for .header-bar.no-transform-transition */
.header-bar.no-transform-transition {
  transition: none !important;
  transition: background 0.3s, color 0.3s !important;
}

.page-title {
  display: flex;
  align-items: center;
}
.page-title span {
  position: relative;
  width: var(--pad-1);
  height: var(--pad-1);
  margin-right: calc(var(--pad-1) * 0.5);
  display: inline-block;
}
.page-title span:after,
.page-title span:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

.page-title span:after {
  width: 69%;
  height: 55%;
  border-bottom: 1px solid currentColor;
  border-left: 1px solid currentColor;
}
.page-title span:before {
  width: 40%;
  height: 40%;
  transform: rotate(-135deg);
  border-bottom: 1px solid currentColor;
  border-left: 1px solid currentColor;
  right: 30%;
  left: unset;
  top: calc(37% - 1px);
}
@media all and (min-width: 1024px) {
  .page-title span {
    display: none;
  }
}

</style> 