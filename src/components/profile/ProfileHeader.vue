<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ProfileHeader'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { getProfileDetails } from '@/utils/getProfileDetails'

const auth = useAuthStore()

const initialUserName = computed(() => auth.user?.email?.split('@')[0] ?? '')

const profileDetails = ref({
  avatar_url: '',
  username: initialUserName.value,
  about: '',
  full_name: initialUserName.value
})
const loading = ref(false)

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(profileDetails.value.avatar_url)
    if (error) throw error
    profileDetails.value.avatar_url = URL.createObjectURL(data)
  } catch (error: any) {
    console.error('Error downloading image: ', error.message)
  }
}

onMounted(() => {
  loading.value = true

  getProfileDetails()
    .then((data) => {
      if (!data) return
      Object.assign(profileDetails.value, {
        avatar_url: data.avatar_url,
        username: data.username,
        about: data.about,
        full_name: data.full_name.split(' ')[0]
      })
    })
    .then(() => {
      if (profileDetails.value.avatar_url) downloadImage()
    })
    .catch((err) => console.log(err))
    .finally(() => (loading.value = false))
})
</script>

<template>
  <header class="wrapper flex flex-col gap-2 items-center text-center mt-4 max-w-sm">
    <figure>
      <img
        v-if="profileDetails.avatar_url"
        :src="profileDetails.avatar_url"
        alt="portrait"
        class="h-[7.5rem] w-[7.5rem] object-cover rounded-full"
      />
      <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-7x text-gray-600" />
    </figure>
    <h1 class="font-semibold text-4xl">{{ profileDetails.full_name.split(' ')[0] }}</h1>
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
