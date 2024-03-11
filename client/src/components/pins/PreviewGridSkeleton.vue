<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewGridSkeleton'
})
</script>

<script setup lang="ts">
const skeletons = Array.from({ length: 16 }, (_, i) => i)
</script>

<template>
  <div id="saved-pins">
    <div id="container" class="mx-auto" v-for="skeleton in skeletons" :key="skeleton">
      <div id="grid-wrapper" class="bg-white rounded-2xl">
        <div id="preview-grid-1" class="rounded-tl-2xl rounded-bl-2xl bg-neutral-200" />
        <div id="preview-grid-2" class="rounded-tr-2xl bg-neutral-200" />
        <div id="preview-grid-3" class="rounded-br-2xl bg-neutral-200" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 14.75rem;
}

#grid-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1px;
  width: 14.75rem;
  height: 9.8rem;
}

#preview-grid-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  height: 9.8rem;
}

#preview-grid-2 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  height: calc(9.8rem / 2 - 0.5px);
}

#preview-grid-3 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  height: calc(9.8rem / 2 - 0.5px);
}

#saved-pins {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
  column-gap: 1rem;
  row-gap: 1.5rem;
  margin: 0 auto;
}

@media (max-width: 768px) {
  #saved-pins {
    max-width: 500px;
  }
}

@media (max-width: 1024px) {
  #saved-pins {
    max-width: 750px;
  }
}

@media (max-width: 1200px) {
  #saved-pins {
    max-width: 1000px;
  }
}

@media (min-width: 1201px) {
  #saved-pins {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    max-width: 1200px;
    column-gap: 1.5rem;
  }
}
</style>
