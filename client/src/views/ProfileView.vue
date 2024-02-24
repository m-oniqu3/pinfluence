<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileView'
})
</script>

<script setup lang="ts">
import ProfileBody from '@/components/profile/ProfileBody.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
</script>

<template>
  <ProfileHeader />
  <ProfileBody />
</template>

<style scoped></style>
