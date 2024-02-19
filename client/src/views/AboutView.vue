<script setup lang="ts">
// import { populateCreatedPins } from '@/scripts/populateCreatedPins'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import axios, { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(async () => {
  console.log('mounted')
  getUsers()

  // await populateCreatedPins()
})

const users = ref<{ id: string; full_name: string }[]>([])

const authStore = useAuthStore()

async function getUsers() {
  try {
    const response = await api.get<{ data: { id: string; full_name: string }[] }>('auth/tempusers')

    users.value = response.data.data
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.log(error.response?.data ?? error.message)
    } else {
      console.log('Something went wrong. Please try again.')
    }
  }
}

async function logout() {
  try {
    const response = await authStore.logout()

    if (response.status === 200) {
      authStore.setUser(null)
      authStore.removeSession()
      console.log(response.data.data)
      router.push('/login')
    }

    console.log(response)

    //clear pinia state
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    console.log('Failed to logout. ' + message, ' from logout')
  }
}
</script>

<template>
  <div class="about">
    <li v-for="user in users" :key="user.id">
      <router-link
        :to="{ name: 'profile', params: { profile: user.id } }"
        class="grid grid-cols-[auto,1fr] gap-4 w-full"
      >
        <p class="truncate font-bold">{{ user.id }}</p>
        <p>{{ user.full_name }}</p>
      </router-link>
    </li>

    <br />
    <br />
    <br />
    <button @click="logout" class="btn bg-black text-white">Logout</button>
    <h1>This is an about page</h1>
  </div>
</template>

<style></style>
