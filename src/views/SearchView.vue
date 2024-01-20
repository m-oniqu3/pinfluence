<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchView'
})
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const param = ref(route.params.query as string)

//when the param changes, fetch new photos
watch(
  () => route.params.query,
  (newQuery) => {
    //fetch new photos here
    param.value = newQuery as string
  }
)
</script>

<template>
  <p>Search for: {{ param }}</p>
  <!-- <section class="wrapper">
    <InfiniteScroll :isLoading="isLoading" @load-more="loadMorePhotos(page++, param)">
      <PhotoList :photos="photos" />
    </InfiniteScroll>
  </section> -->
</template>
