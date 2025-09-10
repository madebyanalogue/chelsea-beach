<template>
  <div class="marquee-section" v-if="effectiveLink">
    <div class="marquee-container">
      <div 
        class="marquee-content" 
        :style="{ '--marquee-speed': marqueeSpeed + 's', '--marquee-direction': reverse ? 'reverse' : 'normal' }"
      >
        <div class="marquee-item" v-for="n in repeatCount" :key="n">
          <a 
            :href="effectiveLink" 
            target="_blank" 
            rel="noopener noreferrer"
            class="booking-link"
          >
            {{ effectiveTitle }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const props = defineProps({
  section: {
    type: Object,
    required: false,
    default: () => ({})
  },
  // Number of times to repeat the marquee text
  repeatCount: {
    type: Number,
    default: 10
  },
  // Speed of the marquee animation in seconds
  marqueeSpeed: {
    type: Number,
    default: 15
  },
  // Reverse the marquee direction
  reverse: {
    type: Boolean,
    default: false
  }
})

const { bookingLink, bookingTitle } = useSiteSettings()

// Prefer overrides from section.marqueeContent when provided
const overrideTitle = computed(() => props.section?.marqueeContent?.linkTitle || '')
const overrideLink = computed(() => props.section?.marqueeContent?.linkUrl || '')

const effectiveTitle = computed(() => overrideTitle.value || bookingTitle.value)
const effectiveLink = computed(() => overrideLink.value || bookingLink.value)
</script>

<style scoped>
.marquee-section {
  background: var(--marquee-background);
  color: var(--marquee-text-color);
  overflow: hidden;
  padding: calc(var(--h6) * .8) 0 calc(var(--h6) * .6);
  text-transform: uppercase;
  font-size: var(--h6);
}

.marquee-container {
  width: 100vw;
  overflow: hidden;
}

.marquee-content {
  display: flex;
  animation: marquee var(--marquee-speed) linear infinite;
  animation-direction: var(--marquee-direction, normal);
  white-space: nowrap;
}

.marquee-item {
  flex-shrink: 0;
  width: calc(var(--unit) * 25);
  padding: 0;
}

.booking-link {
  color: var(--marquee-text-color);
  text-decoration: none;
  transition: color 0.3s ease;
  display: block;
  text-align: center;
}

.booking-link:hover {
  color: var(--marquee-hover-color);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}


/* Responsive adjustments */
@media (max-width: 799px) {
  .marquee-item {
    width: calc(var(--unit) * 30);
  }
  .marquee-item {
    padding: 0 var(--pad-1);
  }
}
</style>
