<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PublicNavbar'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import BaseNavbar from '@/components/nav/BaseNavbar.vue'
</script>

<template>
  <BaseNavbar>
    <nav class="wrapper flex justify-between items-center">
      <AppLogo />

      <div class="flex items-center gap-2">
        <BaseButton class="bg-primary text-neutral">Log in</BaseButton>
        <BaseButton class="bg-neutral-100 text-black">Sign up</BaseButton>
      </div>
    </nav>
  </BaseNavbar>
</template>
