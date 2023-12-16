<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView'
})
</script>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import PrivateHome from '@/components/pages/PrivateHome.vue'
import PublicHome from '@/components/pages/PublicHome.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <DefaultLayout>
    <PrivateHome v-if="auth.isAuth" />
    <PublicHome v-else />
  </DefaultLayout>
</template>
