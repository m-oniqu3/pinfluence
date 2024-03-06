<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types/notification'
import { computed, onMounted } from 'vue'

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

const icon = computed(() => {
  switch (props.message.type) {
    case 'success':
      return ['fas', 'circle-check']
    case 'info':
      return ['fas', 'circle-info']
    case 'warning':
      return ['fas', 'circle-exclamation']
    case 'error':
      return ['fas', 'circle-xmark']
    default:
      return ['fas', 'circle-info']
  }
})

const iconColourClass = computed(() => {
  switch (props.message.type) {
    case 'success':
      return 'text-green-500'
    case 'info':
      return 'text-blue-500'
    case 'warning':
      return 'text-yellow-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-blue-500'
  }
})
const backgroundColourClass = computed(() => {
  switch (props.message.type) {
    case 'success':
      return 'bg-green-100'
    case 'info':
      return 'bg-blue-100'
    case 'warning':
      return 'bg-yellow-100'
    case 'error':
      return 'bg-red-100'
    default:
      return 'bg-blue-100'
  }
})

onMounted(() => {
  dismiss()
})
</script>

<template>
  <article
    class="bg-white shadow-lg p-1 rounded-[1.7rem] grid grid-cols-[50px,1fr] gap-2 border-[1px] border-stone-100 w-96"
  >
    <figure :class="backgroundColourClass" class="w-12 h-12 flex items-center justify-center rounded-full">
      <font-awesome-icon :icon="icon" :class="iconColourClass" class="text-3xl" />
    </figure>

    <div class="">
      <h2 class="text-slate-600 grid grid-cols-[1fr,30px] gap-2 w-full">
        <span class="font-semibold">
          {{ props.message.title }}
        </span>

        <span class="cursor-pointer" @click="notify.remove(props.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" class="text-slate-400" />
        </span>
      </h2>
      <p :class="iconColourClass" class="text-sm font-medium w-[95%]">{{ props.message.message }}</p>
    </div>
  </article>
</template>
