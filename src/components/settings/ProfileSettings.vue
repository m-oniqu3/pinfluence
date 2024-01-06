<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import ProfileAvatar from '@/components/settings/ProfileAvatar.vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ProfileSettings'
})
</script>

<script setup lang="ts">
import { getProfileDetails } from '@/utils/getProfileDetails'

const loading = ref(false)
const profileDetails = ref({
  firstName: '',
  lastName: '',
  about: '',
  website: '',
  username: '',
  avatar_url: ''
})

const auth = useAuthStore()

const errors = ref({ isFirstNameValid: false, isUserNameValid: false })

onMounted(() => {
  loading.value = true

  getProfileDetails()
    .then((data) => {
      if (!data) return

      const [firstName, lastName] = data.full_name.split(' ')
      Object.assign(profileDetails.value, {
        firstName,
        lastName,
        about: data.about,
        website: data.website,
        username: data.username,
        avatar_url: data.avatar_url
      })
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      loading.value = false
    })
})

const isValidForm = computed(() => {
  return (
    !errors.value.isFirstNameValid &&
    !errors.value.isUserNameValid &&
    profileDetails.value.firstName.length > 0 &&
    profileDetails.value.username.length > 0
  )
})

function validateField(field: string) {
  switch (field) {
    case 'firstName':
      errors.value.isFirstNameValid = profileDetails.value.firstName.length < 3
      break
    case 'password':
      errors.value.isUserNameValid = profileDetails.value.username.length < 3
      break
  }
}

async function updateProfile() {
  try {
    loading.value = true

    if (!auth.user?.id) throw new Error('You must be logged in to update your profile.')

    const updates = {
      id: auth.user.id,
      full_name: `${profileDetails.value.firstName} ${profileDetails.value.lastName}`,
      username: profileDetails.value.username,
      website: profileDetails.value.website,
      avatar_url: profileDetails.value.avatar_url,
      about: profileDetails.value.about,
      updated_at: new Date()
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error
  } catch (error: any) {
    console.error(error, error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="space-y-8 max-w-xl">
    <header class="mb-4">
      <div class="flex justify-between items-center">
        <h1 class="font-medium text-3xl">Edit profile</h1>
        <BaseButton
          type="submit"
          class="bg-neutral-200 disabled:opacity-25"
          :disabled="loading || !isValidForm"
          @click="updateProfile"
        >
          Save
        </BaseButton>
      </div>
      <p class="mt-2">
        Keep your personal details private. Information you add here is visible to any who can view
        your profile.
      </p>
    </header>

    <div>
      <ProfileAvatar v-model:path="profileDetails.avatar_url" @upload="updateProfile" />
    </div>

    <div class="grid grid-cols-2 gap-4 mt-8">
      <div>
        <InputField
          label="First name"
          name="firstname"
          type="text"
          v-model="profileDetails.firstName"
          @blur="validateField('firstName')"
        />
        <p class="text-sm text-red-500 h-4 mb-4">
          <span v-if="errors.isFirstNameValid"> First name must be at least 3 characters. </span>
        </p>
      </div>

      <InputField label="Last name" name="lastname" type="text" v-model="profileDetails.lastName" />
    </div>

    <InputField label="About" name="about" type="textarea" v-model="profileDetails.about" />

    <InputField label="Website" name="website" type="text" v-model="profileDetails.website" />

    <div>
      <InputField
        label="Username"
        name="username"
        type="text"
        v-model="profileDetails.username"
        @blur="validateField('username')"
      />
      <p class="text-sm text-red-500 h-4 mb-4">
        <span v-if="errors.isUserNameValid"> Username must be at least 3 characters. </span>
      </p>
    </div>
  </form>
</template>
