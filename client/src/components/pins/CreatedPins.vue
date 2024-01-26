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

const createdPinsStore = useCreatedPinsStore()

if (!createdPinsStore.createdPins) {
  await createdPinsStore.getCreatedPins()
}
</script>

<template>
  <p v-if="!createdPinsStore.createdPins">No pins found</p>

  <PinGrid v-else class="wrapper pt-8 pb-12">
    <PinPreview
      v-for="pin in createdPinsStore.createdPins"
      :key="pin.id"
      :details="{
        id: +pin.id,
        image: pin.image,
        name: pin.name,
        board_id: pin.board_id
      }"
    />
  </PinGrid>
</template>
