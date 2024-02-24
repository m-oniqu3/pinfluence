<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
  isLoadingIntial: boolean
  isLoadingMore: boolean
}>()

const emit = defineEmits(['load-more'])

const observerElement = ref<HTMLDivElement>(document.getElementById('obs') as HTMLDivElement)
const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  rootMargin: '500px',
  threshold: 0
})

function handleIntersection(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && (!props.isLoadingMore || !props.isLoadingIntial)) {
      console.log('intersecting')
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

    <div ref="observerElement" id="obs" class="h-10">
      <p v-if="props.isLoadingMore && !props.isLoadingIntial" class="text-center">Loading...</p>
    </div>
  </div>
</template>
