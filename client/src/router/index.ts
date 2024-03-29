import { useAuthStore } from '@/stores/auth'

import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/verification/',
      name: 'verification',
      component: () => import('../views/VerificationView.vue'),
      beforeEnter: [authGuard, requireToken]
    },
    {
      path: '/about',
      name: 'about',

      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:profile',
      name: 'profile',
      beforeEnter: (to, _from, next) => {
        if (!to.params.profile) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
      component: () => import('../views/ProfileView.vue'),
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

    // /:profile/:board
    {
      path: '/:profile/:boardID',
      name: 'board-details',
      beforeEnter: (to, _from, next) => {
        if (!to.params.profile || !to.params.boardID) {
          next({ name: 'home', query: { ...to.query, showError: 'true' }, state: { message: 'Could not find board' } })
        } else {
          next()
        }
      },

      component: () => import('../views/BoardView.vue')
    },

    // /:profile/:board/organize
    {
      path: '/:profile/:boardID/organize',
      name: 'organize-board',

      beforeEnter: (to, _from, next) => {
        const auth = useAuthStore()
        if (!to.params.profile || !to.params.boardID) {
          next({
            name: 'home',
            query: { ...to.query, showError: 'true' },
            state: { message: 'Could not find board to organize' }
          })
        } else if (to.params.profile !== auth.user?.id) {
          //  check if user is organizer
          next({
            name: 'home',
            query: { ...to.query, showError: 'true' },
            state: {
              message: 'Oops! You are not authorized to organize this board.'
            }
          })
        } else {
          next()
        }
      },

      component: () => import('../views/OrganizeBoard.vue'),
      meta: { requiresAuth: true }
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
      path: '/pin/:id',
      name: 'pin-details',
      component: () => import('../views/PinDetails.vue')
    }
    // {
    //   path: '/search/pins/:query',
    //   name: 'search',
    //   component: SearchView,
    //   meta: { requiresAuth: true }
    // },
  ]
})

// global navigation guard

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.user?.id) {
    next({ name: 'login' })
  } else {
    next()
  }
})

function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  console.log('authGuard')

  const auth = useAuthStore()

  if (auth.user) {
    next({ name: 'home' }) // Redirect to home if user is already authenticated
  } else {
    next() // Proceed to login if not authenticated
  }
}

function requireToken(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  console.log('requireToken')

  if (!to.hash) {
    next({ name: 'logout' })
  } else {
    next()
  }
}
export default router
