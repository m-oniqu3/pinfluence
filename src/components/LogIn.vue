<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { modal, type ModalActions } from '@/types/keys'
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  name: 'LogIn'
})
</script>

<script setup lang="ts">
const { closeModal, openModal } = inject(modal) as ModalActions

const credentials = ref({ email: '', password: '' })

function submitForm() {
  console.log('submitting form')
}
</script>

<template>
  <form
    class="bg-neutral w-full rounded-lg p-6 flex flex-col gap-4 relative max-w-sm mx-auto"
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

    <InputField name="email" type="email" label="Email" v-model="credentials.email" />
    <InputField name="password" type="password" label="Password" v-model="credentials.password" />

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
