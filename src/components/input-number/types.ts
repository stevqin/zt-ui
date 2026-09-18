import type { ZtComponentSize } from '../types'

export type ZtInputNumberSize = ZtComponentSize
export type ZtInputNumberControlsPosition = 'default' | 'left' | 'right'

export interface ZtInputNumberProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
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
