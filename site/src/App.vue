<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const nav = [
  { label: '指南', items: [
    { path: '/', label: '介绍' },
  ]},
  { label: '组件', items: [
    { path: '/button', label: 'Button 按钮' },
    { path: '/tag', label: 'Tag 标签' },
    { path: '/radio', label: 'Radio 单选框' },
    { path: '/checkbox', label: 'Checkbox 多选框' },
    { path: '/switch', label: 'Switch 开关' },
    { path: '/badge', label: 'Badge 徽标' },
    { path: '/steps', label: 'Steps 步骤条' },
    { path: '/pagination', label: 'Pagination 分页' },
    { path: '/modal', label: 'Modal 弹窗' },
    { path: '/drawer', label: 'Drawer 抽屉' },
  ]},
]

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="doc-layout">
    <aside class="doc-aside">
      <div class="doc-aside__logo" @click="go('/')">
        <span class="doc-aside__logo-icon">Zt</span>
        <span>Zt UI</span>
      </div>
      <nav v-for="group in nav" :key="group.label" class="doc-nav-group">
        <h4 class="doc-nav-group__title">{{ group.label }}</h4>
        <ul>
          <li v-for="item in group.items" :key="item.path">
            <a
              :class="['doc-nav-link', { 'is-active': route.path === item.path }]"
              @click="go(item.path)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="doc-main">
      <router-view />
    </main>
  </div>
</template>
