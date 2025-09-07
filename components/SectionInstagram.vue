<template>
  <section class="section-instagram py3">
    <div class="wrapper">
      <div class="grid grid-1 gap--2">
      <!-- Section Image -->
        <div v-if="sectionImage" class="grid grid-center-items">
          <div class="col-span-12 col-span-6-md">
            <img
              :src="getImageUrl(sectionImage)"
              :alt="'Instagram Section'"
              class="section-image"
            />
          </div>
        </div>

        <!-- Instagram Grid -->
        <div class="grid grid-3 gap-2 px6">
          <div
            v-for="(item, index) in shuffledItems"
            :key="index"
            class="instagram-item"
          >
            <a
              v-if="linkUrl"
              :href="linkUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="instagram-link"
            >
              <img
                :src="getImageUrl(item.image)"
                :alt="`Instagram post ${index + 1}`"
                class="instagram-image"
              />
            </a>
            <img
              v-else
              :src="getImageUrl(item.image)"
              :alt="`Instagram post ${index + 1}`"
              class="instagram-image"
            />
          </div>
        </div>

        <!-- Link -->
        <div v-if="linkText && linkUrl" class="instagram-link-container py1 ptop">
          <a
            :href="linkUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="instagram-link underline-link"
          >
            {{ linkText }}
          </a>
        </div>

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
  background-color: var(--beige);
}

.section-image-container {
  text-align: center;
}

.section-image {
  max-width: 100%;
  height: auto;
}

.instagram-grid {
  display: grid;
}

.instagram-item {
  aspect-ratio: 2/3;
  overflow: hidden;
}

.instagram-item:hover {
  
}

.instagram-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.75s ease;
}

.instagram-item:hover .instagram-image {
  transform: scale(1.05);
}

.instagram-link-container {
  text-align: center;
}

.instagram-link {
  text-decoration: none;
  color: inherit;
}

/* Desktop: 3 columns */
@media (min-width: 768px) {
  
}

/* Responsive adjustments */
@media (max-width: 767px) {
 
}
</style>
