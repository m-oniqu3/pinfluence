<script lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { defineComponent } from 'vue'
import NotificationMessage from './NotificationMessage.vue'

export default defineComponent({
  name: 'NotificationDisplay'
})
</script>

<script setup lang="ts">
const notify = useNotificationStore()
</script>

<template>
  <div class="fixed top-20 right-0 z-50" v-if="notify.allMessages.length">
    <div v-for="{ id, message } in notify.allMessages" :key="id">
      <NotificationMessage :id="id" :message="message" />
    </div>
  </div>
</template>
