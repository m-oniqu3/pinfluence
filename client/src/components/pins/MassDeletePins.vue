<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { deleteMultipleSavedPins } from '@/services/pinServices'
import { ref } from 'vue'
const props = defineProps<{
  selectedPins: Set<number>
}>()

const emit = defineEmits<{
  (event: 'close-modal'): void
  (event: 'refresh-board'): void
}>()

const isDeletingPins = ref(false)

async function removePins() {
  try {
    isDeletingPins.value = true

    const pins = Array.from(props.selectedPins)
    const response = await deleteMultipleSavedPins(pins)
    console.log(response)

    emit('refresh-board')
  } catch (error: any) {
    console.log(error.message)
  } finally {
    isDeletingPins.value = false
  }
}
</script>

<template>
  <article @click.stop class="p-4 bg-white rounded-xl wrapper max-w-lg flex flex-col gap-2">
    <h1 class="text-center h-14 text-2xl font-bold pb-2">Delete Pins</h1>

    <p class="text-center pb-4 max-w-xs mx-auto">
      Are you sure you want to delete these pins? This action cannot be undone.
    </p>
    <div class="flex gap-2 justify-end">
      <BaseButton class="bg-neutral-200 text-black" @click="emit('close-modal')">Cancel</BaseButton>
      <BaseButton @click="removePins" class="bg-primary text-neutral">
        {{ isDeletingPins ? 'Deleting...' : 'Delete' }}
      </BaseButton>
    </div>
  </article>
</template>
