<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import { useBoardStore } from '@/stores/board'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateView'
})
</script>

<script setup lang="ts">
const boardStore = useBoardStore()
const pinDetails = ref({
  title: '',
  description: '',
  image: '',
  link: '',
  board: '',
  tags: []
})

const imageUrl = ref<string | null>(null)

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = (input.files || [])[0]

  if (file) {
    // initialize FileReader object to read the file
    const reader = new FileReader()

    // when the file is read, store the image data in the imageUrl ref
    reader.onload = (e) => {
      // convert the image data to a string
      imageUrl.value = e.target?.result as string
    }

    // read the file as a data URL
    reader.readAsDataURL(file)
  }
}

const changeImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleImageUpload

  input.click()
}
</script>

<template>
  <header class="h-20 border-y-[1px] border-gray-300 flex items-center">
    <div class="wrapper flex items-center justify-between">
      <h2 class="text-xl font-semibold">Create Pin</h2>
      <BaseButton type="submit" class="bg-primary text-neutral">Publish</BaseButton>
    </div>
  </header>

  <form class="wrapper py-6 max-w-5xl mx-auto md:grid md:grid-cols-[40%_1fr] md:gap-8">
    <div class="">
      <figure v-if="imageUrl" class="relative mx-auto rounded-3xl w-[20rem]">
        <button
          type="button"
          class="btn btn-primary mx-auto absolute top-3 right-3 rounded-full bg-white/60 h-10 w-10 grid place-items-center hover:bg-white/80"
          @click.stop.prevent="changeImage"
        >
          <font-awesome-icon icon="fa-solid fa-pen" />
        </button>
        <img :src="imageUrl" alt="Uploaded image" class="mx-auto rounded-3xl object-cover" />
      </figure>

      <label
        v-else
        class="bg-neutral-200 h-[60vh] max-w-[20rem] grid place-items-center cursor-pointer mx-auto rounded-3xl border-dashed border-2 border-gray-300 md:w-full"
        for="file"
      >
        <span class="text-center">
          <font-awesome-icon icon="fa-solid fa-circle-arrow-up" class="fa-2xl mb-2" />
          <p>Choose a file to upload</p>
        </span>

        <input type="file" id="file" name="file" accept="image/*" @change="handleImageUpload" />
      </label>
    </div>

    <div class="flex flex-col gap-4 mt-6 max-w-lg mx-auto md:max-w-none md:m-0 md:w-full">
      <InputField v-model="pinDetails.title" name="'title" type="text" label="Title" />
      <InputField
        v-model="pinDetails.description"
        name="description"
        type="textarea"
        label="Description"
        placeholder="Add a detailed description"
      />

      <InputField v-model="pinDetails.link" name="link" type="text" label="Link" />

      <div class="flex flex-col gap-2">
        <label for="board"> Board </label>
        <select
          v-model="pinDetails.board"
          name="board"
          class="border-2 rounded-lg py-2 px-4 bg-inherit"
        >
          <option value="" disabled selected>Choose a board</option>
          <option v-for="board in boardStore.boards" :key="board.id" :value="board.id">
            {{ board.name }}
          </option>
          <button>Create Board</button>
        </select>
      </div>

      <InputField v-model="pinDetails.tags" name="tags" type="text" label="Tags" />
    </div>
  </form>
</template>

<style scoped>
#file {
  display: none;
}
</style>
