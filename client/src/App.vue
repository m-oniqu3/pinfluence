<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppNavbar />
  <div class="mt-24" style="{ minHeight: 'calc(100vh - 96px)' }">
    <RouterView />
  </div>
</template>

<style scoped></style>
