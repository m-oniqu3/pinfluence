<script lang="ts">
import type { PexelsPhoto } from '@/types/pexels'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinDetailsView'
})
</script>

<script setup lang="ts">
import pexelsClient from '@/lib/pexelsClient'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pinId = route.params.id as string | undefined

const pinDetails: Ref<PexelsPhoto | null> = ref(null)
const loading = ref(false)

async function getPinDetails(id: string) {
  loading.value = true
  try {
    const response = (await pexelsClient.photos.show({ id: id })) as unknown as PexelsPhoto

    pinDetails.value = response
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (pinId) {
    await getPinDetails(pinId as string)
  }
})
</script>

<template>
  <div>
    <h1>Pin Details</h1>
    <p>Pin ID: {{ pinId }}</p>
    <p v-if="loading">Loading...</p>
    <p v-else-if="pinDetails === null">No pin details found</p>
    <section v-else>
      <img :src="pinDetails.src.medium" :alt="pinDetails.photographer" />
      <p>Photographer: {{ pinDetails.photographer }}</p>
      <p>
        Photographer URL:
        <a :href="pinDetails.photographer_url">{{ pinDetails.photographer_url }}</a>
      </p>
      <p>
        Pin URL: <a :href="pinDetails.url">{{ pinDetails.url }}</a>
      </p>
    </section>
  </div>
</template>
