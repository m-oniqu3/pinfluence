<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
</script>

<template>
  <header class="h-20 flex justify-center items-center">
    <nav class="wrapper flex justify-between items-center">
      <p class="flex gap-2 items-center">
        <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
        <span class="hidden font-bold text-lg text-primary">Pinfluence</span>
      </p>

      <div class="flex items-center gap-2">
        <BaseButton class="bg-primary text-neutral">Log in</BaseButton>
        <BaseButton class="bg-gray-100 text-black">Sign up</BaseButton>
      </div>
    </nav>
  </header>
</template>
