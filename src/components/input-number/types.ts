import type { ZtComponentSize } from '../types'

export type ZtInputNumberSize = ZtComponentSize
export type ZtInputNumberControlsPosition = 'default' | 'left' | 'right'

export interface ZtInputNumberProps {
  /** 显式 true 启用下边框，false 强制普通边框；省略时继承最近 Form 的 underline。内部及弹出面板辅助控件保留普通边框。 */
  underline?: boolean
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  precision?: number
  stepStrictly?: boolean
  size?: ZtInputNumberSize
  disabled?: boolean
  readonly?: boolean
  controls?: boolean
  controlsPosition?: ZtInputNumberControlsPosition
}
