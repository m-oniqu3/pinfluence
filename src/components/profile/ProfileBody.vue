<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileBody'
})
</script>

<script setup lang="ts"></script>

<template>
  <header class="wrapper my-4">
    <nav class="h-32">
      <ul class="flex justify-center items-center gap-8 h-1/2 text-base">
        <li>
          <router-link :to="{ name: 'profile.created' }">Created </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'profile.saved' }">Saved</router-link>
        </li>
      </ul>

      <ul class="h-1/2 flex justify-between items-center">
        <li
          class="p-4 flex place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-sliders" class="fa-lg" />
        </li>
        <li
          class="p-4 flex place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg" />
        </li>
      </ul>
    </nav>
  </header>

  <router-view class="wrapper" />
</template>

<style scoped>
a {
  font-weight: 600;
  padding: 0.3rem 0;
}

a.router-link-active {
  border-bottom: 3px solid;
}
</style>
