<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RegisterView'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validatePassword } from '@/utils/validation'
import { assign } from '@sa-net/utils'
import axios from 'axios'
import { reactive, ref } from 'vue'

const authStore = useAuthStore()

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
  <section class="wrapper max-w-sm h-full grid place-items-center">
    <form
      class="w-full rounded-lg p-6"
      @click.stop.prevent
      @submit.prevent="submitForm"
      @input="signupError = ''"
    >
      <header class="space-y-4 py-2 mb-4 h-32">
        <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
        <div>
          <h2 class="text-xl font-bold">Welcome to Pinfluence</h2>
          <p>Find new ideas to try</p>
        </div>

        <p v-show="signupError" class="font-bold text-red-500">{{ signupError }}</p>
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
          <router-link to="/login" class="font-bold cursor-pointer">Log in</router-link>
        </p>
      </div>
    </form>
  </section>
</template>

<style scoped>
#submit {
  border-radius: 0.5rem; /* 8px */
}
</style>
