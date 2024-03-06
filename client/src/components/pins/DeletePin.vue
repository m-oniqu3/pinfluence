<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { deleteCreatedPin, deleteSavedPin } from '@/services/pinServices'
import { useNotificationStore } from '@/stores/notification'
import { ref } from 'vue'

const props = defineProps<{
  pin: { pinID: number; image: string }
  type: 'saved' | 'created'
}>()

const emit = defineEmits<{
  // (event: 'delete-saved-pin', savedPinID: number): void
  (event: 'refresh-board'): void
  (event: 'close-modal'): void
}>()

const isDeletingPin = ref(false)
const notify = useNotificationStore()

//call delete function based on the type of pin
function removePin() {
  if (props.type === 'saved') {
    removeSavedPin(props.pin.pinID)
  } else {
    removeCreatedPin(props.pin.pinID)
  }
}

async function removeCreatedPin(pinID: number) {
  try {
    isDeletingPin.value = true

    const response = await deleteCreatedPin(pinID)
    notify.push({ type: 'success', message: response, title: 'Success' })

    emit('refresh-board')
    emit('close-modal')
  } catch (error: any) {
    notify.push({ type: 'error', message: error.message, title: 'Error' })
  } finally {
    isDeletingPin.value = false
  }
}

async function removeSavedPin(pinID: number) {
  try {
    isDeletingPin.value = true
    const response = await deleteSavedPin(pinID)
    notify.push({ type: 'success', message: response, title: 'Success' })

    emit('refresh-board')
    emit('close-modal')
  } catch (error: any) {
    notify.push({ type: 'error', message: error.message, title: 'Error' })
  } finally {
    isDeletingPin.value = false
  }
}
</script>

<template>
  <article @click.stop class="relative p-4 bg-white rounded-xl wrapper max-w-lg grid grid-rows-[auto,1fr,auto] gap-4">
    <h1 class="text-center h-14 text-2xl font-bold pb-2">Delete this Pin</h1>

    <figure class="grid grid-cols-1 place-items-center gap-4 pb-3 max-w-[300px] mx-auto">
      <figcaption class="text-center">
        Are you sure you want to delete this pin? This action cannot be undone.
      </figcaption>

      <img :src="pin.image" alt="Pin" class="mx-auto h-36 object-cover rounded-lg" />
    </figure>

    <div class="flex gap-2 items-baseline justify-end">
      <BaseButton class="bg-neutral-200 text-black" @click="emit('close-modal')">Cancel</BaseButton>
      <BaseButton @click="removePin" class="bg-primary text-neutral">
        {{ isDeletingPin ? 'Deleting...' : 'Delete' }}
      </BaseButton>
    </div>
  </article>
</template>
