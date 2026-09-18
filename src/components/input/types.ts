import type { ZtComponentSize } from '../types'

export type ZtInputSize = ZtComponentSize
export type ZtInputStatus = 'default' | 'success' | 'warning' | 'error'

export interface ZtInputProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
  underline?: boolean
  modelValue?: string | number | null
  type?: string
  size?: ZtInputSize
  status?: ZtInputStatus
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  clearable?: boolean
  maxlength?: number
  showWordLimit?: boolean
}

export interface ZtPasswordProps extends Omit<ZtInputProps, 'type'> {
  showToggle?: boolean
}
