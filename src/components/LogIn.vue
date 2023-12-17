<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { modal, type ModalActions } from '@/types/keys'
import { validateEmail, validatePassword } from '@/utils/validation'
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  name: 'LogIn'
})
</script>

<script setup lang="ts">
const { closeModal, openModal } = inject(modal) as ModalActions

const credentials = ref({ email: '', password: '' })
const errors = ref({ isEmailValid: false, isPasswordValid: false })

function validateField(field: string, value: string) {
  switch (field) {
    case 'email':
      errors.value.isEmailValid = !validateEmail(value)
      break
    case 'password':
      errors.value.isPasswordValid = !validatePassword(value)
      break
  }
}

function submitForm() {
  console.log('submitting form')
}
</script>

<template>
  <form
    class="bg-neutral w-full rounded-lg p-6 relative max-w-sm mx-auto"
    @click.stop.prevent
    @submit.prevent="submitForm"
  >
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="fa-xl absolute top-2 right-2 cursor-pointer"
      @click="closeModal"
    />

    <header class="flex flex-col gap-8 items-center py-2 mb-4">
      <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
      <h2 class="text-2xl font-bold">Welcome to Pinfluence</h2>
    </header>

    <InputField
      name="email"
      type="email"
      label="Email"
      v-model="credentials.email"
      @validate-input="validateField"
    />
    <p class="text-sm text-red-500 h-4 mb-4">
      <span v-if="errors.isEmailValid"> Email is invalid. </span>
    </p>

    <InputField
      name="password"
      type="password"
      label="Password"
      v-model="credentials.password"
      @validate-input="validateField"
    />

    <p class="text-sm text-red-500 h-4 mb-4">
      <span v-if="errors.isPasswordValid"> Password must be at least 8 characters. </span>
    </p>

    <BaseButton @click="submitForm" type="submit" class="bg-primary w-full text-neutral mt-2"
      >Log In</BaseButton
    >

    <p class="text-sm text-center">
      Not on pinterest yet?
      <span class="font-bold cursor-pointer" @click="openModal('sign-up')">Sign up</span>
    </p>
  </form>
</template>
@/types/keys
