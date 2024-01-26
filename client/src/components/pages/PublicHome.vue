<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PublicHome'
})
</script>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { onMounted, ref } from 'vue'

const countries = ref([]) as any

async function getCountries() {
  const { data } = await supabase.from('countries').select()
  countries.value = data
}

onMounted(() => {
  getCountries()
})
</script>

<template>
  <p>public home</p>
  <ul>
    <li v-for="country in countries" :key="country.id">{{ country.name }}</li>
  </ul>
</template>
