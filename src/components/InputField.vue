<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InputField'
})
</script>

<script setup lang="ts">
interface Props {
  modelValue: any
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: (props) => props.label,
  required: true
})

const emit = defineEmits(['update:modelValue', 'validateInput'])

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="props.name" class="text-sm">
      {{ props.label }}
    </label>
    <input
      :name="name"
      :type="props.type"
      :placeholder="props.placeholder"
      :required="true"
      class="border-2 rounded-lg py-2 px-4"
      :value="props.modelValue"
      @input="updateInput"
      @blur="emit('validateInput', props.name, props.modelValue)"
    />
  </div>
</template>
