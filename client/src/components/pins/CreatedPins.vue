<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CreatedPins'
})
</script>

<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreviewVue from '@/components/pins/PinPreview.vue'
import { getUserCreatedPins } from '@/services/pinServices'
import type { PinPreview } from '@/types/pin'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'

const router = useRouter()
const isLoadingInitial = ref(false)
const isLoadingMore = ref(false)

const pins = ref<PinPreview[]>([])

const range = 9

async function fetchInitialPins() {
  try {
    isLoadingInitial.value = true

    const { params } = router.currentRoute.value

    if (!params.profile) {
      return
    }

    const response = await getUserCreatedPins(params.profile as string, [0, 9])
    pins.value = response
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

async function fetchMorePins() {
  try {
    isLoadingMore.value = true
    const { params } = router.currentRoute.value

    if (!params.profile) {
      return
    }

    const id = params.profile as string
    const min = pins.value.length
    const max = pins.value.length + range

    const response = await getUserCreatedPins(id, [min, max])
    pins.value = pins.value.concat(response)
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

onMounted(() => {
  fetchInitialPins()
})

// watch for changes in the route
router.afterEach(fetchInitialPins)
</script>

<template>
  <p v-if="isLoadingInitial" class="text-center w-full">Loading...</p>

  <InfiniteScroll
    v-else-if="pins.length > 0"
    :is-loading-intial="isLoadingInitial"
    :is-loading-more="isLoadingMore"
    @load-more="fetchMorePins"
  >
    <PinGrid class="wrapper">
      <PinPreviewVue
        v-for="pin in pins"
        :key="pin.id"
        :details="{
          id: pin.id,
          image: pin.image,
          name: pin.name
        }"
      />
    </PinGrid>
  </InfiniteScroll>

  <p v-else>No pins found</p>
</template>
