<template>
  <section class="news-section">
    <div class="wrapper">
      <div class="grid grid-1 gap-2 py2">

        <!-- Top Text Section -->
        <div v-if="topText" class="grid grid-1 grid-md-2">
          <h2 class="h1">
            <div v-html="topText"></div>
          </h2>
        </div>

        
        <div class="grid grid-1 grid-md-2 gap-4 gap-2-md py1 pbottom">
          <div v-for="post in posts" :key="post._id" class="" :data-summary="post.summary">
            <div class="grid grid-1">
              <NuxtImg 
                v-if="post.featuredImage"
                :src="getImageUrl(post.featuredImage)" 
                :alt="post.title"
                class="square"
                data-image-overlay
              />
              <div class="grid grid-1 gap-1">
                <div class="h2">{{ post.title }}</div>
                <SanityBlocks v-if="post.content" :blocks="post.content" />
                <div v-if="post.pdf?.asset?.url" >
                  <a 
                      v-if="post.pdf?.asset?.url" 
                      :href="post.pdf.asset.url" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="btn" 
                      data-btn-hover
                    >
                      <span class="btn__text">Download PDF</span>
                      <div class="btn__circle"></div>
                  </a>
                </div>
                <!-- <div class="">
                  <div class="h5">{{ formatDate(post.publishedAt) }}</div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template> 

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSanityImage } from '~/composables/useSanityImage'
import { isDark, useRemoveTopPadding } from '~/composables/usePageUi.js'

// Props
const props = defineProps({
  section: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && 
             value._type === 'section' && 
             value.sectionType === 'news'
    }
  }
})

const posts = ref([])
const { getImageUrl } = useSanityImage()

// Computed property for top text with line break formatting
const topText = computed(() => {
  const text = props.section?.newsContent?.topText || ''
  return text.replace(/\n/g, '<br>')
})

onMounted(async () => {
  const res = await $fetch('/api/sanity', { params: { type: 'news' } })
  posts.value = res
  
  // Debug: Check if images are rendered with correct attributes
  nextTick(() => {
    const newsImages = document.querySelectorAll('[data-image-overlay]')
    console.log('[SectionNews] Found images with data-image-overlay:', newsImages.length)
    newsImages.forEach((img, i) => {
      console.log(`[SectionNews] Image ${i}:`, {
        tagName: img.tagName,
        src: img.src,
        alt: img.alt,
        hasOverlay: img.hasAttribute('data-image-overlay')
      })
    })
    
    // Dispatch event for image overlay plugin to re-initialize
    window.dispatchEvent(new CustomEvent('news-loaded'))
  })
})

isDark.value = false
useRemoveTopPadding.value = false

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  // Get month name in uppercase
  const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase()
  const year = date.getFullYear()
  return `${month} ${year}`
}
</script>

<style scoped>
.news-section {
  background-color: var(--grey);
}
</style> 