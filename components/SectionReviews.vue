<template>
  <section class="section-reviews" :style="{ backgroundColor: `var(--${backgroundColor})`, color: `var(--${textColor})` }">
    <div class="wrapper">
      <div class="reviews-container">
        <div class="reviews-grid">
          <div
            v-for="(review, index) in items"
            :key="index"
            :class="getReviewClass(index)"
            class="review-item"
          >
            <div class="review-content">
              <div v-if="review.showStars" class="review-stars">
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
              </div>
              <div class="review-text">
                <SanityBlocks :blocks="review.reviewContent" />
              </div>
              <div class="review-cite">
                <cite>“{{ review.cite }}”</cite>
              </div>
            </div>
          </div>
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
             value.sectionType === 'reviews'
    }
  }
})

// Extract data from section
const backgroundColor = computed(() => props.section?.reviewsContent?.backgroundColor || 'white')
const textColor = computed(() => props.section?.reviewsContent?.textColor || 'dark-grey')
const items = computed(() => props.section?.reviewsContent?.items || [])

// Get CSS class for responsive layout
const getReviewClass = (index) => {
  const totalItems = items.value.length
  
  if (totalItems === 1) {
    return 'col-span-12 col-span-6-md centered'
  } else if (totalItems % 2 === 1 && index === totalItems - 1) {
    // Last item in odd number of items - center it
    return 'col-span-12 col-span-6-md centered'
  } else {
    // Regular 6-column layout
    return 'col-span-12 col-span-6-md'
  }
}
</script>

<style scoped>
.section-reviews {
  width: 100%;
  padding: 4rem 0;
}

.reviews-container {
  max-width: 1200px;
  margin: 0 auto;
}

.reviews-grid {
  display: grid;
  gap: 2rem;
}

.review-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.review-item.centered {
  justify-self: center;
  max-width: 600px;
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-text {
  font-size: var(--body);
  line-height: 1.6;
  font-style: italic;
}

.review-cite {
  font-weight: 600;
  font-size: var(--small);
  text-align: right;
}

.review-cite cite {
  font-style: normal;
}

.review-stars {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  color: var(--yellow);
  font-size: 1.2rem;
}

.star {
  transition: transform 0.2s ease;
}

.review-item:hover .star {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-reviews {
    padding: 2rem 0;
  }
  
  .review-item {
    padding: 1.5rem;
  }
  
  .review-text {
    font-size: var(--small);
  }
}
</style>
