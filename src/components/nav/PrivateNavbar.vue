<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrivateNavbar'
})
</script>

<script setup lang="ts">
import AppLogo from '@/components/app/AppLogo.vue'
import BaseNavbar from '@/components/nav/BaseNavbar.vue'
</script>

<template>
  <BaseNavbar>
    <nav class="wrapper flex justify-between items-center">
      <AppLogo />

      <p>Logged in</p>
    </nav>
  </BaseNavbar>
</template>
