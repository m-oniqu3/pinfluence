<script setup lang="ts">
import AppModal from '@/components/app/AppModal.vue'
import EditBoard from '@/components/boards/EditBoard.vue'
import { getBoardOwner } from '@/services/boardServices'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  boardID: number
  userID: string
}>()

const {
  data: owner,
  isLoading,
  isError,
  error,
  refetch
} = useQuery({
  queryKey: ['boardOwner', props.boardID, props.userID],
  queryFn: () => fetchBoardOwnerProfile(props.boardID, props.userID),
  retry: false
})

const router = useRouter()
const authStore = useAuthStore()
const user = authStore.user

const isEditBoardModalOpen = ref(false)
const isOwner = computed(() => user?.id === props.userID)

function setEditBoardModal(value: boolean) {
  isEditBoardModalOpen.value = value
}

//check if the board is secret
const isSecret = computed(() => owner?.value?.board.secret && user?.id !== props.userID)

//redirect to home if the board is secret
watch(isSecret, (value) => {
  if (value) {
    console.log('board is secret')
    router.push({ name: 'home', query: { showError: 'true' }, state: { message: "We can't find that board" } })
  }
})

// refetch when the boardID or userID changes
watch([() => props.boardID, () => props.userID], () => {
  refetch()
})

async function fetchBoardOwnerProfile(boardID: number, userID: string) {
  try {
    const response = await getBoardOwner(boardID, userID)
    return response
  } catch (error: any) {
    console.log(error.message)
    throw new Error('Error fetching user profile')
  }
}

function refresh() {
  refetch()
  setEditBoardModal(false)
}
</script>

<template>
  <section>
    <p v-if="isLoading" class="text-center">Loading...</p>

    <p v-else-if="!isLoading && isError" class="text-center text-red-500">{{ error }}</p>

    <article v-else-if="owner" class="flex flex-col justify-center items-center gap-2 p-4 h-full max-w-md mx-auto">
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

      <router-link
        v-if="isOwner"
        :to="{ name: 'organize-board', params: { profile: owner.user.id, boardID: owner.board.id } }"
        class="bg-neutral-200 h-20 w-20 grid place-items-center cursor-pointer rounded-3xl"
      >
        <font-awesome-icon :icon="['fa', 'gears']" class="fa-2xl" />
      </router-link>
    </article>

    <AppModal v-if="owner" @close-modal="isEditBoardModalOpen = false" :open="isEditBoardModalOpen">
      <EditBoard @close-modal="isEditBoardModalOpen = false" :boardId="owner.board.id" @refresh-boards="refresh" />
    </AppModal>
  </section>
</template>
