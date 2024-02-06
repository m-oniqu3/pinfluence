<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileHeader'
})
</script>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import type { Profile } from '@/types/profile'

const router = useRouter()
const authStore = useAuthStore()

const profile = ref<Profile | null>(null)

async function getProfile() {
  try {
    const { params } = router.currentRoute.value

    if (!params.profile) {
      return
    }

    const id = params.profile as string
    const response = await authStore.getUserProfile(id)

    profile.value = response
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    console.log('Failed to get profile. ' + message, ' from getProfile')
  }
}

await getProfile()
</script>

<template>
  <header v-if="profile" class="wrapper flex flex-col gap-2 items-center text-center my-4 max-w-sm">
    <figure>
      <img
        v-if="profile.avatar_url"
        :src="profile.avatar_url"
        alt="portrait"
        class="h-[7.5rem] w-[7.5rem] object-cover rounded-full bg-gray-300"
      />
      <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-7x text-gray-600" />
    </figure>

    <h1 v-show="profile.full_name" class="font-semibold text-4xl">
      {{ profile.full_name }}
    </h1>

    <div class="flex gap-1 items-center text-gray-600">
      <AppLogo class="fa-1x" id="logo" />
      <p class="text-sm lowercase">{{ profile.username }}</p>
    </div>

    <p class="space-x-2">
      <span v-if="profile.website" class="font-bold">
        {{ profile.website.split('//')[1] }}
      </span>
      <span v-if="profile.about">
        {{ profile.about }}
      </span>
    </p>

    <router-link to="/settings/profile">
      <BaseButton class="bg-neutral-200"> Edit Profile </BaseButton>
    </router-link>
  </header>

  <p v-else>no profile found</p>
</template>

<style scoped>
#logo {
  color: inherit;
  font-size: large;
}
</style>
