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
    // convert the map to an array of objects and limit it to 3
    Array.from(messages.value)
      .map(([id, message]) => ({ id, message }))
      .slice(0, 3)
  )

  function push(message: Notification) {
    const id = generateId.next().value as number

    const duration = message.duration || 5000
    messages.value.set(id, { ...message, duration })
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
