<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateView'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import InputField from '@/components/InputField.vue'
import TagsList from '@/components/TagsList.vue'
import AppMenu from '@/components/app/AppMenu.vue'
import BoardList from '@/components/boards/BoardList.vue'
import { createPin } from '@/services/pinServices'

import { createTag, getTags } from '@/services/tagServices'
import { useAuthStore } from '@/stores/auth'
import type { Tag } from '@/types/tag'
import { isAxiosError } from 'axios'
import { computed, ref, watchEffect } from 'vue'

const auth = useAuthStore()
// const createdPinStore = useCreatedPinsStore()
const loading = ref(false)

const isSelectBoardModalOpen = ref(false)
const positions = ref({ x: 0, y: 0 })

const initialPin = {
  image: '',
  file: new File([], ''),
  name: '',
  description: '',
  link: '',
  board: { id: null, name: '' }
}

const pinDetails = ref({ ...initialPin })

const adjustBoardModal = (val: boolean) => {
  isSelectBoardModalOpen.value = val
}

function getPosition(event: MouseEvent) {
  positions.value = {
    x: event.clientX < 350 ? 400 : event.clientX,
    y: 200
  }
}

function handleBoardModal(event: MouseEvent) {
  getPosition(event)
  adjustBoardModal(true)
}

function changeImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = updateImage

  input.click()
}

async function updateImage(event: Event) {
  const files = (event.target as HTMLInputElement)?.files

  if (!files || files.length === 0) {
    throw new Error('You must select an image to upload.')
  }

  const file = files[0]
  pinDetails.value.file = file

  const reader = new FileReader()
  reader.onload = (e) => {
    pinDetails.value.image = e.target?.result as string
  }

  reader.readAsDataURL(file)
}

// TAGS

const newTag = ref('')
const tagsList = ref<Tag[]>([])
const selectedTags = ref<Tag[]>([])
const isTagsListOpen = ref(false)
const isLoadingTags = ref(false)
const tagLabel = computed(() => `Tagged topics (${selectedTags.value.length})`)

// Get tags from the database based on the input value
async function getMatchTags(val: string) {
  isLoadingTags.value = true

  try {
    if (!val) return
    const response = await getTags(val)
    tagsList.value = response ?? []
  } catch (error) {
    if (isAxiosError(error)) console.log(error.response?.data)

    console.log(error)
  } finally {
    isLoadingTags.value = false
  }
}

// Filter tags list to show only tags that are not selected
const filteredTagList = computed(() => {
  const selectedTagIds = new Set(selectedTags.value.map((tag) => tag.id))
  return tagsList.value.filter((tag) => !selectedTagIds.has(tag.id))
})

// Open tags list when user types and there are tags to show
watchEffect(() => {
  const hasFilteredTags = !!filteredTagList.value.length
  const hasInput = !!newTag.value.trim().length

  if (hasFilteredTags && hasInput) {
    isTagsListOpen.value = true
  } else {
    isTagsListOpen.value = false
  }
})

// Show add button when user types a tag that doesn't exist in the list
const showAddButton = computed(() => {
  if (filteredTagList.value.length > 0) return false

  return newTag.value.length >= 1 && tagsList.value.length === 0
})

// Handle adding a new tag
async function uploadNewTag() {
  try {
    if (!newTag.value.trim().length) return

    const tag = await createTag(newTag.value)

    if (!tag) return

    selectTag(tag)
  } catch (error) {
    if (isAxiosError(error)) console.log(error.response?.data)
    console.log(error)
  }
}

// Event handler for selecting a tag
function selectTag(tag: Tag) {
  selectedTags.value.push(tag)
  newTag.value = ''
}

// Event handler for removing a tag
function removeTag(id: Tag['id']) {
  selectedTags.value = selectedTags.value.filter((tag) => tag.id !== id)
}

// Function to calculate the position of the tags list
function calculateTagsListPosition(event: MouseEvent) {
  const x = window.innerWidth < 768 ? (window.innerWidth + 400) / 2 : (window.innerWidth + 650) / 2
  const y = event.clientY - 300
  positions.value = { x, y }
}

// Event handler for handling the tags list
function handleTagsList(event: MouseEvent) {
  calculateTagsListPosition(event)

  if (filteredTagList.value.length > 0 && newTag.value.trim().length > 0) {
    isTagsListOpen.value = true
  } else {
    isTagsListOpen.value = false
  }
}

async function createNewPin() {
  loading.value = true
  try {
    if (!auth.user) return

    const formData = new FormData()
    formData.append('name', pinDetails.value.name)
    formData.append('desc', pinDetails.value.description)
    formData.append('link', pinDetails.value.link)
    formData.append('boardId', pinDetails.value.board.id ?? '')
    formData.append('file', pinDetails.value.file)
    formData.append('tags', selectedTags.value.map((tag) => tag.id).join(','))

    const response = await createPin(formData)

    console.log(response)
  } catch (error) {
    if (isAxiosError(error)) console.log(error.response?.data)
    else console.log(error)
  } finally {
    loading.value = false
    pinDetails.value = { ...initialPin }
    selectedTags.value = []
  }
}
</script>

<template>
  <header class="h-20 border-y-[1px] border-gray-300 flex items-center">
    <div class="wrapper flex items-center justify-between">
      <h2 class="text-xl font-semibold">Create Pin</h2>
      <BaseButton v-if="pinDetails.image" type="submit" class="bg-primary text-neutral" @click="createNewPin">
        {{ loading ? 'Publishing...' : 'Publish' }}
      </BaseButton>
    </div>
  </header>

  <form name="form" class="wrapper py-8 max-w-5xl mx-auto md:grid md:grid-cols-[40%_1fr] md:gap-8">
    <div>
      <figure v-if="pinDetails.image" class="relative mx-auto rounded-3xl w-[20rem]">
        <button
          type="button"
          class="btn btn-primary mx-auto absolute top-3 right-3 rounded-full bg-white/60 h-10 w-10 grid place-items-center hover:bg-white/80"
          @click.stop.prevent="changeImage"
        >
          <font-awesome-icon icon="fa-solid fa-pen" />
        </button>
        <img :src="pinDetails.image" alt="Uploaded image" class="mx-auto rounded-3xl object-cover" />
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

        <input type="file" id="file" name="file" accept="image/*" @change="updateImage" />
      </label>
    </div>

    <fieldset
      id="fieldset"
      class="flex flex-col gap-4 mt-6 max-w-lg mx-auto md:max-w-none md:m-0 md:w-full disabled:opacity-50"
    >
      <InputField v-model="pinDetails.name" name="'title" type="text" label="Title" />
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

        <AppMenu :positions="positions" v-if="isSelectBoardModalOpen" @close-menu="adjustBoardModal(false)">
          <BoardList @close-menu="adjustBoardModal(false)" v-model="pinDetails.board" />
        </AppMenu>
      </div>

      <div class="relative">
        <InputField
          v-model="newTag"
          name="tags"
          type="text"
          :label="tagLabel"
          placeholder="Search for tags"
          @click="handleTagsList"
          @input.prevent="getMatchTags(newTag.trim())"
        />
        <!-- @input.prevent="getMatchTags(newTag.trim())" should go to input above -->
        <span class="text-xs pt-1 text-gray-700"> Don't worry, people won't see your tags </span>

        <span
          v-if="showAddButton"
          class="absolute top-9 right-2 h-6 w-6 grid place-items-center bg-primary rounded-full cursor-pointer"
          @click="uploadNewTag"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-white" />
        </span>

        <ul v-if="selectedTags.length" class="py-2 flex gap-2 flex-wrap">
          <li
            v-for="tag in selectedTags"
            :key="tag.id"
            class="bg-black text-white px-4 py-3 flex items-center gap-2 rounded-full"
          >
            <span class="font-bold text-base"> {{ tag.name }}</span>
            <span class="ml-2 cursor-pointer" @click="removeTag(tag.id)">
              <font-awesome-icon icon="fa-solid fa-times" class="fa-lg" />
            </span>
          </li>
        </ul>
      </div>

      <TagsList
        :isMenuOpen="isTagsListOpen"
        :positions="positions"
        @close-menu="isTagsListOpen = false"
        @add-tag="selectTag"
        :tagsList="filteredTagList"
        :isLoadingTags="isLoadingTags"
      />
    </fieldset>
  </form>
</template>

<style scoped>
#file {
  display: none;
}
</style>
