<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PinPreview'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { type PinPreview } from '@/types/pin'
import { defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
  details: PinPreview
}>()

const router = useRouter()

const hovering = ref(false)

onMounted(() => {
  // if (props.details.board_id) {
  //   boardName.value = boardStore.boardKeys ? boardStore.boardKeys[props.details.board_id] : ''
  // }
})

function loadImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.classList.add('lazyloaded')
}

function savePin(event: Event) {
  //capture click event
  event.stopPropagation()
  console.log('saving pin')
}
</script>

<template>
  <figure
    class="relative break-inside-avoid"
    :style="{ minHeight: '300px' }"
    @mouseover="hovering = true"
    @mouseout="hovering = false"
  >
    <!-- <router-link :to="{ name: 'pin-details', params: { id: props.details.id } }"> -->
    <figcaption
      v-show="hovering"
      class="absolute h-full w-full p-4 rounded-2xl z-0"
      :class="hovering ? 'bg-black bg-opacity-50' : ''"
      @click="router.push({ name: 'pin-details', params: { id: props.details.id } })"
    >
      <div class="flex justify-between items-center z-[1]" @click.stop>
        <h1 class="text-white font-bold text-base truncate">Architecture</h1>
        <BaseButton class="bg-primary text-white self-start" @click.stop="savePin($event)"
          >Save</BaseButton
        >
      </div>
    </figcaption>

    <img
      :src="props.details.image"
      :alt="props.details.name"
      class="rounded-2xl h-full w-full mb-8 object-cover lazyload bg-slate-300"
      @load="loadImage"
    />
    <!-- </router-link> -->
  </figure>
</template>

<style scoped>
.lazyload {
  opacity: 50%;
  transition: opacity 0.3s ease-in-out;
}

.lazyloaded {
  opacity: 1;
}
</style>
