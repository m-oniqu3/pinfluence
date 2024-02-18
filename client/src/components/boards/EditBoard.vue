<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { getBoardById } from '@/services/boardServices'
import { isAxiosError } from 'axios'
import { onMounted, reactive } from 'vue'

const props = defineProps<{
  boardId: number
}>()

const emit = defineEmits<{ (event: 'closeModal'): void }>()

const board = reactive({
  name: '',
  secret: false,
  description: ''
})

async function getBoardDetails() {
  try {
    const response = await getBoardById(props.boardId)
    return response
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  } finally {
    console.log('done')
  }
}

onMounted(async () => {
  const response = await getBoardDetails()

  if (!response) return

  Object.assign(board, {
    name: response.name,
    secret: response.secret,
    description: response.description
  })
})
</script>

<template>
  <section class="bg-neutral rounded-2xl max-w-lg grid grid-rows-[8rem,1fr,6rem] h-5/6" @click.stop>
    <header class="relative h-full flex justify-center items-center border-b-[1px] shadow-sm">
      <h1 class="text-2xl font-semibold">Edit your board</h1>
      <span>
        <font-awesome-icon
          icon="fa-solid fa-xmark"
          class="fa-xl cursor-pointer absolute top-4 right-4"
          @click="emit('closeModal')"
        />
      </span>
    </header>

    <form @submit.prevent="" class="p-8 h-full overflow-y-scroll space-y-8">
      <InputField v-model="board.name" label="Name" name="name" />
      <InputField
        v-model="board.description"
        label="Description"
        type="textarea"
        name="description"
        placeholder="What's your board about?"
      />

      <div>
        <h1 class="text-xs pb-2">Settings</h1>
        <div class="grid grid-cols-[auto,1fr] items-center gap-4">
          <input
            type="checkbox"
            name="secret"
            id="secret"
            @change="board.secret = !board.secret"
            class="w-5 h-5 accent-black"
          />
          <label for="secret">
            <span class="font-bold"> Keep this board secret </span>
            <br />
            So only you and collaborators can see it. Secret {{ board.secret }}</label
          >
        </div>
      </div>

      <div class="cursor-pointer">
        <p class="text-xs pb-2">Action</p>
        <h1 class="text-lg font-semibold">Delete board</h1>
        <p>Delete this board and all its pins. This action cannot be undone.</p>
      </div>
    </form>

    <footer class="flex justify-end items-center border-t-[1px] shadow-sm px-8">
      <BaseButton type="submit" class="bg-primary text-white" @click="emit('closeModal')">Done</BaseButton>
    </footer>
  </section>
</template>
