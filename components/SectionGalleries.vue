<template>
  <section class="section-galleries">
    <div class="wrapper">
      <!-- Section Header -->
      <div v-if="title || description" class="section-header">
        <h2 v-if="title" class="section-title">{{ title }}</h2>
        <p v-if="description" class="section-description">{{ description }}</p>
      </div>

      <!-- Galleries Grid -->
      <div class="galleries-grid">
        <div
          v-for="gallery in displayedGalleries"
          :key="gallery._id"
          class="gallery-item"
          @click="openGalleryModal(gallery._id)"
        >
          <div class="gallery-thumbnail">
            <img
              v-if="gallery.thumbnail?.asset"
              :src="getImageUrl(gallery.thumbnail)"
              :alt="gallery.title"
              class="thumbnail-image"
            />
            <div v-else class="thumbnail-placeholder">
              <span>No Image</span>
            </div>
          </div>
          <div class="gallery-info">
            <h3 class="gallery-title">{{ gallery.title }}</h3>
            <p class="gallery-count">{{ gallery.itemCount }} items</p>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreGalleries" class="load-more-container">
        <button @click="loadMore" class="load-more-button">
          Load More Galleries
        </button>
      </div>
    </div>

    <!-- Gallery Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        
        <div v-if="selectedGallery" class="modal-gallery">
          <h2 class="modal-title">{{ selectedGallery.title }}</h2>
          
          <div class="modal-items">
            <div
              v-for="(item, index) in selectedGallery.items"
              :key="index"
              class="modal-item"
            >
              <img
                v-if="item._type === 'image' && item.asset"
                :src="getImageUrl(item)"
                :alt="`${selectedGallery.title} - Image ${index + 1}`"
                class="modal-image"
              />
              <video
                v-else-if="item._type === 'file' && item.asset"
                :src="item.asset.url"
                controls
                class="modal-video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
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
             value.sectionType === 'sectionGalleries'
    }
  }
})

const { getImageUrl } = useSanityImage()

// Extract data from section
const title = computed(() => props.section?.galleriesContent?.title)
const description = computed(() => props.section?.galleriesContent?.description)

// Gallery data
const galleries = ref([])
const displayedCount = ref(8)
const isModalOpen = ref(false)
const selectedGallery = ref(null)

// Computed properties
const displayedGalleries = computed(() => galleries.value.slice(0, displayedCount.value))
const hasMoreGalleries = computed(() => galleries.value.length > displayedCount.value)

// Methods
const loadMore = () => {
  displayedCount.value = galleries.value.length
}

const openGalleryModal = async (galleryId) => {
  try {
    const result = await $fetch('/api/sanity', { 
      params: { type: 'gallery', id: galleryId } 
    })
    selectedGallery.value = result
    isModalOpen.value = true
  } catch (error) {
    console.error('Error fetching gallery:', error)
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedGallery.value = null
}

// Fetch galleries on mount
onMounted(async () => {
  try {
    const result = await $fetch('/api/sanity', { params: { type: 'galleries' } })
    galleries.value = result || []
  } catch (error) {
    console.error('Error fetching galleries:', error)
    galleries.value = []
  }
})
</script>

<style scoped>
.section-galleries {
  width: 100%;
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: var(--h2);
  margin-bottom: 1rem;
  color: var(--dark-grey);
}

.section-description {
  font-size: var(--body);
  color: var(--grey);
  max-width: 600px;
  margin: 0 auto;
}

.galleries-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.gallery-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--white);
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.gallery-thumbnail {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.gallery-item:hover .thumbnail-image {
  transform: scale(1.05);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-grey);
  color: var(--grey);
  font-size: var(--small);
}

.gallery-info {
  padding: 1.5rem;
}

.gallery-title {
  font-size: var(--h4);
  margin-bottom: 0.5rem;
  color: var(--dark-grey);
}

.gallery-count {
  font-size: var(--small);
  color: var(--grey);
  margin: 0;
}

.load-more-container {
  text-align: center;
}

.load-more-button {
  padding: 0.75rem 2rem;
  background: var(--yellow);
  color: var(--dark-grey);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.load-more-button:hover {
  background: var(--dark-grey);
  color: var(--white);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--white);
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--dark-grey);
  z-index: 1001;
}

.modal-title {
  font-size: var(--h3);
  margin-bottom: 2rem;
  color: var(--dark-grey);
  text-align: center;
}

.modal-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.modal-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-image,
.modal-video {
  width: 100%;
  height: auto;
  display: block;
}

/* Desktop: 4 columns */
@media (min-width: 768px) {
  .galleries-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .section-galleries {
    padding: 2rem 0;
  }
  
  .galleries-grid {
    gap: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-items {
    grid-template-columns: 1fr;
  }
}
</style>
