<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinDetails'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import CreateBoard from '@/components/CreateBoard.vue'
import AppMenu from '@/components/app/AppMenu.vue'
import AppModal from '@/components/app/AppModal.vue'
import CommentPanel from '@/components/pins/CommentPanel.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import { fetchExtraPinDetails, getPinDetails } from '@/services/createPinServices'
import type { Owner } from '@/types/owner'
import { type PinDetails } from '@/types/pin'
import { capitalizeSentence } from '@/utils/capitalize'
import { calculateXPosition, calculateYPosition } from '@/utils/menu'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pinId = route.params.id as string | undefined

const pin: Ref<PinDetails | null> = ref(null)
const owner = ref<Owner | null>(null)
const board = ref('')
const isLoading = ref(false)

onMounted(async () => {
  if (pinId) {
    isLoading.value = true
    const url = import.meta.env.VITE_SUPABASE_STORAGE_URL
    const pinDetails = await getPinDetails(+pinId)

    if (!pinDetails) return

    const { ownerDetails, boardDetails } = await fetchExtraPinDetails(
      pinDetails.user_id,
      pinDetails.board_id
    )

    if (!ownerDetails) return

    const pinUrl = pinDetails.image.startsWith('http')
      ? pinDetails.image
      : `${url}/created-pins/${pinDetails.user_id}/${pinDetails.image}`

    pin.value = { ...pinDetails, image: pinUrl }

    owner.value = {
      ...ownerDetails,
      avatar_url: `${url}/avatars/${ownerDetails.avatar_url}`
    }

    if (boardDetails) board.value = boardDetails.name

    isLoading.value = false
  }
})

const isPinListOpen = ref(false)
const isPinListModalOpen = ref(false)
const isCreatingBoard = ref(false)
const positions = ref({ x: 0, y: 0 })
const menuDimensions = ref({ width: 360, height: 500 })

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

// open pin list and position it
const openPinList = (clientX: number, clientY: number) => {
  togglePinList(true)

  const xPos = calculateXPosition(clientX, menuDimensions.value.width)
  const yPos = calculateYPosition(clientY, menuDimensions.value.height)

  positions.value = { x: xPos, y: yPos }
}

// toggle either the modal or the menu
const handleSavePin = (event: MouseEvent) => {
  const { clientX, clientY } = event

  const shouldOpenModal =
    window.innerWidth < 768 || window.innerHeight < menuDimensions.value.height + 100

  if (shouldOpenModal) {
    togglePinListModal(true)
  } else {
    openPinList(clientX, clientY)
  }
}
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <p v-else-if="!pin || !owner">No pin details found</p>

  <section
    v-else
    class="wrapper rounded-[2rem] border-[1px] border-gray-100 shadow-xl sm:w-2/3 mb-8 lg:grid lg:grid-cols-2 lg:w-10/12 xl:max-w-5xl relative"
  >
    <figure class="w-full">
      <img
        :src="pin.image"
        :alt="pin.name"
        class="rounded-t-[2rem] w-full lg:rounded-t-none lg:rounded-l-[2rem] lg:h-full lg:object-cover"
      />
    </figure>

    <section class="space-y-2 w-full">
      <header
        class="bg-white flex justify-between items-center h-20 px-6 lg:sticky lg:top-20 lg:z-[1] lg:rounded-tr-[2rem]"
      >
        <p>Share</p>

        <div class="flex gap-4 items-center">
          <p>{{ board }}</p>
          <BaseButton class="bg-primary text-neutral" @click="handleSavePin">Save</BaseButton>
        </div>
      </header>

      <article class="px-6 py-8 space-y-2 overflow-scroll h-[700px]">
        <router-link v-if="pin.link" :to="pin.link" class="underline">
          {{ pin.link.split('/')[2] }}
        </router-link>

        <h1 v-if="pin.name" class="text-3xl font-semibold py-2">
          {{ capitalizeSentence(pin.name) }}
        </h1>

        <p v-if="pin.description" class="text-gray-500 py-2">
          {{ capitalizeSentence(pin.description) }}
        </p>

        <div class="flex justify-between items-center">
          <figure class="flex items-center gap-4 py-2">
            <img
              :src="owner.avatar_url"
              :alt="pin.name"
              class="w-12 h-12 object-cover rounded-full"
            />
            <figcaption class="font-medium">{{ owner.full_name }}</figcaption>
          </figure>

          <BaseButton class="bg-neutral-100">Follow</BaseButton>
        </div>
        <CommentPanel />
      </article>

      <form
        name="comment-form"
        class="bg-white px-6 border-t-[1px] lg:w-full lg:rounded-b-[2rem] lg:sticky h-44 lg:bottom-0 lg:z-[1]"
      >
        <header class="py-6">
          <h2 class="text-xl font-semibold">1 Comment</h2>
        </header>

        <fieldset class="grid grid-cols-[auto,1fr] gap-4 items-center">
          <figure>
            <img
              :src="owner.avatar_url"
              :alt="pin.name"
              class="w-12 h-12 object-cover rounded-full"
            />
          </figure>

          <input
            type="text"
            placeholder="Add a comment"
            class="rounded-full bg-neutral-200 w-full py-4 px-6"
          />
        </fieldset>
      </form>
    </section>
  </section>

  <AppMenu :positions="positions" @close-menu="togglePinList(false)" v-if="isPinListOpen">
    <PinSaveMenu
      @close-modal="togglePinListModal(false)"
      @create-board="toggleCreateModal(true)"
      :style="{ width: menuDimensions.width + 'px', height: menuDimensions.height + 'px' }"
    />
  </AppMenu>

  <AppModal @close-modal="togglePinListModal(false)" :open="isPinListModalOpen">
    <PinSaveMenu @close-modal="togglePinListModal(false)" @create-board="toggleCreateModal(true)" />
  </AppModal>

  <AppModal :open="isCreatingBoard" @close-modal="toggleCreateModal(false)">
    <CreateBoard @close-modal="toggleCreateModal(false)" />
  </AppModal>
</template>
