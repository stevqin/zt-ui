import type { ListTable } from '@visactor/vtable'

export type ZtVTableGridRowKey = string | number
export type ZtVTableGridSize = 'large' | 'default' | 'medium' | 'small' | 'mini'
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

export type ZtVTableGridEditor = boolean | 'text' | 'textarea' | 'date' | 'number' | 'email' | 'url' | {
  type: 'select'
  options: Array<{ label: string; value: string | number } | string | number>
} | {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export interface ZtVTableGridSummaryRule<Row> {
  type?: ZtVTableGridSummaryType
  calculate?: (values: unknown[], rows: Row[]) => unknown
  formatter?: (value: unknown, rows: Row[]) => string | number
}

export type ZtVTableGridSummary<Row> = ZtVTableGridSummaryType | ZtVTableGridSummaryRule<Row>

export interface ZtVTableGridColumn<Row extends object = Record<string, unknown>> {
  field: keyof Row & string
  key?: string
  title?: string
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  fixed?: 'left' | 'right'
  sort?: boolean | ((first: unknown, second: unknown) => number)
  formatter?: (args: unknown) => unknown
  style?: unknown
  headerStyle?: unknown
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
  status?: ZtVTableGridActionStatus
  visible?: boolean | ((row: Row) => boolean)
  disabled?: boolean | ((row: Row) => boolean)
  handler?: (row: Row) => void
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

export interface ZtVTableGridEditChange<Row> {
  key: ZtVTableGridRowKey
  row: Row
  original: Row
  fields: string[]
}

export interface ZtVTableGridSavePayload<Row> {
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

export type ZtVTableGridTableOptions = Record<string, unknown>

export interface ZtVTableGridProps<
  Row extends object = Record<string, unknown>,
  FormData extends object = Record<string, unknown>,
> {
  columns: ZtVTableGridColumn<Row>[]
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
}

export interface ZtVTableGridCellChangePayload<Row> {
  row: Row
  field: string
  oldValue: unknown
  value: unknown
  event: unknown
}

export interface ZtVTableGridExpose<Row> {
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
  form?: (scope: { formData: FormData; query: (resetPage?: boolean) => Promise<void>; reload: () => Promise<void> }) => unknown
  'toolbar-left'?: (scope: { query: (resetPage?: boolean) => Promise<void>; reload: () => Promise<void>; selectedRows: Row[] }) => unknown
  'toolbar-right'?: (scope: { query: (resetPage?: boolean) => Promise<void>; reload: () => Promise<void>; selectedRows: Row[] }) => unknown
  empty?: () => unknown
  'pager-left'?: (scope: { total: number; selectedRows: Row[]; selectedCount: number }) => unknown
  'edit-actions'?: (scope: { changes: ZtVTableGridSavePayload<Row>; save: () => Promise<void>; cancel: () => void }) => unknown
}

export interface ZtVTableGridEmits<Row extends object = Record<string, unknown>> {
  (event: 'update:currentPage' | 'update:pageSize', value: number): void
  (event: 'loaded', payload: ZtVTableGridLoadedPayload<Row>): void
  (event: 'error' | 'save-error', error: unknown): void
  (event: 'page-change', payload: ZtVTableGridPageChangePayload): void
  (event: 'sort-change', payload: ZtVTableGridSort): void
  (event: 'selection-change', rows: Row[]): void
  (event: 'action', payload: ZtVTableGridActionPayload<Row>): void
  (event: 'create' | 'import'): void
  (event: 'export', csv: string): void
  (event: 'cell-change', payload: ZtVTableGridCellChangePayload<Row>): void
  (event: 'save', payload: ZtVTableGridSavePayload<Row>): void
  (event: 'row-click' | 'row-dblclick', row: Row, nativeEvent: unknown): void
  (event: 'column-settings-change', value: ZtVTableGridColumnSettingsValue): void
}

export interface ZtVTableGridEventProps<Row extends object = Record<string, unknown>> {
  'onUpdate:currentPage'?: (value: number) => void
  'onUpdate:pageSize'?: (value: number) => void
  onLoaded?: (payload: ZtVTableGridLoadedPayload<Row>) => void
  onError?: (error: unknown) => void
  onPageChange?: (payload: ZtVTableGridPageChangePayload) => void
  onSortChange?: (payload: ZtVTableGridSort) => void
  onSelectionChange?: (rows: Row[]) => void
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
