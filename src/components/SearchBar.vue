<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SearchBar'
})
</script>

<script setup lang="ts">
import { ref } from 'vue'
const search = ref('')
const router = useRouter()

function submit() {
  if (search.value.trim() !== '') {
    router.push({ name: 'search', params: { query: encodeURIComponent(search.value) } })
  }
}
</script>

<template>
  <form class="flex items-center h-12 relative" @submit.prevent="submit">
    <span class="h-full bg-neutral-100 pl-3 pr-1 grid place-items-center rounded-s-full">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-gray-700" />
    </span>

    <input
      type="text"
      name="search"
      placeholder="Search"
      class="pl-1 py-4 pr-4 bg-neutral-100 w-full h-full rounded-r-full font-medium placeholder:text-gray-700 outline-none"
      v-model="search"
    />

    <span v-if="search" @click="search = ''">
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="fa-lg absolute top-4 right-4 cursor-pointer"
      />
    </span>
  </form>
</template>
