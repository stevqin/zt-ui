import type { ZtComponentSize } from '../types'

export type ZtInputNumberSize = ZtComponentSize
export type ZtInputNumberControlsPosition = 'default' | 'left' | 'right'

export interface ZtInputNumberProps {
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
