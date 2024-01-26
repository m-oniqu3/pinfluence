<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileHeader'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { useProfileStore } from '@/stores/profile'

const profile = useProfileStore()
const url = import.meta.env.VITE_SUPABASE_STORAGE_URL
</script>

<template>
  <header class="wrapper flex flex-col gap-2 items-center text-center my-4 max-w-sm">
    <figure>
      <img
        v-if="profile.details?.avatar_url"
        :src="url + '/avatars/' + profile.details.avatar_url"
        alt="portrait"
        class="h-[7.5rem] w-[7.5rem] object-cover rounded-full bg-gray-300"
      />
      <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-7x text-gray-600" />
    </figure>

    <template v-if="profile.details != null">
      <h1 v-show="profile.details.firstName" class="font-semibold text-4xl">
        {{ profile.details.firstName }} {{ profile.details.lastName }}
      </h1>

      <div class="flex gap-1 items-center text-gray-600">
        <AppLogo class="fa-1x" id="logo" />
        <p class="text-sm lowercase">{{ profile.details.username }}</p>
      </div>

      <p class="space-x-2">
        <span v-if="profile.details.website" class="font-bold">
          {{ profile.details.website.split('//')[1] }}
        </span>
        <span v-if="profile.details.about">
          {{ profile.details.about }}
        </span>
      </p>
    </template>

    <router-link to="/settings/profile">
      <BaseButton class="bg-neutral-200"> Edit Profile </BaseButton>
    </router-link>
  </header>
</template>

<style scoped>
#logo {
  color: inherit;
  font-size: large;
}
</style>
