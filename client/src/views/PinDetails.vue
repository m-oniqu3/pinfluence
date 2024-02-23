<script lang="ts">
import { getPinDetails } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import { isAxiosError } from 'axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinDetails'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import AppMenu from '@/components/app/AppMenu.vue'
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import CommentPanel from '@/components/pins/CommentPanel.vue'
import PinSaveMenu from '@/components/pins/PinSaveMenu.vue'
import { type PinDetails } from '@/types/pin'
import { capitalizeSentence } from '@/utils/capitalize'
import { calculateXPosition, calculateYPosition } from '@/utils/menu'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const pinId = route.params.id as string | undefined

const authStore = useAuthStore()
const pin = ref<PinDetails>()
const currentUser = ref<{ full_name: string; avatar_url: string }>({ full_name: '', avatar_url: '' })

const board = ref('essentials')
const isLoading = ref(false)
const error = ref('')
const isHovering = ref(false)

const showImageLink = computed(() => {
  return isHovering.value && !!pin.value?.link
})

async function fetchPinDetails() {
  if (!pinId) return
  try {
    isLoading.value = true
    const response = await getPinDetails(+pinId)
    pin.value = response
  } catch (err: any) {
    let message = ''
    if (isAxiosError(err)) {
      message = err.response?.data || err.message
    } else {
      message = err.message || 'Something went wrong. Could not get pin details'
    }

    error.value = message
    console.log(message)
  } finally {
    isLoading.value = false
  }
}

async function fetchCurrentUser() {
  try {
    const response = await authStore.getUserProfile()
    console.log(response)
    currentUser.value = {
      full_name: response.full_name,
      avatar_url: response.avatar_url
    }
  } catch (err: any) {
    let message = ''
    if (isAxiosError(err)) {
      message = err.response?.data || err.message
    } else {
      message = err.message || 'Something went wrong. Could not get current user'
    }

    console.log(message)
  }
}

onMounted(() => {
  fetchPinDetails()
  fetchCurrentUser()
})

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

  const shouldOpenModal = window.innerWidth < 768 || window.innerHeight < menuDimensions.value.height + 100

  if (shouldOpenModal) {
    togglePinListModal(true)
  } else {
    openPinList(clientX, clientY)
  }
}
</script>

<template>
  <p class="h-full grid place-items-center" v-if="isLoading">Loading...</p>

  <p v-else-if="error" class="h-full grid place-items-center">{{ error }}</p>

  <p v-else-if="!pin">No pin details found</p>

  <section
    v-else
    class="wrapper rounded-[2rem] border-[1px] border-gray-100 shadow-xl sm:w-2/3 mb-8 lg:grid lg:grid-cols-2 lg:w-10/12 xl:max-w-5xl relative"
  >
    <span
      @click="router.back()"
      class="xs:hidden cursor-pointer rounded-full absolute top-2 -left-20 w-12 h-12 place-items-center hover:bg-neutral-100 sm:grid xl:-left-44"
    >
      <font-awesome-icon :icon="['fas', 'arrow-left']" class="fa-lg" />
    </span>

    <figure class="w-full relative" @mouseover="isHovering = true" @mouseleave="isHovering = false">
      <img
        :src="pin.image"
        :alt="pin.name"
        class="rounded-t-[2rem] w-full lg:rounded-none lg:rounded-l-[2rem] lg:h-full lg:object-cover"
      />

      <figcaption class="absolute bottom-4 left-4" v-show="showImageLink">
        <a
          :href="pin.link"
          target="_blank"
          class="btn bg-white/90 flex gap-2 items-center justify-center hover:bg-gray-200/90"
        >
          <span>
            <font-awesome-icon :icon="['fas', 'arrow-up']" class="fa-xl rotate-45" />
          </span>

          <span class="font-semibold"> View Image </span>
        </a>
      </figcaption>
    </figure>

    <section class="space-y-2 w-full">
      <header
        class="bg-white flex justify-between items-center h-20 px-6 lg:sticky lg:top-20 lg:z-[1] lg:rounded-tr-[2rem]"
      >
        <p>Share</p>

        <div class="flex gap-4 items-center">
          <p class="font-semibold text-base">{{ board }}</p>
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

        <!-- avatar -->
        <div class="flex justify-between items-center" v-if="pin.user">
          <figure class="flex items-center gap-4 py-2">
            <router-link v-if="pin.user.avatar_url" :to="{ name: 'profile', params: { profile: pin.user.id } }">
              <img :src="pin.user.avatar_url" :alt="pin.user.full_name" class="w-12 h-12 object-cover rounded-full" />
            </router-link>

            <p v-else class="w-12 h-12 bg-neutral-200 text-lg rounded-full flex items-center justify-center">
              <span class="font-bold">{{ pin.user.full_name.at(0)!.toUpperCase() }}</span>
            </p>

            <figcaption class="font-medium relative flex flex-col">
              <span class="font-medium"> {{ pin.user.full_name }}</span>
              <span> {{ pin.user.full_name.length }}k followers</span>
            </figcaption>
          </figure>

          <BaseButton class="bg-neutral-100">Follow</BaseButton>
        </div>

        <CommentPanel />
      </article>

      <form
        name="comment-form"
        class="bg-white px-6 border-t-[1px] rounded-b-[2rem] lg:w-full lg:sticky h-44 lg:bottom-0 lg:z-[1]"
      >
        <header class="py-6">
          <h2 class="text-xl font-semibold">1 Comment</h2>
        </header>

        <fieldset class="grid grid-cols-[auto,1fr] gap-4 items-center">
          <figure>
            <img
              v-if="currentUser.avatar_url"
              :src="currentUser.avatar_url"
              :alt="currentUser.full_name"
              class="w-12 h-12 object-cover rounded-full"
            />
            <p v-else class="w-12 h-12 bg-primary text-neutral text-lg rounded-full flex items-center justify-center">
              <span class="font-bold">{{ currentUser.full_name.at(0)?.toUpperCase() }}</span>
            </p>
          </figure>

          <input type="text" placeholder="Add a comment" class="rounded-full bg-neutral-200 w-full py-4 px-6" />
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
