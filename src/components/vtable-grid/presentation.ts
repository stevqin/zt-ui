import type { ZtComponentSize } from '../types'

type Style = Record<string, any>
export type GridCellStyle = Style | ((args: any) => Style | undefined)
const resolve = (style: GridCellStyle | undefined, args: any): Style => (typeof style === 'function' ? style(args) : style) ?? {}

/** Merge overrides without replacing native per-cell style functions. */
export function mergeGridCellStyle(style: unknown, overrides: Style): GridCellStyle {
  return typeof style === 'function'
    ? (args: any) => ({ ...style(args), ...overrides })
    : { ...(style as Style ?? {}), ...overrides }
}

export function resolveGridBorderStyle(mode: string = 'cell') {
  return { borderLineWidth: mode === 'none' ? [0, 0, 0, 0] : mode === 'row' ? [0, 0, 1, 0] : [1, 1, 1, 1] }
}

/** Pure VTable presentation options. resolveCellStyle is consumed by the column adapter. */
export function resolveGridPresentation(props: Record<string, any>, size: ZtComponentSize = 'default', theme: string = 'light') {
  const presets = { mini: [28, 32, 11, 16, 6], small: [32, 36, 12, 18, 8], default: [36, 40, 13, 20, 10], medium: [40, 44, 14, 22, 12], large: [44, 48, 15, 22, 14] }
  const [rowHeight, headerHeight, fontSize, lineHeight, horizontalPadding] = presets[size] ?? presets.default
  const dark = theme === 'dark'
  const borderStyle = resolveGridBorderStyle(props.borderMode)
  const changedCellStyle = { bgColor: dark ? '#63532e' : '#fff4ce', ...props.changedCellStyle }
  const selectedRowStyle = { bgColor: dark ? '#344e74' : '#eaf1ff', ...props.selectedRowStyle }
  const editableCellStyle = { bgColor: dark ? '#35475b' : '#f0f5ff', ...props.editableCellStyle }
  const readonlyCellStyle = { ...props.readonlyCellStyle }
  const bodyStyle = {
    fontSize, lineHeight, padding: [4, horizontalPadding, 4, horizontalPadding],
    color: dark ? '#e4eaf3' : '#202020', borderColor: dark ? '#5c697c' : '#e2e2e2',
    bgColor: (args: any) => props.stripe && (args.row - (args.table?.frozenRowCount ?? 1)) % 2 === 1
      ? dark ? '#35404f' : '#f5f8fc'
      : dark ? '#3b4554' : '#ffffff',
    ...props.cellStyle, ...borderStyle,
  }
  return {
    heightMode: props.rowHeight === 'auto' ? 'autoHeight' : 'standard',
    defaultRowHeight: typeof props.rowHeight === 'number' ? props.rowHeight : rowHeight,
    defaultHeaderRowHeight: props.headerRowHeight ?? headerHeight,
    autoWrapText: false,
    bodyStyle,
    headerStyle: { fontSize, lineHeight, padding: [4, horizontalPadding, 4, horizontalPadding], ...props.headerCellStyle, ...props.headerStyle, ...borderStyle },
    hover: { highlightMode: props.hoverMode ?? 'row', disableHover: props.hoverMode === 'none' },
    select: { highlightMode: 'cell', disableSelect: false },
    selectionStyle: props.cellSelection === false ? { cellBgColor: 'transparent', cellBorderColor: 'transparent', cellBorderLineWidth: 0, inlineRowBgColor: 'transparent', inlineColumnBgColor: 'transparent' } : {},
    editableCellStyle, readonlyCellStyle, changedCellStyle, selectedRowStyle,
    resolveCellStyle(args: any, columnStyle?: GridCellStyle, editable = false): Style {
      const row = args.table?.getCellOriginRecord?.(args.col, args.row)
      const field = args.table?.getHeaderField?.(args.col, args.row)
      const configured = resolve(columnStyle, args)
      const globalStyle = Object.fromEntries(Object.entries(bodyStyle).map(([key, value]) => [key, typeof value === 'function' ? value(args) : value]))
      const selected = row && !row.__zt_grid_summary__ && (props.isRowSelected?.(row) ?? row.__zt_grid_checked__)
      const changed = row && !row.__zt_grid_summary__ && props.isCellChanged?.(args, field, row)
      return {
        ...globalStyle,
        ...(editable && props.highlightEditableCell ? editableCellStyle : !editable ? readonlyCellStyle : {}),
        ...configured,
        ...(selected ? selectedRowStyle : {}), ...(changed ? changedCellStyle : {}),
        ...borderStyle,
      }
    },
  }
}
