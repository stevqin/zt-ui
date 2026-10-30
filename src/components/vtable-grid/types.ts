import type { ListTable } from '@visactor/vtable'
import type { VNodeChild } from 'vue'
import type { ZtFormInstance } from '../form/types'
import type { ZtVTableGridFormConfig } from './form-types'
import type { ZtVTableGridOptionLoader } from './option-loader'
export type * from './form-types'
export type { ZtVTableGridOption, ZtVTableGridOptionLoader, ZtVTableGridOptionContext } from './option-loader'
import type { ZtComponentSize } from '../types'

export type ZtVTableGridRowKey = string | number
export type ZtVTableGridSize = ZtComponentSize
export type ZtVTableGridSortOrder = 'asc' | 'desc' | 'normal'
export type ZtVTableGridToolbarItem = 'create' | 'import' | 'export' | 'columnsetting' | 'reload'
export type ZtVTableGridSummaryType = 'sum' | 'avg' | 'count' | 'min' | 'max'

export interface ZtVTableGridSort {
  field?: string | number | string[]
  order: ZtVTableGridSortOrder
}

export interface ZtVTableGridQueryParams<FormData extends object = Record<string, unknown>> {
  page: number
  pageSize: number
  sort: ZtVTableGridSort
  form: FormData
}

export interface ZtVTableGridQueryResult<Row> {
  data?: Row[]
  records?: Row[]
  total?: number
  summaryData?: Record<string, unknown> | null
  summary_data?: Record<string, unknown> | null
}

export type ZtVTableGridProxyConfig<Row, FormData extends object = Record<string, unknown>> =
  (params: ZtVTableGridQueryParams<FormData>) => Promise<ZtVTableGridQueryResult<Row>>

export type ZtVTableGridEditor = { type: 'image'; placeholder?: string } | boolean | 'text' | 'textarea' | 'date' | 'number' | 'email' | 'url' | 'image' | 'checkbox' | {
  type: 'select'
  options?: Array<{ label: string; value: string | number } | string | number>
  optionSource?: string
} | {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export interface ZtVTableGridSummaryRule<Row> {
  type?: ZtVTableGridSummaryType
  calculate?: (values: unknown[], rows: Row[]) => unknown
  summaryField?: string
  formatter?: (value: unknown, rows: Row[] & Partial<ZtVTableGridSummaryContext<Row>>) => string | number
}

export type ZtVTableGridSummary<Row> = ZtVTableGridSummaryType | ZtVTableGridSummaryRule<Row>

/** 链接点击上下文，rowIndex 为当前显示数据中从零开始的索引。 */
export interface ZtVTableGridLinkContext<Row> {
  row: Row
  field?: string
  value: unknown
  rowIndex: number
  params: unknown
  event?: unknown
}
/** Canvas 业务字段链接配置；不自动跳转 URL。 */
export interface ZtVTableGridLink<Row> {
  /** 显示文字，省略时使用单元格值；函数收到当前行上下文。 */
  text?: string | ((context: ZtVTableGridLinkContext<Row>) => string | number)
  /** 传给回调与事件的业务参数，可为静态值或按行求值的函数。 */
  params?: object | string | number | boolean | null | ((row: Row) => unknown)
  /** 禁用链接，支持按行判断。 */
  disabled?: boolean | ((row: Row) => boolean)
  /** 自定义链接文字颜色。 */
  color?: string
  /** 点击回调；首参为当前行，次参包含字段、值、索引、参数及 Canvas 事件。 */
  handler?: (row: Row, context: ZtVTableGridLinkContext<Row>) => void
}

export interface ZtVTableGridColumn<Row extends object = Record<string, unknown>> {
  field: keyof Row & string
  key?: string
  title?: string
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  resizable?: boolean
  ellipsis?: boolean | string
  showOverflowTooltip?: boolean
  keepAspectRatio?: boolean
  imageAutoSizing?: boolean
  clickToPreview?: boolean
  /** Canvas 单元格具名插槽，接收 row/value/column/rowIndex、尺寸及忙碌状态；内容使用 Canvas 子入口节点。 */
  slot?: string
  /** Canvas 表头具名插槽，接收字段、列定义、表头值和几何信息。 */
  headerSlot?: string
  render?: (scope: ZtVTableGridCellSlotScope<Row>) => VNodeChild
  slots?: { default?: (scope: ZtVTableGridCellSlotScope<Row>) => VNodeChild }
  filter?: boolean
  fixed?: 'left' | 'right'
  sort?: boolean | ((first: unknown, second: unknown) => number)
  formatter?: (args: unknown) => unknown
  style?: unknown
  headerStyle?: unknown
  /** true 使用字段值作为链接；对象可配置文字、参数、禁用与回调。自定义 render/slot 优先。 */
  link?: boolean | ZtVTableGridLink<Row>
  cellType?: string
  headerType?: string
  visible?: boolean
  editable?: ZtVTableGridEditor
  summary?: ZtVTableGridSummary<Row>
  copyFormatter?: (row: Row) => unknown
  [nativeOption: string]: unknown
}

export type ZtVTableGridActionStatus = 'primary' | 'success' | 'info' | 'warning' | 'danger'
export interface ZtVTableGridActionButton<Row> {
  type: string
  text?: string
  /** icon 图标、text 有边框文字按钮、link 无边框链接。 */
  mode?: 'icon' | 'text' | 'link'
  icon?: string
  tooltip?: string | false
  iconFontFamily?: string
  color?: string
  width?: number
  status?: ZtVTableGridActionStatus
  visible?: boolean | ((row: Row) => boolean)
  disabled?: boolean | ((row: Row) => boolean)
  /** 静态业务参数或按行求值的函数，传入 handler 次参及 action 事件。 */
  params?: object | string | number | boolean | null | ((row: Row) => unknown)
  handler?: (row: Row, context: ZtVTableGridLinkContext<Row>) => void
}
export type ZtVTableGridActionItem<Row> = string | ZtVTableGridActionButton<Row>
export type ZtVTableGridActionButtons<Row> = ZtVTableGridActionItem<Row>[] | ((row: Row) => ZtVTableGridActionItem<Row>[])

export interface ZtVTableGridPagination {
  pageSize?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
}

export interface ZtVTableGridColumnSettings {
  enabled?: boolean
  allowReorder?: boolean
  allowVisibility?: boolean
  storageKey?: string
}

export interface ZtVTableGridColumnSettingsValue {
  order: string[]
  visible: string[]
  hidden: string[]
}

export type ZtVTableGridBorderMode = 'none' | 'row' | 'cell'
export type ZtVTableGridCellStyle = Record<string, any>
export interface ZtVTableGridSummaryContext<Row> { field: string; rows: Row[]; source: 'backend' | 'frontend'; scope: 'all' | 'page' }
export interface ZtVTableGridSummaryLabel<Row> { text?: string | ((context: Omit<ZtVTableGridSummaryContext<Row>, 'field'>) => string); fields?: string[]; align?: 'left' | 'center' | 'right' }
export interface ZtVTableGridContextMenuItem<Row> { type: string; text: string; icon?: string; color?: string; status?: ZtVTableGridActionStatus; disabled?: boolean; visible?: boolean; divided?: boolean; handler?: (row: Row) => void }
export type ZtVTableGridRowContextMenu<Row> = ZtVTableGridContextMenuItem<Row>[] | ((row: Row) => ZtVTableGridContextMenuItem<Row>[])
export interface ZtVTableGridContextMenuPayload<Row> { type: string; row: Row; item: ZtVTableGridContextMenuItem<Row> }
export interface ZtVTableGridSlotState {
  size: ZtVTableGridSize
  loading: boolean
  exportLoading: boolean
  disabled: boolean
}
export interface ZtVTableGridCellSlotScope<Row extends object> extends ZtVTableGridSlotState {
  row: Row; record: Row; rowIndex: number; col: number
  field?: string; column?: ZtVTableGridColumn<Row>; value: unknown
  width: number; height: number; x: number; y: number
  [key: string]: unknown
}
export interface ZtVTableGridHeaderSlotScope<Row extends object> extends ZtVTableGridSlotState {
  col: number; row: number; field?: string; column?: ZtVTableGridColumn<Row>; value: unknown
  width: number; height: number; x: number; y: number
  [key: string]: unknown
}

export interface ZtVTableGridEditChange<Row> {
  key: ZtVTableGridRowKey
  row: Row
  original: Row
  fields: string[]
}

export interface ZtVTableGridSavePayload<Row> {
  records?: Row[]
  insertedRows?: Row[]
  deletedRows?: Row[]
  rows: Row[]
  changes: ZtVTableGridEditChange<Row>[]
  changedRowCount: number
  changedCellCount: number
}

export type ZtVTableGridBatchSave<Row> = (payload: ZtVTableGridSavePayload<Row>) => Promise<void>

export interface ZtVTableGridSummaryConfig {
  label?: string
  showWhenEmpty?: boolean
  summaryData?: Record<string, unknown> | null
}

export interface ZtVTableGridEnhancedSummaryConfig<Row = Record<string, unknown>> { label?: string | ZtVTableGridSummaryLabel<Row>; showWhenEmpty?: boolean; style?: ZtVTableGridCellStyle; scope?: 'all' | 'page'; summaryData?: Record<string, unknown> | null }

export type ZtVTableGridTableOptions = Record<string, unknown>

export interface ZtVTableGridProps<
  Row extends object = Record<string, unknown>,
  FormData extends object = Record<string, unknown>,
> {
  columns: ZtVTableGridColumn<Row>[]
  originalRecords?: Row[]
  localPagination?: boolean
  filterMethod?: (row: Row, form: FormData) => boolean
  formConfig?: ZtVTableGridFormConfig<FormData>
  showForm?: boolean | null
  optionLoader?: ZtVTableGridOptionLoader
  actionDisplay?: 'menu' | 'inline'
  toolbarConfig?: ZtVTableGridToolbarItem[] | false
  exportMode?: 'csv' | 'external'
  /** 自定义导出任务，优先于 exportMode；组件等待 Promise 完成并自动管理 loading、互斥和失败后的解锁，失败触发 error。 */
  exportMethod?: (context: { records: Row[]; columns: ZtVTableGridColumn<Row>[]; selectedRows: Row[] }) => void | Promise<void>
  /** 外部导出任务的受控 loading；与组件内部导出状态合并。 */
  exportLoading?: boolean
  summaryConfig?: boolean | ZtVTableGridEnhancedSummaryConfig<Row>
  batchEdit?: boolean
  saveConfirm?: boolean | ((payload: ZtVTableGridSavePayload<Row>) => boolean | Promise<boolean>)
  beforeSave?: (payload: ZtVTableGridSavePayload<Row>) => boolean | void | Promise<boolean | void>
  rowContextMenu?: ZtVTableGridRowContextMenu<Row>
  checkboxCheckMethod?: (row: Row) => boolean
  rowHeight?: number | 'auto'
  headerRowHeight?: number | 'auto'
  cellStyle?: ZtVTableGridCellStyle
  headerStyle?: ZtVTableGridCellStyle
  highlightEditableCell?: boolean
  editableCellStyle?: ZtVTableGridCellStyle
  readonlyCellStyle?: ZtVTableGridCellStyle
  stripe?: boolean
  cellSelection?: boolean
  borderMode?: ZtVTableGridBorderMode
  hoverMode?: 'cell' | 'row'
  reserveScrollbar?: boolean
  scrollbarSize?: number
  filterConfig?: boolean | Record<string, unknown>
  records?: Row[]
  proxyConfig?: ZtVTableGridProxyConfig<Row, FormData>
  formData?: FormData
  pagination?: boolean | ZtVTableGridPagination
  currentPage?: number
  pageSize?: number
  rowKey?: (keyof Row & string) | ((row: Row) => ZtVTableGridRowKey)
  height?: string | number
  size?: ZtVTableGridSize
  loading?: boolean
  autoLoad?: boolean
  disabled?: boolean
  checkbox?: boolean
  reserveCheckbox?: boolean
  actionButtons?: ZtVTableGridActionButtons<Row>
  showActionsColumn?: boolean
  editable?: boolean
  batchSave?: ZtVTableGridBatchSave<Row>
  summary?: boolean | ZtVTableGridSummaryConfig
  columnSettings?: boolean | ZtVTableGridColumnSettings
  toolbar?: ZtVTableGridToolbarItem[] | false
  tableOptions?: ZtVTableGridTableOptions
}

export interface ZtVTableGridLoadedPayload<Row> {
  data: Row[]
  total: number
  summaryData: Record<string, unknown> | null
}

export interface ZtVTableGridPageChangePayload {
  currentPage: number
  pageSize: number
}

export interface ZtVTableGridActionPayload<Row> {
  type: string
  row: Row
  item: ZtVTableGridActionButton<Row>
  /** 本次动作的字段、值、显示行索引、业务参数及原始事件。 */
  field?: string
  value?: unknown
  rowIndex?: number
  params?: unknown
  event?: unknown
}

export interface ZtVTableGridCellChangePayload<Row> {
  row: Row
  field: string
  oldValue: unknown
  value: unknown
  event: unknown
}

export interface ZtVTableGridExpose<Row> {
  readonly isSaving: boolean
  readonly hasChanges: boolean
  readonly tableInstance: ListTable | null
  readonly formRef: ZtFormInstance | null
  refreshRecords: () => void
  getEditChanges: () => ZtVTableGridSavePayload<Row>
  getColumnSettings: () => ZtVTableGridColumnSettingsValue
  resetColumnSettings: () => void
  query: (resetPage?: boolean) => Promise<void>
  reload: () => Promise<void>
  resize: () => void
  setRecords: (records: Row[], total?: number) => void
  getTableInstance: () => ListTable | null
  getSelectedRows: () => Row[]
  getSelectedKeys: () => ZtVTableGridRowKey[]
  setSelectedKeys: (keys: ZtVTableGridRowKey[]) => void
  clearSelection: () => void
  getChanges: () => ZtVTableGridSavePayload<Row>
  saveChanges: () => Promise<void>
  cancelChanges: () => void
  exportCsv: (filename?: string) => string
}

export interface ZtVTableGridSlots<
  Row extends object = Record<string, unknown>,
  FormData extends object = Record<string, unknown>,
> {
  /** 整块自定义搜索表单；formData/form 为同一查询模型，query(true) 从第一页查询。 */
  form?: (scope: ZtVTableGridSlotState & { formData: FormData; form: FormData; size: ZtVTableGridSize; query: (resetPage?: boolean) => Promise<void>; reload: () => Promise<void> }) => unknown
  /** 自定义左侧工具栏；selectedRows 与 loading/exportLoading/disabled 实时同步。 */
  'toolbar-left'?: (scope: ZtVTableGridSlotState & { query: (resetPage?: boolean) => Promise<void>; reload: () => Promise<void>; selectedRows: Row[]; size: ZtVTableGridSize; checkbox: boolean }) => unknown
  /** 自定义右侧工具栏，沿用内置工具栏的查询与互斥状态。 */
  'toolbar-right'?: (scope: ZtVTableGridSlotState & { query: (resetPage?: boolean) => Promise<void>; reload: () => Promise<void>; selectedRows: Row[]; size: ZtVTableGridSize; checkbox: boolean }) => unknown
  'pager-right'?: (scope: { total: number; selectedRows: Row[]; selectedCount: number }) => unknown
  actions?: (scope: ZtVTableGridCellSlotScope<Row>) => unknown
  [name: string]: ((scope: any) => unknown) | undefined
  empty?: () => unknown
  'pager-left'?: (scope: { total: number; selectedRows: Row[]; selectedCount: number }) => unknown
  'edit-actions'?: (scope: { changes: ZtVTableGridSavePayload<Row>; saving: boolean; save: () => Promise<void>; cancel: () => void }) => unknown
}

export interface ZtVTableGridEmits<Row extends object = Record<string, unknown>> {
  (event: 'update:currentPage' | 'update:pageSize', value: number): void
  (event: 'update:records', rows: Row[]): void
  (event: 'saved' | 'save-start' | 'cancel-edit', payload: ZtVTableGridSavePayload<Row>): void
  (event: 'row-reorder', payload: { sourceIndex: number; targetIndex: number }): void
  (event: 'filter-change', rows: Row[]): void
  (event: 'paste', payload: unknown): void
  (event: 'toolbar-action', type: ZtVTableGridToolbarItem): void
  (event: 'reload' | 'export-request'): void
  (event: 'context-menu-click', payload: ZtVTableGridContextMenuPayload<Row>): void
  (event: 'loaded', payload: ZtVTableGridLoadedPayload<Row>): void
  (event: 'error' | 'save-error', error: unknown): void
  (event: 'page-change', payload: ZtVTableGridPageChangePayload): void
  (event: 'sort-change', payload: ZtVTableGridSort): void
  (event: 'selection-change', rows: Row[]): void
  /** 点击业务列链接时触发，返回当前行、字段、值和求值后的业务参数。 */
  (event: 'link-click', payload: ZtVTableGridLinkContext<Row>): void
  (event: 'action', payload: ZtVTableGridActionPayload<Row>): void
  (event: 'create' | 'import'): void
  (event: 'export', csv: string): void
  (event: 'cell-change', payload: ZtVTableGridCellChangePayload<Row>): void
  (event: 'save', payload: ZtVTableGridSavePayload<Row>): void
  (event: 'row-click' | 'row-dblclick', row: Row, nativeEvent: unknown): void
  (event: 'column-settings-change', value: ZtVTableGridColumnSettingsValue): void
}

export interface ZtVTableGridEventProps<Row extends object = Record<string, unknown>> {
  'onUpdate:records'?: (rows: Row[]) => void
  onSaved?: (payload: ZtVTableGridSavePayload<Row>) => void
  onSaveStart?: (payload: ZtVTableGridSavePayload<Row>) => void
  onCancelEdit?: (payload: ZtVTableGridSavePayload<Row>) => void
  onRowReorder?: (payload: { sourceIndex: number; targetIndex: number }) => void
  onFilterChange?: (rows: Row[]) => void
  onPaste?: (payload: unknown) => void
  onToolbarAction?: (type: ZtVTableGridToolbarItem) => void
  onReload?: () => void
  onExportRequest?: () => void
  onContextMenuClick?: (payload: ZtVTableGridContextMenuPayload<Row>) => void
  'onUpdate:currentPage'?: (value: number) => void
  'onUpdate:pageSize'?: (value: number) => void
  onLoaded?: (payload: ZtVTableGridLoadedPayload<Row>) => void
  onError?: (error: unknown) => void
  onPageChange?: (payload: ZtVTableGridPageChangePayload) => void
  onSortChange?: (payload: ZtVTableGridSort) => void
  onSelectionChange?: (rows: Row[]) => void
  onLinkClick?: (payload: ZtVTableGridLinkContext<Row>) => void
  onAction?: (payload: ZtVTableGridActionPayload<Row>) => void
  onCreate?: () => void
  onImport?: () => void
  onExport?: (csv: string) => void
  onCellChange?: (payload: ZtVTableGridCellChangePayload<Row>) => void
  onSave?: (payload: ZtVTableGridSavePayload<Row>) => void
  onSaveError?: (error: unknown) => void
  onRowClick?: (row: Row, nativeEvent: unknown) => void
  onRowDblclick?: (row: Row, nativeEvent: unknown) => void
  onColumnSettingsChange?: (value: ZtVTableGridColumnSettingsValue) => void
}

export type ZtVTableGridInstance<Row extends object = Record<string, unknown>> = ZtVTableGridExpose<Row>
