import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
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
      path: '/:profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      redirect: { name: 'settings.profile' },
      component: () => import('../views/SettingsView.vue'),
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
