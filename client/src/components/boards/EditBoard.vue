<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { deleteBoard, getBoardById, getCurrentUserBoards, updateBoard } from '@/services/boardServices'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import type { Board } from '@/types/board'
import { isAxiosError } from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps<{
  boardId: number
}>()

const emit = defineEmits<{ (event: 'closeModal'): void; (event: 'refresh-boards'): void; (event: 'redirect'): void }>()

const authStore = useAuthStore()
const notify = useNotificationStore()

const originalBoard = reactive({ name: '', secret: false, description: '' })
const newBoard = reactive({ name: '', secret: false, description: '' })
const isLoading = ref(false)
const isSubmitting = ref(false)
const boardError = ref('')

const isBoardNameEmpty = computed(() => newBoard.name.trim() === '')

const isValidForm = computed(() => {
  const ogBoardString = JSON.stringify(originalBoard)
  const newBoardString = JSON.stringify(newBoard)

  // name isn't empty, detail changed, we want to keep the name
  return !isBoardNameEmpty.value && ogBoardString !== newBoardString
})

async function getBoardDetails() {
  try {
    isLoading.value = true
    const response = await getBoardById(props.boardId)
    return response
  } catch (error: any) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data
    } else {
      message = error.message
    }

    notify.push({ type: 'error', message, title: 'Error' })
  } finally {
    isLoading.value = false
  }
}

async function submit() {
  try {
    if (!isValidForm.value) {
      return
    }

    isSubmitting.value = true
    const existingBoards = (await fetchBoards()) as Board[]

    //check if board name already exists except for the original board
    const boardExists = existingBoards
      .filter((board) => board.name !== originalBoard.name)
      .some((board) => board.name === newBoard.name)

    if (boardExists) {
      boardError.value = 'Could not edit board. You already have a board with that name.'
      return
    }

    //if changes, send request to update board
    const response = await updateBoard({
      id: props.boardId,
      name: newBoard.name,
      secret: newBoard.secret,
      description: newBoard.description
    })

    notify.push({ type: 'success', message: response, title: 'Success' })

    //close modal and fetch new data
    emit('refresh-boards')
  } catch (error: any) {
    let message = ''
    if (isAxiosError(error)) {
      console.error(error.response?.data)
      message = error.response?.data ?? error.message
    } else {
      console.error(error)
      message = error.message ?? 'Something went wrong. Could not edit board.'
    }

    boardError.value = message
    notify.push({ type: 'error', message, title: 'Error' })
  } finally {
    isSubmitting.value = false
  }
}

// fetch boards to check if board name already exists
async function fetchBoards() {
  try {
    if (!authStore.user) {
      throw new Error('User is not authenticated')
    }

    const response = await getCurrentUserBoards('created_at', 'desc')

    return response
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  }
}

async function removeBoard() {
  try {
    isSubmitting.value = true
    //send request to remove board
    const response = await deleteBoard(props.boardId)
    console.log(response)

    notify.push({ type: 'success', message: response, title: 'Success' })

    //close modal and fetch new data
    emit('refresh-boards')
    emit('redirect')
  } catch (error: any) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data ?? error.message
    } else {
      message = error.message ?? 'Something went wrong. Could not delete board.'
    }

    notify.push({ type: 'error', message, title: 'Error' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  const response = await getBoardDetails()

  if (!response) return

  console.log(response.id)

  Object.assign(newBoard, {
    name: response.name,
    secret: response.secret,
    description: response.description
  })

  Object.assign(originalBoard, newBoard)
})
</script>

<template>
  <div class="bg-neutral rounded-2xl w-11/12 max-w-lg h-5/6" @click.stop>
    <p v-if="isLoading" class="text-center h-full w-full grid place-items-center">Loading...</p>
    <section v-else class="grid grid-rows-[8rem,1fr,6rem] h-full">
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

      <form @submit.prevent="submit" class="p-8 h-full overflow-y-scroll space-y-8" @input="boardError = ''">
        <div>
          <InputField
            v-model="newBoard.name"
            label="Name"
            name="name"
            :class="{ 'border-red-500': isBoardNameEmpty }"
          />
          <p class="text-sm text-red-500 h-4 mb-4 mt-2">
            <span v-if="isBoardNameEmpty"> Your board has to have a name. </span>
          </p>
        </div>

        <InputField
          v-model="newBoard.description"
          label="Description"
          type="textarea"
          name="description"
          placeholder="What's your board about?"
        />

        <div>
          <h1 class="text-xs pb-2">Settings</h1>

          <div class="grid grid-cols-[auto,1fr] items-center gap-4">
            <input
              v-model="newBoard.secret"
              type="checkbox"
              name="secret"
              id="secret"
              class="w-5 h-5 accent-black cursor-pointer"
            />
            <label for="secret">
              <span class="font-bold"> Keep this board secret </span>
              <br />
              So only you can see it.</label
            >
          </div>
        </div>

        <div>
          <p class="text-xs pb-2">Action</p>
          <h1 class="text-lg font-semibold cursor-pointer" @click.prevent="removeBoard">Delete board</h1>
          <p>Delete this board and all its pins. This action cannot be undone.</p>
        </div>
      </form>

      <footer class="h-full flex flex-col gap-2 items-end justify-center border-t-[1px] shadow-sm px-8">
        <BaseButton
          :disabled="!isValidForm"
          type="submit"
          class="bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
          @click="submit"
        >
          {{ isSubmitting ? 'Editing...' : 'Save' }}
        </BaseButton>

        <p class="text-sm text-red-500 h-4 self-center">
          <span v-if="boardError"> {{ boardError }} </span>
        </p>
      </footer>
    </section>
  </div>
</template>
