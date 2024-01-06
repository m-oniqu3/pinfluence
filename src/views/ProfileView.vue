<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileView'
})
</script>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
</script>

<template>
  <DefaultLayout>
    <ProfileHeader />
  </DefaultLayout>
</template>

<style scoped></style>
