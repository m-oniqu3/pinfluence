<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CommentPanel'
})
</script>

<script setup lang="ts">
import { ref } from 'vue'

const comments = ref([
  {
    id: 1,
    userName: { firstName: 'Alice', lastName: 'Smith' },
    comment: 'This forest is truly magical!',
    date: '2024-03-15'
  },
  {
    id: 2,
    userName: { firstName: 'Bob', lastName: 'Johnson' },
    comment: 'The scent of pine is so refreshing.',
    date: '2024-03-14'
  },
  {
    id: 3,
    userName: { firstName: 'Charlie', lastName: 'Brown' },
    comment: 'Exploring the forest floor is like stepping into a fairytale.',
    date: '2024-03-13'
  },
  {
    id: 4,
    userName: { firstName: 'Diana', lastName: 'Miller' },
    comment: 'The birdsong adds a beautiful melody to the atmosphere.',
    date: '2024-03-12'
  },
  {
    id: 5,
    userName: { firstName: 'Ethan', lastName: 'Clark' },
    comment: 'Such a peaceful escape from the hustle and bustle.',
    date: '2024-03-11'
  },
  {
    id: 6,
    userName: { firstName: 'Fiona', lastName: 'Davis' },
    comment: 'The play of sunlight through the leaves is mesmerizing.',
    date: '2024-03-10'
  },
  {
    id: 7,
    userName: { firstName: 'George', lastName: 'Turner' },
    comment: `Nature's artwork is on full display here.`,
    date: '2024-03-09'
  },
  {
    id: 8,
    userName: { firstName: 'Helen', lastName: 'Wright' },
    comment: 'Came here for solitude and found serenity.',
    date: '2024-03-08'
  },
  {
    id: 9,
    userName: { firstName: 'Isaac', lastName: 'Robinson' },
    comment: 'The forest comes alive with the symphony of birdcalls.',
    date: '2024-03-07'
  },
  {
    id: 10,
    userName: { firstName: 'Julia', lastName: 'Cooper' },
    comment: 'A hidden gem in the heart of nature.',
    date: '2024-03-06'
  }
])
</script>

<template>
  <article class="pb-6">
    <header class="flex justify-between items-center p-6">
      <h2 class="text-base font-bold">Comments</h2>
    </header>
    <ul class="px-6">
      <li v-for="comment in comments" :key="comment.id" id="comment-wrapper">
        <img
          id="comment-avatar"
          :src="`https://i.pravatar.cc/80?u=${comment.id}`"
          :alt="`${comment.userName.firstName} ${comment.userName.lastName}`"
          class="w-8 h-8 object-cover rounded-full"
        />

        <p id="comment-details">
          <span class="font-semibold pr-2">
            {{ comment.userName.firstName }} {{ comment.userName.lastName }}</span
          >
          <span>{{ comment.comment }}</span>
        </p>

        <p id="comment-actions" class="text-gray-500 w-36">
          {{ new Date(comment.date).toDateString() }}
        </p>
      </li>
    </ul>
  </article>
</template>

<style scoped>
#comment-wrapper {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.5rem;
  row-gap: 0.2rem;
}

#comment-avatar {
  grid-row: 1 / 3;
}

#comment-actions {
  display: flex;
  gap: 1rem;
}
</style>
