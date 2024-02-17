<script lang="ts">
import { defineComponent } from 'vue'

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

const isLoading = ref(false)
const pins = ref<PinPreview[]>([])

async function fetchPins() {
  try {
    isLoading.value = true

    const response = await getUserCreatedPins()
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
