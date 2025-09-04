<template>
  <section ref="sectionRef">
    <div class="wrapper">
      <div class="grid grid-1 py2 ptop">
        


        <div v-if="service" class="service-section">
          <div class="service-container" :class="alignmentClass">
            
            <!-- Service Content -->
            <div class="service-content" :data-index="0">
              <div class="h2 service--title">
                <span class="">{{ service.title }}</span>
              </div>
              
              <div v-if="service.description" class="service-description">
                {{ service.description }}
              </div>

              <!-- Subservices List -->
              <div v-if="service.subservices && service.subservices.length > 0" class="subservices-list">
                <table class="subservices-table">
                  <thead>
                    <tr>
                      <th class="subservice-title-header">Service</th>
                      <th class="subservice-duration-header">Duration</th>
                      <th class="subservice-cost-header">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(subservice, index) in service.subservices" 
                      :key="subservice.title" 
                      class="subservice-row"
                      :data-subservice-index="index"
                    >
                      <td class="subservice-title">{{ subservice.title }}</td>
                      <td class="subservice-duration">({{ subservice.duration }})</td>
                      <td class="subservice-cost">{{ subservice.cost }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Testimonial -->
              <div v-if="testimonial && testimonial.quote" class="testimonial">
                <blockquote class="testimonial-quote">
                  {{ testimonial.quote }}
                </blockquote>
                <cite v-if="testimonial.cite" class="testimonial-cite">
                  — {{ testimonial.cite }}
                </cite>
              </div>

              <!-- Booking Button -->
              <div v-if="service.bookingLink" class="booking-section">
                <a :href="service.bookingLink" target="_blank" rel="noopener" class="btn" data-btn-hover>
                  <span class="btn__text">Book Now</span>
                  <div class="btn__circle"></div>
                </a>
              </div>
            </div>

          </div>
        </div>
        <div v-else class="service-section">
          <p>No service found.</p>
        </div>



      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useSanityImage } from '~/composables/useSanityImage'
import SanityBlocks from '~/components/SanityBlocks.vue'
import gsap from 'gsap'
import { useScrollTrigger } from '~/composables/useScrollTrigger'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const { getImageUrl } = useSanityImage()
const { registerSection, unregisterSection } = useScrollTrigger()
const sectionRef = ref(null)
const hasAnimated = ref(false)

function getServiceImageUrl(image) {
  const url = image?.asset?.url
  const mimeType = image?.asset?.mimeType
  if ((mimeType && mimeType === 'image/svg+xml') || (url && url.endsWith('.svg'))) {
    return url
  }
  return getImageUrl(image)
}

const service = computed(() => props.section?.serviceContent?.service || null)
const alignment = computed(() => props.section?.serviceContent?.alignment || 'left')
const testimonial = computed(() => props.section?.serviceContent?.testimonial || null)

const alignmentClass = computed(() => {
  return alignment.value === 'right' ? 'service-right' : 'service-left'
})

// Animation setup
const setupAnimations = () => {
  if (!sectionRef.value || hasAnimated.value) return

  // Set initial states immediately
  gsap.set('.service-content', { 
    opacity: 0,
    y: 20
  })
  
  gsap.set('.subservice-row', { 
    opacity: 0,
    y: 15
  })

  // Register with global scroll trigger system - only trigger once
  const tl = registerSection('service', {
    trigger: sectionRef.value,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none none', // Changed to only play once
    immediateRender: false
  })

  // Only proceed if timeline was created successfully
  if (!tl) {
    console.warn('Failed to create timeline, GSAP may not be loaded yet')
    return
  }

  // Animate the service content first
  tl.to('.service-content', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out'
  })

  // Then animate subservices with staggered delay
  if (service.value?.subservices?.length > 0) {
    tl.to('.subservice-row', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15, // 150ms delay between each subservice
      ease: 'power2.out'
    }, '-=0.6') // Start 0.6s before the previous animation ends
  }

  hasAnimated.value = true
}

// Cleanup animations
const cleanupAnimations = () => {
  unregisterSection('service')
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.gsap) {
    console.log('🔴 [SectionService] Component mounted, setting up animations...')
    nextTick(() => {
      setupAnimations()
    })
  } else {
    console.warn('🔴 [SectionService] GSAP not available, skipping animations')
  }
})

// Watch for changes in service to re-setup animations if needed
watch(service, (newService) => {
  if (newService && typeof window !== 'undefined') {
    nextTick(() => {
      // Reset animation flag when service changes
      hasAnimated.value = false
      // Re-setup animations when service changes
      setupAnimations()
    })
  }
}, { immediate: false })

onUnmounted(() => {
  cleanupAnimations()
})
</script>

<style scoped>
.service-item {
  opacity: 1;
}

.service-image-container {
  aspect-ratio: 1/1;
  position: relative;
  overflow: hidden;
}

.service-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Subservices Table Styles */
.subservices-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background: white;
}

.subservices-table th {
  text-align: left;
  padding: 0.75rem 0;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.subservices-table td {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.subservices-table tr:last-child td {
  border-bottom: none;
}

.subservice-title-header,
.subservice-title {
  width: 50%;
}

.subservice-duration-header,
.subservice-duration {
  width: 25%;
}

.subservice-cost-header,
.subservice-cost {
  width: 25%;
  text-align: right;
}

/* Testimonial Styles */
.testimonial {
  margin: 2rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-left: 3px solid #333;
}

.testimonial-quote {
  font-style: italic;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.testimonial-cite {
  font-weight: 600;
  color: #666;
}
</style> 