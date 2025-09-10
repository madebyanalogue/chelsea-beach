<template>
  <button 
    role="button" 
    data-navigation-toggle="toggle"
    class="menu-button"
    :class="{ 'menu-active': isActive }"
    @click="$emit('toggle-menu')"
  >
    <div class="hamburger">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </div>
  </button>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-menu'])
</script>

<style scoped>
.menu-button {
  z-index: 10001;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  width: 30px;
  height: 30px;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 1px;
  background: currentColor;
  border-radius: 0px;
  transition: all 0.3s cubic-bezier(0.65, 0.05, 0, 1);
  transform-origin: center;
}

/* Animation states */
.menu-active .hamburger-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.menu-active .hamburger-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
</style>
