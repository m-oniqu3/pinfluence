<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateView'
})
</script>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="wrapper">
      <h1 class="text-4xl font-bold">Create</h1>
    </div>
  </DefaultLayout>
</template>
