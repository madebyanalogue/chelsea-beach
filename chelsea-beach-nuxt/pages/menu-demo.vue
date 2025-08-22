<template>
  <div class="container">
    <!-- Push Overlay Menu -->
    <PushOverlayMenu 
      :menu-image="'/sections/menu-bg.jpg'"
      :menu-tags="[
        { text: 'Accountancy', url: '#' },
        { text: 'Tax Services', url: '#' },
        { text: 'Business Advice', url: '#' }
      ]"
    />
    
    <!-- Demo Content -->
    <section class="hero">
      <div class="wrapper">
        <h1>Push Overlay Menu Demo</h1>
        <p>Click the menu button in the top right to see the push overlay menu in action.</p>
      </div>
    </section>
    
    <section class="content">
      <div class="wrapper">
        <h2>Features</h2>
        <ul>
          <li>Smooth push animation that slides content up/down</li>
          <li>Full-screen overlay with background image</li>
          <li>Animated menu items with stagger effects</li>
          <li>Responsive design</li>
          <li>Integrates with your existing menu data from Sanity</li>
        </ul>
      </div>
    </section>
    
    <section class="content">
      <div class="wrapper">
        <h2>How to Use</h2>
        <p>Simply add the PushOverlayMenu component to any page:</p>
        <pre><code>&lt;PushOverlayMenu 
  :menu-image="'/sections/menu-bg.jpg'"
  :menu-tags="[
    { text: 'Tag 1', url: '#' },
    { text: 'Tag 2', url: '#' }
  ]"
/&gt;</code></pre>
      </div>
    </section>
  </div>
</template>

<script setup>
import PushOverlayMenu from '~/components/PushOverlayMenu.vue'

definePageMeta({
  pageTitle: 'Menu Demo'
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: var(--black);
  color: var(--white);
}

section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.wrapper {
  max-width: 800px;
  text-align: center;
}

h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

ul {
  text-align: left;
  font-size: 1.1rem;
}

li {
  margin-bottom: 0.5rem;
}

pre {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 4px;
  text-align: left;
  overflow-x: auto;
}

code {
  font-family: monospace;
  color: var(--white);
}
</style> 