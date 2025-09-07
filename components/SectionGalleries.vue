<template>
  <section 
    class="section-galleries"
    :style="hoveredColor ? { backgroundColor: hoveredColor } : {}"
  >
    <div class="wrapper">
      <div data-gallery="" class="gallery-group">
        <div role="list" class="gallery-grid">
          <div 
            v-for="(gallery, index) in displayedGalleries" 
            :key="gallery._id"
            data-lightbox="trigger-parent" 
            role="listitem" 
            class="gallery-grid__item"
            :data-gallery-id="gallery._id"
            :data-gallery-color="getColorForGallery(gallery._id)"
            @mouseenter="handleGalleryHover(gallery._id)"
            @mouseleave="handleGalleryLeave"
          >
            <button 
              data-lightbox="trigger" 
              class="gallery-item__button"
            >
              <img 
                v-if="gallery.thumbnail?.asset"
                :src="getImageUrl(gallery.thumbnail)"
                :alt="gallery.title"
                loading="lazy" 
                class="gallery-item__img"
              />
              <div v-else class="thumbnail-placeholder">
                <span>No Image</span>
              </div>
            </button>
            <h3 class="gallery-title">{{ gallery.title }}</h3>
          </div>
        </div>
        
        <!-- Lightbox Modal -->
        <div 
          aria-modal="true" 
          data-lightbox="wrapper" 
          role="dialog" 
          class="lightbox-wrap"
          :style="selectedGallery ? { backgroundColor: getColorForGallery(selectedGallery._id) } : {}"
        >
          <div class="lightbox-img__wrap" @click.stop>
            <div class="lightbox-img__list">
              <div 
                v-for="(item, index) in selectedGallery?.items || []"
                :key="index"
                data-lightbox="item" 
                class="lightbox-img__item"
              >
                <img 
                  v-if="item._type === 'image' && item.asset"
                  :src="getImageUrl(item)"
                  :alt="`${selectedGallery?.title} - Image ${index + 1}`"
                  loading="lazy" 
                  class="lightbox-img"
                />
                <video
                  v-else-if="item._type === 'file' && item.asset"
                  :src="item.asset.url"
                  controls
                  class="lightbox-img"
                >
                  Your browser does not support the video tag.
                </video>
                <div v-else class="thumbnail-placeholder">
                  <span>No Image</span>
                </div>
              </div>
            </div>
          </div>
          <div class="lightbox-nav">
            <div data-lightbox="nav" class="lightbox-nav__col start">
              <p class="lightbox-nav__text">
                <span data-lightbox="counter-current">1</span> / 
                <span data-lightbox="counter-total">{{ selectedGallery?.items?.length || 0 }}</span>
              </p>
            </div>
            <div data-lightbox="nav" class="lightbox-nav__col center">
              <button 
                data-lightbox="prev" 
                class="lightbox-nav__button"
              >
                <div class="lightbox-nav__dot"></div>
                <span class="lightbox-nav__text">prev</span>
              </button>
              <button 
                data-lightbox="next" 
                class="lightbox-nav__button"
              >
                <span class="lightbox-nav__text">next</span>
                <div class="lightbox-nav__dot"></div>
              </button>
            </div>
            <div data-lightbox="nav" class="lightbox-nav__col end">
              <button 
                data-lightbox="close" 
                class="lightbox-nav__button"
              >
                <span class="lightbox-nav__text">close</span>
              </button>
            </div>
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
  </section>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useSanityImage } from '~/composables/useSanityImage'
import { useColorExtraction } from '~/composables/useColorExtraction'

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
const { extractColorFromImage, getColorForGallery, setColorForGallery } = useColorExtraction()

// Gallery data
const galleries = ref([])
const displayedCount = ref(9)
const selectedGallery = ref(null)
const isModalOpen = ref(false)
const hoveredColor = ref(null)

// Computed properties
const displayedGalleries = computed(() => galleries.value.slice(0, displayedCount.value))
const hasMoreGalleries = computed(() => galleries.value.length > displayedCount.value)

// Methods
const loadMore = () => {
  displayedCount.value = galleries.value.length
}

// Color extraction methods
const extractColorsForGalleries = async () => {
  for (const gallery of displayedGalleries.value) {
    if (gallery.thumbnail?.asset) {
      try {
        const imageUrl = getImageUrl(gallery.thumbnail)
        const color = await extractColorFromImage(imageUrl)
        setColorForGallery(gallery._id, color)
      } catch (error) {
        console.error(`Error extracting color for gallery ${gallery._id}:`, error)
      }
    }
  }
}

const handleGalleryHover = (galleryId) => {
  const color = getColorForGallery(galleryId)
  if (color) {
    hoveredColor.value = color
  }
}

const handleGalleryLeave = () => {
  hoveredColor.value = null
}

// Your original JavaScript code
const createLightbox = (container) => {
  const gsap = window.gsap
  const Flip = window.Flip || (window.gsap && window.gsap.Flip)
  
  const elements = {
    wrapper: container.querySelector('[data-lightbox="wrapper"]'),
    triggers: container.querySelectorAll('[data-lightbox="trigger"]'),
    triggerParents: container.querySelectorAll('[data-lightbox="trigger-parent"]'),
    items: container.querySelectorAll('[data-lightbox="item"]'),
    nav: container.querySelectorAll('[data-lightbox="nav"]'),
    titles: container.querySelectorAll('.gallery-title'),
    counter: {
      current: container.querySelector('[data-lightbox="counter-current"]'),
      total: container.querySelector('[data-lightbox="counter-total"]')
    },
    buttons: {
      prev: container.querySelector('[data-lightbox="prev"]'),
      next: container.querySelector('[data-lightbox="next"]'),
      close: container.querySelector('[data-lightbox="close"]')
    }
  };

  const mainTimeline = gsap.timeline();

  if (elements.counter.total) {
    elements.counter.total.textContent = elements.triggers.length;
  }
  
  function closeLightbox() {
    mainTimeline.clear();
    gsap.killTweensOf([elements.wrapper, elements.nav, elements.triggerParents, elements.items]);
    
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        elements.wrapper.classList.remove('is-active');
        elements.items.forEach(item => {
          item.classList.remove('is-active');
        });
        // Reset Vue state
        selectedGallery.value = null
        isModalOpen.value = false
      }
    });

    const originalItem = container.querySelector('[data-lightbox="original"]');
    const originalParent = container.querySelector('[data-lightbox="original-parent"]');
    
    if (originalItem && originalParent) {
      gsap.set(originalItem, { clearProps: "all" });
      originalParent.appendChild(originalItem);
      originalParent.removeAttribute('data-lightbox');
      originalItem.removeAttribute('data-lightbox');
    }
    
    let activeLightboxSlide = container.querySelector('[data-lightbox="item"].is-active')

    tl.to(elements.triggerParents, {
      autoAlpha: 1,
      duration: 0.5,
      stagger: 0.03,
      overwrite: true
    })
    .to(elements.titles, {
      autoAlpha: 1,
      duration: 0.5,
      stagger: 0.03,
      overwrite: true
    }, "<")
    .to(elements.nav, {
      autoAlpha: 0,
      y: "1rem",
      duration: 0.4,
      stagger: 0
    },"<")
    .to(elements.wrapper, {
      backgroundColor: "rgba(0,0,0,0)",
      duration: 0.4
    }, "<")
    .to(activeLightboxSlide,{
      autoAlpha:0,
      duration: 0.4,
    },"<")
    .set([elements.items, activeLightboxSlide, elements.triggerParents],  { clearProps: "all" })
    
    mainTimeline.add(tl);
  }

  function handleOutsideClick(event) {
    if (event.detail === 0) return;
    const clickedElement = event.target;
    const isOutside = !clickedElement.closest('[data-lightbox="item"].is-active img, [data-lightbox="nav"], [data-lightbox="close"], [data-lightbox="trigger"]');
    if (isOutside) {
      closeLightbox();
    }
  }

  function updateActiveItem(index) {
    elements.items.forEach(item => item.classList.remove('is-active'));
    elements.items[index].classList.add('is-active');
    if (elements.counter.current) {
      elements.counter.current.textContent = index + 1;
    }
  }

  elements.triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', async () => {
      // Get gallery ID and fetch contents
      const galleryId = trigger.closest('[data-gallery-id]')?.getAttribute('data-gallery-id')
      if (galleryId) {
        try {
          const result = await $fetch('/api/sanity', {
            params: { type: 'gallery', id: galleryId }
          })
          selectedGallery.value = result
          isModalOpen.value = true
          
          // Wait for Vue to update the DOM
          await nextTick()
          
          // Re-query elements after DOM update
          elements.items = container.querySelectorAll('[data-lightbox="item"]')
          elements.counter.total = container.querySelector('[data-lightbox="counter-total"]')
          elements.counter.current = container.querySelector('[data-lightbox="counter-current"]')
          elements.wrapper = container.querySelector('[data-lightbox="wrapper"]')
          elements.nav = container.querySelectorAll('[data-lightbox="nav"]')
          
          // Check if elements exist before proceeding
          if (!elements.wrapper || !elements.items.length) {
            console.error('Lightbox elements not found')
            return
          }
          
          mainTimeline.clear();
          gsap.killTweensOf([elements.wrapper, elements.nav, elements.triggerParents]);
          
          const img = trigger.querySelector("img")
          const state = Flip ? Flip.getState(img) : null;
          
          const triggerRect = trigger.getBoundingClientRect();
          trigger.parentElement.style.height = `${triggerRect.height}px`;
          
          trigger.setAttribute('data-lightbox', 'original-parent');
          img.setAttribute('data-lightbox', 'original');
          
          updateActiveItem(0); // Start with first item
          container.addEventListener('click', handleOutsideClick);
          
          const tl = gsap.timeline();
          elements.wrapper.classList.add('is-active');
          const targetItem = elements.items[0]; // First item
          
          const lightboxImage = targetItem.querySelector('img');
          if (lightboxImage) {
            lightboxImage.style.display = 'none';
          }

          elements.triggerParents.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
              gsap.to(otherTrigger, {
                autoAlpha: 0,
                duration: 0.4,
                stagger:0.02,
                overwrite: true
              });
            }
          });
          
          gsap.to(elements.titles, {
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.02,
            overwrite: true
          });

          if (!targetItem.contains(img)) {
            targetItem.appendChild(img);
            if (Flip && state) {
              tl.add(
                Flip.from(state, {
                  targets: img,
                  absolute: true,
                  duration: 0.6,
                  ease: "power2.inOut"
                }), 0
              );
            }
          }
          
          tl.fromTo(elements.nav, {
            autoAlpha: 0,
            y: "1rem"
          }, {
            autoAlpha: 1,
            y: "0rem",
            duration: 0.6,
            stagger: { each: 0.05, from: "center" }
          }, 0.2);
          
          mainTimeline.add(tl);
        } catch (error) {
          console.error('Error fetching gallery:', error)
        }
      }
    });
  });

  if (elements.buttons.next) {
    elements.buttons.next.addEventListener('click', () => {
      const currentIndex = Array.from(elements.items).findIndex(item => 
        item.classList.contains('is-active')
      );
      const nextIndex = (currentIndex + 1) % elements.items.length;
      updateActiveItem(nextIndex);
    });
  }

  if (elements.buttons.prev) {
    elements.buttons.prev.addEventListener('click', () => {
      const currentIndex = Array.from(elements.items).findIndex(item => 
        item.classList.contains('is-active')
      );
      const prevIndex = (currentIndex - 1 + elements.items.length) % elements.items.length;
      updateActiveItem(prevIndex);
    });
  }

  if (elements.buttons.close) {
    elements.buttons.close.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (event) => {
    if (!elements.wrapper.classList.contains('is-active')) return;
    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        elements.buttons.next?.click();
        break;
      case 'ArrowLeft':
        elements.buttons.prev?.click();
        break;
    }
  });
}

// Initialize lightbox after component mounts
onMounted(async () => {
  try {
    const result = await $fetch('/api/sanity', { params: { type: 'galleries' } })
    galleries.value = result || []
    
    // Extract colors for galleries
    await extractColorsForGalleries()
    
    await nextTick()
    
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap
      const Flip = window.Flip || (window.gsap && window.gsap.Flip)
      
      if (Flip) {
        gsap.registerPlugin(Flip)
      }
      
      gsap.defaults({
        ease: "power4.inOut",
        duration: 0.8,
      });
      
      const wrapper = document.querySelector("[data-gallery]")
      if (wrapper) {
        createLightbox(wrapper)
      }
    }
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
  transition: background-color 0.3s ease;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.gallery-group {
  position: relative;
}

.gallery-grid {
  grid-column-gap: 1.25em;
  grid-row-gap: 4em;
  flex-flow: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 8em;
  display: flex;
}

.gallery-grid__item {
  width: calc(33.3333% - .833333em);
  cursor: pointer;
}

.gallery-item__button {
  outline-offset: -1px;
  background-color: #0000;
  border: 1px #000;
  border-radius: .375em;
  outline: 1px #131313;
  width: 100%;
  padding: 0;
  cursor: pointer;
}

.gallery-item__button:focus-visible {
  outline-offset: 3px;
  border-radius: .25em;
  outline: 1px solid #131313;
}

.gallery-item__img {
  border-radius: .375em;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.thumbnail-placeholder {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-grey);
  color: var(--grey);
  font-size: var(--small);
  border-radius: .375em;
}

.gallery-title {
  font-size: var(--h4);
  margin-top: 1rem;
  margin-bottom: 0;
  color: var(--dark-grey);
  text-align: center;
  font-weight: 500;
}

/* Lightbox Styles */
.lightbox-wrap {
  z-index: 100;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100dvh;
  display: none;
  position: fixed;
  inset: 0% 0% auto;
  background: rgba(0, 0, 0, 0.9);
  transition: background-color 0.3s ease;
}

.lightbox-wrap.is-active {
  display: flex;
}

.lightbox-img__wrap {
  width: 90vw;
  height: calc(100svh - 10em);
}

.lightbox-img__container {
  width: 100%;
  height: 100%;
}

.lightbox-img__list {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.lightbox-img__item {
  visibility: hidden;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
}

.lightbox-img__item.is-active {
  visibility: visible;
}

.lightbox-img {
  object-fit: contain;
  border-radius: .375em;
  min-width: auto;
  max-height: 100%;
}

.lightbox-img__item img { 
  object-fit: contain !important;
  min-width: auto;
  width: auto;
  max-height: 100%;
}

/* Navigation */
.lightbox-nav {
  z-index: 2;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  display: flex;
  position: absolute;
  bottom: 2em;
  left: 2em;
  right: 2em;
}

.lightbox-nav__col {
  width: 33.333%;
}

.lightbox-nav__col.start {
  justify-content: flex-start;
  align-items: center;
  display: flex;
}

.lightbox-nav__col.center {
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  justify-content: center;
  align-items: center;
  display: flex;
}

.lightbox-nav__col.end {
  justify-content: flex-end;
  align-items: center;
  display: flex;
}

.lightbox-nav__text {
  margin-bottom: 0;
  font-size: 1em;
}

.lightbox-nav__button {
  grid-column-gap: .5em;
  grid-row-gap: .5em;
  background-color: #0000;
  justify-content: flex-start;
  align-items: center;
  margin: -1em;
  padding: 1em;
  display: flex;
  border: none;
  color: white;
  cursor: pointer;
}

.lightbox-nav__button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.lightbox-nav__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lightbox-nav__dot {
  background-color: currentColor;
  border-radius: 10em;
  width: .375em;
  height: .375em;
  margin-bottom: -.1em;
  transition-property: transform;
  transition-duration: .45s;
  transition-timing-function: cubic-bezier(.625, .05, 0, 1);
}

/* Load More Button */
.load-more-container {
  text-align: center;
  margin-top: 3rem;
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

/* Responsive Design */
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 767px) {
  .section-galleries {
    padding: 2rem 0;
  }
  
  .wrapper {
    padding: 0 1rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .gallery-item__img {
    height: 200px;
  }
  
  .thumbnail-placeholder {
    height: 200px;
  }
  
  .lightbox-wrap {
    padding: 1rem;
  }
  
  .lightbox-nav {
    padding: 1rem 0;
  }
  
  .lightbox-nav__col.center {
    gap: 1rem;
  }
}
</style>
