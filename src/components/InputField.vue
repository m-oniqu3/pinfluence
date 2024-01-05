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
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="props.name" class="text-sm"> {{ props.label }} </label>
    <input
      @input="updateInput"
      v-bind="$attrs"
      :placeholder="'placeholder' in $attrs ? ($attrs.placeholder as string) : props.label"
      :required="'required' in $attrs ? ($attrs.required as boolean) : true"
      :value="props.modelValue"
      class="border-2 rounded-lg py-2 px-4"
    />
  </div>
</template>
