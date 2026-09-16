<script setup lang="ts">
import { useZtSize, useZtConfig } from '../config-provider/context'
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, type Component } from 'vue'
import { register, themes, type ListTable } from '@visactor/vtable'
import { ZtButton } from '../button'
import { ZtCheckbox } from '../checkbox'
import { ZtPagination } from '../pagination'
import { createLatestQueryRunner, normalizePagination, normalizeQueryResult } from './data'
import { createSelectionStore } from './selection'
import { createEditStore } from './editing'
import { createColumnSettingsStore } from './column-settings'
import { buildSummaryValues } from './summary'
import { toCsv } from './csv'
import { ACTION_FIELD, SUMMARY_FIELD, buildVTableColumns, resolveActionButtons, resolveRowKey } from './columns'
import { registerGridEditors } from './editors'
import type {
  ZtVTableGridActionButton,
  ZtVTableGridActionPayload,
  ZtVTableGridCellChangePayload,
  ZtVTableGridColumnSettingsValue,
  ZtVTableGridLoadedPayload,
  ZtVTableGridPageChangePayload,
  ZtVTableGridProps,
  ZtVTableGridSavePayload,
  ZtVTableGridSort,
} from './types'
import './vtable-grid.scss'

defineOptions({ name: 'ZtVTableGrid', inheritAttrs: false })

type Row = Record<string, unknown>
type FormData = Record<string, unknown>

const props = withDefaults(defineProps<ZtVTableGridProps<Row, FormData>>(), {
  records: () => [],
  formData: () => ({} as FormData),
  pagination: true,
  currentPage: 1,
  rowKey: 'id' as keyof Row & string,
  height: 480,
  loading: false,
  autoLoad: true,
  disabled: false,
  checkbox: false,
  reserveCheckbox: true,
  actionButtons: () => ['detail', 'edit', 'delete'],
  showActionsColumn: false,
  editable: false,
  summary: false,
  columnSettings: false,
  toolbar: () => ['reload'],
  tableOptions: () => ({}),
})
const configSize = useZtSize(props)
const provider = useZtConfig()


const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  loaded: [payload: ZtVTableGridLoadedPayload<Row>]
  error: [error: unknown]
  'page-change': [payload: ZtVTableGridPageChangePayload]
  'sort-change': [sort: ZtVTableGridSort]
  'selection-change': [rows: Row[]]
  action: [payload: ZtVTableGridActionPayload<Row>]
  create: []
  import: []
  export: [content: string]
  'cell-change': [payload: ZtVTableGridCellChangePayload<Row>]
  save: [payload: ZtVTableGridSavePayload<Row>]
  'save-error': [error: unknown]
  'row-click': [row: Row, event: unknown]
  'row-dblclick': [row: Row, event: unknown]
  'column-settings-change': [value: ZtVTableGridColumnSettingsValue]
}>()

type TableRef = { vTableInstance?: ListTable | null }
const VueListTable = shallowRef<Component | null>(null)
const tableRef = ref<TableRef | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const displayedRecords = shallowRef<Row[]>([])
const renderedRecords = shallowRef<Row[]>([])
const innerLoading = ref(false)
const loadError = ref<unknown>(null)
const total = ref(0)
const declaredPageSize = typeof props.pagination === 'object' ? props.pagination.pageSize : undefined
const paginationState = normalizePagination({ currentPage: props.currentPage, pageSize: props.pageSize ?? declaredPageSize ?? 200 })
const innerCurrentPage = ref(paginationState.currentPage)
const innerPageSize = ref(paginationState.pageSize)
const sort = ref<ZtVTableGridSort>({ order: 'normal' })
const queryRunner = createLatestQueryRunner()
const getRowKey = (row: Row) => resolveRowKey(row, props.rowKey ?? ('id' as keyof Row & string))
const selection = createSelectionStore<Row>(getRowKey)
const selectionVersion = ref(0)
const edits = createEditStore<Row>(getRowKey)
const editVersion = ref(0)
const settingsVersion = ref(0)
let settings = createColumnSettingsStore(props.columns, columnSettingsOptions())
const actionMenu = shallowRef<{ row: Row; items: Array<ReturnType<typeof resolveActionButtons<Row>>[number]> } | null>(null)
const settingsOpen = ref(false)
const summaryValues = ref<Record<string, unknown>>({})
let querySequence = 0

function columnSettingsOptions() {
  const config = typeof props.columnSettings === 'object' ? props.columnSettings : {}
  return { storageKey: config.storageKey }
}

const tableInstance = computed(() => tableRef.value?.vTableInstance ?? null)
const actualLoading = computed(() => props.loading || innerLoading.value)
const paginationConfig = computed(() => typeof props.pagination === 'object' ? props.pagination : {})
const paginationEnabled = computed(() => props.pagination !== false)
const containerStyle = computed(() => ({ height: typeof props.height === 'number' ? `${props.height}px` : props.height }))
const settingsEnabled = computed(() => props.columnSettings === true || (typeof props.columnSettings === 'object' && props.columnSettings.enabled !== false))
const toolbarItems = computed(() => props.toolbar === false ? [] : props.toolbar)
const columnSettingsValue = computed(() => {
  settingsVersion.value
  return settings.value()
})
const orderedSettingsColumns = computed(() => {
  const byKey = new Map(props.columns.map(column => [columnKey(column), column]))
  return columnSettingsValue.value.order
    .map(key => byKey.get(key))
    .filter((column): column is (typeof props.columns)[number] => Boolean(column))
})
const nativeColumns = computed(() => buildVTableColumns(props.columns, {
  settings: columnSettingsValue.value,
  checkbox: props.checkbox,
  showActionsColumn: props.showActionsColumn,
  editable: props.editable,
  disabled: props.disabled,
  isRowSelected: selection.has,
  actionsWidth: 108,
}))
const nativeOptions = computed(() => {
  const { records: _records, columns: _columns, pagination: _pagination, ...safeOptions } = props.tableOptions
  const rowHeights = {
    mini: [28, 32],
    small: [32, 36],
    default: [36, 40],
    medium: [40, 44],
    large: [44, 48],
  } as const
  const [defaultRowHeight, defaultHeaderRowHeight] = rowHeights[configSize.value]
  return {
    theme: provider.theme.value === 'dark' ? themes.DARK.extends({
      defaultStyle: { bgColor: '#3b4554', color: '#e4eaf3', borderColor: '#5c697c' },
      headerStyle: { bgColor: '#465160', color: '#e4eaf3', borderColor: '#5c697c' },
      bodyStyle: { bgColor: '#3b4554', color: '#e4eaf3', borderColor: '#5c697c', hover: { cellBgColor: '#40577a' } },
      frameStyle: { borderColor: '#5c697c' },
    }) : themes.DEFAULT,
    autoFillWidth: true,
    widthMode: 'adaptive',
    defaultRowHeight,
    defaultHeaderRowHeight,
    keyboardOptions: { moveFocusCellOnTab: true, editCellOnEnter: true },
    hover: { highlightMode: 'row' },
    select: { highlightMode: 'cell' },
    ...safeOptions,
    columns: nativeColumns.value,
  }
})
// The native options update recreates the data source. Restore our managed rows
// after the child has applied theme, size, or other option changes.
watch(nativeOptions, async () => {
  await nextTick()
  tableInstance.value?.setRecords(renderedRecords.value)
}, { flush: 'post' })
const changes = computed(() => {
  editVersion.value
  return edits.payload()
})
const selectedRows = computed(() => {
  selectionVersion.value
  return selection.rows()
})

watch(() => props.currentPage, value => { innerCurrentPage.value = normalizePagination({ currentPage: value }).currentPage })
watch(
  [() => props.pageSize, () => typeof props.pagination === 'object' ? props.pagination.pageSize : undefined],
  ([value, configValue]) => { innerPageSize.value = normalizePagination({ pageSize: value ?? configValue ?? 200 }).pageSize },
)
watch(() => props.columns, value => {
  settings = createColumnSettingsStore(value, columnSettingsOptions())
  settingsVersion.value += 1
  tableInstance.value?.updateColumns(nativeColumns.value)
}, { deep: true })
watch(() => props.records, () => { if (!props.proxyConfig) void query(false) }, { deep: true })

function currentPageRows(rows: Row[]) {
  if (!paginationEnabled.value) return rows
  const start = (innerCurrentPage.value - 1) * innerPageSize.value
  return rows.slice(start, start + innerPageSize.value)
}

async function applyRows(rows: Row[], nextTotal: number, backendSummary: Record<string, unknown> | null = null) {
  const previousSelection = selection.keys()
  const withDrafts = edits.apply(rows)
  displayedRecords.value = withDrafts
  total.value = nextTotal
  selection.replacePage(withDrafts, props.reserveCheckbox)
  selectionVersion.value += 1
  if (!sameKeys(selection.keys(), previousSelection)) {
    emit('selection-change', selection.rows())
  }
  summaryValues.value = buildSummaryValues(props.columns, withDrafts, backendSummary)
  renderedRecords.value = withSummaryRecord(withDrafts)
  await nextTick()
  tableInstance.value?.setRecords(renderedRecords.value)
  tableInstance.value?.resize()
}

function sameKeys(left: Array<string | number>, right: Array<string | number>) {
  return left.length === right.length && left.every((key, index) => Object.is(key, right[index]))
}

function withSummaryRecord(rows: Row[]) {
  if (!props.summary) return rows
  const config = typeof props.summary === 'object' ? props.summary : {}
  if (!rows.length && !config.showWhenEmpty) return rows
  const orderedKeys = columnSettingsValue.value.order
  const visibleKeys = new Set(columnSettingsValue.value.visible)
  const byKey = new Map(props.columns.map(column => [columnKey(column), column]))
  const firstColumn = orderedKeys.map(key => byKey.get(key)).find(column => column && visibleKeys.has(columnKey(column)))
  const summaryRow: Record<string, unknown> = {
    ...summaryValues.value,
    [SUMMARY_FIELD]: true,
  }
  if (firstColumn) summaryRow[firstColumn.field] = config.label ?? '合计'
  return [...rows, summaryRow as Row]
}

async function query(resetPage = false) {
  const request = ++querySequence
  if (resetPage) innerCurrentPage.value = 1
  loadError.value = null
  innerLoading.value = true
  try {
    if (props.proxyConfig) {
      const result = await queryRunner.run<Row>(() => props.proxyConfig!({
        page: innerCurrentPage.value,
        pageSize: innerPageSize.value,
        sort: { ...sort.value },
        form: { ...props.formData } as FormData,
      }))
      if (result.stale || request !== querySequence) return
      await applyRows(result.data, result.total, result.summaryData)
      emit('loaded', { data: result.data, total: result.total, summaryData: result.summaryData })
    } else {
      queryRunner.invalidate()
      const source = sortLocalRows(props.records)
      const result = normalizeQueryResult<Row>({ data: currentPageRows(source), total: source.length })
      await applyRows(result.data, result.total)
      emit('loaded', { data: result.data, total: result.total, summaryData: null })
    }
  } catch (error) {
    if (request !== querySequence) return
    loadError.value = error
    emit('error', error)
  } finally {
    if (request === querySequence) innerLoading.value = false
  }
}

function sortLocalRows(rows: Row[]) {
  if (sort.value.order === 'normal' || sort.value.field === undefined) return rows
  const fields = Array.isArray(sort.value.field) ? sort.value.field : [sort.value.field]
  if (!fields.length) return rows
  const direction = sort.value.order === 'asc' ? 1 : -1
  return [...rows].sort((first, second) => {
    for (const field of fields) {
      const left = first[field]
      const right = second[field]
      const column = props.columns.find(item => item.field === String(field))
      const compared = typeof column?.sort === 'function'
        ? column.sort(left, right)
        : typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true })
      if (compared) return compared * direction
    }
    return 0
  })
}

const reload = () => query(false)
const resize = () => tableInstance.value?.resize()

async function handlePage(page: number) {
  innerCurrentPage.value = page
  emit('update:currentPage', page)
  emit('page-change', { currentPage: page, pageSize: innerPageSize.value })
  await query(false)
}

async function handlePageSize(size: number) {
  innerPageSize.value = size
  innerCurrentPage.value = 1
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
  emit('page-change', { currentPage: 1, pageSize: size })
  await query(false)
}

function rowFromEvent(event: any) {
  if (event?.originData && typeof event.originData === 'object') {
    if (event.originData[SUMMARY_FIELD]) return undefined
    return event.originData as Row
  }
  return displayedRecords.value[Math.max(0, Number(event?.row ?? 1) - 1)]
}

function handleCheckbox(event: any) {
  if (props.disabled) return
  if (Number(event?.row) === 0 || event?.isHeader) {
    selection.selectPage(displayedRecords.value, Boolean(event.checked ?? event.value))
    selectionVersion.value += 1
    emit('selection-change', selection.rows())
    syncSelectionToTable()
    return
  }
  const row = rowFromEvent(event)
  if (!row) return
  selection.toggle(row, Boolean(event.checked ?? event.value))
  selectionVersion.value += 1
  emit('selection-change', selection.rows())
  syncSelectionToTable()
}

function handleSort(event: any) {
  if (props.disabled) return
  sort.value = { field: event.field, order: event.order ?? 'normal' }
  emit('sort-change', { ...sort.value })
  void query(true)
}

function handleCellChange(event: any) {
  if (props.disabled) return
  const row = rowFromEvent(event)
  const field = String(event.field ?? tableInstance.value?.getHeaderField?.(event.col, 0) ?? '')
  if (!row || !field || field === ACTION_FIELD) return
  const oldValue = event.rawValue ?? event.oldValue
  const value = event.changedValue ?? event.currentValue ?? event.value ?? row[field]
  ;(row as Record<string, unknown>)[field] = value
  edits.record(row, field, oldValue, value)
  editVersion.value += 1
  emit('cell-change', { row, field, oldValue, value, event })
}

function handleRowClick(event: any, name: 'row-click' | 'row-dblclick') {
  if (props.disabled) return
  const row = rowFromEvent(event)
  if (!row) return
  if (name === 'row-click') emit('row-click', row, event)
  else emit('row-dblclick', row, event)
}

function handleActionCell(event: any) {
  if (props.disabled) return
  const row = rowFromEvent(event)
  if (!row) return
  actionMenu.value = { row, items: resolveActionButtons(props.actionButtons, row) }
}

function runAction(item: ZtVTableGridActionButton<Row>) {
  if (props.disabled) return
  const menu = actionMenu.value
  if (!menu || item.disabled) return
  item.handler?.(menu.row as Row)
  emit('action', { type: item.type, row: menu.row as Row, item })
  actionMenu.value = null
}

function toolbarAction(item: string) {
  if (props.disabled) return
  if (item === 'create') emit('create')
  else if (item === 'import') emit('import')
  else if (item === 'export') exportCsv()
  else if (item === 'reload') void reload()
}

function updateRecords(records: Row[], nextTotal = records.length) {
  void applyRows(records, nextTotal)
}

function clearSelection() {
  selection.clear()
  selectionVersion.value += 1
  emit('selection-change', [])
  syncSelectionToTable()
}

function setSelectedKeys(keys: Array<string | number>) {
  selection.setKeys(keys)
  selectionVersion.value += 1
  emit('selection-change', selection.rows())
  syncSelectionToTable()
}

function syncSelectionToTable() {
  nextTick(() => tableInstance.value?.setRecords(renderedRecords.value))
}

async function saveChanges() {
  const payload = edits.payload()
  if (!payload.changedRowCount) return
  try {
    await props.batchSave?.(payload)
    edits.clear()
    editVersion.value += 1
    emit('save', payload)
  } catch (error) {
    emit('save-error', error)
    throw error
  }
}

function cancelChanges() {
  const restored = edits.restoreRows(displayedRecords.value)
  edits.clear()
  editVersion.value += 1
  void applyRows(restored, total.value)
}

function exportCsv(filename = 'data.csv') {
  const byKey = new Map(props.columns.map(column => [columnKey(column), column]))
  const exportColumns = columnSettingsValue.value.order
    .filter(key => columnSettingsValue.value.visible.includes(key))
    .map(key => byKey.get(key))
    .filter((column): column is (typeof props.columns)[number] => Boolean(column))
  const content = toCsv(exportColumns, displayedRecords.value)
  emit('export', content)
  if (typeof document !== 'undefined' && typeof URL.createObjectURL === 'function') {
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return content
}

function refreshColumns() {
  settingsVersion.value += 1
  renderedRecords.value = withSummaryRecord(displayedRecords.value)
  emit('column-settings-change', settings.value())
  nextTick(() => {
    tableInstance.value?.updateColumns(nativeColumns.value)
    tableInstance.value?.setRecords(renderedRecords.value)
  })
}

function columnKey(column: (typeof props.columns)[number]) {
  return column.key ?? column.field
}

function columnTitle(column: (typeof props.columns)[number]) {
  return String(column.title ?? column.field)
}

function isColumnVisible(column: (typeof props.columns)[number]) {
  return columnSettingsValue.value.visible.includes(columnKey(column))
}

function setColumnVisible(column: (typeof props.columns)[number], visible: boolean) {
  settings.setVisible(columnKey(column), visible)
  refreshColumns()
}

function moveColumn(column: (typeof props.columns)[number], offset: number) {
  settings.move(columnKey(column), offset)
  refreshColumns()
}

function resetColumnSettings() {
  settings.reset()
  refreshColumns()
}

function handleReady() {
  tableInstance.value?.setRecords(renderedRecords.value)
  tableInstance.value?.resize()
}

function handleGlobalPointer(event: PointerEvent) {
  if (actionMenu.value && !bodyRef.value?.contains(event.target as Node)) actionMenu.value = null
  if (settingsOpen.value && !(event.target as Element)?.closest?.('.zt-vtable-grid__settings-wrap')) settingsOpen.value = false
}

registerGridEditors((name, editor) => register.editor(name, editor as any))
onMounted(async () => {
  document.addEventListener('pointerdown', handleGlobalPointer)
  if (props.autoLoad || !props.proxyConfig) void query(false)
  const { ListTable } = await import('@visactor/vue-vtable')
  VueListTable.value = markRaw(ListTable)
  await nextTick()
})
onBeforeUnmount(() => {
  queryRunner.invalidate()
  document.removeEventListener('pointerdown', handleGlobalPointer)
})

defineExpose({
  query,
  reload,
  resize,
  setRecords: updateRecords,
  getTableInstance: () => tableInstance.value,
  getSelectedRows: selection.rows,
  getSelectedKeys: selection.keys,
  setSelectedKeys,
  clearSelection,
  getChanges: edits.payload,
  saveChanges,
  cancelChanges,
  exportCsv,
})
</script>

<template>
  <section class="zt-vtable-grid" :class="[`zt-vtable-grid--${configSize}`, { 'is-disabled': disabled }]" :style="containerStyle" v-bind="$attrs">
    <div v-if="$slots.form" class="zt-vtable-grid__form">
      <slot name="form" :form-data="formData" :query="query" :reload="reload" />
    </div>

    <header v-if="toolbarItems.length || $slots['toolbar-left'] || $slots['toolbar-right']" class="zt-vtable-grid__toolbar" aria-label="表格工具栏">
      <div class="zt-vtable-grid__toolbar-group">
        <slot name="toolbar-left" :query="query" :reload="reload" :selected-rows="selectedRows" />
        <ZtButton v-if="toolbarItems.includes('create')" :size="configSize" status="primary" :disabled="disabled" aria-label="新建" @click="toolbarAction('create')">新建</ZtButton>
      </div>
      <div class="zt-vtable-grid__toolbar-group zt-vtable-grid__toolbar-group--right">
        <slot name="toolbar-right" :query="query" :reload="reload" :selected-rows="selectedRows" />
        <ZtButton v-if="toolbarItems.includes('import')" :size="configSize" :disabled="disabled" aria-label="导入" @click="toolbarAction('import')">导入</ZtButton>
        <ZtButton v-if="toolbarItems.includes('export')" :size="configSize" :disabled="disabled || actualLoading" aria-label="导出" @click="toolbarAction('export')">导出</ZtButton>
        <div v-if="toolbarItems.includes('columnsetting') && settingsEnabled" class="zt-vtable-grid__settings-wrap">
          <ZtButton :size="configSize" :disabled="disabled" aria-label="列设置" :aria-expanded="settingsOpen" @click="settingsOpen = !settingsOpen">列设置</ZtButton>
          <div v-if="settingsOpen" class="zt-vtable-grid__settings" role="dialog" aria-label="列设置" @keydown.esc="settingsOpen = false">
            <div v-for="(column, index) in orderedSettingsColumns" :key="columnKey(column)" class="zt-vtable-grid__settings-row">
              <ZtCheckbox
                :model-value="isColumnVisible(column)"
                :size="configSize"
                tabindex="0"
                :disabled="typeof columnSettings === 'object' && columnSettings.allowVisibility === false"
                :aria-label="`${isColumnVisible(column) ? '隐藏' : '显示'}${columnTitle(column)}列`"
                @change="setColumnVisible(column, $event)"
                @keydown.space.prevent="setColumnVisible(column, !isColumnVisible(column))"
              >{{ columnTitle(column) }}</ZtCheckbox>
              <div class="zt-vtable-grid__settings-actions">
                <ZtButton :size="configSize" circle :disabled="index === 0 || (typeof columnSettings === 'object' && columnSettings.allowReorder === false)" :aria-label="`上移${columnTitle(column)}列`" @click="moveColumn(column, -1)">↑</ZtButton>
                <ZtButton :size="configSize" circle :disabled="index === orderedSettingsColumns.length - 1 || (typeof columnSettings === 'object' && columnSettings.allowReorder === false)" :aria-label="`下移${columnTitle(column)}列`" @click="moveColumn(column, 1)">↓</ZtButton>
              </div>
            </div>
            <ZtButton :size="configSize" class="zt-vtable-grid__settings-reset" @click="resetColumnSettings">重置列设置</ZtButton>
          </div>
        </div>
        <ZtButton v-if="toolbarItems.includes('reload')" :size="configSize" :disabled="disabled || actualLoading" aria-label="刷新" @click="toolbarAction('reload')">刷新</ZtButton>
      </div>
    </header>

    <main ref="bodyRef" class="zt-vtable-grid__body">
      <component
        :is="VueListTable"
        v-if="VueListTable"
        ref="tableRef"
        :options="nativeOptions"
        :records="[]"
        width="100%"
        height="100%"
        :on-ready="handleReady"
        @on-checkbox-state-change="handleCheckbox"
        @on-change-cell-value="handleCellChange"
        @on-sort-click="handleSort"
        @on-click-cell="handleRowClick($event, 'row-click')"
        @on-dbl-click-cell="handleRowClick($event, 'row-dblclick')"
        @on-button-click="handleActionCell"
      />
      <div v-if="actualLoading" class="zt-vtable-grid__state" role="status"><span class="zt-vtable-grid__spinner" />加载中…</div>
      <div v-else-if="loadError" class="zt-vtable-grid__state is-error" role="alert">加载失败</div>
      <div v-else-if="displayedRecords.length === 0" class="zt-vtable-grid__state is-empty">
        <slot name="empty">暂无数据</slot>
      </div>
      <div v-if="actionMenu" class="zt-vtable-grid__action-menu" role="menu" aria-label="行操作">
        <ZtButton v-for="item in actionMenu.items" :key="item.type" :size="configSize" :status="item.status" :disabled="item.disabled" role="menuitem" @click="runAction(item)">{{ item.text }}</ZtButton>
      </div>
    </main>

    <footer v-if="paginationEnabled || checkbox || changes.changedRowCount" class="zt-vtable-grid__footer">
      <div class="zt-vtable-grid__footer-left">
        <slot name="pager-left" :total="total" :selected-rows="selectedRows" :selected-count="selectedRows.length">
          <span v-if="checkbox">已选 {{ selectedRows.length }} 行</span>
        </slot>
        <slot v-if="changes.changedRowCount" name="edit-actions" :changes="changes" :save="saveChanges" :cancel="cancelChanges">
          <span>已修改 {{ changes.changedRowCount }} 行 / {{ changes.changedCellCount }} 项</span>
          <ZtButton :size="configSize" @click="cancelChanges">撤销</ZtButton>
          <ZtButton :size="configSize" status="primary" :loading="innerLoading" @click="saveChanges">保存修改</ZtButton>
        </slot>
      </div>
      <ZtPagination
        v-if="paginationEnabled"
        :current-page="innerCurrentPage"
        :page-size="innerPageSize"
        :page-sizes="paginationConfig.pageSizes"
        :layout="paginationConfig.layout ?? 'total, sizes, prev, pager, next, jumper'"
        :background="paginationConfig.background"
        :total="total"
        :disabled="disabled || actualLoading"
        :size="configSize"
        @update:current-page="handlePage"
        @update:page-size="handlePageSize"
      />
    </footer>
  </section>
</template>
