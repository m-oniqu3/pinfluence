<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { getPinDetails } from '@/services/pinServices'

import { useQuery } from '@tanstack/vue-query'
import { ref, watchEffect } from 'vue'

const emit = defineEmits<{
  (event: 'closeModal'): void
  (event: 'refresh-boards'): void
  (event: 'deletePin'): void
}>()

const props = defineProps<{
  pinID: number
}>()

const { data, isLoading, isError, error } = useQuery({
  queryKey: ['pinDetails', props.pinID],
  queryFn: () => fetchPinDetails(props.pinID),
  retry: false
})

const pin = ref({ name: '', description: '', link: '' })

//when isSuccess is true, the data is available
watchEffect(() => {
  if (data.value) {
    pin.value = {
      name: data.value.name,
      description: data.value.description,
      link: data.value.link
    }
  }
})

async function fetchPinDetails(pinID: number) {
  try {
    const response = await getPinDetails(pinID)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}
</script>

<template>
  <section class="relative bg-white p-4 shadow-lg w-full h-full max-w-lg ml-auto">
    <p v-if="isLoading" class="text-center w-full">Loading...</p>
    <p v-else-if="isError && error" class="text-center w-full">{{ error.message }}</p>

    <template v-else-if="data">
      <header class="h-28 grid place-items-center">
        <h1 class="text-2xl font-bold mb-4">Edit Pin</h1>

        <!-- close icon -->
        <span>
          <font-awesome-icon
            icon="fa-solid fa-xmark"
            class="fa-xl cursor-pointer absolute top-4 right-4"
            @click="emit('closeModal')"
          />
        </span>
      </header>

      <form class="space-y-8 h-full">
        <InputField v-model="pin.name" label="Ttile" name="name" />

        <InputField
          v-model="pin.description"
          label="Description"
          type="textarea"
          name="description"
          placeholder="What's your board about?"
        />

        <InputField v-model="pin.link" label="Link" name="link" placeholder="Add a link" />

        <div class="absolute bottom-2 right-4 flex items-end justify-end">
          <BaseButton class="bg-neutral-200 text-black" @click.stop="emit('deletePin')">Delete</BaseButton>
          <BaseButton class="bg-primary text-white" @click.stop="">Save</BaseButton>
        </div>
      </form>
    </template>
  </section>
</template>
