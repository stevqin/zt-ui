import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  { path: '/icon', component: () => import('../views/icon/Index.vue'), meta: { title: 'Icon 图标' } },
  { path: '/link', component: () => import('../views/link/Index.vue'), meta: { title: 'Link 链接' } },
  { path: '/text', component: () => import('../views/text/Index.vue'), meta: { title: 'Text 文本' } },
  { path: '/scrollbar', component: () => import('../views/scrollbar/Index.vue'), meta: { title: 'Scrollbar 滚动条' } },
  { path: '/popover', component: () => import('../views/popover/Index.vue'), meta: { title: 'Popover 弹出框' } },
  { path: '/popconfirm', component: () => import('../views/popconfirm/Index.vue'), meta: { title: 'Popconfirm 气泡确认框' } },
  { path: '/tabs', component: () => import('../views/tabs/Index.vue'), meta: { title: 'Tabs 标签页' } },
  { path: '/breadcrumb', component: () => import('../views/breadcrumb/Index.vue'), meta: { title: 'Breadcrumb 面包屑' } },
  { path: '/segmented', component: () => import('../views/segmented/Index.vue'), meta: { title: 'Segmented 分段控制器' } },
  { path: '/descriptions', component: () => import('../views/descriptions/Index.vue'), meta: { title: 'Descriptions 描述列表' } },
  { path: '/collapse', component: () => import('../views/collapse/Index.vue'), meta: { title: 'Collapse 折叠面板' } },
  { path: '/result', component: () => import('../views/result/Index.vue'), meta: { title: 'Result 结果' } },
  { path: '/image', component: () => import('../views/image/Index.vue'), meta: { title: 'Image 图片' } },
  { path: '/avatar', component: () => import('../views/avatar/Index.vue'), meta: { title: 'Avatar 头像' } },
  { path: '/upload', component: () => import('../views/upload/Index.vue'), meta: { title: 'Upload 上传' } },
  { path: '/input-otp', component: () => import('../views/input-otp/Index.vue'), meta: { title: 'InputOtp 一次性密码输入框' } },
  { path: '/menu', name: 'menu-demo', component: () => import('../views/menu/Index.vue'), meta: { title: 'Menu 菜单' } },
  { path: '/slider', component: () => import('../views/slider/Index.vue'), meta: { title: 'Slider 滑块' } },
  { path: '/progress', component: () => import('../views/progress/Index.vue'), meta: { title: 'Progress 进度条' } },
  { path: '/config-provider', component: () => import('../views/config-provider/Index.vue'), meta: { title: 'ConfigProvider 全局配置' } },
  { path: '/getting-started', component: () => import('../views/GettingStarted.vue'), meta: { title: '快速开始' } },
  { path: '/foundations', component: () => import('../views/Foundations.vue'), meta: { title: '设计基础' } },
  { path: '/conventions', component: () => import('../views/Conventions.vue'), meta: { title: '通用约定' } },
  { path: '/components', component: () => import('../views/Components.vue'), meta: { title: '组件索引' } },
  { path: '/roadmap', component: () => import('../views/Roadmap.vue'), meta: { title: '组件路线图' } },
  { path: '/scenarios', component: () => import('../views/Scenarios.vue'), meta: { title: '场景指南' } },
  { path: '/scenarios/:scene(form-entry|query-filter|data-list|overlay-edit|status-flow)', component: () => import('../views/Scenarios.vue'), meta: { title: '场景指南' } },
  { path: '/api', component: () => import('../views/Api.vue'), meta: { title: 'API 手册' } },
  { path: '/api/:component(icon|link|text|scrollbar|popover|popconfirm|tabs|breadcrumb|segmented|descriptions|collapse|result|image|avatar|upload|input-otp|menu|slider|progress|config-provider|button|tag|badge|radio|checkbox|switch|input|password|input-number|select|form|steps|pagination|modal|drawer|date-picker|date-time-picker|vtable-grid)', component: () => import('../views/Api.vue'), meta: { title: 'API 手册' } },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue'), meta: { title: '页面未找到' } },
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
    path: '/date-picker',
    component: () => import('../views/date-picker/Index.vue'),
    meta: { title: 'DatePicker 日期选择器' },
  },
  {
    path: '/date-time-picker',
    component: () => import('../views/date-time-picker/Index.vue'),
    meta: { title: 'DateTimePicker 日期时间选择器' },
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

const scrollPositions = new Map<string, number>()
export const router = createRouter({
  history: import.meta.env.PROD ? createWebHashHistory(import.meta.env.BASE_URL) : createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    const area = document.querySelector<HTMLElement>('.doc-layout')
    if (!area || (to.path === from.path && (!to.hash || to.hash === from.hash))) return false
    scrollPositions.set(from.fullPath, area.scrollTop)
    // Hash targets are handled after lazy page headings are collected in App.
    if (!to.hash && to.fullPath !== from.fullPath) {
      area.scrollTo({ top: saved ? scrollPositions.get(to.fullPath) ?? 0 : 0 })
    }
    return false
  },
})
