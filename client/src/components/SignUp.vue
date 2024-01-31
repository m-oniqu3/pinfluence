<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import { assign } from '@sa-net/utils'
import axios from 'axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SignUp'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { modal, type ModalActions } from '@/types/keys'
import { validateEmail, validatePassword } from '@/utils/validation'
import { inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const authStore = useAuthStore()
const { closeModal, openModal } = inject(modal) as ModalActions

const credentials = reactive({ email: '', password: '' })
const isLoading = ref(false)
const errors = reactive({ isEmailValid: false, isPasswordValid: false })

const signupError = ref('')

function validateField(field: string) {
  switch (field) {
    case 'email':
      errors.isEmailValid = !validateEmail(credentials.email)
      break
    case 'password':
      errors.isPasswordValid = !validatePassword(credentials.password)
      break
  }
}

async function submitForm() {
  console.log('submitting form')
  if (errors.isEmailValid || errors.isPasswordValid) {
    return
  }

  try {
    isLoading.value = true
    const response = await authStore.signup(credentials)

    if (!response.user) {
      throw new Error('Something went wrong')
    }

    // user should check their email to verify their account
    signupError.value = 'Please check your email to verify your account.'

    closeModal()
    // navigate home
    router.push({ name: 'home' })
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    signupError.value = message
  } finally {
    isLoading.value = false
    assign(credentials, { email: '', password: '' })
  }
}
</script>

<template>
  <form
    class="bg-neutral w-full rounded-lg p-6 relative max-w-sm mx-auto"
    @click.stop.prevent
    @submit.prevent="submitForm"
    @input="signupError = ''"
  >
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="fa-xl absolute top-2 right-2 cursor-pointer"
      @click="closeModal"
    />

    <header class="space-y-4 text-center py-2 mb-4 h-32">
      <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
      <div class="text-center">
        <h2 class="text-2xl font-bold">Welcome to Pinfluence</h2>
        <p>Find new ideas to try</p>
      </div>

      <p class="text-sm text-red-500">
        <span v-if="signupError">{{ signupError }}</span>
      </p>
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
