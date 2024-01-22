<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PinPreview'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import { type PinPreview } from '@/types/pin'
import { defineProps, ref } from 'vue'

const props = defineProps<{
  details: PinPreview
}>()

const router = useRouter()
const hovering = ref(false)

const isPinListOpen = ref(false)
const positions = ref({ x: 0, y: 0 })
const menuDimensions = ref({ width: 0, height: 0 })

function setMenuDemensions(dimensions: { width: number; height: number }) {
  menuDimensions.value = dimensions
}

const togglePinList = (val: boolean) => {
  isPinListOpen.value = val
}

function loadImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.classList.add('lazyloaded')
}

function savePin(event: Event) {
  event.stopPropagation()
  console.log('saving pin')
  togglePinList(true)

  //use the event and width of the pin to position the menu
  const { clientX, clientY } = event as MouseEvent

  const xPos = clientX + 360 > window.innerWidth ? window.innerWidth - 360 : clientX + 360

  const yPos =
    clientY - 100 + 500 > window.innerHeight ? window.innerHeight - 500 - 100 : clientY - 100
  positions.value = {
    x: xPos + 40,
    y: yPos
  }
}
</script>

<template>
  <figure
    class="relative break-inside-avoid"
    :style="{ minHeight: '300px' }"
    @mouseover="hovering = true"
    @mouseout="hovering = false"
  >
    <figcaption
      v-show="hovering"
      class="absolute h-full w-full rounded-2xl z-0"
      :class="hovering ? 'bg-black bg-opacity-50' : ''"
      @click="router.push({ name: 'pin-details', params: { id: props.details.id } })"
    >
      <div class="flex justify-between items-center z-[1] p-4 bg-orange-500 h-20" @click.stop>
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
    <!-- </router-link> -->
    <PinSaveMenu
      v-if="isPinListOpen"
      :positions="positions"
      :isMenuOpen="isPinListOpen"
      @close-menu="togglePinList(false)"
      @set-menu-dimensions="setMenuDemensions"
    />
  </figure>
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
