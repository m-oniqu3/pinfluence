<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'

import { modal, type ModalActions } from '@/types/keys'
import { validateEmail, validatePassword } from '@/utils/validation'
import { defineComponent, inject, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SignUp'
})
</script>

<script setup lang="ts">
const router = useRouter()
const { closeModal, openModal } = inject(modal) as ModalActions

const credentials = ref({ email: '', password: '' })
const isLoading = ref(false)
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

async function signUpNewUser(email: string, password: string) {
  // const { data, error } = await supabase.auth.signUp({
  //   email: email,
  //   password: password,
  //   options: {
  //     emailRedirectTo: 'http://localhost:5173/'
  //   }
  // })
  // return { data, error }
}

async function submitForm() {
  console.log('submitting form')
  if (errors.value.isEmailValid || errors.value.isPasswordValid) {
    return
  }

  try {
    isLoading.value = true
    await signUpNewUser(credentials.value.email, credentials.value.password)

    // if (error) {
    //   console.log(error.message, error.name)
    //   throw error
    // }

    // console.log(data)

    closeModal()
    // navigate home
    router.push({ name: 'home' })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
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

    <header class="flex flex-col items-center gap-6 py-2 mb-4">
      <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
      <div class="text-center">
        <h2 class="text-2xl font-bold">Welcome to Pinfluence</h2>
        <p>Find new ideas to try</p>
      </div>
    </header>

    <InputField
      name="email"
      type="email"
      label="Email"
      v-model="credentials.email"
      @blur="validateField('email')"
    />

    <p class="text-sm text-red-500 h-4 mb-4">
      <span v-if="errors.isEmailValid"> Email is invalid. </span>
    </p>

    <InputField
      name="password"
      type="password"
      label="Password"
      v-model="credentials.password"
      @blur="validateField('password')"
    />

    <p class="text-sm text-red-500 h-4 mb-4">
      <span v-if="errors.isPasswordValid"> Password is invalid. </span>
    </p>

    <BaseButton
      type="submit"
      class="bg-primary w-full text-neutral mt-2"
      :disabled="isLoading"
      @click="submitForm"
      id="submit"
    >
      {{ isLoading ? 'Loading...' : 'Sign Up' }}
    </BaseButton>

    <div class="mt-4 flex flex-col gap-2">
      <p class="text-sm text-center">
        Already a member?
        <span class="font-bold cursor-pointer" @click="openModal('log-in')">Log in</span>
      </p>

      <p class="text-sm text-center">
        By continuing, you agree to Pinfluence's
        <strong>Terms of Service, Privacy Policy.</strong>
      </p>
    </div>
  </form>
</template>

<style scoped>
#submit {
  border-radius: 0.5rem; /* 8px */
}
</style>
