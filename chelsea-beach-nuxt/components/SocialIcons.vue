<template>
    <div class="row gap-2 social-icons">
      <a v-if="linkedinUrl" :href="linkedinUrl" target="_blank">
        <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
          <path fill="currentColor" d="M62.05,0H4.95C2.22,0,0,2.15,0,4.8v57.4c0,2.65,2.22,4.8,4.95,4.8h57.1c2.73,0,4.95-2.15,4.95-4.8V4.8C67,2.15,64.78,0,62.05,0ZM10.33,56.07v-30.16h10.03v30.16h-10.03ZM15.35,21.79h0s-.06,0-.06,0c-3.36,0-5.54-2.32-5.54-5.21s2.24-5.21,5.67-5.21,5.54,2.25,5.61,5.21c0,2.89-2.18,5.21-5.67,5.21ZM56.51,56.07h-10.02v-16.13c0-4.06-1.45-6.82-5.08-6.82-2.77,0-4.42,1.87-5.14,3.67-.26.64-.33,1.55-.33,2.45v16.84h-10.03s.13-27.33,0-30.16h10.03v4.27c1.33-2.05,3.72-4.98,9.04-4.98,6.6,0,11.54,4.31,11.54,13.58v17.29Z"/>
        </svg>
      </a>
    </div>
</template>

<script setup>
const props = defineProps({ linkedinUrl: String })
</script>

<style scoped>
.social-icons svg {
  width: calc(var(--unit) * 3);
  height: calc(var(--unit) * 3);
}
</style> 