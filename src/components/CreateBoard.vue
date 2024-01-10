<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateBoard'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'

const emit = defineEmits<{
  (event: 'closeModal'): void
}>()

const auth = useAuthStore()
const boardStore = useBoardStore()
const boardDetails = ref({ name: '', secret: false })

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

  await boardStore.createBoard(boardDetails.value)

  emit('closeModal')
}
</script>

<template>
  <form
    class="bg-neutral relative rounded-lg p-8 w-3/6 space-y-8"
    @click.stop
    @submit.prevent="submit"
  >
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

    <BaseButton
      type="submit"
      class="bg-primary text-neutral float-right disabled:bg-neutral-200"
      :disabled="!!error"
    >
      {{ boardStore.isLoading ? 'Creating...' : 'Create' }}
    </BaseButton>
  </form>
</template>
