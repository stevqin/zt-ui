import type { VNode } from 'vue'
import type { ZtComponentSize } from '../types'

export type VTableTagType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type VTableTagEffect = 'dark' | 'light' | 'plain'
export type VTableTagSize = ZtComponentSize
export interface VTableTagProps {
  text?: string | number
  type?: VTableTagType
  status?: VTableTagType
  effect?: VTableTagEffect
  size?: VTableTagSize
  round?: boolean
  hit?: boolean
  color?: string
  textColor?: string
  borderColor?: string
  fontWeight?: string | number
  padding?: number | number[]
  boundsPadding?: number | number[]
  minWidth?: number
  maxWidth?: number
  visible?: boolean
  textStyle?: Record<string, unknown>
  panelStyle?: Record<string, unknown>
  onClick?: (event: unknown) => void
}

const palettes = {
  default: ['#414141', '#f9fafb', '#e2e2e2'], primary: ['#244c9e', '#f0f5ff', '#bfd2ff'],
  success: ['#166534', '#f0fdf4', '#bbf7d0'], warning: ['#92400e', '#fffbeb', '#fde68a'],
  danger: ['#991b1b', '#fef2f2', '#fecaca'], info: ['#374151', '#f9fafb', '#d1d5db'],
}
const sizes = { mini: [11, 16, 1, 6], small: [12, 18, 1, 7], default: [13, 20, 2, 8], medium: [14, 22, 2, 9], large: [15, 22, 3, 10] }

/** Canvas equivalents of ZtTag's semantic colors and size tokens. */
export function resolveVTableTagAttributes(input: Record<string, any>, inheritedSize: VTableTagSize = 'default', inheritedPreset?: { fontSize: number; lineHeight: number }) {
  const { type = input.status ?? 'primary', status: _status, effect = 'light', size = inheritedSize, round, hit, color, textColor, borderColor, fontWeight, textStyle, panelStyle, padding, ...attributes } = input
  const [ink, soft, line] = palettes[type as VTableTagType] ?? palettes.primary
  const [fontSize, lineHeight, verticalPadding, horizontalPadding] = sizes[size as VTableTagSize] ?? sizes.default
  return {
    ...attributes, text: attributes.text == null ? '' : String(attributes.text),
    boundsPadding: attributes.boundsPadding ?? [0, 2, 0, 2],
    padding: padding ?? [verticalPadding, horizontalPadding, verticalPadding, horizontalPadding],
    textStyle: { fill: textColor ?? (effect === 'dark' ? '#ffffff' : ink), fontSize, lineHeight, ...(!input.size ? inheritedPreset : {}), fontWeight: fontWeight ?? 500, textAlign: 'center', textBaseline: 'middle', ...textStyle },
    panel: { visible: true, fill: color ?? (effect === 'dark' ? ink : effect === 'plain' ? '#ffffff' : soft), stroke: borderColor ?? (hit ? ink : line), lineWidth: 1, cornerRadius: round ? 999 : Math.max(3, Math.round(fontSize / 3)), ...panelStyle },
  }
}

/** Vue placeholder translated to a Canvas Tag by the Grid's custom-layout renderer. */
export const VTableTag = (_props: VTableTagProps): VNode | null => null
Object.assign(VTableTag, { symbol: 'VTableTag', displayName: 'VTableTag' })
export default VTableTag
