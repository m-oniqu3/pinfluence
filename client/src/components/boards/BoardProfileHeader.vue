<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import type { BoardOwnerProfile } from '@/types/board'
import { computed, defineProps } from 'vue'

const props = defineProps<{
  owner: BoardOwnerProfile
}>()

const authStore = useAuthStore()
const user = authStore.user

const isOwner = computed(() => {
  return user?.id === props.owner.user.id
})
</script>

<template>
  <article class="flex flex-col justify-center items-center gap-2 p-4 h-full max-w-md mx-auto">
    <h1 class="text-center items-center justify-center flex flex-wrap gap-2">
      <span class="text-4xl font-bold text-center">{{ owner.board.name }}</span>

      <span
        v-if="isOwner"
        class="w-8 h-8 bg-neutral-200 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-300 transition-all duration-200 ease-in-out"
      >
        <font-awesome-icon :icon="['fas', 'ellipsis']" class="fa-lg" />
      </span>
    </h1>

    <figure class="h-full flex flex-col justify-center items-center gap-2">
      <img
        v-if="owner.user.avatar_url"
        :src="owner.user.avatar_url"
        alt=""
        class="w-12 h-12 object-cover rounded-full"
      />

      <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-lg text-gray-600" />

      <figcaption class="flex flex-col items-center">
        <p v-if="!isOwner" class="text-lg font-medium">{{ owner.user.full_name }}</p>
        <p class="text-center">{{ owner.board.description }}</p>
      </figcaption>
    </figure>

    <p v-if="owner.board.secret" class="text-black/50">
      <span>
        <font-awesome-icon :icon="['fas', 'lock']" />
      </span>

      <span> Secret Board </span>
    </p>
  </article>
</template>
