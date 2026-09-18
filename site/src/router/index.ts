import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import { components } from '../docs/catalog';
const componentPages = import.meta.glob('../views/*/Index.vue');
const routes = [
  ...components.map((component) => ({
    path: component.path,
    name: component.routeName,
    component: componentPages[`../views${component.path}/Index.vue`],
    meta: {
      title: `${component.name} ${component.title}`,
      componentId: component.path.slice(1),
    },
  })),
  {
    path: '/feedback',
    component: () => import('../views/feedback/Index.vue'),
    meta: { title: 'Feedback 命令式反馈' },
  },
  {
    path: '/getting-started',
    component: () => import('../views/GettingStarted.vue'),
    meta: { title: '快速开始' },
  },
  {
    path: '/foundations',
    component: () => import('../views/Foundations.vue'),
    meta: { title: '设计基础' },
  },
  {
    path: '/conventions',
    component: () => import('../views/Conventions.vue'),
    meta: { title: '通用约定' },
  },
  {
    path: '/components',
    component: () => import('../views/Components.vue'),
    meta: { title: '组件索引' },
  },
  {
    path: '/roadmap',
    component: () => import('../views/Roadmap.vue'),
    meta: { title: '组件路线图' },
  },
  {
    path: '/scenarios',
    component: () => import('../views/Scenarios.vue'),
    meta: { title: '场景指南' },
  },
  {
    path: '/scenarios/:scene(form-entry|query-filter|data-list|overlay-edit|status-flow)',
    component: () => import('../views/Scenarios.vue'),
    meta: { title: '场景指南' },
  },
  {
    path: '/api',
    component: () => import('../views/Api.vue'),
    meta: { title: 'API 手册' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面未找到' },
  },
  {
    path: '/',
    component: () => import('../views/Home.vue'),
  },
];

const scrollPositions = new Map<string, number>();
export const router = createRouter({
  history: import.meta.env.PROD
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    const area = document.querySelector<HTMLElement>('.doc-layout');
    if (!area || (to.path === from.path && (!to.hash || to.hash === from.hash)))
      return false;
    scrollPositions.set(from.fullPath, area.scrollTop);
    // Hash targets are handled after lazy page headings are collected in App.
    if (!to.hash && to.fullPath !== from.fullPath) {
      area.scrollTo({
        top: saved ? (scrollPositions.get(to.fullPath) ?? 0) : 0,
      });
    }
    return false;
  },
});
