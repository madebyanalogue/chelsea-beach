<template>
  <section ref="sectionRef" class="section-service">
    <div class="wrapper">
      <div class="service-content-container grid grid-1 py3">
        


        <div v-if="service" class="service-section py2 pbottom">
          <div class="service-container grid h6" :class="alignmentClass">
            
            <!-- Service Content -->
            <div class="service-content col-span-12 col-span-9-md" :data-index="0">

              <div class="flex flex-middle flex-between service--title--container">
                <div class="h4 heading service--title">
                  <span class="">{{ service.title }}</span>
                </div>
                <!-- Booking Button -->
                <div v-if="service.bookingLink" class="booking-section">
                  <a :href="service.bookingLink" target="_blank" rel="noopener" class="button h6 uppercase">
                    <span>Book</span>
                  </a>
                </div>
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
                      <td class="subservice-duration" v-if="subservice.duration">({{ subservice.duration }})</td>
                      <td class="subservice-cost">{{ subservice.cost }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
            </div>

            <!-- Testimonial -->
            <div class="col-span-12 col-span-3-md testimonial show-md">
              <div v-if="testimonial && testimonial.quote" class="grid grid-1 h4 p1">
                <blockquote class="testimonial-quote">
                  {{ testimonial.quote }}
                </blockquote>
                <cite v-if="testimonial.cite" class="testimonial-cite uppercase">{{ testimonial.cite }}</cite>
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

.service-container {
  --table-padding: calc(var(--h6) / 1);
}
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
}

.subservices-table th {
  text-align: left;
  padding: var(--table-padding) 0;
  border-bottom: 0.05em solid currentColor;
  display: none;
}

.subservices-table td {
  padding: var(--table-padding) 0;
  border-bottom: 0.05em solid currentColor;
}

.service--title--container {
  padding: var(--table-padding) 0;
  border-bottom: 1px solid currentColor;
}

/* 
.subservices-table tr:last-child td {
  border-bottom: none;
} */

.subservice-title-header,
.subservice-title {
  width: 65%;
}

.subservice-duration-header,
.subservice-duration {
  width: 24%;
}

.subservice-cost-header,
.subservice-cost {
  width: 11%;
  text-align: right;
}


@media (min-width: 768px) {
  .service-content {
    order: 1;
  }
  
  .testimonial {
    order: 2;
  }
  
  .service-right .service-content {
    order: 2;
  }
  
  .service-right .testimonial {
    order: 1;
  }
}
</style> 