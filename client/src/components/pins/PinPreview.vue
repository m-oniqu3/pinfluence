<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PinPreview'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppMenu from '@/components/app/AppMenu.vue'
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import { savePin } from '@/services/pinServices'
import type { BoardInfo } from '@/types/board'
import { type PinPreview } from '@/types/pin'
import { calculateXPosition, calculateYPosition } from '@/utils/menu'
import { isAxiosError } from 'axios'
import { ref } from 'vue'

const props = defineProps<{
  details: PinPreview
}>()

const router = useRouter()
const hovering = ref(false)

const isPinListOpen = ref(false)
const isPinListModalOpen = ref(false)
const isCreatingBoard = ref(false)
const positions = ref({ x: 0, y: 0 })
const menuDimensions = ref({ width: 360, height: 450 })

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
  console.log('Saving pin')
  console.log(board)

  // need board id, pin id
  try {
    const response = await savePin(props.details.id, board.id)
    console.log(response)
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
  <figure
    class="relative break-inside-avoid"
    @mouseover="hovering = true"
    @mouseout="hovering = false"
    :style="{ height: 400 + 'px' }"
  >
    <figcaption
      v-show="hovering"
      class="absolute h-full w-full rounded-2xl z-0 cursor-pointer"
      :class="hovering ? 'bg-black bg-opacity-50' : ''"
      @click="router.push({ name: 'pin-details', params: { id: props.details.id } })"
    >
      <div class="flex justify-between items-center z-[1] p-2 h-16" @click.stop>
        <h1 class="text-white font-bold text-base truncate">Architecture</h1>
        <BaseButton class="bg-primary text-white" @click.stop="handleSavePin">Save</BaseButton>
      </div>
    </figcaption>

    <img
      :src="props.details.image"
      :alt="props.details.name"
      class="rounded-2xl h-full w-full mb-8 object-cover lazyload bg-slate-300"
      @load="loadImage"
    />

    <AppMenu :positions="positions" @close-menu="togglePinList(false)" v-if="isPinListOpen">
      <PinSaveMenu
        @close-modal="togglePinList(false)"
        @create-board="toggleCreateModal(true)"
        @select-board="addPinToBoard"
        :style="{ width: menuDimensions.width + 'px', height: menuDimensions.height + 'px' }"
      />
    </AppMenu>
  </figure>

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
</template>

<style scoped>
.lazyload {
  opacity: 50%;
  transition: opacity 0.3s ease-in-out;
}

.lazyloaded {
  opacity: 1;
}
</style>
