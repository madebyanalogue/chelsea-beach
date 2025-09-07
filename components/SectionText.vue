<template>
  <section class="section-text py4">
    <div class="wrapper">
      <div class="grid grid-center-items">
        
        <!-- Text content -->
        <div 
          class="h4 text-center col-span-12 col-span-6-md grid grid-1"
          data-fade-in
        >
          <div v-if="imageUrl || title" class="">
            <img 
              v-if="imageUrl" 
              :src="imageUrl" 
              :alt="imageAlt || 'Decorative image'" 
              class="py05 pbottom"
            />
          </div>
          <div v-if="title" class="heading h2">{{ title }}</div>
          <SanityBlocks :blocks="content" class="px-sm-1 py1 pbottom"/>
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


.text-image {
  display: block;
  width: 100%;
  height: auto;
}

</style> 