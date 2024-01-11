<script lang="ts">
import { useSearchPexels } from '@/composables/useSearchPexel'
import { defineComponent } from 'vue'

import PhotoList from '@/components/PhotoList.vue'

export default defineComponent({
  name: 'SearchView'
})
</script>

<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const param = ref(route.params.query as string)

const { isLoading, photos, fetchfirstBatchOfPhotos, loadMorePhotos } = useSearchPexels()
const page = ref(1)

onMounted(() => {
  if (param.value) fetchfirstBatchOfPhotos(param.value)
})

//when the param changes, fetch new photos
watch(
  () => route.params.query,
  (newQuery) => {
    fetchfirstBatchOfPhotos(newQuery as string)
    param.value = newQuery as string
  }
)
</script>

<template>
  <section class="wrapper">
    <InfiniteScroll :isLoading="isLoading" @load-more="loadMorePhotos(page++, param)">
      <PhotoList :photos="photos" />
    </InfiniteScroll>
  </section>
</template>
