<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppLayout'
})
</script>

<script setup lang="ts"></script>

<template>
  <div class="w-full">
    <slot />
  </div>
</template>
