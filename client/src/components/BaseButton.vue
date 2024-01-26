<script lang="ts">
import { defineComponent, defineProps, withDefaults } from 'vue'

export default defineComponent({
  name: 'BaseButton'
})
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<{ type?: 'button' | 'submit' | 'reset' }>(), {
  type: 'button'
})
</script>

<template>
  <button :type="props.type" class="px-3 py-2 rounded-full font-bold">
    <slot />
  </button>
</template>
