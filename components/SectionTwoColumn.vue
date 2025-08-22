<template>
  
  <section>
    <div class="wrapper">
      <div class="grid middle-xs" style="gap:0;" :class="{ 'grid-reverse': imageRight }">

        <div class="col-span-12 col-span-6-md image--column">
          <NuxtImg 
            v-if="mainImage" 
            :src="mainImage.asset.url" 
            :alt="mainImage.alt || 'Main image'" 
            data-image-overlay
          />
        </div>

        <div class="col-span-12 col-span-6-md text--column">
            <div class="p4">
              <SanityBlocks v-if="text" :blocks="text" class="h3 rte" />
          </div>
        </div>

      </div>
    </div>
  </section>


</template>

<script setup>
import { computed, ref } from 'vue'
import SanityBlocks from '~/components/SanityBlocks.vue'

// Define props based on the Sanity schema
const props = defineProps({
  mainImage: {
    type: Object,
    default: null
  },
  roundalImage: {
    type: Object,
    default: null
  },
  includeLogo: {
    type: Boolean,
    default: false
  },
  logoImage: {
    type: Object,
    default: null
  },
  text: {
    type: [String, Array],
    default: ''
  },
  imageRight: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.grid {
  background-color: var(--grey);
}

.image--column {
  aspect-ratio: 1/1;
}
.image--column > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style> 