<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PinPreview'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppModal from '@/components/app/AppModal.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import PinSaveModal from '@/components/pins/PinSaveModal.vue'
import { type PinPreview } from '@/types/pin'
import { defineProps, ref } from 'vue'

const props = defineProps<{
  details: PinPreview
}>()

const router = useRouter()
const hovering = ref(false)

const isPinListOpen = ref(false)
const isPinListModalOpen = ref(false)
const positions = ref({ x: 0, y: 0 })
const menuDimensions = ref({ width: 360, height: 500 })

const togglePinList = (val: boolean) => {
  isPinListOpen.value = val
}

const togglePinListModal = (val: boolean) => {
  isPinListModalOpen.value = val
}

function loadImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.classList.add('lazyloaded')
}

function savePin(event: Event) {
  //use the event and width of the pin to position the menu
  const { clientX, clientY } = event as MouseEvent

  // if the menu is going to be off the screen, move it to the left
  const noAvailableWidth = clientX + menuDimensions.value.width > window.innerWidth
  const noAvailableHeight = window.innerHeight < menuDimensions.value.height + 100

  //if window is too small, open modal
  if (window.innerWidth < 768 || noAvailableHeight) {
    togglePinListModal(true)
    return
  }

  togglePinList(true)

  const xPos = noAvailableWidth
    ? window.innerWidth - menuDimensions.value.width
    : clientX + menuDimensions.value.width

  const yPos =
    clientY - 100 + menuDimensions.value.height >= window.innerHeight
      ? window.innerHeight - menuDimensions.value.height - 100
      : clientY - 100

  positions.value = { x: xPos, y: yPos }
}
</script>

<template>
  <figure
    class="relative break-inside-avoid"
    @mouseover="hovering = true"
    @mouseout="hovering = false"
  >
    <figcaption
      v-show="hovering"
      class="absolute h-full w-full rounded-2xl z-0 cursor-pointer"
      :class="hovering ? 'bg-black bg-opacity-50' : ''"
      @click="router.push({ name: 'pin-details', params: { id: props.details.id } })"
    >
      <div class="flex justify-between items-center z-[1] p-4 h-20" @click.stop>
        <h1 class="text-white font-bold text-base truncate">Architecture</h1>
        <BaseButton class="bg-primary text-white self-start" @click.stop="savePin($event)"
          >Save</BaseButton
        >
      </div>
    </figcaption>

    <img
      :src="props.details.image"
      :alt="props.details.name"
      class="rounded-2xl h-full w-full mb-8 object-cover lazyload bg-slate-300"
      @load="loadImage"
    />
  </figure>

  <PinSaveMenu
    v-if="isPinListOpen"
    :positions="positions"
    :isMenuOpen="isPinListOpen"
    :menuDimensions="menuDimensions"
    @close-menu="togglePinList(false)"
  />

  <AppModal @close-modal="togglePinListModal(false)" :open="isPinListModalOpen">
    <PinSaveModal @close-modal="togglePinListModal(false)" />
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
