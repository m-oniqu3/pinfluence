import './assets/main.css'

import LogIn from '@/components/LogIn.vue'
import SignUp from '@/components/SignUp.vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faChevronDown,
  faCircleArrowUp,
  faCircleUser,
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
app.component('log-in', LogIn)
app.component('sign-up', SignUp)

app.mount('#app')
