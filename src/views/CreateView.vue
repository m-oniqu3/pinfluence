<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CreateView'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BoardList from '@/components/BoardList.vue'
import InputField from '@/components/InputField.vue'
import TagsList from '@/components/TagsList.vue'
import { supabase } from '@/lib/supabaseClient'
import { createPin, createPinTag, createTag } from '@/services/createPinServices'
import { useAuthStore } from '@/stores/auth'
import { useCreatedPinsStore } from '@/stores/createdPins'
import type { PinPreview, UploadPin } from '@/types/pin'
import { computed, watch } from 'vue'

const auth = useAuthStore()
const createdPinStore = useCreatedPinsStore()
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
const tagsList = ref<{ id: string; name: string }[]>([])
const selectedTags = ref<{ id: string; name: string }[]>([])
const isTagsListOpen = ref(false)
const isLoadingTags = ref(false)
const tagLabel = computed(() => `Tagged topics (${selectedTags.value.length})`)

// Get tags from the database based on the input value
async function getMatchTags(val: string) {
  isLoadingTags.value = true
  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name')
    .ilike('name', `%${val}%`)

  if (!error) {
    tagsList.value = tags || []
  }

  isLoadingTags.value = false
}

// Filter tags list to show only tags that are not selected
const filteredTagList = computed(() => {
  const selectedTagIds = new Set(selectedTags.value.map((tag) => tag.id))
  return tagsList.value.filter((tag) => !selectedTagIds.has(tag.id))
})

// Open tags list when user types and there are tags to show
watch(
  () => newTag.value,
  () => {
    const hasFilteredTags = filteredTagList.value.length > 0
    const hasInput = newTag.value.trim().length > 0

    if (hasFilteredTags && hasInput) {
      isTagsListOpen.value = true
    } else {
      isTagsListOpen.value = false
    }
  }
)

// Show add button when user types a tag that doesn't exist in the list
const shouldShowAddBtn = computed(() => {
  if (filteredTagList.value.length > 0) return false

  const trimmedNewTag = newTag.value.trim().toLowerCase()
  return (
    newTag.value.length >= 1 &&
    !selectedTags.value.some((tag) => tag.name.toLowerCase() === trimmedNewTag) &&
    !filteredTagList.value.some((tag) => tag.name.toLowerCase() === trimmedNewTag)
  )
})

// Handle adding a new tag
async function uploadNewTag() {
  const trimmedNewTag = newTag.value.trim()
  const data = await createTag(trimmedNewTag)

  if (data) {
    selectedTags.value.push(data[0])
    newTag.value = ''
  }
}

// Event handler for selecting a tag
function selectTag(tag: { id: string; name: string }) {
  selectedTags.value.push(tag)
  newTag.value = ''
}

// Event handler for removing a tag
function removeTag(id: string) {
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

    const newPin: UploadPin = {
      ...pinDetails.value,
      boardId: pinDetails.value.board.id,
      userId: auth.user.id,
      file: pinDetails.value.file as File
    }
    const data = await createPin(newPin)
    const result = data[0] as PinPreview

    if (!result) return

    if (selectedTags.value.length > 0) {
      console.log(selectedTags.value, result.id)
      await createPinTag(selectedTags.value, result.id.toString())
    }

    createdPinStore.addPin(result)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    pinDetails.value = { ...initialPin }
    selectedTags.value = []
  }
}

console.log(selectedTags.value)
</script>

<template>
  <header class="h-20 border-y-[1px] border-gray-300 flex items-center">
    <div class="wrapper flex items-center justify-between">
      <h2 class="text-xl font-semibold">Create Pin</h2>
      <BaseButton
        v-if="pinDetails.image"
        type="submit"
        class="bg-primary text-neutral"
        @click="createNewPin"
      >
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
        <img
          :src="pinDetails.image"
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

        <BoardList
          :isMenuOpen="isSelectBoardModalOpen"
          :positions="positions"
          @close-menu="adjustBoardModal(false)"
          v-model="pinDetails.board"
        />
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
        <span class="text-xs pt-1 text-gray-700"> Don't worry, people won't see your tags </span>

        <span
          v-if="shouldShowAddBtn"
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
