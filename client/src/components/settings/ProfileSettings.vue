<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import ProfileAvatar from '@/components/settings/ProfileAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import type { Profile } from '@/types/profile'
import { assign } from '@sa-net/utils'
import axios from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'

const authStore = useAuthStore()
const isLoading = ref(false)

const initial = { firstName: '', lastName: '', username: '', website: '', avatar_url: '', about: '' }

const profile = reactive({ ...initial })
const originalDetails = reactive({ ...profile })

async function getProfile() {
  try {
    const response = await authStore.getUserProfile()

    return response
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    console.log('Failed to get profile. ' + message, ' from getProfile')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  const response = await getProfile()

  if (response) {
    const [firstName, lastName] = response.full_name?.split(' ') ?? ['', '']
    assign(profile, { ...response, avatar_url: response.avatar_url ?? '', firstName, lastName })
    assign(originalDetails, { ...profile })
  }
})

const errors = ref({ isFirstNameValid: false, isUserNameValid: false })

const isProfileUpdated = computed(() => {
  return JSON.stringify(profile) !== JSON.stringify(originalDetails)
})

const isValidForm = computed(() => {
  return !errors.value.isFirstNameValid && !errors.value.isUserNameValid && isProfileUpdated.value
})

function validateField(field: string) {
  switch (field) {
    case 'firstName':
      errors.value.isFirstNameValid = profile.firstName.length < 3
      break
    case 'username':
      errors.value.isUserNameValid = profile.username.length < 3
      break
  }
}

async function updateProfile() {
  try {
    isLoading.value = true

    const user = authStore.user

    if (!user) {
      throw new Error('User not found')
    }

    const updates: Profile = {
      id: user.id,
      full_name: `${profile.firstName} ${profile.lastName}`,
      username: profile.username,
      website: profile.website,
      about: profile.about,
      avatar_url: profile.avatar_url
    }

    const response = await authStore.updateProfile(updates)

    assign(profile, { ...response })
    assign(originalDetails, { ...profile })
  } catch (error: any) {
    console.error(error, error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- <p v-if="fetchingProfile" class="text-center">Fetching profile...</p> -->
  <p v-if="isLoading" class="text-center">Loading...</p>
  <form v-else class="space-y-8 max-w-xl" id="profile-form">
    <header class="mb-4">
      <div class="flex justify-between items-center">
        <h1 class="font-medium text-3xl">Edit profile</h1>
        <BaseButton
          type="submit"
          class="bg-primary text-white disabled:bg-neutral-200 disabled:text-black"
          :disabled="isLoading || !isValidForm"
          @click="updateProfile"
        >
          Save
        </BaseButton>
      </div>
      <p class="mt-2">
        Keep your personal details private. Information you add here is visible to any who can view your profile.
      </p>
    </header>

    <div>
      <ProfileAvatar v-model:path="profile.avatar_url" @upload="updateProfile" />
    </div>

    <div class="grid grid-cols-2 gap-4 mt-8">
      <div>
        <InputField
          label="First name"
          name="firstname"
          type="text"
          v-model.trim="profile.firstName"
          @blur="validateField('firstName')"
        />
        <p class="text-sm text-red-500 h-4 mb-4">
          <span v-if="errors.isFirstNameValid"> First name must be at least 3 characters. </span>
        </p>
      </div>

      <InputField label="Last name" name="lastname" type="text" v-model.trim="profile.lastName" />
    </div>

    <InputField label="About" name="about" type="textarea" v-model.trim="profile.about" />

    <InputField label="Website" name="website" type="text" v-model.trim="profile.website" />

    <div>
      <InputField
        label="Username"
        name="username"
        type="text"
        v-model.trim="profile.username"
        @blur="validateField('username')"
      />
      <p class="text-sm text-red-500 h-4 mb-4">
        <span v-if="errors.isUserNameValid"> Username must be at least 3 characters. </span>
      </p>
    </div>
  </form>
</template>
