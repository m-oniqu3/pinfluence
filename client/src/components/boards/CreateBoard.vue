<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateBoard'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { createBoard } from '@/services/boardServices'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { isAxiosError } from 'axios'

const emit = defineEmits<{
  (event: 'closeModal'): void
  (event: 'refresh-boards'): void
}>()

const auth = useAuthStore()
const notify = useNotificationStore()
const boardDetails = ref({ name: '', secret: false })
const isLoading = ref(false)

const error = ref('')

function validateInput() {
  if (!boardDetails.value.name || boardDetails.value.name.length < 3) {
    error.value = 'Board name must be at least 3 characters long'
  } else {
    error.value = ''
  }
}

async function submit() {
  if (!auth.user) return

  try {
    console.log(boardDetails.value)
    isLoading.value = true
    const response = await createBoard(boardDetails.value)

    notify.push({ message: response, type: 'success', title: 'Success' })
    emit('refresh-boards')
  } catch (error: any) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data.error
    } else {
      message = error.message
    }

    console.error(error, 'Error creating board')
    notify.push({ type: 'error', message, title: 'Error' })
  } finally {
    isLoading.value = false
    emit('closeModal')
  }
}
</script>

<template>
  <form class="wrapper bg-neutral relative rounded-lg p-8 space-y-8 max-w-lg" @click.stop @submit.prevent="submit">
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="fa-xl absolute top-2 right-2 cursor-pointer"
      @click="emit('closeModal')"
    />

    <h1 class="text-2xl font-bold text-center">Create Board</h1>

    <div>
      <InputField
        name="name"
        label="Name"
        type="text"
        placeholder="Like 'Places to Go' or 'Recipes to Make"
        v-model="boardDetails.name"
        @blur="validateInput"
      />
      <p class="text-red-500 text-sm mt-1 h-5">
        <span v-if="error">{{ error }}</span>
      </p>
    </div>

    <div class="grid grid-cols-[auto,1fr] items-center gap-4">
      <input
        type="checkbox"
        name="secret"
        id="secret"
        @change="boardDetails.secret = !boardDetails.secret"
        class="w-5 h-5 accent-primary"
      />
      <label for="secret">
        <span class="font-bold"> Keep this board secret </span>
        <br />
        So only you and collaborators can see it. Secret {{ boardDetails.secret }}</label
      >
    </div>

    <BaseButton type="submit" class="bg-primary text-neutral float-right disabled:bg-neutral-200" :disabled="!!error">
      {{ isLoading ? 'Creating...' : 'Create' }}
    </BaseButton>
  </form>
</template>
