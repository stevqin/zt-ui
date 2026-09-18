import type { ZtComponentSize } from '../types'

export type ZtInputSize = ZtComponentSize
export type ZtInputStatus = 'default' | 'success' | 'warning' | 'error'

export interface ZtInputProps {
  /** 显式 true 启用下边框，false 强制普通边框；省略时继承最近 Form 的 underline。内部及弹出面板辅助控件保留普通边框。 */
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
