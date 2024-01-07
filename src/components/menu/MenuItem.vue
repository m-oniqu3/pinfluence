<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuItem'
})
</script>

<script setup lang="ts"></script>

<template>
  <li class="px-2 py-[0.4rem] rounded-lg hover:bg-neutral-100">
    <slot />
  </li>
</template>
