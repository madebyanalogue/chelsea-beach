<template>
  

  <div id="subfooter" ref="subfooterRef" class="py2 grey-bg black-text">
    <div class="wrapper">
      <div class="flex flex-row flex-middle gap-1">
        <div class="h4 mono">Get in contact</div>
        <div class="arrow arrow-right"></div>
        <div>
          <a href="mailto:info@chelseabeach.com" class="btn" data-btn-hover>
            <span class="btn__text">email us</span>
            <div class="btn__circle"></div>
          </a>
        </div>
      </div>
    </div>
  </div> 
  
  <footer class="dark">
    <div id="footer" class="py6 py-md-2 grid grid-1 gap-7 gap-3-md">

      <div class="wrapper">
        <div class="flex flex-row flex-between py1 ptop">

          <div class="">
            <div class="logo">
              <NuxtLink to="/">
                <Logo />
              </NuxtLink>
            </div>
          </div>

          <div>
            <BackToTop :page-data="pageData" />
          </div>

        </div>
      </div>

      <div class="wrapper">
        <div class="grid grid-1 grid-sm-2 grid-md-3 h4">
          <div class="">
            <div class="rte">
              <div v-for="item in firstHalfContactInfo" :key="item.label">
                <div v-html="item.value.replace(/\n/g, '<br>')"></div>
              </div>
            </div>
          </div>
          <div class="">
            <div class="rte">

              <div v-for="item in secondHalfContactInfo" :key="item.label">
                <div v-html="item.value.replace(/\n/g, '<br>')"></div>
              </div>
              
              <div class="flex flex-row flex-bottom gap-1">
                <SocialIcons :linkedinUrl="linkedinUrl" />
                <template v-if="certificationLogo">
                  <NuxtImg
                    :src="$urlFor(certificationLogo).url()"
                    alt="Certification Logo"
                    class="w-auto certification-logo object-contain"
                    loading="lazy"
                  />
                </template>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div class="wrapper">

        <div class="grid grid-1 grid-sm-2 grid-md-3 letter-spacing h7">

          <!-- COPYRIGHT -->
          <div>
            <div class="">© {{ new Date().getFullYear() }} <span class="uppercase">Chelsea Beach</span>. All Rights Reserved.</div>
          </div>

          <!-- FOOTER LINKS -->
          <div>
            <div class="flex flex-row gap-2 uppercase">
              <template v-if="footerMenuItems.length > 0">
                <template v-for="item in footerMenuItems" :key="item.text">
                  <NuxtLink 
                    v-if="item.to?.page?.slug?.current" 
                    :to="`/${item.to.page.slug.current}`"
                  >
                    {{ item.text }}
                  </NuxtLink>
                  <a 
                    v-else-if="item.to?.url" 
                    :href="item.to.url" 
                    target="_blank" 
                    rel="noopener"
                  >
                    {{ item.text }}
                  </a>
                </template>
              </template>
            </div>
          </div>
              
        </div>

      </div>

    </div>

  </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useSiteSettings } from '~/composables/useSiteSettings';
import { useMenu } from '~/composables/useMenu';
import imageUrlBuilder from '@sanity/image-url'
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue';

const props = defineProps({
  pageData: {
    type: Object,
    required: false,
    default: null
  }
});

// Sanity image URL builder
const builder = imageUrlBuilder({ projectId: 'xanklzya', dataset: 'production' })
const $urlFor = (source) => builder.image(source)

const route = useRoute();
const { 
  contactInfo, 
  footerLogos: logos, 
  certificationLogo, 
  ftCreditLogo,
  linkedinUrl 
} = useSiteSettings();

const { 
  mainMenu, 
  footerMenu, 
  mainMenuPending, 
  footerMenuPending, 
  mainMenuError, 
  footerMenuError 
} = useMenu();

// Computed properties for menu items
const mainMenuItems = computed(() => mainMenu?.value?.items || []);
const footerMenuItems = computed(() => footerMenu?.value?.items || []);

// Split contact info into two halves for equal distribution across columns
const firstHalfContactInfo = computed(() => {
  if (!contactInfo?.value) return [];
  const midPoint = Math.ceil(contactInfo.value.length / 2);
  return contactInfo.value.slice(0, midPoint);
});

const secondHalfContactInfo = computed(() => {
  if (!contactInfo?.value) return [];
  const midPoint = Math.ceil(contactInfo.value.length / 2);
  return contactInfo.value.slice(midPoint);
});

// Subfooter reveal on scroll
const subfooterRef = ref(null)
const footerRootRef = ref(null)
let onScrollHandler = null

onMounted(() => {
  nextTick(() => {
    const subfooterEl = subfooterRef.value
    const footerRoot = document.getElementById('footer')
    footerRootRef.value = footerRoot || null
    if (!subfooterEl || !footerRoot) return

    // Initial state for subfooter container and its content
    subfooterEl.style.transformOrigin = 'bottom'
    subfooterEl.style.transform = 'scaleY(0)'
    const subContent = subfooterEl.querySelector('.wrapper')
    if (subContent) subContent.style.opacity = '0'

    // Initial state for footer contents (wrappers)
    const footerBlocks = footerRoot.querySelectorAll(':scope > .wrapper')
    footerBlocks.forEach((blk) => {
      blk.style.opacity = '0'
    })

    const revealFooter = () => {
      // Skip if page is transitioning (footer will be revealed via fade-in)
      if (document.body.classList.contains('page-transitioning')) {
        return
      }
      
      // Reveal subfooter (scale then fade its content)
      if (subfooterEl && !subfooterEl.dataset.revealed) {
        subfooterEl.dataset.revealed = '1'
        subfooterEl.style.transition = 'transform 700ms cubic-bezier(0.5, 0.5, 0, 1)'
        subfooterEl.style.transform = 'scaleY(1)'
        setTimeout(() => {
          if (subContent) {
            subContent.style.transition = 'opacity 600ms ease'
            subContent.style.opacity = '1'
          }
        }, 720)
      }

      // Sequentially fade in footer blocks
      if (footerRoot && !footerRoot.dataset.revealed) {
        footerRoot.dataset.revealed = '1'
        const blocks = footerRoot.querySelectorAll(':scope > .wrapper')
        blocks.forEach((blk, i) => {
          setTimeout(() => {
            blk.style.transition = 'opacity 600ms ease'
            blk.style.opacity = '1'
          }, i * 180)
        })
      }
    }

    const bottomReached = () => {
      const doc = document.documentElement
      const reached = window.innerHeight + window.scrollY >= (doc.scrollHeight - 300)
      return reached
    }

    const onScroll = () => {
      if (bottomReached()) {
        revealFooter()
        window.removeEventListener('scroll', onScrollHandler)
      }
    }
    onScrollHandler = onScroll

    // Hook into global section flow: after preloader completes, start listening for bottom reach
    const startListening = () => {
      window.addEventListener('scroll', onScrollHandler)
      // Check immediately in case we're already at bottom (short pages)
      onScrollHandler()
    }

    if (document.body.classList.contains('preloader-complete')) {
      startListening()
    } else {
      document.addEventListener('preloader-complete', startListening, { once: true })
    }
  })
})

onUnmounted(() => {
  if (onScrollHandler) {
    window.removeEventListener('scroll', onScrollHandler)
  }
})
</script>

<style scoped>
footer {
  background: var(--black);
  color: var(--white);
}
.certification-logo {
  width:25%;
  min-width:70px;
}
.ftcredit-logo {
  width:100%;
  max-width:360px;
}
.logos-row {
  display: flex;
  flex-wrap: wrap;
}
@media (min-width: 768px) {
.logos-row {
  justify-content: space-between;
}
}
.logos-row > * {
  height: calc(var(--pad-3) * 1);
  width: auto;
}
</style> 