<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreatedPins'
})
</script>

<script setup lang="ts">
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
  <section class="wrapper pt-8 pb-12" v-else>
    <ul class="columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 gap-8">
      <li v-for="pin in createdPinsStore.createdPins" :key="pin.id" class="break-inside-avoid">
        <PinPreview
          :details="{
            id: pin.id,
            url: pin.image_url,
            title: pin.title,
            board_id: pin.board_id
          }"
        />
      </li>
    </ul>
  </section>
</template>
