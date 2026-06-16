import { createRouter, createWebHistory, type RouteRecordRaw, type RouteMeta as VueRouteMeta } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    roles?: string[]
    icon?: string
    keepAlive?: boolean
  }
}

// Layout components
const MainLayout = () => import('@/layouts/MainLayout.vue')

/**
 * Static Routes - Always accessible
 */
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '页面不存在' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

/**
 * Dynamic Routes
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { title: '松间心舍' },
  },
  {
    path: '/chat',
    name: 'Main',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'AIChat',
        component: () => import('@/views/ai/AIChatView.vue'),
        meta: { title: '松间心舍' },
      },
    ],
  },
  {
    path: '/chat/memory',
    name: 'MemoryTimeline',
    component: () => import('@/views/dashboard/MemoryTimeline.vue'),
    meta: { title: '成长年轮' },
  },
  {
    path: '/practice',
    name: 'PracticeSpace',
    component: () => import('@/views/practice/PracticeSpaceView.vue'),
    meta: { title: '疗愈岛屿' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...staticRoutes, ...dynamicRoutes],
})

/**
 * Navigation Guards
 */
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title
    ? `${to.meta.title}`
    : '松间心舍'

  next()
})

router.afterEach((to) => {
  window.scrollTo(0, 0)
  console.log('Navigated to:', to.path)
})

export default router
