<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileAvatar'
})
</script>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { ref, toRefs, watchEffect } from 'vue'

// const prop = defineProps(['path', 'size'])

const props = defineProps<{
  path: string
}>()

const { path } = toRefs(props)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const src = ref('')
const files = ref()
const authStore = useAuthStore()

const uploadAvatar = async (evt: Event) => {
  files.value = (evt.target as HTMLInputElement)?.files

  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const user = authStore.user

    if (!user) {
      throw new Error('User not found.')
    }

    const file = files.value[0]
    const formData = new FormData()
    formData.append('file', file)

    const response = await authStore.updateProfileAvatar(user.id, formData)

    emit('update:path', response)
    emit('upload')
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.error ?? error.message)
    } else {
      console.log('Something went wrong. Please try again.')
    }
  } finally {
    uploading.value = false
  }
}

watchEffect(() => {
  if (path.value) {
    const image = path.value
    if (image) {
      src.value = image
    }
  }
})
</script>

<template>
  <form class="flex gap-4 items-center">
    <img v-if="src" :src="src" alt="Avatar" class="h-[7.5rem] w-[7.5rem] object-cover rounded-full bg-neutral-100" />

    <font-awesome-icon v-else icon="fa-solid fa-circle-user" class="fa-7x text-gray-600" />

    <div>
      <label class="btn bg-neutral-200 w-fit cursor-pointer" for="single">
        {{ uploading ? 'Uploading ...' : 'Change' }}
      </label>
      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </form>
</template>
