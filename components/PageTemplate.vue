<template>
  <div class="wrapper">
    <div class="grid grid-center-items">
      <div class="col-span-12 col-span-8-md rte py3 pbottom">
        <div class="h2">{{ title }}</div>
        <div class="h4 rte">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script> 