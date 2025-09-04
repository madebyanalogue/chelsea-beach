<template>
  <div>
    <pre v-if="isDev" style="display: none">{{ JSON.stringify({ pageData, error, pending, slug: slug.value }, null, 2) }}</pre>
    <template v-if="error">
      <div class="wrapper py6">
        <h1>Error</h1>
        <p>{{ error.message }}</p>
        <p v-if="isDev">Status: {{ error.statusCode }}</p>
      </div>
    </template>
    <template v-else-if="pending">
      <div class="wrapper py6">
        <div class="loading-placeholder">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </template>
    <template v-else-if="pageData?.sections?.length">
      <PageBuilder :sections="pageData.sections" :page-data="pageData" />
    </template>
    <template v-else-if="pageData">
      <div class="wrapper py6">
        <h1>{{ pageData.title || 'Page' }}</h1>
        <p>This page is being prepared. Please check back soon!</p>
        <p v-if="isDev">Debug: No sections found</p>
      </div>
    </template>
  </div>
</template> 

<script setup>
import { usePageSettings } from '~/composables/usePageSettings'
import { watch } from 'vue'
import { useRuntimeConfig } from '#app'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteSettings } from '~/composables/useSiteSettings'

const route = useRoute()
const config = useRuntimeConfig()

// Get the full path as the slug
const slug = computed(() => route.params.slug?.join('/') || '')

// Use the usePageSettings composable for consistency
const { page: pageData, error, pending } = usePageSettings()

// Watch for changes in pageData to update title
watch(() => pageData.value, (newData) => {
  if (newData) {
    const { title: websiteTitle } = useSiteSettings()
    const pageTitle = newData.title || route.path.split('/').pop()
    const fullTitle = `${websiteTitle.value} | ${pageTitle}`
    useHead({
      title: fullTitle
    })
  }
}, { immediate: true })

// Page meta
useHead(() => {
  const { title: websiteTitle } = useSiteSettings()
  const title = pageData.value?.title || 'Page Not Found';
  return { 
    title: `${websiteTitle.value} | ${title}`
  };
})

// Computed property for development mode
const isDev = computed(() => config.public.dev)
</script>

<style scoped>
.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--black);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 