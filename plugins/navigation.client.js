import { defineNuxtPlugin } from '#app'

function initScalingHamburgerNavigation() {
  //console.log('Initializing hamburger navigation...')
  
  // Toggle Navigation
  const toggleBtns = document.querySelectorAll('[data-navigation-toggle="toggle"]')
  //console.log('Found toggle buttons:', toggleBtns.length)
  
  toggleBtns.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      //console.log('Toggle button clicked!')
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) {
        //console.log('No navigation status element found')
        return
      }
      const currentStatus = navStatusEl.getAttribute('data-navigation-status')
      //console.log('Current status:', currentStatus)
      
      if (currentStatus === 'not-active') {
        navStatusEl.setAttribute('data-navigation-status', 'active');
        //console.log('Set to active')
      } else {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
        //console.log('Set to not-active')
      }
    });
  });

  // Close Navigation
  document.querySelectorAll('[data-navigation-toggle="close"]').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      navStatusEl.setAttribute('data-navigation-status', 'not-active');
      // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
    });
  });

  // Key ESC - Close Navigation
  document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      if (navStatusEl.getAttribute('data-navigation-status') === 'active') {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
       // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
      }
    }
  });
}

// Initialize Scaling Hamburger Navigation
export default defineNuxtPlugin(() => {
  //console.log('Navigation plugin loading...')
  if (process.server) return
  
  let retryCount = 0
  const maxRetries = 50 // 5 seconds total
  
  // Wait for DOM to be fully ready and then retry until navigation is found
  const initNavigationWithRetry = () => {
    if (retryCount >= maxRetries) {
      //console.log('Max retries reached for navigation, giving up')
      return
    }
    
    const toggleBtns = document.querySelectorAll('[data-navigation-toggle="toggle"]')
    if (toggleBtns.length > 0) {
      //console.log('Navigation found, initializing...')
      initScalingHamburgerNavigation()
    } else {
      retryCount++
      //console.log(`Navigation not found yet, retry ${retryCount}/${maxRetries} in 100ms...`)
      setTimeout(initNavigationWithRetry, 100)
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigationWithRetry);
  } else {
    // Small delay to ensure Vue components are mounted
    setTimeout(initNavigationWithRetry, 100)
  }
})
