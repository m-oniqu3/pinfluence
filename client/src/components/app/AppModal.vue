<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppModal'
})
</script>

<script setup lang="ts">
import { defineEmits, onUnmounted, watch } from 'vue'

const emit = defineEmits<{
  (event: 'closeModal'): void
}>()

const props = defineProps<{ open: boolean }>()

// if modal is open prevent scrolling
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      @click="emit('closeModal')"
      class="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center z-20"
    />
    <transition name="modal" mode="out-in">
      <div
        class="fixed top-0 left-0 h-full w-full flex justify-center items-center z-30"
        v-if="props.open"
        @click="emit('closeModal')"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active {
  animation: modal-enter 0.3s ease-out;
}

.modal-leave-active {
  animation: modal-leave 0.3s ease-in;
}
</style>

<style>
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: translateY(100%) scale(0);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(100%) scale(0);
  }
}
</style>
