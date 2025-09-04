<template>
  <section class="section-instagram">
    <div class="wrapper">
      <!-- Section Image -->
      <div v-if="sectionImage" class="section-image-container">
        <img
          :src="getImageUrl(sectionImage)"
          :alt="'Instagram Section'"
          class="section-image"
        />
      </div>

      <!-- Instagram Grid -->
      <div class="instagram-grid">
        <div
          v-for="(item, index) in shuffledItems"
          :key="index"
          class="instagram-item"
        >
          <img
            :src="getImageUrl(item.image)"
            :alt="`Instagram post ${index + 1}`"
            class="instagram-image"
          />
        </div>
      </div>

      <!-- Link -->
      <div v-if="linkText && linkUrl" class="instagram-link-container">
        <a
          :href="linkUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="instagram-link"
        >
          {{ linkText }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useSanityImage } from '~/composables/useSanityImage'

const props = defineProps({
  section: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
             value._type === 'section' &&
             value.sectionType === 'sectionInstagram'
    }
  }
})

const { getImageUrl } = useSanityImage()

// Extract data from section
const sectionImage = computed(() => props.section?.instagramContent?.sectionImage)
const linkText = computed(() => props.section?.instagramContent?.linkText)
const linkUrl = computed(() => props.section?.instagramContent?.linkUrl)
const items = computed(() => props.section?.instagramContent?.items || [])

// Shuffled items for random placement
const shuffledItems = ref([])

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

onMounted(() => {
  // Shuffle items on component mount
  shuffledItems.value = shuffleArray(items.value)
})
</script>

<style scoped>
.section-instagram {
  width: 100%;
  padding: 4rem 0;
}

.section-image-container {
  margin-bottom: 3rem;
  text-align: center;
}

.section-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.instagram-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.instagram-item {
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.instagram-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.instagram-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.instagram-item:hover .instagram-image {
  transform: scale(1.05);
}

.instagram-link-container {
  text-align: center;
  margin-top: 2rem;
}

.instagram-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--yellow);
  color: var(--dark-grey);
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.instagram-link:hover {
  background: var(--dark-grey);
  color: var(--white);
}

/* Desktop: 3 columns */
@media (min-width: 768px) {
  .instagram-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .section-instagram {
    padding: 2rem 0;
  }
  
  .section-image-container {
    margin-bottom: 2rem;
  }
  
  .instagram-grid {
    gap: 0.75rem;
  }
}
</style>
