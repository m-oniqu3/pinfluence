<script setup lang="ts">
import AppModal from '@/components/app/AppModal.vue'
import EditBoard from '@/components/boards/EditBoard.vue'
import { useAuthStore } from '@/stores/auth'
import type { BoardOwnerProfile } from '@/types/board'
import { computed, ref } from 'vue'

const props = defineProps<{
  owner: BoardOwnerProfile
}>()

const emit = defineEmits<{ (event: 'refresh-boards'): void }>()

const authStore = useAuthStore()
const user = authStore.user

const isOwner = computed(() => {
  return user?.id === props.owner.user.id
})

const isEditBoardModalOpen = ref(false)

function setEditBoardModal(value: boolean) {
  isEditBoardModalOpen.value = value
}

function updateBoards() {
  emit('refresh-boards')
}
</script>

<template>
  <article class="flex flex-col justify-center items-center gap-2 p-4 h-full max-w-md mx-auto">
    <h1 class="text-center items-center justify-center flex flex-wrap gap-2">
      <span class="text-4xl font-bold text-center">{{ owner.board.name }}</span>

      <span
        v-if="isOwner"
        @click="setEditBoardModal(true)"
        class="w-8 h-8 bg-neutral-200 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-300 transition-all duration-200 ease-in-out"
      >
        <font-awesome-icon :icon="['fas', 'ellipsis']" class="fa-lg" />
      </span>
    </h1>

    <router-link :to="{ name: 'profile', params: { profile: owner.user.id } }">
      <figure class="h-full cursor-pointer flex flex-col justify-center items-center gap-2">
        <img
          v-if="owner.user.avatar_url"
          :src="owner.user.avatar_url"
          alt=""
          class="w-12 h-12 object-cover rounded-full"
        />

        <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-lg text-gray-600" />

        <figcaption v-if="!isOwner" class="text-lg text-center font-medium">{{ owner.user.full_name }}</figcaption>
      </figure>
    </router-link>
    <p class="text-center">{{ owner.board.description }}</p>
    <p v-if="owner.board.secret" class="text-black/50">
      <span>
        <font-awesome-icon :icon="['fas', 'lock']" />
      </span>

      <span> Secret Board </span>
    </p>
  </article>

  <AppModal @close-modal="isEditBoardModalOpen = false" :open="isEditBoardModalOpen">
    <EditBoard @close-modal="isEditBoardModalOpen = false" :boardId="owner.board.id" @refresh-boards="updateBoards" />
  </AppModal>
</template>
