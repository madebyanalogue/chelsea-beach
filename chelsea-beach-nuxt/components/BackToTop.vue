<template>
    <transition name="fade">
      <div v-if="!isFooterHidden">
        <div class="back-to-top">
          <button @click="scrollToTop">
            <div class="background"></div>
            <div class="arrow"></div>
          </button>
        </div>
      </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  pageData: {
    type: Object,
    required: false,
    default: null
  }
})
const isFooterHidden = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for page changes to update footer visibility
watch(() => props.pageData, (newPage) => {
  isFooterHidden.value = newPage?.hideFooter || false
}, { immediate: true })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.back-to-top {
  display: block;
  z-index: 100;
}
.back-to-top button {
  min-width: 3.5em;
  min-height: 3.5em;
  max-width: 94px;
  max-height: 94px;
  padding:var(--pad-1) !important;
  position:relative;
}
@media (min-width: 1900px) {
  .back-to-top button {
    padding:30px !important;
  }
}
.back-to-top button .background {
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color: currentColor;
  border-radius: 50%;
  transition: opacity 0.6s ease;
  opacity: 0.1;
}
.back-to-top button:hover .background {
  opacity: 0.175;
}
.back-to-top button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: inherit;
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: var(--pad-1);
    right: var(--pad-1);
  }
}
</style> 