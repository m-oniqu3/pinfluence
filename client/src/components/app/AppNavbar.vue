<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppNavbar'
})
</script>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'

const auth = useAuthStore()
const user = computed(() => auth.user)
// const profile = useProfileStore()

// random avatar
const avatar = ref('https://picsum.photos/200')

// async function updateAvatar(url: string) {
//   const image = await downloadImage(url)
//   if (image) {
//     avatar.value = image
//   }
// }

// onMounted(async () => {
//   if (avatar.value && auth.isAuth) {
//     await updateAvatar(avatar.value)
//   }
// })

// watch(
//   () => profile.details?.avatar_url,
//   async (newAvatarUrl) => {
//     console.log('newAvatarUrl', newAvatarUrl)
//     if (newAvatarUrl && auth.isAuth) {
//       await updateAvatar(newAvatarUrl)
//     }
//   }
// )
</script>

<template>
  <header class="h-20 flex justify-center items-center fixed top-0 left-0 right-0 z-10 bg-white">
    <nav class="wrapper flex justify-between items-center gap-4">
      <router-link to="/">
        <AppLogo class="fa-xl" />
      </router-link>

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
                v-if="avatar"
                :src="avatar"
                alt="avatar"
                class="w-8 h-8 object-cover rounded-full border-2 border-gray-600"
              />
              <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-xl text-gray-600" />
            </router-link>
          </template>

          <font-awesome-icon icon="fa-solid fa-chevron-down" class="fa-lg text-gray-600" />
        </div>
      </template>
    </nav>
  </header>
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
