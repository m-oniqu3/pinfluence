<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileBody'
})
</script>

<script setup lang="ts"></script>

<template>
  <header class="bg-white sticky top-20 z-[1]">
    <nav class="h-24 wrapper">
      <ul class="flex justify-center items-center gap-8 h-full text-base">
        <li>
          <router-link :to="{ name: 'profile.created' }">Created</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'profile.saved' }">Saved</router-link>
        </li>
      </ul>
    </nav>
  </header>

  <router-view />
</template>

<style scoped>
nav a {
  font-weight: 600;
  padding: 0.3rem 0;
}

nav a.router-link-active {
  border-bottom: 3px solid;
}

#content,
#content * {
  font-weight: 600;
}
</style>
