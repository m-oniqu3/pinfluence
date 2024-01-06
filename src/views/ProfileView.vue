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
</template>

<style scoped></style>
