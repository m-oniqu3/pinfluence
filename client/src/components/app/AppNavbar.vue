<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppNavbar'
})
</script>

<script setup lang="ts">
import NavbarOptionsMenu from '@/components/NavbarOptionsMenu.vue'
import SearchBar from '@/components/SearchBar.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { type Profile } from '@/types/profile'
import { computed, ref, watchEffect } from 'vue'

const auth = useAuthStore()
const user = computed(() => auth.user)
const profile = ref<Profile | null>(null)
const isOptionsMenuOpen = ref(false)
const positions = ref({ x: 0, y: 0 })

function getPosition(event: MouseEvent) {
  // Get mouse coordinates
  const { clientX, clientY } = event
  positions.value = { x: clientX, y: clientY }
}

function toggleOptionsMenu(val: boolean) {
  isOptionsMenuOpen.value = val
}

//when logged in, fetch user's avatar
watchEffect(async () => {
  if (user.value) {
    console.log(user.value.id)
    const response = await auth.getUserProfile()
    profile.value = response
  }
})
</script>

<template>
  <header class="h-20 flex justify-center items-center fixed top-0 left-0 right-0 z-10 bg-white">
    <nav class="wrapper flex justify-between items-center gap-4">
      <router-link to="/">
        <AppLogo class="fa-xl" />
      </router-link>

      <!-- PUBLIC NAV -->
      <div class="w-full grid grid-cols-[1fr,auto] gap-2" v-if="!auth.isAuth">
        <SearchBar />

        <ul class="flex items-center gap-2">
          <li>
            <router-link to="/login" class="bg-black text-neutral btn font-bold" id="link">Log in</router-link>
          </li>
          <li>
            <router-link to="/register" class="bg-neutral-100 text-black btn font-bold" id="link">Sign up</router-link>
          </li>
        </ul>
      </div>

      <!-- PRIVATE NAV -->
      <template v-else>
        <ul class="xs:hidden sm:flex">
          <li>
            <router-link :to="{ name: 'home' }" class="btn text-black">Home</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'create' }" class="btn text-black">Create</router-link>
          </li>

          <li>
            <router-link :to="{ name: 'about' }" class="btn text-black">About</router-link>
          </li>
        </ul>

        <SearchBar class="w-[60%] md:w-10/12" />

        <div class="flex gap-3 items-center min-w-max">
          <template v-if="user">
            <router-link :to="{ name: 'profile.saved', params: { profile: user.id } }">
              <img
                v-if="profile?.avatar_url"
                :src="profile.avatar_url"
                alt="avatar"
                class="w-8 h-8 object-cover rounded-full border-2 border-gray-600"
              />
              <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-xl w-8 h-8 text-gray-600" />
            </router-link>
          </template>

          <font-awesome-icon
            icon="fa-solid fa-chevron-down"
            class="fa-lg text-gray-600 cursor-pointer"
            @click="toggleOptionsMenu(true)"
            @click.prevent="getPosition"
          />
        </div>
      </template>
    </nav>
  </header>

  <NavbarOptionsMenu
    :profile="profile"
    :positions="positions"
    :isMenuOpen="isOptionsMenuOpen"
    @closeMenu="toggleOptionsMenu(false)"
  />
</template>

<style scoped>
.btn.router-link-active {
  background-color: black;
  color: white;
}

#link.router-link-active {
  background-color: red;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.5;
}
</style>
