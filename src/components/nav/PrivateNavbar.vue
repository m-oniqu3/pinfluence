<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrivateNavbar'
})
</script>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import BaseNavbar from '@/components/nav/BaseNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const user = auth.user?.id as string
</script>

<template>
  <BaseNavbar>
    <nav class="wrapper flex justify-between items-center gap-4">
      <AppLogo class="fa-xl" />

      <ul class="xs:hidden sm:flex">
        <li>
          <router-link to="/" class="btn text-black">Home</router-link>
        </li>
        <li>
          <router-link to="/create" class="btn text-black">Create</router-link>
        </li>
      </ul>

      <SearchBar class="w-[60%] md:w-10/12" />

      <div class="flex gap-3 items-center">
        <router-link :to="user">
          <font-awesome-icon icon="fa-solid fa-circle-user" class="fa-xl text-gray-600" />
        </router-link>
        <font-awesome-icon icon="fa-solid fa-chevron-down" class="fa-lg text-gray-600" />
      </div>
    </nav>
  </BaseNavbar>
</template>

<style scoped lang="css">
.btn.router-link-active {
  background-color: black;
  color: white;
}
</style>
