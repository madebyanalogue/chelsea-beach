<template>
  <div :class="['page-builder', 'py2', { 'pbottom': removeTopPadding }]">
    <template v-for="(section, index) in sections" :key="section._id || index">
      
      <SectionHero
        v-if="section._type === 'section' && section.sectionType === 'hero'"
        :section="section"
        :isFirstSection="index === 0"
      />

      <SectionBasicPage
        v-else-if="section._type === 'section' && section.sectionType === 'basicPage'"
        :section="section"
      />

      <SectionImage
        v-else-if="section._type === 'section' && section.sectionType === 'image'"
        :section="section"
      />

      <SectionHeadline
        v-else-if="section._type === 'section' && section.sectionType === 'headline'"
        :section="section"
      />

      <SectionContact
        v-else-if="section._type === 'section' && section.sectionType === 'contact'"
        :section="section"
      />

      <SectionBasicContent
        v-else-if="section._type === 'section' && section.sectionType === 'basicContent'"
        :section="section"
      />

      <SectionHomeScroll
        v-else-if="
          section._type === 'section' &&
          section.sectionType === 'homeScroll' &&
          section.homeScrollContent &&
          Array.isArray(section.homeScrollContent.items) &&
          section.homeScrollContent.items.length > 0
        "
        :section="section"
      />



      <!-- Two Column Section -->
      <SectionTwoColumn v-else-if="section._type === 'section' && section.sectionType === 'sectionTwoColumn'" v-bind="section.twoColumnContent" />

      <!-- Nested Section -->
      <SectionNested v-else-if="section._type === 'section' && section.sectionType === 'nested'" :section="section" />

      <!-- Banner Section -->
      <SectionBanner v-else-if="section._type === 'section' && section.sectionType === 'banner'" :section="section" />

      <!-- News Section -->
      <SectionNews v-else-if="section._type === 'section' && section.sectionType === 'news'" :section="section" />

      <!-- Services Section -->
      <SectionServices
        v-else-if="section._type === 'section' && section.sectionType === 'services'"
        :section="section"
      />

      <SectionSelectedServices
        v-else-if="section._type === 'section' && section.sectionType === 'selectedServices'"
        :section="section"
      />

      <!-- Selected News Section -->
      <SectionSelectedNews
        v-else-if="section._type === 'section' && section.sectionType === 'selectedNews'"
        :section="section"
      />

      <!-- Quote Section -->
      <SectionQuote
        v-else-if="section._type === 'section' && section.sectionType === 'quote'"
        :section="section"
      />

      <!-- Google Map Section -->
      <SectionGoogleMap
        v-else-if="section._type === 'section' && section.sectionType === 'googleMap'"
        :section="section"
      />

      <!-- Gallery Section -->
      <SectionGallery
        v-else-if="section._type === 'section' && section.sectionType === 'gallery'"
        :section="section"
      />

      <!-- Text Section -->
      <SectionText
        v-else-if="section._type === 'section' && section.sectionType === 'text'"
        :section="section"
      />

      <!-- Fallback for empty or misconfigured Home Scroll Section -->
      <div
        v-else-if="section._type === 'section' && section.sectionType === 'homeScroll'"
        class="wrapper py6"
      >
        <div class="grid">
          <div class="col-span-12">
            <p class="error">Home Scroll section is empty or misconfigured.</p>
          </div>
        </div>
      </div>

      <!-- Fallback for unknown section types -->
      <div v-else class="wrapper py6">
        <div class="grid">
          <div class="col-span-12">
            <p class="error">Unknown section type: {{ section._type }} - {{ section.sectionType }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { usePageSettings } from '~/composables/usePageSettings'
import SectionServices from '~/components/SectionServices.vue'
import SectionSelectedServices from '~/components/SectionSelectedServices.vue'
import SectionSelectedNews from '~/components/SectionSelectedNews.vue'
import SectionQuote from '~/components/SectionQuote.vue'
import SectionGoogleMap from '~/components/SectionGoogleMap.vue'
import SectionGallery from '~/components/SectionGallery.vue'
import SectionText from '~/components/SectionText.vue'

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(section => 
        section && 
        typeof section === 'object' && 
        section._type === 'section' && 
        typeof section.sectionType === 'string'
      )
    }
  },
  pageData: {
    type: Object,
    required: false,
    default: null
  }
})

// Get page settings for removeTopPadding - only if pageData prop is not provided
const pageSettings = computed(() => {
  if (!props.pageData) {
    return usePageSettings()
  }
  return null
})

// Use page data prop if available, otherwise fall back to composable
const removeTopPadding = computed(() => {
  if (props.pageData && props.pageData.removeTopPadding !== undefined) {
    return props.pageData.removeTopPadding
  }
  return pageSettings.value?.useRemoveTopPadding?.value || false
})

// Grey background setting
const greyBackground = computed(() => {
  return props.pageData?.greyBackground || false
})

// Apply grey background to body when component mounts
onMounted(() => {
  if (greyBackground.value) {
    document.body.style.setProperty('--initial-bg-light', 'var(--grey)')
  } else {
    document.body.style.removeProperty('--initial-bg-light')
  }
})

// Watch for changes in grey background setting
watch(greyBackground, (newValue) => {
  if (newValue) {
    document.body.style.setProperty('--initial-bg-light', 'var(--grey)')
  } else {
    document.body.style.removeProperty('--initial-bg-light')
  }
})

// Clean up on unmount
onUnmounted(() => {
  document.body.style.removeProperty('--initial-bg-light')
})


</script>

<style scoped>
.page-builder {
  width: 100%;
}

.error {
  color: red;
  padding: var(--unit);
  border: 1px solid red;
  border-radius: 4px;
}
</style> 