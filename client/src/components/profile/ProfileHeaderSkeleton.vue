<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileHeaderSkeleton'
})
</script>

<script setup lang="ts"></script>

<template>
  <section>
    <div class="wrapper flex flex-col gap-2 items-center justify-center text-center my-4 max-w-sm">
      <!-- img -->
      <div class="h-[7.5rem] w-[7.5rem] bg-neutral-200 rounded-full" />

      <!-- name -->
      <div class="h-8 w-36 bg-neutral-200 rounded-md" />

      <!-- username -->
      <div class="h-3 w-20 bg-neutral-200 rounded-md" />

      <!-- bio -->
      <div class="h-3 w-full bg-neutral-200 rounded-md" />
      <div class="h-3 w-44 bg-neutral-200 rounded-md" />

      <!-- followers -->
      <div class="flex gap-2 items-center">
        <div class="h-5 w-24 bg-neutral-200 rounded-md" />
        <div class="h-5 w-20 bg-neutral-200 rounded-md" />
      </div>

      <!-- buttons -->
      <div class="flex gap-2 items-center">
        <div class="h-11 w-20 bg-neutral-200 rounded-full" />
        <div class="h-11 w-28 bg-neutral-200 rounded-full" />
      </div>
    </div>
  </section>
</template>
