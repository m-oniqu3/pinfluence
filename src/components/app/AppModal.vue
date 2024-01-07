<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppModal'
})
</script>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'closeModal'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      @click="emit('closeModal')"
      class="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center"
    >
      <div class="wrapper">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
