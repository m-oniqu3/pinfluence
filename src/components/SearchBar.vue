<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchBar'
})
</script>

<script setup lang="ts"></script>

<template>
  <form class="flex items-center h-12">
    <span class="h-full bg-neutral-100 pl-3 pr-1 grid place-items-center rounded-s-full">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-gray-700" />
    </span>

    <input
      type="text"
      name="search"
      placeholder="Search"
      class="pl-1 py-4 pr-4 bg-neutral-100 w-full h-full rounded-r-full font-medium placeholder:text-gray-700"
    />
  </form>
</template>
