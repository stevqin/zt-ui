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
    path: '/input',
    component: () => import('../views/input/Index.vue'),
    meta: { title: 'Input 输入框' },
  },
  {
    path: '/password',
    component: () => import('../views/password/Index.vue'),
    meta: { title: 'Password 密码框' },
  },
  {
    path: '/input-number',
    component: () => import('../views/input-number/Index.vue'),
    meta: { title: 'InputNumber 数字输入框' },
  },
  {
    path: '/select',
    component: () => import('../views/select/Index.vue'),
    meta: { title: 'Select 选择器' },
  },
  {
    path: '/form',
    component: () => import('../views/form/Index.vue'),
    meta: { title: 'Form 表单' },
  },
  {
    path: '/badge',
    component: () => import('../views/badge/Index.vue'),
    meta: { title: 'Badge 徽标' },
  },
  {
    path: '/steps',
    component: () => import('../views/steps/Index.vue'),
    meta: { title: 'Steps 步骤条' },
  },
  {
    path: '/pagination',
    component: () => import('../views/pagination/Index.vue'),
    meta: { title: 'Pagination 分页' },
  },
  {
    path: '/vtable-grid',
    component: () => import('../views/vtable-grid/Index.vue'),
    meta: { title: 'VTableGrid 数据表格' },
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
