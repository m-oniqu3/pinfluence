<script setup lang="ts">
// import { populateCreatedPins } from '@/scripts/populateCreatedPins'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/vue-query'
import axios, { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'

const { isPending, isError, data, error } = useQuery({
  queryKey: ['tempusers'],
  queryFn: getUsers
})

async function getUsers() {
  try {
    const response = await api.get<{ data: { id: string; full_name: string }[] }>('auth/tempusers')

    return response.data.data
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.log(error.response ?? error.message)
      throw new Error('Failed to get users.' + error.message)
    } else {
      throw new Error('Something went wrong. Please try again.')
    }
  }
}

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  try {
    const response = await authStore.logout()

    if (response.status === 200) {
      authStore.setUser(null)
      authStore.setToken(null)
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
  <p v-if="isPending">Loading...</p>
  <p v-if="isError && error">{{ error.message }}</p>
  <div class="about" v-else>
    <li v-for="user in data" :key="user.id">
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
