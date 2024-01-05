<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateView'
})
</script>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

import { ref } from 'vue'
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
  <DefaultLayout>
    <header class="h-20 border-y-[1px] border-gray-300 flex items-center">
      <h2 class="wrapper text-xl font-semibold">Create Pin</h2>
    </header>

    <main class="wrapper py-6">
      <figure v-if="imageUrl" class="relative mx-auto rounded-3xl w-[23rem]">
        <button
          type="button"
          class="btn btn-primary mx-auto absolute top-3 right-3 rounded-full bg-white/60 h-10 w-10 grid place-items-center hover:bg-white/80"
          @click.stop.prevent="changeImage"
        >
          <font-awesome-icon icon="fa-solid fa-pen" />
        </button>
        <img
          :src="imageUrl"
          alt="Uploaded image"
          class="mx-auto mt-6 rounded-lg object-cover w-[23rem]"
        />
      </figure>

      <label
        v-else
        class="bg-neutral-200 h-[60vh] w-[23rem] grid place-items-center cursor-pointer mx-auto rounded-3xl border-dashed border-2 border-gray-300"
        for="file"
      >
        <span class="text-center">
          <font-awesome-icon icon="fa-solid fa-circle-arrow-up" class="fa-2xl mb-2" />
          <p>Choose a file to upload</p>
        </span>

        <input type="file" id="file" name="file" accept="image/*" @change="handleImageUpload" />
      </label>
    </main>
  </DefaultLayout>
</template>

<style scoped>
#file {
  display: none;
}
</style>
