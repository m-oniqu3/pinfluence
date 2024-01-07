<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ProfileHeader'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { downloadImage } from '@/services/profileServices'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

const auth = useAuthStore()

const userProfile = useProfileStore()

const profileDetails = ref({
  avatar_url: userProfile.details?.avatar_url ?? '',
  username: userProfile.details?.username ?? '',
  about: userProfile.details?.about ?? '',
  full_name: `${userProfile.details?.firstName ?? ''} ${userProfile.details?.lastName ?? ''}`
})

const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true

    if (!auth.isAuth) {
      throw new Error('You must be logged in to update your profile.')
    }

    if (profileDetails.value.avatar_url) {
      const image = await downloadImage(profileDetails.value.avatar_url)
      if (image) {
        profileDetails.value.avatar_url = image
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p v-if="loading">Loading... ></p>
  <header v-else class="wrapper flex flex-col gap-2 items-center text-center mt-4 max-w-sm">
    <figure>
      <img
        v-if="profileDetails.avatar_url"
        :src="profileDetails.avatar_url"
        alt="portrait"
        class="h-[7.5rem] w-[7.5rem] object-cover rounded-full"
      />
      <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-7x text-gray-600" />
    </figure>
    <h1 class="font-semibold text-4xl">{{ profileDetails.full_name }}</h1>
    <div class="flex gap-1 items-center text-gray-600">
      <AppLogo class="fa-1x text-inherit" />
      <p class="text-sm lowercase">{{ profileDetails.username }}</p>
    </div>
    <p>
      {{ profileDetails.about }}
    </p>

    <router-link to="/settings/profile">
      <BaseButton class="bg-neutral-200"> Edit Profile </BaseButton>
    </router-link>
  </header>
</template>
