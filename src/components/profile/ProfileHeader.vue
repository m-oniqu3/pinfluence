<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileHeader'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppLogo from '@/components/app/AppLogo.vue'
</script>

<template>
  <header class="wrapper flex flex-col gap-2 items-center text-center mt-4 max-w-sm">
    <img
      src="https://images.unsplash.com/photo-1702165642972-88c68edd8a62?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="portrait"
      class="h-[7.5rem] w-[7.5rem] object-cover rounded-full"
    />
    <h1 class="font-semibold text-4xl">Giselle</h1>
    <div class="flex gap-1 items-center text-gray-600">
      <AppLogo class="fa-1x text-inherit" />
      <p class="text-sm lowercase">Giselleyen</p>
    </div>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae qui eum voluptatem aliquam
      voluptate, mollitia exercitationem.
    </p>

    <router-link to="/settings/profile">
      <BaseButton class="bg-neutral-200"> Edit Profile </BaseButton>
    </router-link>
  </header>
</template>
