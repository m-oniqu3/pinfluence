<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PreviewGrid'
})
</script>

<script setup lang="ts">
import AppModal from '@/components/app/AppModal.vue'
import EditBoard from '@/components/boards/EditBoard.vue'
import { getSavedPinsForBoard } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import type { Board } from '@/types/board'
import { timeSince } from '@/utils/timeSince'
import { isAxiosError } from 'axios'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  board: Board
}>()

const emit = defineEmits<{ (event: 'refresh-boards'): void }>()

const authStore = useAuthStore()
const router = useRouter()

const user = authStore.user
const isHovering = ref(false)
const isEditBoardModalOpen = ref(false)
const postDate = timeSince(new Date(props.board.created_at))

// will be 3 images
const images = ref<string[]>([])
const pinsPerBoard = ref(0)

const { params } = router.currentRoute.value

async function getImagesFromBoard() {
  try {
    //get id from url

    if (!params.profile) {
      return
    }

    const response = await getSavedPinsForBoard(params.profile as string, props.board.id, 3)

    if (!response) return

    response.pins.forEach((pin) => images.value.push(pin.image))
    pinsPerBoard.value = response.count
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.log(error.response?.data ?? error.message)
    } else {
      console.log('Something went wrong. Please try again.')
    }
  }
}

onMounted(() => {
  getImagesFromBoard()
  console.log(props.board.user_id)
})

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
  <router-link
    :to="{ name: 'board-details', params: { profile: props.board.user_id, board: props.board.id } }"
    class="mx-auto space-y-2"
    id="container"
  >
    <figure class="rounded-2xl bg-white relative" @mouseover="isHovering = true" @mouseleave="isHovering = false">
      <!-- edit -->
      <span
        v-if="showEditButton"
        class="absolute h-8 w-8 rounded-full grid place-items-center bottom-2 right-2 bg-white hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out"
        @click="toggleEditBoardModal"
      >
        <font-awesome-icon :icon="['fas', 'pen']" />
      </span>

      <!-- secret -->
      <span class="absolute h-8 w-8 rounded-full grid place-items-center top-2 left-2 bg-white" v-show="board.secret">
        <font-awesome-icon :icon="['fas', 'lock']" />
      </span>

      <div id="preview-grid-1" class="rounded-tl-2xl rounded-bl-2xl bg-neutral-200">
        <img
          v-if="images[0]"
          :src="images[0]"
          alt=""
          class="rounded-tl-2xl rounded-bl-2xl h-full w-full object-cover"
        />
      </div>

      <div id="preview-grid-2" class="rounded-tr-2xl bg-neutral-200">
        <img v-if="images[1]" :src="images[1]" alt="" class="rounded-tr-2xl h-full w-full object-cover" />
      </div>

      <div id="preview-grid-3" class="rounded-br-2xl bg-neutral-200">
        <img v-if="images[2]" :src="images[2]" alt="" class="rounded-br-2xl h-full w-full object-cover" />
      </div>
    </figure>

    <div class="w-full">
      <h1 class="font-semibold text-lg truncate">{{ props.board.name }}</h1>

      <p class="text-xs text-gray-500 grid grid-cols-[auto,1fr] gap-2 w-full">
        <span class="w-full">{{ pinsPerBoard }} {{ pinsPerBoard === 1 ? 'pin' : 'pins' }} </span>

        <span class="w-full">
          {{ postDate }}
        </span>
      </p>
    </div>
  </router-link>

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
