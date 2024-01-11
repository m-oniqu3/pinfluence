<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits(['load-more'])

const observerElement = ref<HTMLDivElement>(document.getElementById('obs') as HTMLDivElement)
const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  rootMargin: '0px',
  threshold: 0.7
})

function handleIntersection(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      emit('load-more')
    }
  })
}
onMounted(() => {
  if (observerElement.value) {
    observer.observe(observerElement.value as HTMLDivElement)
  }
})
</script>

<template>
  <div>
    <slot></slot>
    <p v-if="props.isLoading" class="text-center">Loading...</p>
    <div ref="observerElement" id="obs" class="h-1"></div>
  </div>
</template>
