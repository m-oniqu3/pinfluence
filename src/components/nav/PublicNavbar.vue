<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PublicNavbar'
})
</script>

<script setup lang="ts">
import AppLogo from '@/components/app/AppLogo.vue'
import AppModal from '@/components/app/AppModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseNavbar from '@/components/nav/BaseNavbar.vue'
import type { AuthComponent } from '@/types/keys'
import { modal } from '@/types/keys'

import { provide, ref, type Ref } from 'vue'

const selectedComponent: Ref<AuthComponent | null> = ref(null)

const openModal = (component: AuthComponent) => (selectedComponent.value = component)
const closeModal = () => (selectedComponent.value = null)

provide(modal, { openModal, closeModal })
</script>

<template>
  <BaseNavbar>
    <nav class="wrapper flex justify-between items-center">
      <AppLogo class="fa-xl" />

      <div class="flex items-center gap-2">
        <BaseButton class="bg-primary text-neutral" @click="openModal('log-in')">Log in</BaseButton>
        <BaseButton class="bg-neutral-100 text-black" @click="openModal('sign-up')"
          >Sign up</BaseButton
        >
      </div>
    </nav>
  </BaseNavbar>

  <AppModal v-if="selectedComponent" :close-modal="closeModal">
    <KeepAlive>
      <component :is="selectedComponent" />
    </KeepAlive>
  </AppModal>
</template>
