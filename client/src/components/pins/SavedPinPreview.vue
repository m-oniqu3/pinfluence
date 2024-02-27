<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppMenu from '@/components/app/AppMenu.vue'
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import DeletePin from '@/components/pins/DeletePin.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import { savePin } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import type { BoardInfo } from '@/types/board'
import { type PinPreview } from '@/types/pin'
import { calculateXPosition, calculateYPosition } from '@/utils/menu'
import { isAxiosError } from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  savedPinID: number
  pin: PinPreview
}>()

const emit = defineEmits<{ (event: 'refresh-board'): void }>()

const authStore = useAuthStore()
const router = useRouter()
const hovering = ref(false)

const isPinListOpen = ref(false)
const isPinListModalOpen = ref(false)
const isCreatingBoard = ref(false)
const isDeletingPin = ref(false)
const positions = ref({ x: 0, y: 0 })
const menuDimensions = ref({ width: 360, height: 450 })

const isBoardOwner = computed(() => {
  //get userID from url
  const currentUserBoard = router.currentRoute.value.params.profile

  return authStore.user?.id === currentUserBoard
})

const toggleDeleteModal = (val: boolean) => {
  isDeletingPin.value = val
}

const togglePinList = (val: boolean) => {
  isPinListOpen.value = val
}

const togglePinListModal = (val: boolean) => {
  isPinListModalOpen.value = val
}

function toggleCreateModal(val: boolean) {
  if (isPinListOpen.value) togglePinList(false)
  if (isPinListModalOpen.value) togglePinListModal(false)
  isCreatingBoard.value = val
}

function loadImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.classList.add('lazyloaded')
}

// open pin list and position it
function openPinList(clientX: number, clientY: number) {
  togglePinList(true)

  const xPos = calculateXPosition(clientX, menuDimensions.value.width)
  const yPos = calculateYPosition(clientY, menuDimensions.value.height)

  positions.value = { x: xPos, y: yPos }
}

// toggle either the modal or the menu
function handleSavePin(event: MouseEvent) {
  const { clientX, clientY } = event

  const shouldOpenModal = window.innerWidth < 768 || window.innerHeight < menuDimensions.value.height + 100

  if (shouldOpenModal && !isPinListModalOpen.value) {
    togglePinListModal(true)
  } else {
    openPinList(clientX, clientY)
  }
}

async function addPinToBoard(board: BoardInfo) {
  try {
    const response = await savePin(props.pin.id, board.id)
    console.log(response)

    emit('refresh-board')
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.log(error.response?.data)
    } else {
      console.log(error.message)
    }
  }
}
</script>

<template>
  <div>
    <figure
      class="relative rounded-2xl bg-slate-300 cursor-pointer"
      @mouseover="hovering = true"
      @mouseout="hovering = false"
      @click="router.push({ name: 'pin-details', params: { id: pin.id } })"
    >
      <figcaption
        v-show="hovering && authStore.isAuth"
        class="absolute h-full w-full rounded-2xl z-0 cursor-pointer"
        :class="hovering ? 'bg-pink bg-opacity-50' : ''"
        @click="router.push({ name: 'pin-details', params: { id: pin.id } })"
      >
        <div class="flex justify-between items-center z-[1] p-2 h-16" @click.stop>
          <h1 class="text-white font-bold text-base truncate">Architecture</h1>
          <BaseButton class="bg-primary text-white" @click.stop="handleSavePin">Save</BaseButton>
        </div>

        <!-- delete icon -->
        <div
          v-if="hovering && isBoardOwner"
          @click.stop.prevent="toggleDeleteModal(true)"
          class="w-10 h-10 rounded-full bg-white grid place-items-center absolute bottom-2 right-2 z-10"
        >
          <font-awesome-icon :icon="['fas', 'trash']" class="text-gray-800 fa-md" />
        </div>
      </figcaption>

      <img :src="pin.image" :alt="pin.name" class="rounded-2xl h-full w-full object-cover lazyload" @load="loadImage" />
    </figure>

    <AppMenu :positions="positions" @close-menu="togglePinList(false)" v-if="isPinListOpen">
      <PinSaveMenu
        @close-modal="togglePinList(false)"
        @create-board="toggleCreateModal(true)"
        @select-board="addPinToBoard"
        :style="{ width: menuDimensions.width + 'px', height: menuDimensions.height + 'px' }"
      />
    </AppMenu>

    <AppModal @close-modal="togglePinListModal(false)" :open="isPinListModalOpen">
      <PinSaveMenu
        @close-modal="togglePinListModal(false)"
        @create-board="toggleCreateModal(true)"
        @select-board="addPinToBoard"
      />
    </AppModal>

    <AppModal :open="isCreatingBoard" @close-modal="toggleCreateModal(false)">
      <CreateBoard @close-modal="toggleCreateModal(false)" />
    </AppModal>

    <AppModal :open="isDeletingPin" @close-modal="toggleDeleteModal(false)">
      <DeletePin
        :savedPinID="props.savedPinID"
        :image="pin.image"
        @refresh-board="emit('refresh-board')"
        @close-modal="toggleDeleteModal(false)"
      />
    </AppModal>
  </div>
</template>

<style scoped>
figure {
  min-height: 300px;
  height: 400px;
}

img {
  min-height: 300px;
}
.lazyload {
  opacity: 50%;
  transition: opacity 0.3s ease-in-out;
}

.lazyloaded {
  opacity: 1;
}
</style>
