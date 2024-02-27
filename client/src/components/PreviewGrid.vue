<script setup lang="ts">
import AppModal from '@/components/app/AppModal.vue'
import EditBoard from '@/components/boards/EditBoard.vue'
import { getSavedPinsPreview } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import type { Board } from '@/types/board'
import { timeSince } from '@/utils/timeSince'
import { useQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ board: Board }>()
const emit = defineEmits<{ (event: 'refresh-boards'): void }>()

const authStore = useAuthStore()
const user = authStore.user

const router = useRouter()
const { params } = router.currentRoute.value
const profile = params.profile as string

const isHovering = ref(false)
const isEditBoardModalOpen = ref(false)
const postDate = timeSince(new Date(props.board.created_at))

const { data } = useQuery({
  queryKey: ['savedPinsPreview', profile, props.board.id],
  queryFn: () => getImagesFromBoard(profile, props.board.id),
  retry: false
})

async function getImagesFromBoard(profileID: string, boardID: number) {
  try {
    const response = await getSavedPinsPreview(profileID, boardID, 3)
    return response
  } catch (error: any) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data || error.message
    } else {
      message = error.message
    }

    throw new Error(message)
  }
}

const toggleEditBoardModal = () => {
  isEditBoardModalOpen.value = !isEditBoardModalOpen.value
  console.log(isEditBoardModalOpen.value)
}

function updateBoards() {
  emit('refresh-boards')
  isEditBoardModalOpen.value = false
}

// show edit button if user is hovering and owns the board
const showEditButton = computed(() => {
  return isHovering.value && user?.id === props.board.user_id
})
</script>

<template>
  <div
    @click="router.push({ name: 'board-details', params: { profile: props.board.user_id, boardID: props.board.id } })"
    class="mx-auto space-y-2 cursor-pointer"
    id="container"
  >
    <figure class="rounded-2xl bg-white relative z-0" @mouseover="isHovering = true" @mouseleave="isHovering = false">
      <!-- edit -->
      <span
        v-if="showEditButton"
        class="absolute h-8 w-8 rounded-full grid place-items-center bottom-2 right-2 bg-white hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out z-[1]"
        @click.stop="toggleEditBoardModal"
      >
        <font-awesome-icon :icon="['fas', 'pen']" />
      </span>

      <!-- secret -->
      <span class="absolute h-8 w-8 rounded-full grid place-items-center top-2 left-2 bg-white" v-show="board.secret">
        <font-awesome-icon :icon="['fas', 'lock']" />
      </span>

      <div id="preview-grid-1" class="rounded-tl-2xl rounded-bl-2xl bg-neutral-200">
        <img
          v-if="data?.pins[0]"
          :src="data?.pins[0].image"
          alt=""
          class="rounded-tl-2xl rounded-bl-2xl h-full w-full object-cover"
        />
      </div>

      <div id="preview-grid-2" class="rounded-tr-2xl bg-neutral-200">
        <img v-if="data?.pins[1]" :src="data?.pins[1].image" alt="" class="rounded-tr-2xl h-full w-full object-cover" />
      </div>

      <div id="preview-grid-3" class="rounded-br-2xl bg-neutral-200">
        <img v-if="data?.pins[2]" :src="data?.pins[2].image" alt="" class="rounded-br-2xl h-full w-full object-cover" />
      </div>
    </figure>

    <div class="w-full">
      <h1 class="font-semibold text-lg truncate">{{ props.board.name }}</h1>

      <p class="text-xs text-gray-500 grid grid-cols-[auto,1fr] gap-2 w-full">
        <span class="w-full">{{ data?.count }} {{ data?.count === 1 ? 'pin' : 'pins' }} </span>

        <span class="w-full">
          {{ postDate }}
        </span>
      </p>
    </div>
  </div>

  <AppModal @close-modal="isEditBoardModalOpen = false" :open="isEditBoardModalOpen">
    <EditBoard @close-modal="isEditBoardModalOpen = false" :boardId="board.id" @refresh-boards="updateBoards" />
  </AppModal>
</template>

<style scoped>
#container {
  width: 14.75rem;
}

figure {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1px;
  width: 14.75rem;
  height: 9.8rem;
}

#preview-grid-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  height: 9.8rem;
}

#preview-grid-2 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  height: calc(9.8rem / 2 - 0.5px);
}

#preview-grid-3 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  height: calc(9.8rem / 2 - 0.5px);
}
</style>
