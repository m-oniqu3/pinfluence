<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BoardSearch'
})
</script>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'clearSearch'): void
}>()

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <form class="relative w-full px-3 h-16 flex items-center justify-center z-10" @click.stop>
    <font-awesome-icon
      v-show="!props.modelValue"
      icon="fa-solid fa-magnifying-glass"
      class="text-gray-700 absolute left-6"
    />

    <input
      @input="updateInput"
      v-bind="$attrs"
      type="text"
      :value="props.modelValue"
      placeholder="Search boards"
      class="p-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-200"
      :class="props.modelValue ? 'pl-4' : 'pl-10'"
    />

    <div
      v-if="props.modelValue"
      class="bg-black w-6 h-6 rounded-full grid place-items-center absolute right-6 cursor-pointer"
    >
      <font-awesome-icon icon="fa-solid fa-times" class="text-white" @click="emit('clearSearch')" />
    </div>
  </form>
</template>
