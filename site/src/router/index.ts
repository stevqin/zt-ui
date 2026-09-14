import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/button',
    component: () => import('../views/button/Index.vue'),
    meta: { title: 'Button 按钮' },
  },
  {
    path: '/tag',
    component: () => import('../views/tag/Index.vue'),
    meta: { title: 'Tag 标签' },
  },
  {
    path: '/radio',
    component: () => import('../views/radio/Index.vue'),
    meta: { title: 'Radio 单选框' },
  },
  {
    path: '/checkbox',
    component: () => import('../views/checkbox/Index.vue'),
    meta: { title: 'Checkbox 多选框' },
  },
  {
    path: '/switch',
    component: () => import('../views/switch/Index.vue'),
    meta: { title: 'Switch 开关' },
  },
  {
    path: '/badge',
    component: () => import('../views/badge/Index.vue'),
    meta: { title: 'Badge 徽标' },
  },
  {
    path: '/modal',
    component: () => import('../views/modal/Index.vue'),
    meta: { title: 'Modal 弹窗' },
  },
  {
    path: '/drawer',
    component: () => import('../views/drawer/Index.vue'),
    meta: { title: 'Drawer 抽屉' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
