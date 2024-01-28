<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogIn'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

import { modal, type ModalActions } from '@/types/keys'

import { api } from '@/services/api'
import { validateEmail, validatePassword } from '@/utils/validation'
import { assign } from '@sa-net/utils'
import { inject, reactive, ref } from 'vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const { closeModal, openModal } = inject(modal) as ModalActions

const credentials = reactive({ email: '', password: '' })
const errors = reactive({ isEmailValid: false, isPasswordValid: false })
const loading = ref(false)

const loginMessage = ref('')

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
  loading.value = true
  try {
    const response = await authStore.login(credentials)

    if (!response.user || !response.session) {
      throw new Error('Something went wrong')
    }

    const token = response.session.access_token

    // set user and session
    authStore.setUser(response.user)
    authStore.setSession(token)

    //update axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.defaults.headers.common['Content-Type'] = 'application/json'

    // await profileStore.getProfileDetails()

    closeModal()
    // navigate home
    // router.push({ name: 'home' })
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    loginMessage.value = message
  } finally {
    loading.value = false
    assign(credentials, { email: '', password: '' })
  }
}
</script>

<template>
  <form
    class="bg-neutral w-full rounded-lg p-6 relative max-w-sm mx-auto"
    @click.stop.prevent
    @submit.prevent="submitForm"
    @input="loginMessage = ''"
  >
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="fa-xl absolute top-2 right-2 cursor-pointer"
      @click="closeModal"
    />

    <header class="space-y-4 text-center py-2 mb-4 h-28">
      <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
      <h2 class="text-2xl font-bold">Welcome to Pinfluence</h2>

      <p v-show="loginMessage">{{ loginMessage }}</p>
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
      <span v-if="errors.isPasswordValid"> Password must be at least 6 characters. </span>
    </p>

    <BaseButton
      @click="submitForm"
      type="submit"
      class="bg-primary w-full text-neutral mt-2"
      id="submit"
      :disabled="errors.isEmailValid || errors.isPasswordValid || loading"
    >
      {{ loading ? 'Loading' : '  Log In' }}
    </BaseButton>

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
