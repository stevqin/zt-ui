import type { ZtComponentSize } from '../types'

export type ZtInputSize = ZtComponentSize
export type ZtInputStatus = 'default' | 'success' | 'warning' | 'error'

export interface ZtInputProps {
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
