import type { Notification } from '@/types/notification'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Generator function for unique keys
function* idGenerator() {
  let id = 1
  while (true) {
    yield id++
  }
}

const generateId = idGenerator()

export const useNotificationStore = defineStore('notification', () => {
  const messages = ref(new Map<number, Notification>())

  const allMessages = computed(() =>
    Array.from(messages.value)
      .map(([id, message]) => ({ id, message }))
      .slice(0, 4)
  )

  messages.value.set(generateId.next().value as number, {
    title: 'Account created successfully',
    message: 'Please check your email to verify your account. Follow the instructions in the email to get started.',
    type: 'info'
  })

  messages.value.set(generateId.next().value as number, {
    title: 'Something went wrong',
    message: 'Something went wrong, please try again later',
    type: 'error'
  })
  messages.value.set(generateId.next().value as number, {
    title: 'Account created successfully',
    message: 'Your account has been created successfully. Welcome!',
    type: 'success'
  })

  messages.value.set(generateId.next().value as number, {
    title: 'Warning',
    message: 'This is a warning message',
    type: 'warning'
  })

  function push(message: Notification) {
    const id = generateId.next().value as number
    messages.value.set(id, message)
  }

  function remove(id: number) {
    messages.value.delete(id)
  }

  return {
    push,
    remove,
    allMessages
  }
})
