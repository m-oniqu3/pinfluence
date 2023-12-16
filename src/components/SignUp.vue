<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { modal, type ModalActions } from '@/types/keys'
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  name: 'SignUp'
})
</script>

<script setup lang="ts">
const { closeModal, openModal } = inject(modal) as ModalActions

const credentials = ref({ email: '', password: '' })
</script>

<template>
  <form
    class="bg-neutral w-full rounded-lg p-6 flex flex-col gap-4 relative max-w-sm mx-auto"
    @click.stop.prevent
  >
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="fa-xl absolute top-2 right-2 cursor-pointer"
      @click="closeModal"
    />

    <header class="flex flex-col gap-8 items-center py-2 mb-4">
      <span class="fa-brands fa-pinterest fa-2xl text-primary"></span>
      <div class="text-center">
        <h2 class="text-2xl font-bold">Welcome to Pinfluence</h2>
        <p>Find new ideas to try</p>
      </div>
    </header>

    <InputField name="email" type="email" label="Email" v-model="credentials.email" />
    <InputField name="password" type="password" label="Password" v-model="credentials.password" />

    <BaseButton type="submit" class="bg-primary w-full text-neutral mt-2">Sign In</BaseButton>

    <p class="text-sm text-center">
      Already a member?
      <span class="font-bold cursor-pointer" @click="openModal('log-in')">Log in</span>
    </p>
  </form>
</template>
