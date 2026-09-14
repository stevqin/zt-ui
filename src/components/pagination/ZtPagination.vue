<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { ZtPaginationProps } from './types'
import type { PagerItem } from './pagination'
import { buildPagerItems, normalizePagerCount } from './pagination'
import './pagination.scss'

defineOptions({ name: 'ZtPagination', inheritAttrs: false })

const props = withDefaults(defineProps<ZtPaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pagerCount: 7,
  pageSizes: () => [10, 20, 30, 40, 50, 100],
  layout: 'prev, pager, next, jumper, ->, total',
  size: 'default',
  small: false,
  background: false,
  disabled: false,
  hideOnSinglePage: false,
  prevText: '',
  nextText: '',
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  'current-change': [page: number]
  'size-change': [size: number]
  change: [page: number, size: number]
  'prev-click': [page: number]
  'next-click': [page: number]
}>()

function normalizePositiveInteger(value: number, fallback = 1) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback
}

const innerPageSize = ref(normalizePositiveInteger(props.pageSize, 10))
const effectivePageSize = computed(() => innerPageSize.value)
const totalPages = computed(() => {
  if (props.pageCount !== undefined) return normalizePositiveInteger(props.pageCount)
  return Math.max(1, Math.ceil(Math.max(0, props.total) / effectivePageSize.value))
})
const innerCurrentPage = ref(Math.min(totalPages.value, normalizePositiveInteger(props.currentPage)))
const current = computed(() => Math.min(totalPages.value, normalizePositiveInteger(innerCurrentPage.value)))
const effectiveSize = computed(() => props.small ? 'small' : props.size)
const pagerItems = computed(() => buildPagerItems(totalPages.value, current.value, props.pagerCount))
const jumpValue = ref(String(current.value))
const rootElement = ref<HTMLElement>()

watch(current, value => { jumpValue.value = String(value) })
watch(() => props.pageSize, value => { innerPageSize.value = normalizePositiveInteger(value, 10) })
watch(() => props.currentPage, value => {
  innerCurrentPage.value = Math.min(totalPages.value, normalizePositiveInteger(value))
})
watch(totalPages, pages => {
  const next = Math.min(pages, normalizePositiveInteger(innerCurrentPage.value))
  if (next === innerCurrentPage.value) return
  innerCurrentPage.value = next
  emit('update:currentPage', next)
  emit('current-change', next)
  emit('change', next, effectivePageSize.value)
})

const layoutGroups = computed(() => {
  const items = props.layout.split(',').map(item => item.trim()).filter(Boolean)
  const spacer = items.indexOf('->')
  return spacer < 0 ? [items] : [items.slice(0, spacer), items.slice(spacer + 1)]
})

const classes = computed(() => [
  'zt-pagination',
  `zt-pagination--${effectiveSize.value}`,
  {
    'is-background': props.background,
    'is-disabled': props.disabled,
  },
])

function setPage(page: number) {
  if (props.disabled) return false
  const next = Math.min(totalPages.value, Math.max(1, Math.floor(page)))
  if (next === current.value) return false
  innerCurrentPage.value = next
  emit('update:currentPage', next)
  emit('current-change', next)
  emit('change', next, effectivePageSize.value)
  return true
}

async function handlePager(item: PagerItem) {
  if (typeof item === 'number') return setPage(item)
  const offset = normalizePagerCount(props.pagerCount) - 2
  if (!setPage(current.value + (item === 'prev-more' ? -offset : offset))) return
  await nextTick()
  rootElement.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus()
}

function handlePrev() {
  const next = current.value - 1
  if (props.disabled || next < 1) return
  setPage(next)
  emit('prev-click', next)
}

function handleNext() {
  const next = current.value + 1
  if (props.disabled || next > totalPages.value) return
  setPage(next)
  emit('next-click', next)
}

function handleSize(event: Event) {
  if (props.disabled) return
  const size = normalizePositiveInteger(Number((event.target as HTMLSelectElement).value), effectivePageSize.value)
  if (size === effectivePageSize.value) return
  const previousPage = current.value
  innerPageSize.value = size
  const nextPage = Math.min(previousPage, totalPages.value)
  innerCurrentPage.value = nextPage
  emit('update:pageSize', size)
  emit('size-change', size)
  if (nextPage !== previousPage) {
    emit('update:currentPage', nextPage)
    emit('current-change', nextPage)
  }
  emit('change', nextPage, size)
}

function handleJump() {
  const value = Number(jumpValue.value)
  if (!Number.isFinite(value)) {
    jumpValue.value = String(current.value)
    return
  }
  const next = Math.min(totalPages.value, Math.max(1, Math.floor(value)))
  jumpValue.value = String(next)
  setPage(next)
}

function pagerLabel(item: PagerItem) {
  if (typeof item === 'number') return `第 ${item} 页`
  const offset = normalizePagerCount(props.pagerCount) - 2
  return item === 'prev-more' ? `向前 ${offset} 页` : `向后 ${offset} 页`
}
</script>

<template>
  <nav v-if="!(hideOnSinglePage && totalPages <= 1)" ref="rootElement" :class="classes" aria-label="分页" v-bind="$attrs">
    <div
      v-for="(group, groupIndex) in layoutGroups"
      :key="groupIndex"
      class="zt-pagination__group"
      :class="{ 'zt-pagination__group--right': groupIndex > 0 }"
    >
      <template v-for="(item, itemIndex) in group" :key="`${item}-${itemIndex}`">
        <span v-if="item === 'total'" class="zt-pagination__total">共 {{ total }} 条</span>

        <label v-else-if="item === 'sizes'" class="zt-pagination__sizes">
          <span class="zt-pagination__sr-only">每页条数</span>
          <select :value="effectivePageSize" :disabled="disabled" aria-label="每页条数" @change="handleSize">
            <option v-for="option in pageSizes" :key="option" :value="option">{{ option }} 条/页</option>
          </select>
        </label>

        <button v-else-if="item === 'prev'" type="button" class="zt-pagination__button zt-pagination__prev" :disabled="disabled || current <= 1" aria-label="上一页" @click="handlePrev">
          <span v-if="prevText">{{ prevText }}</span>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>

        <ol v-else-if="item === 'pager'" class="zt-pagination__pager">
          <li v-for="page in pagerItems" :key="page">
            <button
              type="button"
              class="zt-pagination__button zt-pagination__pager-button"
              :class="{ 'is-active': page === current, 'is-more': typeof page !== 'number' }"
              :disabled="disabled"
              :aria-label="pagerLabel(page)"
              :aria-current="page === current ? 'page' : undefined"
              @click="handlePager(page)"
            >{{ typeof page === 'number' ? page : '•••' }}</button>
          </li>
        </ol>

        <button v-else-if="item === 'next'" type="button" class="zt-pagination__button zt-pagination__next" :disabled="disabled || current >= totalPages" aria-label="下一页" @click="handleNext">
          <span v-if="nextText">{{ nextText }}</span>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>

        <label v-else-if="item === 'jumper'" class="zt-pagination__jumper">
          <span>前往</span>
          <input v-model="jumpValue" type="number" min="1" :max="totalPages" :disabled="disabled" aria-label="跳转页码" @change="handleJump" @keydown.enter="handleJump" />
          <span>页</span>
        </label>

        <span v-else-if="item === 'slot'" class="zt-pagination__slot"><slot /></span>
      </template>
    </div>
  </nav>
</template>
