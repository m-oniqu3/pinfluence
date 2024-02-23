<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import BoardProfileHeader from '@/components/boards/BoardProfileHeader.vue'
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreview from '@/components/pins/PinPreview.vue'
import { getBoardOwner } from '@/services/boardServices'
import { getSavedPinsForBoard } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import type { BoardOwnerProfile } from '@/types/board'
import { type SavedPinPreview } from '@/types/pin'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { params } = router.currentRoute.value
const { profile, boardID } = params as { profile: string; boardID: string }

const authStore = useAuthStore()
const pins = ref<SavedPinPreview>({ pins: [], count: 0 })
const owner = ref<BoardOwnerProfile | null>(null)
const isLoadingInitial = ref(false)
const isLoadingMore = ref(false)
const isLoading = ref(false)
const range = 9

async function fetchInitialPinsForCurrentBoard(userID: string, boardID: number, range: number) {
  try {
    isLoadingInitial.value = true
    const response = await getSavedPinsForBoard(userID, boardID, [0, range])

    return response
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  } finally {
    isLoadingInitial.value = false
  }
}

async function fetchMorePinsForCurrentBoard(userID: string, boardID: number, range: number) {
  try {
    isLoadingMore.value = true
    console.log('fetching more pins')

    const min = pins.value.pins.length
    const max = min + range
    const response = await getSavedPinsForBoard(userID, boardID, [min, max])

    if (!response) return

    pins.value.pins.push(...response.pins)
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  } finally {
    isLoadingMore.value = false
  }
}

async function fetchBoardOwnerProfile(boardID: number, userID: string) {
  try {
    const response = await getBoardOwner(boardID, userID)
    return response
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  }
}

async function getBoardOwnerAndPins() {
  try {
    isLoading.value = true

    if (!profile || !boardID) {
      // show toast notification
      console.error('Profile or board ID not found')

      router.push({ name: 'home' })
    }
    const [boardOwner, savedPins] = await Promise.all([
      fetchBoardOwnerProfile(+boardID, profile),
      fetchInitialPinsForCurrentBoard(profile, +boardID, range)
    ])

    if (!boardOwner || !savedPins) {
      // show toast notification
      console.error('Profile or board ID not found')

      return router.push({ name: 'home' })
    }

    //check if board is private
    if (boardOwner.board.secret && boardOwner.user.id !== authStore.user?.id) {
      // show toast notification to say could not get the board
      console.error('Board is private')

      router.push({ name: 'home' })
    }

    owner.value = boardOwner
    pins.value = savedPins
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  getBoardOwnerAndPins()
})
</script>

<template>
  <div>
    <p v-if="isLoading" class="text-center">Loading...</p>

    <section v-else>
      <BoardProfileHeader v-if="owner" :owner="owner" />

      <h1 v-if="authStore.user?.id === owner?.user.id" class="text-2xl font-bold text-center">
        {{ pins.count }} {{ pins.count === 1 ? 'Pin' : 'Pins' }}
      </h1>

      <InfiniteScroll
        v-if="pins.count > 0"
        :isLoadingIntial="isLoadingInitial"
        :isLoadingMore="isLoadingMore"
        @load-more="fetchMorePinsForCurrentBoard(profile, +boardID, range)"
      >
        <PinGrid class="wrapper py-12">
          <PinPreview
            v-for="pin in pins.pins"
            :key="pin.id"
            :pin="pin"
            :details="pin"
            @refresh-boards="getBoardOwnerAndPins"
          />
        </PinGrid>
      </InfiniteScroll>

      <p v-else class="text-center">No pins saved to this board</p>
    </section>
  </div>
</template>

<style scoped></style>
