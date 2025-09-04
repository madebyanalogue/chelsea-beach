<template>
  <section class="section-single-carousel">
    <div class="single-carousel-container">
      <div 
        v-if="carouselImages.length > 1" 
        class="carousel-container"
        :style="{ '--carousel-speed': `${carouselSpeed}s`, '--transition-duration': `${transitionDuration}s` }"
      >
        <div 
          v-for="(media, index) in carouselImages" 
          :key="`carousel-${index}`"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <img 
            v-if="!isVideo(media)"
            :src="getMediaUrl(media)" 
            :alt="media.alt || 'Carousel image'"
            class="carousel-image"
          />
          <video 
            v-else
            :src="getMediaUrl(media)" 
            :alt="media.alt || 'Carousel video'"
            class="carousel-video"
            muted
            loop
            autoplay
            playsinline
          />
        </div>
      </div>
      <div v-else-if="carouselImages.length === 1" class="single-image">
        <img 
          v-if="!isVideo(carouselImages[0])"
          :src="getMediaUrl(carouselImages[0])" 
          :alt="carouselImages[0].alt || 'Carousel image'"
          class="carousel-image"
        />
        <video 
          v-else
          :src="getMediaUrl(carouselImages[0])" 
          :alt="carouselImages[0].alt || 'Carousel video'"
          class="carousel-video"
          muted
          loop
          autoplay
          playsinline
        />
      </div>
      
      <!-- Overlay -->
      <div v-if="overlay" class="overlay-image">
        <img 
          :src="getMediaUrl(overlay)" 
          :alt="overlay.alt || 'Overlay image'"
          class="overlay-img"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

// Extract data from section
const carouselImages = computed(() => props.section?.singleCarouselContent?.carousel || [])
const overlay = computed(() => props.section?.singleCarouselContent?.overlay)
const carouselSpeed = computed(() => props.section?.singleCarouselContent?.carouselSpeed || 3)
const transitionDuration = computed(() => props.section?.singleCarouselContent?.transitionDuration || 0.5)

// Carousel state
const currentSlide = ref(0)
let carouselInterval = null

// Media URL helper
const getMediaUrl = (media) => {
  if (!media?.asset?.url) return ''
  return media.asset.url
}

// Check if media is a video
const isVideo = (media) => {
  return media?._type === 'file' || media?.asset?.url?.includes('.mp4')
}

// Start carousel if we have multiple images
const startCarousel = () => {
  if (carouselImages.value.length <= 1) return
  
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length
  }, carouselSpeed.value * 1000)
}

// Stop carousel
const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.section-single-carousel {
  width: 100%;
}

.single-carousel-container {
  position: relative;
  aspect-ratio: 16/9.8;
  overflow: hidden;
  width: 100%;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity var(--transition-duration) ease-in-out;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-image,
.carousel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.single-image {
  width: 100%;
  height: 100%;
}

.single-image .carousel-image,
.single-image .carousel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.overlay-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/* Mobile responsive - change to square aspect ratio */
@media (max-width: 800px) {
  .single-carousel-container {
    aspect-ratio: 1/1;
  }
}
</style>
