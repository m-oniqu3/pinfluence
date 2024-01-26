<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SettingsView'
})
</script>

<script setup lang="ts"></script>

<template>
  <div class="wrapper mt-4 md:grid md:grid-cols-[25%,1fr] md:gap-4">
    <aside class="h-14 flex items-start md:h-full">
      <ul class="flex gap-6 items-center md:flex-col md:items-start">
        <li>
          <router-link :to="{ name: 'settings.profile' }">Profile</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'settings.account' }">Account Management</router-link>
        </li>

        <li>
          <router-link to="/settings/notifications">Notifications</router-link>
        </li>

        <li>
          <router-link to="/settings/privacy">Privacy</router-link>
        </li>

        <li>
          <router-link to="/settings/billing">Profile Visibility</router-link>
        </li>
      </ul>
    </aside>

    <router-view />
  </div>
</template>

<style scoped>
a {
  font-weight: 600;
  padding: 0.3rem 0;
}

a.router-link-active {
  border-bottom: 3px solid;
}
</style>
