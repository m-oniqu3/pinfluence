<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BoardList from '@/components/BoardList.vue'
import InputField from '@/components/InputField.vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateView'
})
</script>

<script setup lang="ts">
const auth = useAuthStore()
const pinDetails = ref({
  imageUrl: '',
  file: new File([], ''),
  title: '',
  description: '',
  link: '',
  board: { id: '', name: '' },
  tags: []
})

const loading = ref(false)

async function uploadAll() {
  loading.value = true
  try {
    await createPin()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function createPin() {
  const { data, error } = await supabase
    .from('created-pins')
    .insert([
      {
        name: pinDetails.value.title,
        description: pinDetails.value.description,
        link: pinDetails.value.link,
        board_id: pinDetails.value.board.id,
        user_id: auth.user?.id,
        image: pinDetails.value.file.name,
        tags: JSON.stringify(pinDetails.value.tags)
      }
    ])
    .select()

  if (error) throw error

  if (data) {
    await uploadImage()
  }
}

async function uploadImage() {
  if (!auth.user?.id) {
    throw new Error('You must be logged in to create a pin.')
  }
  const { error } = await supabase.storage
    .from(`created-pins/${auth.user.id}`)
    .upload(pinDetails.value.file.name, pinDetails.value.file)

  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }
  console.log('Image uploaded successfully')
}

const isSelectBoardModalOpen = ref(false)
const positions = ref({ x: 0, y: 0 })

const openSelectBoardModal = () => {
  isSelectBoardModalOpen.value = true
}

const closeSelectBoardModal = () => {
  isSelectBoardModalOpen.value = false
}

function getPosition(event: MouseEvent) {
  //postion right above the input
  positions.value = {
    x: event.clientX < 350 ? 400 : event.clientX,
    y: 200
  }
}

function handleBoardModal(event: MouseEvent) {
  getPosition(event)
  openSelectBoardModal()
}

const updateImageURL = async (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files

  if (!files || files.length === 0) {
    throw new Error('You must select an image to upload.')
  }

  const file = files[0]

  pinDetails.value.file = file

  const reader = new FileReader()

  reader.onload = (e) => {
    pinDetails.value.imageUrl = e.target?.result as string
  }

  reader.readAsDataURL(file)

  // if (file) {
  //   // initialize FileReader object to read the file
  //   const reader = new FileReader()

  //   // when the file is read, store the image data in the imageUrl ref
  //   reader.onload = (e) => {
  //     // convert the image data to a string
  //     pinDetails.value.imageUrl = e.target?.result as string
  //   }

  //   // read the file as a data URL
  //   reader.readAsDataURL(file)
  // }
}

const changeImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = updateImageURL

  input.click()
}
</script>

<template>
  <header class="h-20 border-y-[1px] border-gray-300 flex items-center">
    <div class="wrapper flex items-center justify-between">
      <h2 class="text-xl font-semibold">Create Pin</h2>
      <BaseButton type="submit" class="bg-primary text-neutral" @click="uploadAll">
        {{ loading ? 'Publishing...' : 'Publish' }}
      </BaseButton>
    </div>
  </header>

  <form class="wrapper py-6 max-w-5xl mx-auto md:grid md:grid-cols-[40%_1fr] md:gap-8">
    <div class="">
      <figure v-if="pinDetails.imageUrl" class="relative mx-auto rounded-3xl w-[20rem]">
        <button
          type="button"
          class="btn btn-primary mx-auto absolute top-3 right-3 rounded-full bg-white/60 h-10 w-10 grid place-items-center hover:bg-white/80"
          @click.stop.prevent="changeImage"
        >
          <font-awesome-icon icon="fa-solid fa-pen" />
        </button>
        <img
          :src="pinDetails.imageUrl"
          alt="Uploaded image"
          class="mx-auto rounded-3xl object-cover"
        />
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

        <input type="file" id="file" name="file" accept="image/*" @change="updateImageURL" />
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

      <div class="flex flex-col gap-2 relative">
        <label for="board"> Board </label>
        <button
          type="button"
          class="border-2 rounded-lg py-2 px-4 bg-inherit text-left"
          name="board"
          @click.prevent="handleBoardModal"
        >
          {{ pinDetails.board.name || 'Select a board' }}
        </button>

        <BoardList
          :isMenuOpen="isSelectBoardModalOpen"
          :positions="positions"
          @close-menu="closeSelectBoardModal"
          v-model="pinDetails.board"
        />
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
