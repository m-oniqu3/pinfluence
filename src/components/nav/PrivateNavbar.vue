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
</script>

<template>
  <BaseNavbar>
    <nav class="wrapper flex justify-between items-center gap-4">
      <AppLogo />

      <ul class="xs:hidden sm:flex">
        <li>
          <router-link to="/" class="link">Home</router-link>
        </li>
        <li>
          <router-link to="/create" class="link">Create</router-link>
        </li>
      </ul>

      <SearchBar class="w-[60%] md:w-10/12" />

      <div class="flex gap-3 items-center">
        <font-awesome-icon icon="fa-solid fa-circle-user" class="fa-xl text-gray-600" />
        <font-awesome-icon icon="fa-solid fa-chevron-down" class="fa-lg text-gray-600" />
      </div>
    </nav>
  </BaseNavbar>
</template>

<style scoped lang="css">
.link.router-link-active {
  background-color: black;
  color: white;
}
</style>
