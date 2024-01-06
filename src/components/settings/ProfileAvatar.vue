<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileAvatar'
})
</script>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { ref, toRefs, watchEffect } from 'vue'

const prop = defineProps(['path', 'size'])
const { path, size } = toRefs(prop)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(path?.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error: any) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt: Event) => {
  files.value = (evt.target as HTMLInputElement)?.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

    if (uploadError) throw uploadError
    emit('update:path', filePath)
    emit('upload')
  } catch (error: any) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

watchEffect(() => {
  if (path?.value) downloadImage()
})
</script>

<template>
  <form class="flex gap-4 items-center">
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="h-[7.5rem] w-[7.5rem] object-cover rounded-full"
    />

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
