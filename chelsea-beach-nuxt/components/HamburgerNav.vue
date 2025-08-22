<template>
  <nav data-navigation-status="not-active" class="navigation">
    <div data-navigation-toggle="close" class="navigation__dark-bg"></div>
    <div class="hamburger-nav">
      <div class="hamburger-nav__bg"></div>
      <div class="hamburger-nav__group">
        <p class="hamburger-nav__menu-p">Menu</p>
        <ul class="hamburger-nav__ul">
          <div v-for="(item, idx) in normalizedMenuItems" :key="idx" class="hamburger-nav__li">
            <NuxtLink :to="item.to" class="hamburger-nav__a" @click="closeMenu">
              <p class="hamburger-nav__p">{{ item.text }}</p>
              <div class="hamburger-nav__dot"></div>
            </NuxtLink>
          </div>
        </ul>
      </div>
      <div data-navigation-toggle="toggle" class="hamburger-nav__toggle">
        <div class="hamburger-nav__toggle-bar"></div>
        <div class="hamburger-nav__toggle-bar"></div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useMenu } from '~/composables/useMenu'

const { mainMenu } = useMenu()

// Function to close the menu when a link is clicked
const closeMenu = () => {
  const navStatusEl = document.querySelector('[data-navigation-status]')
  if (navStatusEl) {
    navStatusEl.setAttribute('data-navigation-status', 'not-active')
  }
}

const normalizedMenuItems = computed(() => {
  const items = mainMenu?.value?.items || []
  return items.map((it) => {
    const text = it?.text || it?.title || 'Untitled'
    const slug = it?.to?.page?.slug?.current
    const url = it?.to?.url
    const to = slug ? `/${slug}` : (url || '#')
    return { text, to }
  })
})
</script>

<style scoped>
/* No styles here; uses global hamburger-nav.css */
</style>


