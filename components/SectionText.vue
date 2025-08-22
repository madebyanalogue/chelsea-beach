<template>
  <section>
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
          <SanityBlocks :blocks="content" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import SanityBlocks from '~/components/SanityBlocks.vue'

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
</script>

<style scoped>

@media (max-width: 768px) {
  .text-offset {
    display: none;
  }
  .text-content {
    grid-column: span 12;
  }
}
</style> 