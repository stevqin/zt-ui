<script setup lang="ts">
import { useZtSize, useZtConfig } from '../config-provider/context'
import { computed, markRaw, nextTick, onActivated, onBeforeUnmount, onMounted, ref, shallowRef, watch, useSlots, type Component } from 'vue'
import { register, themes, CustomLayout, TYPES, type ListTable } from '@visactor/vtable'
import { ZtButton } from '../button'
import { ZtCheckbox } from '../checkbox'
import { useAnchoredDropdown } from '../selection/useAnchoredDropdown'
import { ZtPagination } from '../pagination'
import { createLatestQueryRunner, normalizePagination, normalizeQueryResult } from './data'
import { createSelectionStore } from './selection'
import { createEditStore } from './editing'
import { createColumnSettingsStore } from './column-settings'
import { buildSummaryValues } from './summary'
import { toCsv } from './csv'
import { fillGridFrozenGap } from './geometry'
import { getRecordChanges, cloneGridData, rebaseRecordChanges } from './record-changes'
import { buildEnhancedSummary, resolveSummaryMerge } from './summary-layout'
import { resolveGridPresentation } from './presentation'
import { createGridFilterStore } from './filter'
import SearchForm from './search-form'
import GridContextMenu from './GridContextMenu.vue'
import { ZtIcon } from '../icon'
import { createGridImageLoader } from './image'
import { createGridOptionLoader } from './option-loader'
import { ZtMessageBox } from '@ztechjs/zt-alert'
import { ACTION_FIELD, SUMMARY_FIELD, buildVTableColumns, resolveActionButtons, resolveRowKey } from './columns'
import { registerGridEditors, normalizeGridEditorValue } from './editors'
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
  pagination: true,
  localPagination: true,
  batchEdit: undefined,
  toolbarConfig: undefined,
  summaryConfig: undefined,
  showForm: null,
  highlightEditableCell: true,
  cellSelection: true,
  saveConfirm: false,
  exportMode: 'csv',
  actionDisplay: 'menu',
  exportLoading: false,
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
  'update:records': [rows: Row[]]
  'saved': [payload: ZtVTableGridSavePayload<Row>]
  'save-start': [payload: ZtVTableGridSavePayload<Row>]
  'cancel-edit': [payload: ZtVTableGridSavePayload<Row>]
  'toolbar-action': [type: string]
  'reload': []
  'export-request': []
  'context-menu-click': [payload: { type: string; row: Row; item: any }]
  'filter-change': [rows: Row[]]
  'paste': [payload: unknown]
  'row-reorder': [payload: { sourceIndex: number; targetIndex: number }]
}>()

type TableRef = { vTableInstance?: ListTable | null }
const VueListTable = shallowRef<Component | null>(null)
const tableRef = ref<TableRef | null>(null)
const slots = useSlots()
const formRef = ref<any>()
const formData = computed(() => props.formData ?? props.formConfig?.data ?? {})
const saving = ref(false)
const preparingSave = ref(false)
const isSaving = computed(() => saving.value || preparingSave.value)
const localRecords = shallowRef<Row[] | null>(null)
const batchEditing = computed(() => props.batchEdit ?? true)
const tracksRecordChanges = computed(() => batchEditing.value && !props.proxyConfig && props.originalRecords !== undefined)
const contextMenu = shallowRef<{ row: Row; items: any[]; x: number; y: number } | null>(null)
const filterPanel = ref<HTMLElement>()
const filterState = shallowRef<{ field: string; values: unknown[]; selected: unknown[]; x: number; y: number } | null>(null)
const filterVisible = computed({ get: () => Boolean(filterState.value), set: value => { if (!value) filterState.value = null } })
let filterStore = createGridFilterStore<Row>(props.columns)
const loadedRows = shallowRef<Row[]>([])
let canvasRenderer: any
const canvasVersion = ref(0)
const tableViewportWidth = ref(0)
const imageLoader = createGridImageLoader()
const optionCache = shallowRef<ReturnType<typeof createGridOptionLoader>>()
const editorOptions = shallowRef<Record<string, any[]>>({})
watch(() => props.optionLoader, (loader, _previous, onCleanup) => {
  const cache = loader ? createGridOptionLoader(loader) : undefined
  editorOptions.value = {}
  optionCache.value = cache
  onCleanup(() => cache?.dispose())
}, { immediate: true })
let imagePreview: { release: () => void } | undefined
let resizeObserver: ResizeObserver | undefined
let alive = true
let sourceGeneration = 0
let recordsRefreshPending = false
let columnDrag: string | undefined

const bodyRef = ref<HTMLElement | null>(null)
useAnchoredDropdown({ visible: filterVisible, trigger: computed(() => bodyRef.value ?? undefined), popup: filterPanel, tabThroughPopup: true, close: () => { filterState.value = null }, focus: () => bodyRef.value?.focus() })
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
const settingsTrigger = ref<InstanceType<typeof ZtButton>>()
const settingsPanel = ref<HTMLElement>()
const settingsTriggerElement = computed(() => settingsTrigger.value?.$el as HTMLElement | undefined)
useAnchoredDropdown({
  visible: settingsOpen, trigger: settingsTriggerElement, popup: settingsPanel,
  close: () => { settingsOpen.value = false },
  focus: () => settingsTriggerElement.value?.focus({ preventScroll: true }),
  tabThroughPopup: true,
})
function closeSettings() {
  settingsTriggerElement.value?.focus({ preventScroll: true })
  settingsOpen.value = false
}
const summaryEnabled = computed(() => props.summaryConfig !== undefined ? Boolean(props.summaryConfig) : Boolean(props.summary))
const summaryValues = ref<Record<string, unknown>>({})
let querySequence = 0

function columnSettingsOptions() {
  const config = typeof props.columnSettings === 'object' ? props.columnSettings : {}
  return { storageKey: config.storageKey }
}

const tableInstance = computed(() => tableRef.value?.vTableInstance ?? null)
const actualLoading = computed(() => props.loading || innerLoading.value || isSaving.value)
const paginationConfig = computed(() => typeof props.pagination === 'object' ? props.pagination : {})
const paginationEnabled = computed(() => props.pagination !== false && (Boolean(props.proxyConfig) || props.localPagination))
const containerStyle = computed(() => ({ height: typeof props.height === 'number' ? `${props.height}px` : props.height }))
const settingsEnabled = computed(() => Array.isArray(props.toolbarConfig) && props.toolbarConfig.includes('columnsetting') || props.columnSettings === true || (typeof props.columnSettings === 'object' && props.columnSettings.enabled !== false))
const toolbarItems = computed(() => {
  const value = props.toolbarConfig !== undefined ? props.toolbarConfig : props.toolbar
  return value === false ? [] : value ?? []
})
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
const nativeColumns = computed(() => {
  canvasVersion.value
  const configuredColumns = props.columns.map(column => typeof column.editable === 'object' && column.editable.type === 'select' && column.editable.optionSource ? { ...column, editable: { ...column.editable, options: editorOptions.value[column.editable.optionSource] ?? column.editable.options ?? [] } } : column)
  const columns = buildVTableColumns(configuredColumns, {
  settings: columnSettingsValue.value,
  checkbox: props.checkbox,
  showActionsColumn: props.showActionsColumn,
  editable: props.editable,
  disabled: props.disabled || saving.value,
  isRowSelected: selection.has,
  checkboxCheckMethod: props.checkboxCheckMethod,
  imageLoader,
  actionsWidth: 108,
})
  const adapted = columns.map((column: any) => {
    const original = configuredColumns.find(item => item.field === column.field)
    if (original) {
      if (props.filterConfig && original.filter === true) {
        const nativeIcons = column.headerIcon
        column.headerIcon = (args: any) => [...(typeof nativeIcons === 'function' ? [nativeIcons(args)].flat().filter(Boolean) : [nativeIcons].flat().filter(Boolean)), 'zt-grid-filter']
      }
      const ownStyle = column.style
      column.style = (args: any) => {
        const record = rowFromEvent(args)
        const rawRecord = args.table?.getCellOriginRecord?.(args.col, args.row) ?? renderedRecords.value[Number(args.row) - 1]
        const changed = record && changes.value.changes.some(change => change.key === getRowKey(record) && change.fields.includes(original.field))
        return {
          ...presentation.value.resolveCellStyle({ ...args, changed, selected: record ? selection.has(record) : false }, ownStyle, Boolean(props.editable && original.editable)),
          ...(rawRecord?.[SUMMARY_FIELD] ? { ...(typeof props.summaryConfig === 'object' ? props.summaryConfig.style : {}), ...(summaryLabel.value.fields.includes(original.field) ? { textAlign: summaryLabel.value.align } : {}) } : {}),
        }
      }
      if (canvasRenderer && (original.render || original.slots?.default)) column.customLayout = (args: any) => canvasRenderer.createRenderLayout(original.render ?? original.slots!.default, args, original.align)
      if (canvasRenderer && original.slot && slots[original.slot]) column.customLayout = (args: any) => canvasRenderer.createSlotLayout(original.slot, slots, args, false, original.align)
      if (canvasRenderer && original.headerSlot && slots[original.headerSlot]) column.headerCustomLayout = (args: any) => canvasRenderer.createSlotLayout(original.headerSlot, slots, args, true, original.align)
    }
    if (column.field === ACTION_FIELD) column.fixed = 'right'
    if (column.field === ACTION_FIELD && canvasRenderer && props.actionDisplay === 'inline') {
      column.cellType = 'text'
      column.width = Math.max(108, ...displayedRecords.value.map(row => resolveActionButtons(props.actionButtons, row).reduce((width, item) => width + (item.width ?? (item.mode === 'text' ? Math.max(42, item.text.length * 14 + 16) : 36)) + 8, 16)))
      column.customLayout = (args: any) => {
        const row = rowFromEvent(args)
        return row ? canvasRenderer.createActionLayout(resolveActionButtons(props.actionButtons, row), args, (item: any) => dispatchAction(item, row)) : { renderDefault: false }
      }
    }
    if (column.field === ACTION_FIELD && canvasRenderer && slots.actions) column.customLayout = (args: any) => canvasRenderer.createSlotLayout('actions', slots, args)
    return column
  })
  return fillGridFrozenGap(adapted, tableViewportWidth.value)
})
const presentation = computed(() => resolveGridPresentation({ ...props, isRowSelected: selection.has, isCellChanged: (args: any, field: string, row: Row) => changes.value.changes.some(change => change.key === getRowKey(row) && change.fields.includes(String(field))) }, configSize.value, provider.theme.value))
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
    autoFillWidth: !nativeColumns.value.some(column => column.field === '__zt_grid_spacer__'),
    widthMode: nativeColumns.value.some(column => column.field === '__zt_grid_spacer__') ? 'standard' : 'adaptive',
    defaultRowHeight,
    defaultHeaderRowHeight,
    ...Object.fromEntries(Object.entries(presentation.value).filter(([key]) => ['heightMode', 'defaultRowHeight', 'defaultHeaderRowHeight', 'autoWrapText', 'hover', 'select'].includes(key))),
    theme: (provider.theme.value === 'dark' ? themes.DARK : themes.DEFAULT).extends({
      bodyStyle: presentation.value.bodyStyle, headerStyle: presentation.value.headerStyle, selectionStyle: presentation.value.selectionStyle,
      scrollStyle: props.reserveScrollbar ? { visible: 'always', hoverOn: false, width: props.scrollbarSize ?? 10 } : {},
      ...(safeOptions.theme as any ?? {}),
    }),
    ...safeOptions,
    tooltip: {
      ...(safeOptions.tooltip as any ?? {}),
      isShowOverflowTextTooltip: (col: number, row: number, table: any) => {
        const field = nativeColumns.value[col]?.field
        const column = props.columns.find(item => item.field === field)
        if (column?.showOverflowTooltip !== undefined) return column.showOverflowTooltip
        if (column?.ellipsis !== undefined) return Boolean(column.ellipsis)
        const fallback = (safeOptions.tooltip as any)?.isShowOverflowTextTooltip
        return typeof fallback === 'function' ? fallback(col, row, table) : fallback ?? false
      },
    },
    frozenColCount: props.checkbox || props.columns.some(column => column.fixed === 'left') ? nativeColumns.value.filter((column: any) => column.fixed === 'left').length + (props.checkbox ? 1 : 0) : 0,
    rightFrozenColCount: nativeColumns.value.filter((column: any) => column.fixed === 'right').length,
    bottomFrozenRowCount: summaryEnabled.value && renderedRecords.value.some(row => row[SUMMARY_FIELD]) ? 1 : 0,
    showFrozenIcon: false,
    allowFrozenColCount: 0,
    customMergeCell: (col: number, row: number) => summaryMergeCell(col, row) ?? (typeof safeOptions.customMergeCell === 'function' ? safeOptions.customMergeCell(col, row, tableInstance.value) : undefined),
    keyboardOptions: { moveFocusCellOnTab: true, editCellOnEnter: true, moveSelectedCellOnArrowKeys: true, copySelected: true, cutSelected: true, pasteValueToCell: props.editable && !props.disabled && !saving.value, getCopyCellValue: { value: copyCellValue }, ...(safeOptions.keyboardOptions as any ?? {}) },
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
  if (!batchEditing.value) return { rows: [], changes: [], changedRowCount: 0, changedCellCount: 0 }
  return tracksRecordChanges.value ? getRecordChanges(localRecords.value ?? props.records, props.originalRecords!, getRowKey) : edits.payload()
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
watch(() => [props.columns, columnSettingsOptions().storageKey] as const, ([value]) => {
  filterStore = createGridFilterStore<Row>(value)
  settings = createColumnSettingsStore(value, columnSettingsOptions())
  settingsVersion.value += 1
  tableInstance.value?.updateColumns(nativeColumns.value)
}, { deep: true })
watch(() => props.records, () => { if (props.proxyConfig) return; if (isSaving.value) { recordsRefreshPending = true; return }; localRecords.value = null; void query(false) }, { deep: true })
watch(() => props.proxyConfig, () => { sourceGeneration++; querySequence++; queryRunner.invalidate(); if (props.autoLoad) void query(false) })

watch(() => [optionCache.value, props.columns.map(column => typeof column.editable === 'object' && column.editable.type === 'select' ? column.editable.optionSource : undefined).filter(Boolean)] as const, async ([, sources], _previous, onCleanup) => {
  let current = true
  const cache = optionCache.value
  onCleanup(() => { current = false })
  if (!cache) return
  for (const source of new Set(sources)) {
    try {
      const options = await cache.load(source!)
      if (alive && current) editorOptions.value = { ...editorOptions.value, [source!]: options }
    } catch (error) { if (alive && current) emit('error', error) }
  }
}, { immediate: true, deep: true })

function currentPageRows(rows: Row[]) {
  if (!paginationEnabled.value) return rows
  const start = (innerCurrentPage.value - 1) * innerPageSize.value
  return rows.slice(start, start + innerPageSize.value)
}

async function applyRows(rows: Row[], nextTotal: number, backendSummary: Record<string, unknown> | null = null) {
  const previousSelection = selection.keys()
  loadedRows.value = rows
  const filtered = filterStore.apply(rows)
  const withDrafts = batchEditing.value && !tracksRecordChanges.value ? edits.apply(filtered) : cloneGridData(filtered)
  displayedRecords.value = withDrafts
  editVersion.value++
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
  resize()
}

function sameKeys(left: Array<string | number>, right: Array<string | number>) {
  return left.length === right.length && left.every((key, index) => Object.is(key, right[index]))
}

const summaryLabel = ref<{ fields: string[]; align: string }>({ fields: [], align: 'left' })
const summarySourceRows = shallowRef<Row[]>([])
const backendSummary = shallowRef<Record<string, unknown> | null>(null)
function withSummaryRecord(rows: Row[]) {
  if (!summaryEnabled.value) return rows
  if (props.summaryConfig !== undefined) {
    const config = typeof props.summaryConfig === 'object' ? props.summaryConfig : {}
    if (!rows.length && !config.showWhenEmpty) return rows
    const ordered = arrangedColumns()
    const result = buildEnhancedSummary(ordered as any, filterStore.apply(summarySourceRows.value), { ...config, backend: config.summaryData ?? backendSummary.value, remote: Boolean(props.proxyConfig) })
    summaryLabel.value = result.label
    return [...rows, { ...result.values, [SUMMARY_FIELD]: true } as Row]
  }
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
        form: { ...formData.value } as FormData,
      }))
      if (!alive || result.stale || request !== querySequence) return
      backendSummary.value = result.summaryData
      summarySourceRows.value = result.data
      await applyRows(result.data, result.total, result.summaryData)
      if (!alive || request !== querySequence) return
      emit('loaded', { data: result.data, total: result.total, summaryData: result.summaryData })
    } else {
      queryRunner.invalidate()
      const source = sortLocalRows((localRecords.value ?? props.records).filter(row => props.filterMethod?.(row, formData.value) ?? true))
      backendSummary.value = null
      summarySourceRows.value = typeof props.summaryConfig === 'object' && props.summaryConfig.scope === 'page' ? currentPageRows(source) : source
      const result = normalizeQueryResult<Row>({ data: currentPageRows(source), total: source.length })
      await applyRows(result.data, result.total)
      if (!alive || request !== querySequence) return
      emit('loaded', { data: result.data, total: result.total, summaryData: null })
    }
  } catch (error) {
    if (!alive || request !== querySequence) return
    loadError.value = error
    emit('error', error)
  } finally {
    if (alive && request === querySequence) innerLoading.value = false
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
const resize = () => {
  const body = bodyRef.value
  if (!body?.isConnected || body.clientWidth <= 0 || body.clientHeight <= 0 || !alive || (tableInstance.value as any)?.isReleased) return
  tableInstance.value?.resize()
  const width = (tableInstance.value as any)?.tableNoFrameWidth ?? body.clientWidth
  if (Math.abs(width - tableViewportWidth.value) >= 1) tableViewportWidth.value = width
}

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
  const native = tableInstance.value?.getCellOriginRecord?.(event?.col ?? 0, event?.row ?? 1)
  if (native && typeof native === 'object') return native[SUMMARY_FIELD] ? undefined : native as Row
  const index = Number(event?.row ?? 1) - 1
  const record = renderedRecords.value[index]
  return index < 0 || record?.[SUMMARY_FIELD] ? undefined : record

}

function handleCheckbox(event: any) {
  if (props.disabled || saving.value) return
  const field = event.field ?? tableInstance.value?.getHeaderField?.(event.col, 0)
  const column = props.columns.find(item => item.field === field)
  if (column?.editable === 'checkbox') {
    const record = rowFromEvent(event)
    if (record) handleCellChange({ ...event, field, rawValue: (localRecords.value ?? loadedRows.value).find(item => getRowKey(item) === getRowKey(record))?.[field] ?? record[field], changedValue: Boolean(event.checked ?? event.value) })
    return
  }
  if (Number(event?.row) === 0 || event?.isHeader) {
    selection.selectPage(displayedRecords.value.filter(row => props.checkboxCheckMethod?.(row) ?? true), Boolean(event.checked ?? event.value))
    selectionVersion.value += 1
    emit('selection-change', selection.rows())
    syncSelectionToTable()
    return
  }
  const row = rowFromEvent(event)
  if (!row || props.checkboxCheckMethod?.(row) === false) return
  selection.toggle(row, Boolean(event.checked ?? event.value))
  selectionVersion.value += 1
  emit('selection-change', selection.rows())
  syncSelectionToTable()
}

function handleSort(event: any) {
  if (props.disabled || saving.value) return
  sort.value = { field: event.field, order: event.order ?? 'normal' }
  emit('sort-change', { ...sort.value })
  void query(true)
}

function handleCellChange(event: any) {
  if (props.disabled || saving.value || !props.editable) return
  const row = rowFromEvent(event)
  const field = String(event.field ?? tableInstance.value?.getHeaderField?.(event.col, 0) ?? '')
  if (!row || !field || field === ACTION_FIELD) return
  const oldValue = event.rawValue ?? event.oldValue
  const incoming = Object.prototype.hasOwnProperty.call(event, 'changedValue') ? event.changedValue : Object.prototype.hasOwnProperty.call(event, 'currentValue') ? event.currentValue : Object.prototype.hasOwnProperty.call(event, 'value') ? event.value : row[field]
  const column = props.columns.find(item => item.field === field)
  const value = normalizeGridEditorValue(column?.editable ?? false, incoming)
  ;(row as Record<string, unknown>)[field] = value
  if (batchEditing.value) edits.record(row, field, oldValue, value)
  if (!props.proxyConfig && (tracksRecordChanges.value || !batchEditing.value)) {
    localRecords.value = (localRecords.value ?? props.records).map(item => getRowKey(item) === getRowKey(row) ? { ...item, [field]: value } : item)
    emit('update:records', cloneGridData(localRecords.value))
  }
  editVersion.value += 1
  emit('cell-change', { row, field, oldValue, value, event })
  if (summaryEnabled.value) {
    summarySourceRows.value = summarySourceRows.value.map(item => getRowKey(item) === getRowKey(row) ? { ...item, [field]: value } : item)
    renderedRecords.value = withSummaryRecord(displayedRecords.value)
  }
  void nextTick(() => { if (alive) tableInstance.value?.setRecords(renderedRecords.value) })
}

function handleRowClick(event: any, name: 'row-click' | 'row-dblclick') {
  if (props.disabled || saving.value) return
  const row = rowFromEvent(event)
  if (!row) return
  if (name === 'row-click') emit('row-click', row, event)
  else emit('row-dblclick', row, event)
}

function handleActionCell(event: any) {
  if (props.disabled || saving.value) return
  const row = rowFromEvent(event)
  if (!row) return
  actionMenu.value = { row, items: resolveActionButtons(props.actionButtons, row) }
}

function runAction(item: ZtVTableGridActionButton<Row>) {
  if (props.disabled || saving.value) return
  const menu = actionMenu.value
  if (!menu || item.disabled) return
  dispatchAction(item, menu.row)
  actionMenu.value = null
}

function toolbarAction(item: string) {
  if (props.disabled || saving.value) return
  emit('toolbar-action', item)
  if (item === 'create') emit('create')
  else if (item === 'import') emit('import')
  else if (item === 'export') { if (!props.exportLoading && !actualLoading.value) { if (props.exportMode === 'external') emit('export-request'); else exportCsv() } }
  else if (item === 'reload') { emit('reload'); void reload() }
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
  if (props.checkboxCheckMethod) selection.rows().forEach(row => { if (!props.checkboxCheckMethod!(row)) selection.toggle(row, false) })
  selectionVersion.value += 1
  emit('selection-change', selection.rows())
  syncSelectionToTable()
}

function syncSelectionToTable() {
  nextTick(() => tableInstance.value?.setRecords(renderedRecords.value))
}

async function saveChanges() {
  if (isSaving.value || props.disabled || props.loading) return
  preparingSave.value = true
  try { (tableInstance.value as any)?.completeEditCell?.() } catch { (tableInstance.value as any)?.cancelEditCell?.() }
  await nextTick()
  preparingSave.value = false
  if (saving.value || !alive) return
  const payload = cloneGridData(changes.value)
  const source = sourceGeneration
  const handler = props.batchSave
  if (!payload.changedRowCount) return
  saving.value = true
  let succeeded = false
  try {
    if (await props.beforeSave?.(payload) === false) return
    const confirmed = typeof props.saveConfirm === 'function' ? await props.saveConfirm(payload)
      : props.saveConfirm ? await ZtMessageBox.confirm({ title: `确定保存 ${payload.changedRowCount} 行 / ${payload.changedCellCount} 项修改？`, icon: 'warning' }) : true
    if (!confirmed || !alive || source !== sourceGeneration) return
    emit('save-start', payload)
    await handler?.(payload)
    if (!alive || source !== sourceGeneration) return
    succeeded = true
    edits.clear()
    editVersion.value += 1
    emit('save', payload)
    emit('saved', payload)
    if (props.proxyConfig && props.batchSave) await query(false)
  } catch (error) {
    emit('save-error', error)
    throw error
  } finally {
    saving.value = false
    if (recordsRefreshPending && alive) {
      recordsRefreshPending = false
      localRecords.value = !succeeded && tracksRecordChanges.value ? rebaseRecordChanges(props.records, payload, getRowKey) : null
      await query(false)
    }
  }
}

async function cancelChanges() {
  if (saving.value || props.disabled || props.loading) return
  ;(tableInstance.value as any)?.cancelEditCell?.()
  const payload = cloneGridData(changes.value)
  const restored = tracksRecordChanges.value ? cloneGridData(props.originalRecords!) : edits.restoreRows(displayedRecords.value)
  edits.clear()
  editVersion.value += 1
  if (tracksRecordChanges.value) {
    localRecords.value = restored
    clearSelection()
    emit('update:records', cloneGridData(restored))
    await query(false)
  } else {
    if (!props.proxyConfig) {
      localRecords.value = null
      await query(false)
    } else await applyRows(restored, total.value)
  }
  emit('cancel-edit', payload)
}

function dispatchAction(item: any, row: Row) {
  if (props.disabled || saving.value || item.disabled) return
  item.handler?.(row)
  emit('action', { type: item.type, row, item })
}

function arrangedColumns() {
  const byKey = new Map(props.columns.map(column => [columnKey(column), column]))
  return columnSettingsValue.value.order.filter(key => columnSettingsValue.value.visible.includes(key)).map(key => byKey.get(key)!).filter(Boolean)
}

function summaryMergeCell(col: number, row: number) {
  if (props.summaryConfig === undefined || row !== renderedRecords.value.length || !renderedRecords.value.at(-1)?.[SUMMARY_FIELD]) return
  const merge = resolveSummaryMerge(arrangedColumns() as any, summaryLabel.value.fields)
  if (!merge) return
  const start = nativeColumns.value.findIndex(column => column.field === merge.fields[0])
  const end = nativeColumns.value.findIndex(column => column.field === merge.fields.at(-1))
  if (start < 0 || col < start || col > end) return
  return { text: renderedRecords.value.at(-1)?.[merge.fields[0]], range: { start: { col: start, row }, end: { col: end, row } }, style: { textAlign: summaryLabel.value.align } }
}

function copyCellValue(col: number, row: number) {
  const record = rowFromEvent({ col, row })
  const field = tableInstance.value?.getHeaderField?.(col, 0)
  const column = props.columns.find(item => item.field === field)
  return record && column ? column.copyFormatter ? column.copyFormatter(record) ?? '' : record[column.field] : ''
}

function moveColumnTo(key: string, index: number) {
  if (props.disabled || saving.value || typeof props.columnSettings === 'object' && props.columnSettings.allowReorder === false) return
  settings.moveTo(key, index)
  refreshColumns()
}

function onContextMenu(event: any) {
  if (!props.rowContextMenu || props.disabled || saving.value) return
  const row = rowFromEvent(event)
  if (!row) return
  const pointer = event.event?.nativeEvent ?? event.event ?? event.nativeEvent ?? event
  pointer.preventDefault?.()
  const items = typeof props.rowContextMenu === 'function' ? props.rowContextMenu(row) : props.rowContextMenu
  contextMenu.value = { row, items, x: pointer.clientX ?? 0, y: pointer.clientY ?? 0 }
}

function chooseContextItem(item: any) {
  const menu = contextMenu.value
  if (!menu || item.disabled || props.disabled || saving.value) return
  item.handler?.(menu.row)
  emit('context-menu-click', { type: item.type, row: menu.row, item })
  contextMenu.value = null
}

function handleFilterIcon(event: any) {
  if (!props.filterConfig || props.disabled || saving.value || (event.funcType ?? event.icon?.funcType ?? event.icon?.attribute?.funcType) !== 'zt-grid-filter') return
  const field = String(tableInstance.value?.getHeaderField?.(event.col, 0) ?? nativeColumns.value[event.col]?.field ?? '')
  const column = props.columns.find(item => item.field === field && item.filter === true)
  if (!column) return
  const values = filterStore.values(field, loadedRows.value)
  const pointer = event.event?.nativeEvent ?? event.event ?? event.nativeEvent ?? event
  filterState.value = { field, values, selected: [...values], x: Math.min(Math.max(8, pointer.clientX ?? 8), window.innerWidth - 260), y: Math.min(Math.max(8, pointer.clientY ?? 8), window.innerHeight - 300) }
  void nextTick(() => filterPanel.value?.querySelector<HTMLInputElement>('input')?.focus())
}
function toggleFilter(value: unknown, checked: boolean) {
  if (!filterState.value) return
  filterState.value = { ...filterState.value, selected: checked ? [...filterState.value.selected, value] : filterState.value.selected.filter(item => !Object.is(item, value)) }
}
async function applyHeaderFilter(clear = false) {
  const filter = filterState.value
  if (!filter) return
  if (clear || filter.selected.length === filter.values.length) filterStore.clear(filter.field)
  else filterStore.set(filter.field, filter.selected)
  filterState.value = null
  await applyRows(loadedRows.value, total.value, backendSummary.value)
  emit('filter-change', cloneGridData(displayedRecords.value))
}

function handleReorder(event: any) {
  if (props.disabled || saving.value || event.movingColumnOrRow === 'column') return
  const sourceIndex = Number(event.source?.row) - 1
  const targetIndex = Number(event.target?.row) - 1
  if (sourceIndex >= 0 && targetIndex >= 0 && sourceIndex < displayedRecords.value.length && targetIndex < displayedRecords.value.length) emit('row-reorder', { sourceIndex, targetIndex })
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
    // Defer revoke so the download can start before the blob is collected.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
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
  resize()
  void setupCanvasFeatures()
}
async function setupCanvasFeatures(refresh = false) {
  if (!alive || !tableInstance.value) return
  if ((!canvasRenderer || refresh) && (props.columns.some(column => column.slot || column.headerSlot || column.render || column.slots?.default) || slots.actions || props.actionDisplay === 'inline')) {
    const module = await import('./canvas-layout')
    if (!alive) return
    canvasRenderer = module.createGridCanvasRenderer({ CustomLayout, size: configSize.value, toSourceRow: (row: Row) => row, getRowIndex: (_args: any, row: Row) => displayedRecords.value.findIndex(item => getRowKey(item) === getRowKey(row)) })
    canvasVersion.value++
    refreshColumns()
  }
  if (props.columns.some(column => column.cellType === 'image' || column.editable === 'image' || typeof column.editable === 'object' && column.editable.type === 'image')) {
    const module = await import('./image')
    if (!alive || !tableInstance.value) return
    imagePreview?.release()
    imagePreview = module.bindGridImagePreview(tableInstance.value as any, { getColumn: (event: any) => props.disabled || saving.value ? undefined : props.columns.find(column => column.field === nativeColumns.value[event.col]?.field), getValue: (event: any) => copyCellValue(event.col, event.row), onRefresh: () => tableInstance.value?.setRecords(renderedRecords.value) })
  }
}

function handleGlobalPointer(event: PointerEvent) {
  if (contextMenu.value && !(event.target as Element)?.closest?.('.zt-grid-context-menu')) contextMenu.value = null
  if (filterState.value && !(event.target as Element)?.closest?.('.zt-vtable-grid__filter')) filterState.value = null
  if (actionMenu.value && !bodyRef.value?.contains(event.target as Node)) actionMenu.value = null
  if (settingsOpen.value && !(event.target as Element)?.closest?.('.zt-vtable-grid__settings-wrap')) settingsOpen.value = false
}

registerGridEditors((name, editor) => register.editor(name, editor as any))
register.icon('zt-grid-filter', { type: 'svg', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8Z" fill="none" stroke="#64748b" stroke-width="1.6"/></svg>', width: 16, height: 16, positionType: TYPES.IconPosition.right, marginLeft: 4, name: 'zt-grid-filter', funcType: 'zt-grid-filter', cursor: 'pointer' })
onMounted(async () => {
  document.addEventListener('pointerdown', handleGlobalPointer, true)
  if (props.autoLoad || !props.proxyConfig) void query(false)
  if (bodyRef.value && typeof ResizeObserver !== 'undefined') { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(bodyRef.value) }
  const { ListTable } = await import('@visactor/vue-vtable')
  if (!alive) return
  VueListTable.value = markRaw(ListTable)
  await nextTick()
  await setupCanvasFeatures()
})
watch([configSize, () => props.columns, () => props.actionDisplay], () => { void nextTick(() => setupCanvasFeatures(true)) }, { deep: true })
onActivated(() => { void nextTick(resize) })
onBeforeUnmount(() => {
  alive = false
  querySequence++
  resizeObserver?.disconnect()
  imagePreview?.release()
  imageLoader.release()
  optionCache.value?.dispose()
  queryRunner.invalidate()
  document.removeEventListener('pointerdown', handleGlobalPointer, true)
})

defineExpose({
  isSaving,
  hasChanges: computed(() => changes.value.changedRowCount > 0),
  tableInstance, formRef,
  getEditChanges: () => changes.value,
  getColumnSettings: () => settings.value(),
  resetColumnSettings,
  refreshRecords: () => { void query(false) },
  query,
  reload,
  resize,
  setRecords: updateRecords,
  getTableInstance: () => tableInstance.value,
  getSelectedRows: selection.rows,
  getSelectedKeys: selection.keys,
  setSelectedKeys,
  clearSelection,
  getChanges: () => changes.value,
  saveChanges,
  cancelChanges,
  exportCsv,
})
</script>

<template>
  <section class="zt-vtable-grid" :class="[`zt-vtable-grid--${configSize}`, { 'is-disabled': disabled }]" :style="containerStyle" v-bind="$attrs">
    <div v-if="showForm ?? ($slots.form || formConfig?.items?.length)" class="zt-vtable-grid__form">
      <slot name="form" :form-data="formData" :form="formData" :size="configSize" :query="query" :reload="reload">
        <SearchForm v-if="formConfig" ref="formRef" :config="formConfig" :model="formData" :size="configSize" :disabled="disabled || saving" :option-loader="optionCache" @submit="query(true)" @reset="query(true)">
          <template v-for="(_, name) in $slots" #[name]="scope"><slot :name="name" v-bind="scope" /></template>
        </SearchForm>
      </slot>
    </div>

    <header v-if="toolbarItems.length || $slots['toolbar-left'] || $slots['toolbar-right']" class="zt-vtable-grid__toolbar" aria-label="表格工具栏">
      <div class="zt-vtable-grid__toolbar-group">
        <slot name="toolbar-left" :query="query" :reload="reload" :selected-rows="selectedRows" :size="configSize" :checkbox="checkbox" />
        <ZtButton v-if="toolbarItems.includes('create')" :size="configSize" status="primary" :disabled="disabled || saving" aria-label="新建" @click="toolbarAction('create')"><ZtIcon name="add" />新建</ZtButton>
      </div>
      <div class="zt-vtable-grid__toolbar-group zt-vtable-grid__toolbar-group--right">
        <slot name="toolbar-right" :query="query" :reload="reload" :selected-rows="selectedRows" :size="configSize" :checkbox="checkbox" />
        <ZtButton v-if="toolbarItems.includes('import')" :size="configSize" :disabled="disabled || saving" aria-label="导入" status="success" plain @click="toolbarAction('import')"><ZtIcon name="upload" />导入</ZtButton>
        <ZtButton v-if="toolbarItems.includes('export')" :size="configSize" :loading="exportLoading" :disabled="disabled || actualLoading || exportLoading" aria-label="导出" status="primary" plain @click="toolbarAction('export')"><ZtIcon name="download" />导出</ZtButton>
        <div v-if="toolbarItems.includes('columnsetting') && settingsEnabled" class="zt-vtable-grid__settings-wrap">
          <ZtButton ref="settingsTrigger" :size="configSize" :disabled="disabled || saving" aria-label="列设置" :aria-expanded="settingsOpen" @click="settingsOpen = !settingsOpen" title="列设置"><ZtIcon name="settings" /></ZtButton>
          <div v-if="settingsOpen" ref="settingsPanel" class="zt-vtable-grid__settings" role="dialog" aria-label="列设置" @keydown.esc.stop.prevent="closeSettings">
            <div v-for="(column, index) in orderedSettingsColumns" :key="columnKey(column)" class="zt-vtable-grid__settings-row" :draggable="!(typeof columnSettings === 'object' && columnSettings.allowReorder === false)" @dragstart="columnDrag = columnKey(column)" @dragover.prevent @drop.prevent="columnDrag && moveColumnTo(columnDrag, index)">
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
        <ZtButton v-if="toolbarItems.includes('reload')" :size="configSize" :disabled="disabled || actualLoading" aria-label="刷新" @click="toolbarAction('reload')"><ZtIcon name="refresh" /></ZtButton>
      </div>
    </header>

    <main ref="bodyRef" class="zt-vtable-grid__body" tabindex="-1">
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
        @on-context-menu-cell="onContextMenu"
        @on-icon-click="handleFilterIcon"
        @on-pasted-data="emit('paste', $event)"
        @on-change-header-position="handleReorder"
      />
      <div v-if="actualLoading" class="zt-vtable-grid__state" role="status"><span class="zt-vtable-grid__spinner" />加载中…</div>
      <div v-else-if="loadError" class="zt-vtable-grid__state is-error" role="alert">加载失败</div>
      <div v-else-if="displayedRecords.length === 0" class="zt-vtable-grid__state is-empty">
        <slot name="empty">暂无数据</slot>
      </div>
      <div v-if="filterState" ref="filterPanel" class="zt-vtable-grid__filter" role="dialog" :aria-label="`筛选${columns.find(column => column.field === filterState?.field)?.title ?? filterState.field}`" :style="{left: `${filterState.x}px`, top: `${filterState.y}px`}" @keydown.esc.stop.prevent="filterState = null">
        <strong>筛选{{ columns.find(column => column.field === filterState?.field)?.title ?? filterState.field }}</strong>
        <small>仅筛选已加载记录</small>
        <div class="zt-vtable-grid__filter-options">
          <label v-for="(value, index) in filterState.values" :key="index"><input type="checkbox" :aria-label="`筛选 ${value ?? '(空)'}`" :checked="filterState.selected.some(item => Object.is(item, value))" @change="toggleFilter(value, ($event.target as HTMLInputElement).checked)" />{{ value === '' || value == null ? '(空)' : value }}</label>
        </div>
        <div class="zt-vtable-grid__filter-actions"><ZtButton :size="configSize" @click="applyHeaderFilter(true)">清除</ZtButton><ZtButton :size="configSize" status="primary" :disabled="!filterState.selected.length" aria-label="应用筛选" @click="applyHeaderFilter()">应用</ZtButton></div>
      </div>
      <GridContextMenu v-if="contextMenu" :items="contextMenu.items" :x="contextMenu.x" :y="contextMenu.y" @choose="chooseContextItem" @close="contextMenu = null" />
      <div v-if="actionMenu" class="zt-vtable-grid__action-menu" role="menu" aria-label="行操作">
        <ZtButton v-for="item in actionMenu.items" :key="item.type" :size="configSize" :status="item.status" :disabled="item.disabled" role="menuitem" @click="runAction(item)">{{ item.text }}</ZtButton>
      </div>
    </main>

    <footer v-if="paginationEnabled || checkbox || changes.changedRowCount" class="zt-vtable-grid__footer">
      <div class="zt-vtable-grid__footer-left">
        <slot name="pager-left" :total="total" :selected-rows="selectedRows" :selected-count="selectedRows.length">
          <span v-if="checkbox">已选 {{ selectedRows.length }} 行</span>
        </slot>
        <slot v-if="changes.changedRowCount" name="edit-actions" :changes="changes" :saving="saving" :save="saveChanges" :cancel="cancelChanges">
          <span>已修改 {{ changes.changedRowCount }} 行 / {{ changes.changedCellCount }} 项</span>
          <ZtButton :size="configSize" :disabled="disabled || actualLoading" @click="cancelChanges">撤销</ZtButton>
          <ZtButton :size="configSize" status="primary" :loading="saving" :disabled="disabled || actualLoading" @click="saveChanges().catch(() => {})">保存修改</ZtButton>
        </slot>
      </div>
      <slot name="pager-right" :total="total" :selected-rows="selectedRows" :selected-count="selectedRows.length" />
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
