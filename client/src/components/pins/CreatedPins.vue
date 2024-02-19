<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CreatedPins'
})
</script>

<script setup lang="ts">
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreviewVue from '@/components/pins/PinPreview.vue'
import { getUserCreatedPins } from '@/services/pinServices'
import type { PinPreview } from '@/types/pin'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'

const router = useRouter()
const isLoading = ref(false)

const pins = ref<PinPreview[]>([])

async function fetchPins() {
  try {
    isLoading.value = true

    const { params } = router.currentRoute.value

    if (!params.profile) {
      return
    }

    const response = await getUserCreatedPins(params.profile as string)
    pins.value = response
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
  fetchPins()
})

// watch for changes in the route
router.afterEach(fetchPins)
</script>

<template>
  <p v-if="!pins">No pins found</p>

  <PinGrid v-else class="wrapper pt-8 pb-12">
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
</template>
