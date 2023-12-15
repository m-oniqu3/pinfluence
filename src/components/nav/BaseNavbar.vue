<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseNavbar'
})
</script>

<template>
  <header class="h-20 flex justify-center items-center">
    <slot />
  </header>
</template>
