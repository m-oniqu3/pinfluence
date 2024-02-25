<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OrganizeBoard'
})
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const { params } = router.currentRoute.value
const { profile, boardID } = params as { profile: string; boardID: string }
</script>

<template>
  <div>
    {{ profile }}
    {{ boardID }}
  </div>
</template>
