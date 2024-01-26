<script setup lang="ts">
// import { populateCreatedPins } from '@/scripts/populateCreatedPins'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(async () => {
  console.log('mounted')

  // await populateCreatedPins()
})

const auth = useAuthStore()

async function logout() {
  await auth.logout()

  router.push('/')

  //clear pinia state
}
</script>

<template>
  <div class="about">
    <button @click="logout">Logout</button>
    <h1>This is an about page</h1>
  </div>
</template>

<style></style>
