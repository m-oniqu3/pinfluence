<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppNavbar'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import AppModal from '@/components/app/AppModal.vue'
import { useAuthStore } from '@/stores/auth'
import type { AuthComponent } from '@/types/keys'
import { modal } from '@/types/keys'
import { provide, ref, type Ref } from 'vue'

const auth = useAuthStore()

const selectedComponent: Ref<AuthComponent | null> = ref(null)

const openModal = (component: AuthComponent) => (selectedComponent.value = component)
const closeModal = () => (selectedComponent.value = null)

provide(modal, { openModal, closeModal })
</script>

<template>
  <header class="h-20 flex justify-center items-center">
    <nav class="wrapper flex justify-between items-center gap-4">
      <AppLogo class="fa-xl" />

      <div v-if="!auth.isAuth" class="flex items-center gap-2">
        <BaseButton class="bg-primary text-neutral" @click="openModal('log-in')">Log in</BaseButton>
        <BaseButton class="bg-neutral-100 text-black" @click="openModal('sign-up')"
          >Sign up</BaseButton
        >
      </div>

      <template v-else>
        <ul class="xs:hidden sm:flex">
          <li>
            <router-link to="/" class="btn text-black">Home</router-link>
          </li>
          <li>
            <router-link to="/create" class="btn text-black">Create</router-link>
          </li>
        </ul>

        <SearchBar class="w-[60%] md:w-10/12" />

        <div class="flex gap-3 items-center">
          <router-link :to="{ name: 'profile' }">
            <font-awesome-icon icon="fa-solid fa-circle-user" class="fa-xl text-gray-600" />
          </router-link>
          <font-awesome-icon icon="fa-solid fa-chevron-down" class="fa-lg text-gray-600" />
        </div>
      </template>
    </nav>
  </header>

  <AppModal v-if="selectedComponent" :close-modal="closeModal">
    <KeepAlive>
      <component :is="selectedComponent" />
    </KeepAlive>
  </AppModal>
</template>

<style scoped>
.btn.router-link-active {
  background-color: black;
  color: white;
}
</style>
