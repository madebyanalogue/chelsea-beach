<template>
  <section class="section-tips-from-the-table">
    <div :class="['wrapper', { 'p2': enablePadding }]">
      <div class="tips-container">
        <div
          v-for="tip in tips"
          :key="tip._id"
          class="tip-item"
        >
          <div v-if="tip.backgroundImage" class="tip-background-image">
            <img
              :src="getImageUrl(tip.backgroundImage)"
              :alt="tip.title"
              class="tip-background-cover"
            />
          </div>
          <div class="tip-image">
            <img
              :src="getImageUrl(tip.image)"
              :alt="tip.title"
              class="tip-cover-image"
            />
          </div>
          <div class="tip-content">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <div class="tip-text">
              <SanityBlocks :blocks="tip.content" />
            </div>
            <a
              v-if="tip.link && tip.link.url && tip.link.text"
              :href="tip.link.url"
              :target="tip.link.targetBlank ? '_blank' : '_self'"
              :rel="tip.link.targetBlank ? 'noopener noreferrer' : ''"
              class="tip-link btn"
            >
              {{ tip.link.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSanityImage } from '~/composables/useSanityImage'
import SanityBlocks from '~/components/SanityBlocks.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
             value._type === 'section' &&
             value.sectionType === 'sectionTipsFromTheTable'
    }
  }
})

const { getImageUrl } = useSanityImage()

// Extract data from section
const enablePadding = computed(() => {
  return props.section?.tipsFromTheTableContent?.enablePadding || false
})

// Fetch tips from Sanity
const tips = ref([])



onMounted(async () => {
  try {
    const result = await $fetch('/api/sanity', { params: { type: 'tips' } })
    tips.value = result || []
  } catch (error) {
    console.error('Error fetching tips:', error)
    tips.value = []
  }
})
</script>

<style scoped>
.section-tips-from-the-table {
  width: 100%;
  background-color: var(--beige);
}

.tips-container {
  max-width: 800px;
  margin: 0 auto;
}

.tip-item {
  margin-bottom: 3rem;
  background: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tip-background-image {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.tip-background-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.tip-item:hover .tip-background-cover {
  transform: scale(1.05);
}

.tip-content {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}

.tip-title {
  font-size: var(--h3);
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark-grey);
}

.tip-text {
  font-size: var(--body);
  line-height: 1.6;
  color: var(--grey);
  margin-bottom: 1.5rem;
}

.tip-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--yellow);
  color: var(--dark-grey);
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.tip-link:hover {
  background: var(--dark-grey);
  color: var(--white);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tip-content {
    padding: 1.5rem;
  }

  .tip-title {
    font-size: var(--h4);
  }
}
</style>
