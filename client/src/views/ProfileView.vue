<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileView'
})
</script>

<script setup lang="ts">
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
</script>

<template>
  <ProfileHeader />
  <!-- <Suspense>
    <ProfileBody />

     loading state via #fallback slot
    <template #fallback> Loading... </template>
  </Suspense> -->
</template>

<style scoped></style>
