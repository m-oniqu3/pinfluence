<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { editCreatedPin, getPinDetails } from '@/services/pinServices'

import { computed, onMounted, ref } from 'vue'

const emit = defineEmits<{
  (event: 'closeModal'): void
  (event: 'refresh-boards'): void
  (event: 'deletePin'): void
}>()

const props = defineProps<{
  pinID: number
}>()

const originalPin = ref({ name: '', description: '', link: '' })
const pin = ref({ name: '', description: '', link: '' })
const isLoading = ref(false)
const isEditing = ref(false)
const error = ref('')

async function fetchPinDetails(pinID: number) {
  try {
    isLoading.value = true
    const response = await getPinDetails(pinID)
    pin.value = {
      name: response.name,
      description: response.description,
      link: response.link
    }
    originalPin.value = { ...pin.value }
  } catch (error: any) {
    console.error(error.message)
    error.value = error.message
  } finally {
    isLoading.value = false
  }
}

const isValidForm = computed(() => {
  const initalPin = JSON.stringify(originalPin.value)
  const newPin = JSON.stringify(pin.value)

  // detail changed
  return initalPin !== newPin
})

async function updatePin() {
  try {
    if (!isValidForm.value) {
      return
    }

    isEditing.value = true
    const response = await editCreatedPin(props.pinID, pin.value)
    console.log(response)
    emit('refresh-boards')
    emit('closeModal')
  } catch (error: any) {
    console.error(error.message)
  } finally {
    isEditing.value = false
  }
}

onMounted(() => {
  fetchPinDetails(props.pinID)
})
</script>

<template>
  <section class="relative bg-white p-4 shadow-lg w-full h-full max-w-lg ml-auto" @click.stop>
    <p v-if="isLoading" class="text-center w-full">Loading...</p>
    <p v-else-if="error" class="text-center w-full">{{ error }}</p>

    <template v-else>
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
        <InputField v-model.trim="pin.name" label="Ttile" name="name" />

        <InputField
          v-model.trim="pin.description"
          label="Description"
          type="textarea"
          name="description"
          placeholder="What's your board about?"
        />

        <InputField v-model.trim="pin.link" label="Link" name="link" placeholder="Add a link" />

        <div class="absolute bottom-2 right-4 flex items-end justify-end gap-2">
          <BaseButton class="bg-neutral-200 text-black" @click.stop="emit('deletePin')">Delete</BaseButton>
          <BaseButton
            class="bg-primary text-white disabled:opacity-50"
            @click.stop="updatePin"
            :disabled="!isValidForm"
          >
            {{ isEditing ? 'Editing...' : 'Save' }}
          </BaseButton>
        </div>
      </form>
    </template>
  </section>
</template>
