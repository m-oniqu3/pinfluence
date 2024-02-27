<script setup lang="ts">
import BoardBody from '@/components/boards/BoardBody.vue'
import BoardProfileHeader from '@/components/boards/BoardHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { params } = router.currentRoute.value
const { profile, boardID } = params as { profile: string; boardID: string }
</script>

<template>
  <BoardProfileHeader class="mb-8" :boardID="+boardID" :userID="profile" />
  <BoardBody :userID="profile" :boardID="+boardID" />
</template>

<style scoped></style>
