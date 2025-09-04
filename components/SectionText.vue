<template>
  <section class="section-text">
    <div class="wrapper">
      <div class="grid-1 grid-sm-12 grid">
        <!-- Offset div -->
        <div 
          v-if="offset > 0" 
          :class="`col-span-${offset}`"
          class="text-offset"
        ></div>
        
        <!-- Text content -->
        <div 
          :class="`col-span-${columns}`"
          class="h3 rte"
          data-fade-in
        >
          <div v-if="imageUrl || title" class="text-header">
            <img 
              v-if="imageUrl" 
              :src="imageUrl" 
              :alt="imageAlt || 'Decorative image'" 
              class="text-image"
            />
            <h2 v-if="title" class="text-title">{{ title }}</h2>
          </div>
          <SanityBlocks :blocks="content" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import SanityBlocks from '~/components/SanityBlocks.vue'
import { useSanityImage } from '~/composables/useSanityImage'

const props = defineProps({
  section: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && 
             value._type === 'section' && 
             value.sectionType === 'text'
    }
  }
})

// Extract text content
const content = computed(() => {
  return props.section?.textContent?.content || []
})

const columns = computed(() => {
  return props.section?.textContent?.columns || 6
})

const offset = computed(() => {
  return props.section?.textContent?.offset || 0
})

// Optional title and image
const title = computed(() => {
  return props.section?.textContent?.title || ''
})

const { getImageUrl } = useSanityImage()
const imageSource = computed(() => {
  return props.section?.textContent?.image || null
})
const imageUrl = computed(() => {
  return imageSource.value ? getImageUrl(imageSource.value) : null
})
const imageAlt = computed(() => {
  return imageSource.value?.alt || ''
})
</script>

<style scoped>

.text-header {
  margin-bottom: var(--space-3, 1.5rem);
}

.text-image {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: var(--space-2, 1rem);
}

.text-title {
  font-size: var(--h3);
  line-height: 1.2;
  margin: 0 0 var(--space-2, 1rem) 0;
}

@media (max-width: 768px) {
  .text-offset {
    display: none;
  }
  .text-content {
    grid-column: span 12;
  }
}
</style> 