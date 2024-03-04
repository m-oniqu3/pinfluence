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
import DeletePin from '@/components/pins/DeletePin.vue'
import EditPinDetails from '@/components/pins/EditPinDetails.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import { savePin } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import type { BoardInfo } from '@/types/board'
import { type PinPreview, type PinPreviewSaved } from '@/types/pin'
import { calculateXPosition, calculateYPosition } from '@/utils/menu'
import { isAxiosError } from 'axios'
import { computed, ref } from 'vue'

const props = defineProps<{
  details: PinPreview | PinPreviewSaved
  allowEdit?: boolean
}>()

const emit = defineEmits<{ (event: 'refresh-boards'): void }>()

const authStore = useAuthStore()
const router = useRouter()
const hovering = ref(false)

const isPinListOpen = ref(false)
const isPinListModalOpen = ref(false)
const isEditingPin = ref(false)
const isDeletingPin = ref(false)
const isCreatingBoard = ref(false)
const positions = ref({ x: 0, y: 0 })
const menuDimensions = ref({ width: 360, height: 450 })

const isBoardOwner = computed(() => {
  //get userID from url
  const currentUserBoard = router.currentRoute.value.params.profile

  return authStore.user?.id === currentUserBoard
})

/**
 * @param details - the details prop
 * @returns true if the details is a regular pin
 * @description checks if the details is a regular pin - has an image and a name
 */
function isRegularPin(details: PinPreview | PinPreviewSaved): details is PinPreview {
  return (details as PinPreview).image !== undefined && (details as PinPreview).name !== undefined
}

/**
 * @param details - the details prop
 * @returns true if the details is a saved pin
 * @description checks if the details is a saved pin - has an id and a pin object (with an id)
 */
function isSavedPin(details: PinPreview | PinPreviewSaved): details is PinPreviewSaved {
  return (details as PinPreviewSaved).id !== undefined && (details as PinPreviewSaved).pin !== undefined
}

// variables with inferred types based on type guards
const regularPinDetails = isRegularPin(props.details) ? props.details : null
const savedPinDetails = isSavedPin(props.details) ? props.details : null

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

function toggleDeleteModal(val: boolean) {
  isDeletingPin.value = val
}

function toggleEditPinModal(val: boolean) {
  isEditingPin.value = val
}

function deleteCreatedPin() {
  toggleEditPinModal(false)
  toggleDeleteModal(true)
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

async function addPinToBoard(board: BoardInfo, pinID: number) {
  try {
    if (!authStore.isAuth) return
    if (!board.id || !pinID) return

    const response = await savePin(pinID, board.id)
    console.log(response)

    emit('refresh-boards')
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
    <!-- NOT BOARD VIEW -->
    <template v-if="isRegularPin(details) && regularPinDetails">
      <figure
        class="relative rounded-2xl bg-slate-300 cursor-pointer"
        @mouseover="hovering = true"
        @mouseout="hovering = false"
        @click="router.push({ name: 'pin-details', params: { id: regularPinDetails.id } })"
      >
        <figcaption
          v-show="hovering && authStore.isAuth"
          class="absolute h-full w-full rounded-2xl z-0 cursor-pointer"
          :class="hovering ? 'bg-black bg-opacity-50' : ''"
          @click="router.push({ name: 'pin-details', params: { id: regularPinDetails.id } })"
        >
          <!-- save button -->
          <div class="flex justify-between items-center z-[1] p-2 h-16" @click.stop>
            <h1 class="text-white font-bold text-base truncate">Architecture</h1>
            <BaseButton class="bg-primary text-white" @click.stop="handleSavePin">Save</BaseButton>
          </div>

          <!-- edit -->
          <div
            v-if="allowEdit && authStore.isAuth && isBoardOwner"
            class="absolute h-10 w-10 rounded-full grid place-items-center bottom-2 right-2 bg-white hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out z-10"
            @click.stop="toggleEditPinModal(true)"
          >
            <font-awesome-icon :icon="['fas', 'pen']" />
          </div>
        </figcaption>

        <img
          :src="regularPinDetails.image"
          :alt="regularPinDetails.name"
          class="rounded-2xl h-full w-full object-cover lazyload"
          @load="loadImage"
        />
      </figure>

      <AppMenu :positions="positions" @close-menu="togglePinList(false)" v-if="isPinListOpen">
        <PinSaveMenu
          @close-modal="togglePinList(false)"
          @create-board="toggleCreateModal(true)"
          @select-board="addPinToBoard.call(null, $event, regularPinDetails.id)"
          :style="{ width: menuDimensions.width + 'px', height: menuDimensions.height + 'px' }"
        />
      </AppMenu>

      <AppModal @close-modal="togglePinListModal(false)" :open="isPinListModalOpen">
        <PinSaveMenu
          @close-modal="togglePinListModal(false)"
          @create-board="toggleCreateModal(true)"
          @select-board="addPinToBoard.call(null, $event, regularPinDetails.id)"
        />
      </AppModal>

      <AppModal :open="isEditingPin" @close-modal="toggleEditPinModal(false)">
        <EditPinDetails
          :pinID="regularPinDetails.id"
          @close-modal="toggleEditPinModal(false)"
          @delete-pin="deleteCreatedPin"
        />
      </AppModal>

      <AppModal :open="isDeletingPin" @close-modal="toggleDeleteModal(false)">
        <DeletePin
          :pin="{ pinID: regularPinDetails.id, image: regularPinDetails.image }"
          :type="'created'"
          @refresh-board="emit('refresh-boards')"
          @close-modal="toggleDeleteModal(false)"
        />
      </AppModal>
    </template>

    <!-- BOARD VIEW -->
    <template v-else-if="isSavedPin(details) && savedPinDetails">
      <figure
        class="relative rounded-2xl bg-slate-300 cursor-pointer"
        @mouseover="hovering = true"
        @mouseout="hovering = false"
        @click="router.push({ name: 'pin-details', params: { id: savedPinDetails.pin.id } })"
      >
        <figcaption
          v-show="hovering && authStore.isAuth"
          class="absolute h-full w-full rounded-2xl z-0 cursor-pointer"
          :class="hovering ? 'bg-black bg-opacity-50' : ''"
          @click="router.push({ name: 'pin-details', params: { id: savedPinDetails.pin.id } })"
        >
          <!-- save button -->
          <div class="flex justify-between items-center z-[1] p-2 h-16" @click.stop>
            <h1 class="text-white font-bold text-base truncate">Architecture</h1>
            <BaseButton class="bg-primary text-white" @click.stop="handleSavePin">Save</BaseButton>
          </div>
        </figcaption>

        <img
          :src="savedPinDetails.pin.image"
          :alt="savedPinDetails.pin.name"
          class="rounded-2xl h-full w-full object-cover lazyload"
          @load="loadImage"
        />

        <!-- delete -->
        <div
          v-if="hovering && isBoardOwner"
          @click.stop.prevent="toggleDeleteModal(true)"
          class="w-10 h-10 rounded-full bg-white grid place-items-center absolute bottom-2 right-2 z-10"
        >
          <font-awesome-icon :icon="['fas', 'trash']" class="text-gray-800 fa-md" />
        </div>
      </figure>

      <AppMenu :positions="positions" @close-menu="togglePinList(false)" v-if="isPinListOpen">
        <PinSaveMenu
          @close-modal="togglePinList(false)"
          @create-board="toggleCreateModal(true)"
          @select-board="addPinToBoard.call(null, $event, savedPinDetails.pin.id)"
          :style="{ width: menuDimensions.width + 'px', height: menuDimensions.height + 'px' }"
        />
      </AppMenu>

      <AppModal @close-modal="togglePinListModal(false)" :open="isPinListModalOpen">
        <PinSaveMenu
          @close-modal="togglePinListModal(false)"
          @create-board="toggleCreateModal(true)"
          @select-board="addPinToBoard.call(null, $event, savedPinDetails.pin.id)"
        />
      </AppModal>

      <AppModal :open="isDeletingPin" @close-modal="toggleDeleteModal(false)">
        <DeletePin
          :pin="{ pinID: savedPinDetails.pin.id, image: savedPinDetails.pin.image }"
          :type="'saved'"
          @refresh-board="emit('refresh-boards')"
          @close-modal="toggleDeleteModal(false)"
        />
      </AppModal>
    </template>

    <AppModal :open="isCreatingBoard" @close-modal="toggleCreateModal(false)">
      <CreateBoard @close-modal="toggleCreateModal(false)" />
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
