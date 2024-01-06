<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileSettings'
})
</script>

<script setup lang="ts">
const profileDetails = ref({
  firstName: '',
  lastName: '',
  about: '',
  website: '',
  username: ''
})
</script>

<template>
  <form class="space-y-8 max-w-md">
    <header class="mb-4">
      <div class="flex justify-between items-center">
        <h1 class="font-medium text-3xl">Edit profile</h1>
        <BaseButton type="submit" class="bg-neutral-200"> Save </BaseButton>
      </div>
      <p class="mt-2">
        Keep your personal details private. Information you add here is visible to any who can view
        your profile.
      </p>
    </header>

    <div class="grid grid-cols-2 gap-4 mt-8">
      <InputField
        label="First name"
        name="firstname"
        type="text"
        v-model="profileDetails.firstName"
      />

      <InputField label="Last name" name="lastname" type="text" v-model="profileDetails.lastName" />
    </div>

    <InputField label="About" name="about" type="textarea" v-model="profileDetails.about" />

    <InputField label="Website" name="website" type="text" v-model="profileDetails.website" />

    <InputField label="Username" name="username" type="text" v-model="profileDetails.username" />
  </form>
</template>
