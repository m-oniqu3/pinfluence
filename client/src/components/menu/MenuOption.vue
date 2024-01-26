<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuOption'
})
</script>

<script setup lang="ts"></script>

<template>
  <div>
    <h1 class="text-sm pl-2 mb-1">
      <slot name="title" />
    </h1>
    <div>
      <slot name="image" />
    </div>
    <slot />
  </div>
</template>
