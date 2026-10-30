interface GeometryColumn { field?: unknown; width?: unknown; fixed?: unknown; disableColumnResize?: boolean; [key: string]: unknown }

/** Fill unused center space only when every displayed column has a stable pixel width. */
export function fillGridFrozenGap<T extends GeometryColumn>(columns: T[], viewportWidth: number): Array<T | GeometryColumn> {
  const right = columns.findIndex(column => column.fixed === 'right')
  if (right < 0 || !Number.isFinite(viewportWidth) || viewportWidth <= 0) return columns
  const widths = columns.map(column => typeof column.width === 'number' ? column.width : typeof column.width === 'string' && /^\d+(\.\d+)?(px)?$/.test(column.width.trim()) ? Number.parseFloat(column.width) : NaN)
  if (columns.some(column => column.disableColumnResize === false) || widths.some(width => !Number.isFinite(width) || width <= 0)) return columns
  const gap = Math.floor(viewportWidth - widths.reduce((sum, width) => sum + width, 0))
  if (gap < 2) return columns
  const result: Array<T | GeometryColumn> = [...columns]
  result.splice(right, 0, { field: '__zt_grid_spacer__', title: '', width: gap, disableColumnResize: true, sort: false, disableSelect: true, style: { borderLineWidth: 0 } })
  return result
}
