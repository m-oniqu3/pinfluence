<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { supabase } from '@/lib/supabaseClient'
import router from '@/router'
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

function validateField(field: string) {
  switch (field) {
    case 'email':
      errors.value.isEmailValid = !validateEmail(credentials.value.email)
      break
    case 'password':
      errors.value.isPasswordValid = !validatePassword(credentials.value.password)
      break
  }
}

async function submitForm() {
  console.log('submitting form')

  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.value.email,
      password: credentials.value.password
    })
    if (error) throw error

    closeModal()
    // navigate home

    router.push({ name: 'home' })
    // call get profile details here
  } catch (error) {
    console.error('error', error)
  }
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
      v-model="credentials.email"
      name="email"
      type="email"
      label="Email"
      @blur="validateField('email')"
    />
    <p class="text-sm text-red-500 h-4 mb-4">
      <span v-if="errors.isEmailValid"> Email is invalid. </span>
    </p>

    <InputField
      v-model="credentials.password"
      name="password"
      type="password"
      label="Password"
      @blur="validateField('password')"
    />

    <p class="text-sm text-red-500 h-4 mb-4">
      <span v-if="errors.isPasswordValid"> Password must be at least 8 characters. </span>
    </p>

    <BaseButton
      @click="submitForm"
      type="submit"
      class="bg-primary w-full text-neutral mt-2"
      id="submit"
      >Log In</BaseButton
    >

    <p class="text-sm text-center mt-4">
      Not on pinterest yet?
      <span class="font-bold cursor-pointer" @click="openModal('sign-up')">Sign up</span>
    </p>
  </form>
</template>

<style scoped>
#submit {
  border-radius: 0.5rem; /* 8px */
}
</style>
