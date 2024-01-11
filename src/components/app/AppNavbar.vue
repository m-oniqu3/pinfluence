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
import { downloadImage } from '@/services/profileServices'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import type { AuthComponent } from '@/types/keys'
import { modal } from '@/types/keys'
import { computed, onMounted, provide, ref, watch, type Ref } from 'vue'

const auth = useAuthStore()
const profile = useProfileStore()
const avatar = ref(profile.details?.avatar_url)

async function updateAvatar(url: string) {
  const image = await downloadImage(url)
  if (image) {
    avatar.value = image
  }
}

onMounted(async () => {
  if (avatar.value && auth.isAuth) {
    await updateAvatar(avatar.value)
  }
})

watch(
  () => profile.details?.avatar_url,
  async (newAvatarUrl) => {
    console.log('newAvatarUrl', newAvatarUrl)
    if (newAvatarUrl && auth.isAuth) {
      await updateAvatar(newAvatarUrl)
    }
  }
)

const selectedComponent: Ref<AuthComponent | null> = ref(null)

const openModal = (component: AuthComponent) => (selectedComponent.value = component)
const closeModal = () => (selectedComponent.value = null)

provide(modal, { openModal, closeModal })

const isModalOpen = computed(() => selectedComponent.value !== null)
</script>

<template>
  <header class="h-20 flex justify-center items-center fixed top-0 left-0 right-0 z-50 bg-white">
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

        <div class="flex gap-3 items-center min-w-max">
          <router-link :to="{ name: 'profile' }">
            <img
              v-if="avatar"
              :src="avatar"
              alt="avatar"
              class="w-8 h-8 object-cover rounded-full border-2 border-gray-600"
            />
            <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-xl text-gray-600" />
          </router-link>
          <font-awesome-icon icon="fa-solid fa-chevron-down" class="fa-lg text-gray-600" />
        </div>
      </template>
    </nav>
  </header>

  <AppModal @close-modal="closeModal" :open="isModalOpen">
    <KeepAlive>
      <Transition name="fade" mode="out-in">
        <component :is="selectedComponent" />
      </Transition>
    </KeepAlive>
  </AppModal>
</template>

<style scoped>
.btn.router-link-active {
  background-color: black;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.5;
}
</style>
