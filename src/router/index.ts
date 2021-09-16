import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    redirect: { path: '/home/park' },
    component: () => import('@/views/Home/Home.vue'),
    children: [
      {
        path: 'park',
        component: () => import('@/views/Park/HomePark.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router