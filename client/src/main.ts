import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useAuthStore } from '@/stores/auth'
import {
  faChevronDown,
  faCircleArrowUp,
  faCircleUser,
  faLock,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faSliders,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faMagnifyingGlass,
  faChevronDown,
  faCircleUser,
  faLock,
  faXmark,
  faCircleArrowUp,
  faPen,
  faPlus,
  faSliders
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

const userString = localStorage.getItem('sb-user')

const user = userString ? JSON.parse(userString) : null

console.log(user)
const auth = useAuthStore()

auth.setUser(user)

app.mount('#app')
