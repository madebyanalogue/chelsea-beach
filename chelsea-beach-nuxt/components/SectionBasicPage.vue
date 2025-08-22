<template>
  <section>
    <div class="wrapper">
      <div class="py2">
        <div class="grid grid-1 grid-md-12">
          <div class="col-span-3-md">
            <h2>{{ section.basicContent.title }}</h2>
          </div>
          <div class="col-span-7-md">
            <div v-if="section?.basicContent?.content" class="content-wrapper">
              <SanityBlocks :blocks="section.basicContent.content" />
            </div>
            <a 
              v-if="section?.basicContent?.pdf?.asset?.url" 
              :href="section.basicContent.pdf.asset.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="with-circle mt2"
            >
              <div class="circle--heading"><span class="circle"></span><span>Download PDF</span></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({ 
  section: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value._type === 'section' && value.sectionType === 'basicPage'
    }
  }
})


</script>

<style scoped>
.debug {
  background: #f5f5f5;
  padding: 1em;
  margin: 1em 0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.debug-info {
  background: #e8f4ff;
  padding: 1em;
  margin: 1em 0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.debug-info p {
  margin: 0.5em 0;
}

.content-wrapper {
  white-space: pre-wrap;
}
.sanity-blocks {
  display: flex;
  flex-direction: column;
}
</style>