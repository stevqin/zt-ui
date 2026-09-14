import type { ColumnDefine } from '@visactor/vtable'
import { editorName } from './editors'
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
    actionsWidth?: number
    actionLayout?: ColumnDefine['customLayout']
  },
) {
  const byKey = new Map(columns.map(column => [column.key ?? column.field, column]))
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
    const { editable, sort, summary: _summary, visible: _visible, copyFormatter: _copy, ...native } = column
    return {
      ...native,
      sort: options.disabled ? false : sort,
      editor: !options.disabled && options.editable !== false && editable
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
    disable: (args: any) => options.disabled || Boolean(recordFromCell(args)?.[SUMMARY_FIELD]),
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
