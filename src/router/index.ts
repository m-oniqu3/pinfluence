import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
      redirect: { name: 'profile.created' },
      children: [
        {
          path: 'created',
          name: 'profile.created',
          component: () => import('@/components/pins/CreatedPins.vue')
        },
        {
          path: 'saved',
          name: 'profile.saved',
          component: () => import('@/components/pins/SavedPins.vue')
        }
      ]
    },

    {
      path: '/settings',
      name: 'settings',
      redirect: { name: 'settings.profile' },
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'profile',
          name: 'settings.profile',
          component: () => import('@/components/settings/ProfileSettings.vue')
        },
        {
          path: 'account',
          name: 'settings.account',
          component: () => import('@/components/settings/AccountSettings.vue')
        }
      ]
    },
    {
      path: '/search/pins/:query',
      name: 'search',
      component: SearchView
    },
    {
      path: '/pin/:id',
      name: 'pin-details',
      component: () => import('../views/PinDetails.vue')
    }
  ]
})

// global navigation guard

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuth) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
