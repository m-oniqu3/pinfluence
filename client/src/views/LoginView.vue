<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginVue'
})
</script>

<script setup lang="ts">
import axios from 'axios'

import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

import { api } from '@/services/api'
import { validateEmail, validatePassword } from '@/utils/validation'
import { assign } from '@sa-net/utils'
import { onMounted, reactive, ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const credentials = reactive({ email: '', password: '' })
const errors = reactive({ isEmailValid: false, isPasswordValid: false })
const loading = ref(false)

const loginError = ref('')

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

onMounted(() => {
  console.log('login view mounted')
})

async function submitForm() {
  loading.value = true
  try {
    const response = await authStore.login(credentials)

    if (!response.user || !response.token) {
      console.log('no user or token')
      throw new Error('Something went wrong')
    }

    // set user and session
    authStore.setUser(response.user)
    authStore.setToken(response.token)

    //update axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
    api.defaults.headers.common['Content-Type'] = 'application/json'

    // await profileStore.getProfileDetails()

    // navigate home
    router.push({ name: 'home' })
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    loginError.value = message
  } finally {
    loading.value = false
    assign(credentials, { email: '', password: '' })
  }
}
</script>

<template>
  <section class="wrapper max-w-sm h-full grid place-items-center">
    <form class="w-full rounded-lg p-6" @click.stop.prevent @submit.prevent="submitForm" @input="loginError = ''">
      <header class="space-y-4 py-2 mb-4 h-32">
        <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
        <div>
          <h2 class="text-xl font-bold">Welcome to Pinfluence</h2>
          <p>Log in to continue exploring</p>
        </div>

        <p v-show="loginError" class="font-bold text-red-500">{{ loginError }}</p>
      </header>

      <InputField v-model="credentials.email" name="email" type="email" label="Email" @blur="validateField('email')" />
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
        <router-link to="/register" class="font-bold cursor-pointer">Sign up</router-link>
      </p>
    </form>
  </section>
</template>

<style scoped>
#submit {
  border-radius: 0.5rem; /* 8px */
}
</style>
