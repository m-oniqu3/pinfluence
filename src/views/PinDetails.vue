<script lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { supabase } from '@/lib/supabaseClient'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinDetails'
})
</script>

<script setup lang="ts">
import { type Pin } from '@/types/pin'
import { capitalizeSentence } from '@/utils/capitalize'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

type Owner = {
  id: string
  avatar_url: string
  full_name: string
}

const route = useRoute()
const pinId = route.params.id as string | undefined

const pin: Ref<Pin | null> = ref(null)
const owner: Ref<Owner | null> = ref(null)
const isLoading = ref(false)

async function getPinDetails(id: number) {
  try {
    isLoading.value = true
    const { data, error } = await supabase.from('created-pins').select('*').eq('id', id).single()

    if (error) {
      throw new Error(error.message)
    }

    const url = import.meta.env.VITE_SUPABASE_STORAGE_URL

    const details = data as Pin

    pin.value = {
      ...details,
      image: `${url}/created-pins/${details.user_id}/${details.image}`
    }

    await getOwnerDetails(details.user_id)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function getOwnerDetails(id: string) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()

    if (error) {
      throw new Error(error.message)
    }
    const url = import.meta.env.VITE_SUPABASE_STORAGE_URL

    const details = data as Owner

    owner.value = {
      ...details,
      avatar_url: `${url}/avatars/${details.avatar_url}`
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  if (pinId) {
    await getPinDetails(+pinId as number)
  }
})
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <p v-else-if="pin === null || owner === null">No pin details found</p>

  <section v-else class="wrapper rounded-3xl border-[1px] border-gray-50 shadow-md sm:w-2/3 mb-8">
    <figure>
      <img :src="pin.image" :alt="pin.name" class="rounded-t-[2rem]" />
    </figure>

    <article>
      <header class="px-6 py-8 space-y-2">
        <div class="flex justify-between items-center h-20">
          <p>Share</p>

          <div class="flex gap-4 items-center">
            <p>Board Name</p>
            <BaseButton class="bg-primary text-neutral">Save</BaseButton>
          </div>
        </div>

        <router-link v-if="pin.link" :to="pin.link" class="underline">
          {{ pin.link.split('/')[2] }}
        </router-link>

        <h1 v-if="pin.name" class="text-3xl font-semibold py-2">
          {{ capitalizeSentence(pin.name) }}
        </h1>

        <p v-if="pin.description" class="text-gray-500 py-2">
          {{ capitalizeSentence(pin.description) }}
        </p>

        <div class="flex justify-between items-center">
          <figure class="flex items-center gap-4 py-2">
            <img
              :src="owner.avatar_url"
              :alt="pin.name"
              class="w-12 h-12 object-cover rounded-full"
            />
            <figcaption class="font-medium">{{ owner.full_name }}</figcaption>
          </figure>

          <BaseButton class="bg-neutral-100">Follow</BaseButton>
        </div>
      </header>
      <form name="comment-form" class="px-6 pb-4 border-t-[1px]">
        <header class="py-6">
          <h2 class="text-xl font-semibold">1 Comment</h2>
        </header>

        <fieldset class="grid grid-cols-[auto,1fr] gap-4 items-center">
          <figure>
            <img
              :src="owner.avatar_url"
              :alt="pin.name"
              class="w-12 h-12 object-cover rounded-full"
            />
          </figure>

          <input
            type="text"
            placeholder="Add a comment"
            class="rounded-full bg-neutral-200 w-full py-4 px-6"
          />
        </fieldset>
      </form>
    </article>
  </section>
</template>
