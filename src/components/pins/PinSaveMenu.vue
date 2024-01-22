<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinSaveMenu'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import { defineEmits, defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
  isMenuOpen: boolean
  positions: { x: number; y: number }
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
  (event: 'setMenuDemensions', dimensions: { width: number; height: number }): void
}>()

const menu = ref<HTMLElement | null>(null)
const menuDimensions = ref({ width: 0, height: 0 })

onMounted(() => {
  if (menu.value) {
    const { width, height } = menu.value.getBoundingClientRect()
    menuDimensions.value = {
      width,
      height
    }
    emit('setMenuDemensions', menuDimensions.value)
    console.log('menuDimensions', menuDimensions.value)
  }
})
</script>

<template>
  <div>
    <AppMenu :positions="props.positions" v-if="props.isMenuOpen" @close-menu="emit('closeMenu')">
      <section class="py-3 w-[360px] h-[500px]" ref="menu" @click.stop>
        <h1>Save</h1>
      </section>
    </AppMenu>
  </div>
</template>
