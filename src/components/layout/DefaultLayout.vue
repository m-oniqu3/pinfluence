<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLayout'
})
</script>

<script setup lang="ts">
import AppLayout from '@/components/app/AppLayout.vue'
import PrivateNavbar from '@/components/nav/PrivateNavbar.vue'
import PublicNavbar from '@/components/nav/PublicNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
console.log(auth.isAuth)
</script>

<template>
  <AppLayout>
    <PrivateNavbar v-if="auth.isAuth" />
    <PublicNavbar v-else />

    <slot />
  </AppLayout>
</template>
