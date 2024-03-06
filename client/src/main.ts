import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { useAuthStore } from '@/stores/auth'
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faChevronDown,
  faCircleArrowUp,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCircleUser,
  faCircleXmark,
  faEllipsis,
  faGears,
  faLock,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faSliders,
  faTrash,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faArrowUp,
  faEllipsis,
  faArrowLeft,
  faMagnifyingGlass,
  faChevronDown,
  faCircleUser,
  faLock,
  faXmark,
  faCircleArrowUp,
  faPen,
  faPlus,
  faSliders,
  faGears,
  faArrowRight,
  faTrash,
  faCircleCheck,
  faCircleXmark,
  faCircleInfo,

  faCircleExclamation
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.component('font-awesome-icon', FontAwesomeIcon)

const userString = localStorage.getItem('sb-user')

const user = userString ? JSON.parse(userString) : null

const auth = useAuthStore()

auth.setUser(user)

app.mount('#app')
