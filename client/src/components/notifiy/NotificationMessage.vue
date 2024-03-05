<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types/notification'
import { onMounted } from 'vue'

const props = defineProps<{
  id: number
  message: Notification
}>()

const notify = useNotificationStore()

function dismiss() {
  setTimeout(() => {
    console.log('from NotificationMessage.vue, removing notification')
    notify.remove(props.id)
  }, 5000)
}

onMounted(() => {
  //   dismiss()
})
</script>

<template>
  <div class="bg-white shadow-lg p-4 m-4 rounded-lg">
    <p>{{ props.message.message }}</p>
  </div>
</template>
