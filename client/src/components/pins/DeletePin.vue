<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{
  savedPinID: number
  image: string
}>()

const emit = defineEmits<{
  (event: 'delete-saved-pin', savedPinID: number): void
  (event: 'close-modal'): void
}>()

console.log(props.savedPinID)

function deletePin(savedPinID: number) {
  emit('delete-saved-pin', savedPinID)
  console.log('delete pin done')
}
</script>

<template>
  <article class="relative p-4 bg-white rounded-xl wrapper max-w-lg grid grid-rows-[auto,1fr,auto] gap-4">
    <h1 class="text-center h-14 text-2xl font-bold pb-2">Delete this Pin</h1>

    <figure class="grid grid-cols-1 place-items-center gap-4 pb-3 max-w-[300px] mx-auto">
      <figcaption class="text-center">
        Are you sure you want to delete this pin? This action cannot be undone.
      </figcaption>

      <img :src="image" alt="Pin" class="mx-auto h-36 object-cover rounded-lg" />
    </figure>

    <div class="flex gap-2 items-baseline justify-end">
      <BaseButton class="bg-neutral-200 text-black" @click="emit('close-modal')">Cancel</BaseButton>
      <BaseButton @click="deletePin(savedPinID)" class="bg-primary text-neutral"> Delete </BaseButton>
    </div>
  </article>
</template>
