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
  <section class="fixed bottom-2 right-0 z-50 m-4 space-y-3" v-if="notify.allMessages.length">
    <NotificationMessage v-for="{ id, message } in notify.allMessages" :key="id" :id="id" :message="message" />
  </section>
</template>
