<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreatedPins'
})
</script>

<script setup lang="ts">
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreview from '@/components/pins/PinPreview.vue'
import { useCreatedPinsStore } from '@/stores/createdPins'
import { onMounted } from 'vue'

const createdPinsStore = useCreatedPinsStore()

onMounted(async () => {
  if (!createdPinsStore.createdPins) {
    await createdPinsStore.getCreatedPins()
  }
})
</script>

<template>
  <p v-if="createdPinsStore.isLoading">Loading...</p>

  <p v-else-if="!createdPinsStore.createdPins">No pins found</p>

  <PinGrid v-else class="wrapper pt-8 pb-12">
    <PinPreview
      v-for="pin in createdPinsStore.createdPins"
      :key="pin.id"
      :details="{
        id: +pin.id,
        url: pin.image_url,
        title: pin.title,
        board_id: pin.board_id
      }"
    />
  </PinGrid>
</template>
