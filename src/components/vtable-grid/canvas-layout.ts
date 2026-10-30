import { Fragment, Text as VueText, isVNode, type VNode } from 'vue'
import type { ZtComponentSize } from '../types'
import { resolveVTableTagAttributes } from './canvas-tag'

interface CanvasRendererOptions {
  CustomLayout: Record<string, any>
  size?: ZtComponentSize
  color?: string
  getLinkColor?: (status: string) => string | undefined
  getTextColor?: (args: any, isHeader: boolean) => string | undefined
  getColumn?: (col: number) => Record<string, any> | undefined
  getState?: () => { disabled: boolean; loading: boolean; exportLoading: boolean }
  padding?: number | number[]
  fontSize?: number
  lineHeight?: number
  toSourceRow?: (record: any) => any
  getRowIndex?: (args: any, record: any) => number
}
export interface GridCanvasAction {
  type: string
  text?: string
  icon?: string
  mode?: 'icon' | 'text' | 'both' | 'link'
  tooltip?: string | false
  iconFontFamily?: string
  imageIcon?: string
  width?: number
  color?: string
  status?: string
  disabled?: boolean
  [key: string]: unknown
}

const getChildren = (children: any): any[] => typeof children?.default === 'function' ? getChildren(children.default()) : Array.isArray(children) ? children : children == null ? [] : [children]
const textOf = (value: unknown): string => typeof value === 'string' || typeof value === 'number' ? String(value) : Array.isArray(value) ? value.map(textOf).join('') : isVNode(value) ? textOf(getChildren(value.children)) : ''
const camelProps = (props: VNode['props']) => Object.fromEntries(Object.entries(props ?? {}).map(([key, value]) => [key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value]))

/** Inject VTable.CustomLayout after the Grid's lazy engine load; this module never imports the engine. */
export function createGridCanvasRenderer(options: CanvasRendererOptions) {
  const { CustomLayout, size = 'default' } = options
  const fonts = { mini: [11, 16, 6], small: [12, 18, 8], default: [13, 20, 10], medium: [14, 22, 12], large: [15, 22, 14] }
  const preset = fonts[size] ?? fonts.default
  const fontSize = options.fontSize ?? preset[0], lineHeight = options.lineHeight ?? preset[1]
  const padding = options.padding ?? [4, preset[2], 4, preset[2]]
  const pad = typeof padding === 'number' ? [padding, padding, padding, padding] : padding.length === 2 ? [padding[0], padding[1], padding[0], padding[1]] : padding
  const typography = { fontSize, lineHeight, textBaseline: 'middle', fill: options.color ?? '#202020' }

  function createSlotGraphics(value: unknown, color = options.color ?? '#202020'): any[] {
    const typography = { fontSize, lineHeight, textBaseline: 'middle', fill: color }
    if (Array.isArray(value)) return value.flatMap(child => createSlotGraphics(child, color))
    if (typeof value === 'string' || typeof value === 'number') return [new CustomLayout.Text({ ...typography, text: String(value) })]
    if (!isVNode(value)) return []
    if (value.type === Fragment) return createSlotGraphics(value.children, color)
    if (value.type === VueText) return createSlotGraphics(value.children, color)
    const name = typeof value.type === 'string' ? value.type : (value.type as any)?.symbol ?? (value.type as any)?.name ?? (value.type as any)?.displayName
    const tag = name === 'VTableTag' || name === 'ZtTag'
    const kind = tag || name === 'VTableRawTag' ? 'Tag' : name === 'span' ? 'Text' : name?.replace(/^VTable/, '')
    const Class = CustomLayout[kind]
    if (!Class) return []
    let props = camelProps(value.props)
    const children = getChildren(value.children)
    if (tag) props = resolveVTableTagAttributes({ ...props, text: props.text ?? props.content ?? textOf(children) }, size, { fontSize, lineHeight })
    else if (name === 'span') {
      const style = props.style ?? {}
      props = { ...props, ...typography, text: textOf(children), fill: style.color ?? typography.fill, fontSize: style.fontSize ?? fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight ?? lineHeight }
      delete props.style
    } else if (kind === 'Text') props = { ...typography, text: textOf(children), ...props }
    else if (kind === 'Tag') props = { ...props, textStyle: { fontSize, lineHeight, ...props.textStyle } }
    else if (kind === 'CheckBox' || kind === 'Radio') props = { size: fontSize, ...props }
    const graphic = new Class(props)
    Object.entries(props).forEach(([key, handler]) => {
      if (/^on[A-Z]/.test(key) && typeof handler === 'function') graphic.addEventListener?.(key.slice(2).toLowerCase(), (...args: unknown[]) => { if (!options.getState?.().disabled) handler(...args) })
    })
    if (kind === 'Group') children.flatMap(child => createSlotGraphics(child, color)).forEach(child => graphic.add(child))
    return [graphic]
  }

  function scopeFor(args: any, isHeader: boolean) {
    const rect = args.rect ?? args.table.getCellRect(args.col, args.row)
    const record = args.table.getCellOriginRecord?.(args.col, args.row)
    const row = options.toSourceRow?.(record) ?? record
    const column = options.getColumn?.(args.col)
    const field = column?.field ?? args.table.getHeaderField?.(args.col, 0)
    const value = isHeader ? args.table.getCellValue?.(args.col, args.row) : field == null ? args.table.getCellOriginValue?.(args.col, args.row) : row?.[field]
    return { ...args, ...rect, record, column, field, value, size, disabled: false, loading: false, exportLoading: false, ...options.getState?.(), ...(isHeader ? {} : { row, rowIndex: options.getRowIndex?.(args, row) ?? args.row - (args.table.frozenRowCount ?? 1) }) }
  }

  /** Renderer receives the raw business row, record, zero-based rowIndex, table and cell geometry. */
  function createRenderLayout(renderer: (scope: any) => unknown, args: any, align: string = 'left', isHeader = false): any {
    const scope = scopeFor(args, isHeader)
    if (!isHeader && (scope.record?.__zt_grid_summary__ || args.table.isAggregation?.(args.col, args.row))) return { renderDefault: true }
    const root = new CustomLayout.Group({ x: pad[3] ?? pad[1] ?? 0, width: Math.max(0, scope.width - (pad[1] ?? 0) - (pad[3] ?? pad[1] ?? 0)), height: scope.height, display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start' })
    createSlotGraphics(renderer(scope), options.getTextColor?.(args, isHeader)).forEach(child => root.add(child))
    return { rootContainer: root, renderDefault: false }
  }

  function createSlotLayout(name: string, slots: Record<string, any>, args: any, isHeader = false, align = 'left') {
    return createRenderLayout(scope => slots[name]?.(scope), args, align, isHeader)
  }

  function createLinkLayout(text: string, args: any, link: { disabled?: boolean; color?: string }, onClick: (scope: any, event: unknown) => void) {
    const scope = scopeFor(args, false)
    if (scope.record?.__zt_grid_summary__ || args.table.isAggregation?.(args.col, args.row)) return { renderDefault: true }
    const disabled = Boolean(link.disabled || scope.disabled)
    const color = link.color ?? '#245edb'
    const root = new CustomLayout.Group({ x: pad[3] ?? 0, width: Math.max(0, scope.width - (pad[1] ?? 0) - (pad[3] ?? 0)), height: scope.height, display: 'flex', alignItems: 'center', justifyContent: scope.column?.align === 'right' ? 'flex-end' : scope.column?.align === 'center' ? 'center' : 'flex-start' })
    const node = new CustomLayout.Text({ ...typography, text, fill: color, maxLineWidth: Math.max(0, scope.width - (pad[1] ?? 0) - (pad[3] ?? 0)), ellipsis: '…', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1 })
    if (!disabled) {
      node.addEventListener?.('pointertap', (event: any) => {
        if (options.getState?.().disabled) return
        event?.stopPropagation?.()
        onClick(scopeFor(args, false), event)
      })
      node.addEventListener?.('mouseenter', () => { node.setAttributes?.({ underline: true }); node.stage?.renderNextFrame?.() })
      node.addEventListener?.('mouseleave', () => { node.setAttributes?.({ underline: false }); node.stage?.renderNextFrame?.() })
    }
    root.add(node)
    return { rootContainer: root, renderDefault: false }
  }

  /** Buttons are already filtered by resolveActionButtons. Click callback owns dispatch/handler invocation. */
  function createActionLayout(buttons: GridCanvasAction[], args: any, onAction: (button: GridCanvasAction, row: any, event: unknown) => void): any {
    const scope = scopeFor(args, false)
    if (scope.record?.__zt_grid_summary__ || args.table.isAggregation?.(args.col, args.row)) return { renderDefault: false }
    const root = new CustomLayout.Group({ x: pad[3] ?? 0, width: scope.width, height: scope.height, display: 'flex', alignItems: 'center', gap: 8 })
    const colors: Record<string, string> = { primary: '#244c9e', success: '#166534', info: '#374151', warning: '#92400e', danger: '#991b1b' }
    buttons.forEach(button => {
      const mode = button.mode ?? (button.icon || button.imageIcon ? 'icon' : 'text')
      const buttonSize = Math.max(20, fontSize + 10)
      const width = button.width ?? (mode === 'icon' ? buttonSize : Math.max(buttonSize, (button.text ?? button.type).length * fontSize + 16))
      const color = button.color ?? (mode === 'link' ? options.getLinkColor?.(button.status ?? 'primary') : undefined) ?? colors[button.status ?? 'primary'] ?? colors.primary
      const graphic = new CustomLayout.Group({ width, height: buttonSize, display: 'flex', alignItems: 'center', justifyContent: 'center', fill: mode === 'link' ? undefined : mode === 'icon' ? color : '#ffffff', stroke: mode === 'icon' || mode === 'link' ? undefined : color, lineWidth: mode === 'icon' || mode === 'link' ? 0 : 1, cornerRadius: mode === 'icon' ? buttonSize / 2 : 4, opacity: button.disabled ? 0.45 : 1, cursor: button.disabled ? 'not-allowed' : 'pointer', childrenPickable: false })
      const imageIcon = button.imageIcon ?? (button.icon && /^(data:|https?:|\/)/.test(button.icon) ? button.icon : undefined)
      const content = mode === 'icon' && imageIcon
        ? new CustomLayout.Image({ image: imageIcon, width: fontSize, height: fontSize, x: (width - fontSize) / 2, y: (buttonSize - fontSize) / 2, pickable: false })
        : new CustomLayout.Text({ ...typography, x: width / 2, y: buttonSize / 2, textAlign: 'center', text: mode === 'icon' ? button.icon ?? button.text ?? button.type : mode === 'both' ? [button.icon, button.text].filter(Boolean).join(' ') : button.text ?? button.type, fill: mode === 'icon' ? '#ffffff' : color, fontFamily: button.iconFontFamily, pickable: false })
      graphic.add(content)
      if (!button.disabled) {
        // pointertap handles mouse and touch once, unlike listening to both click and pointertap.
        graphic.addEventListener?.('pointertap', (event: any) => { if (options.getState?.().disabled) return; event?.stopPropagation?.(); onAction(button, scope.row, event) })
        graphic.addEventListener?.('mouseenter', () => {
          graphic.setAttributes?.({ opacity: 0.8 })
          graphic.stage?.renderNextFrame?.()
          if (button.tooltip !== false && (button.tooltip || mode === 'icon')) args.table.showTooltip?.(args.col, args.row, { content: button.tooltip || button.text || button.type })
        })
        graphic.addEventListener?.('mouseleave', () => {
          graphic.setAttributes?.({ opacity: 1 })
          graphic.stage?.renderNextFrame?.()
          args.table.hideTooltip?.()
        })
      }
      root.add(graphic)
    })
    return { rootContainer: root, renderDefault: false }
  }
  return { createSlotGraphics, createRenderLayout, createSlotLayout, createActionLayout, createLinkLayout }
}
