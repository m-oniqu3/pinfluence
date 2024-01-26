<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ButtonLink'
})
</script>

<script setup lang="ts">
const props = defineProps<{
  to: string
}>()
</script>

<template>
  <router-link :to="props.to" class="bg-red-900 text-neutral px-4 py-2 rounded">
    <slot></slot>
  </router-link>
</template>
