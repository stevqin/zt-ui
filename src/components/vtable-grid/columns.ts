import type { ColumnDefine } from '@visactor/vtable'
import { editorName } from './editors'
import { mergeGridCellStyle } from './presentation'
import type {
  ZtVTableGridActionButton,
  ZtVTableGridActionButtons,
  ZtVTableGridColumn,
  ZtVTableGridColumnSettingsValue,
  ZtVTableGridRowKey,
} from './types'

export const CHECKBOX_FIELD = '__zt_grid_checked__'
export const ACTION_FIELD = '__zt_grid_actions__'
export const SUMMARY_FIELD = '__zt_grid_summary__'

function recordFromCell(args: any) {
  return args?.table?.getCellOriginRecord?.(args.col, args.row)
}

const ACTION_META: Record<string, Pick<ZtVTableGridActionButton<unknown>, 'text' | 'status'>> = {
  detail: { text: '查看', status: 'primary' },
  edit: { text: '编辑', status: 'warning' },
  copy: { text: '复制', status: 'info' },
  enable: { text: '启用', status: 'success' },
  disable: { text: '停用', status: 'warning' },
  delete: { text: '删除', status: 'danger' },
}

export type ResolvedAction<Row> = Omit<ZtVTableGridActionButton<Row>, 'visible' | 'disabled'> & {
  text: string
  status: NonNullable<ZtVTableGridActionButton<Row>['status']>
  disabled: boolean
}

export function resolveActionButtons<Row>(source: ZtVTableGridActionButtons<Row>, row: Row): ResolvedAction<Row>[] {
  const items = typeof source === 'function' ? source(row) : source
  return items.flatMap(item => {
    const config: ZtVTableGridActionButton<Row> = typeof item === 'string' ? { type: item } : item
    const visible = typeof config.visible === 'function' ? config.visible(row) : config.visible !== false
    if (!visible) return []
    const builtin = ACTION_META[config.type]
    return [{
      ...config,
      text: config.text ?? builtin?.text ?? config.type,
      status: config.status ?? builtin?.status ?? 'primary',
      disabled: typeof config.disabled === 'function' ? config.disabled(row) : Boolean(config.disabled),
    }]
  })
}

export function resolveRowKey<Row extends object>(
  row: Row,
  rowKey: (keyof Row & string) | ((row: Row) => ZtVTableGridRowKey),
) {
  return typeof rowKey === 'function'
    ? rowKey(row)
    : (row as Record<string, unknown>)[rowKey] as ZtVTableGridRowKey
}

export function buildVTableColumns<Row extends object>(
  columns: ZtVTableGridColumn<Row>[],
  options: {
    settings: ZtVTableGridColumnSettingsValue
    checkbox: boolean
    showActionsColumn: boolean
    editable?: boolean
    disabled?: boolean
    isRowSelected?: (row: Row) => boolean
    checkboxCheckMethod?: (row: Row) => boolean
    imageLoader?: (value: unknown) => unknown
    resolveCellStyle?: (args: any, style: any, editable: boolean) => any
    actionsWidth?: number
    actionLayout?: ColumnDefine['customLayout']
  },
) {
  const byKey = new Map(columns
    .filter(column => ![CHECKBOX_FIELD, ACTION_FIELD, SUMMARY_FIELD].includes(column.field))
    .map(column => [column.key ?? column.field, column]))
  const ordered = options.settings.order
    .map(key => byKey.get(key))
    .filter((column): column is ZtVTableGridColumn<Row> => Boolean(column))
    .filter(column => options.settings.visible.includes(column.key ?? column.field))
  const arranged = [
    ...ordered.filter(column => column.fixed === 'left'),
    ...ordered.filter(column => !column.fixed),
    ...ordered.filter(column => column.fixed === 'right'),
  ]

  const business = arranged.map(column => {
    const { editable, sort, summary: _summary, visible: _visible, copyFormatter, align, resizable, ellipsis, showOverflowTooltip, ...native } = column
    const editorType = typeof editable === 'object' ? editable.type : editable
    const image = native.cellType === 'image' || editorType === 'image'
    const checkbox = editorType === 'checkbox'
    const styleOverrides = {
      ...(align ? { textAlign: align } : {}),
      ...(ellipsis ? { autoWrapText: false, textOverflow: typeof ellipsis === 'string' ? ellipsis : 'ellipsis' } : {}),
    }
    const wrappingStyle = typeof native.style === 'function'
      ? (args: any) => ({ autoWrapText: true, ...(native.style as Function)(args) })
      : { autoWrapText: true, ...(native.style as Record<string, unknown> ?? {}) }
    const style = mergeGridCellStyle(wrappingStyle, styleOverrides)
    const canEdit = !options.disabled && options.editable !== false && Boolean(editable)
    return {
      ...native,
      style: options.resolveCellStyle ? (args: any) => options.resolveCellStyle!(args, style, canEdit) : style,
      headerStyle: align ? mergeGridCellStyle(native.headerStyle, { textAlign: align }) : native.headerStyle,
      disableColumnResize: resizable !== undefined ? !resizable : native.width !== undefined && native.width !== 'auto' ? true : native.disableColumnResize,
      __showOverflowTooltip: showOverflowTooltip ?? Boolean(ellipsis),
      __copyFormatter: copyFormatter,
      ...(image ? {
        cellType: native.cellType ?? 'image', clickToPreview: false,
        keepAspectRatio: native.keepAspectRatio ?? true,
        imageAutoSizing: native.imageAutoSizing ?? false,
        ...(options.imageLoader ? { fieldFormat: (record: Row, ...args: any[]) => options.imageLoader!(
          typeof native.fieldFormat === 'function' ? native.fieldFormat(record, ...args) : String(native.field).split('.').reduce((value: any, key) => value?.[key], record),
        ) } : {}),
      } : {}),
      ...(checkbox ? {
        cellType: native.cellType ?? 'checkbox', headerType: native.headerType ?? 'text',
        disable: (args: any) => !canEdit || Boolean(recordFromCell(args)?.[SUMMARY_FIELD]),
      } : {}),
      sort: options.disabled ? false : sort,
      editor: canEdit && !checkbox && editable
        ? (args: any) => recordFromCell(args)?.[SUMMARY_FIELD] ? undefined : editorName(editable)
        : undefined,
    } as ColumnDefine
  })
  const checkbox: ColumnDefine[] = options.checkbox ? [{
    field: CHECKBOX_FIELD,
    title: '',
    width: 42,
    cellType: 'checkbox',
    headerType: 'checkbox',
    checked: (args: any) => {
      const record = recordFromCell(args) as Row | undefined
      return record && !(record as Record<string, unknown>)[SUMMARY_FIELD]
        ? Boolean(options.isRowSelected?.(record))
        : false
    },
    disable: (args: any) => {
      const record = recordFromCell(args)
      return options.disabled || Boolean(record?.[SUMMARY_FIELD]) || Boolean(record && options.checkboxCheckMethod && !options.checkboxCheckMethod(record))
    },
  }] as unknown as ColumnDefine[] : []
  const actions: ColumnDefine[] = options.showActionsColumn ? [{
    field: ACTION_FIELD,
    title: '操作',
    width: options.actionsWidth ?? 160,
    sort: false,
    cellType: 'button',
    text: '操作',
    buttonStyle: { buttonColor: '#2d67dc', buttonHoverColor: '#1f56c1', color: '#ffffff' },
    customLayout: options.actionLayout,
  }] as unknown as ColumnDefine[] : []
  return [...checkbox, ...business, ...actions]
}
