<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileHeader'
})
</script>

<script setup lang="ts">
import AppLogo from '@/components/app/AppLogo.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useQuery } from '@tanstack/vue-query'

const router = useRouter()
const authStore = useAuthStore()

const isOwner = computed(() => {
  return authStore.user?.id === profile.value?.id
})

const { params } = router.currentRoute.value
const id = ref(params.profile as string)

const {
  isLoading,
  isError,
  data: profile,
  error,
  refetch
} = useQuery({ queryKey: ['profile', id], queryFn: () => getProfile(id.value) })

async function getProfile(id: string) {
  try {
    const response = await authStore.getUserProfileById(id)

    return response
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    throw new Error('Failed to get profile. ' + message)
  }
}

// watch for changes in the route
watch(
  () => router.currentRoute.value.params.profile,
  async (newProfile) => {
    id.value = newProfile as string
    await refetch()
  }
)
</script>

<template>
  <p v-if="isLoading" class="text-center">Loading...</p>
  <p v-if="!isLoading && isError && error" class="text-center">{{ error.message }}</p>

  <header v-else-if="profile" class="wrapper flex flex-col gap-2 items-center text-center my-4 max-w-sm">
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

    <div class="flex gap-2 items-center">
      <p class="font-bold">12k followers</p>
      <p class="font-bold">3k following</p>
    </div>

    <div class="flex gap-2 items-center">
      <BaseButton v-if="!isOwner" class="font-bold bg-primary text-neutral"> Follow </BaseButton>
      <BaseButton v-if="isOwner" class="h-12 font-bold bg-neutral-200"> Share </BaseButton>

      <router-link :to="{ name: 'settings.profile' }" v-if="isOwner" class="btn font-bold bg-neutral-200">
        Edit Profile
      </router-link>
    </div>
  </header>

  <p v-else-if="!isLoading && !profile" class="text-center">no profile found</p>
</template>

<style scoped>
#logo {
  color: inherit;
  font-size: large;
}
</style>
