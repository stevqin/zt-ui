import type { ZtComponentSize } from '../types'
export type ZtInputOtpStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'error'
export interface ZtInputOtpProps {
  /** 输入值。使用字符串以保留开头的 0。 */
  modelValue?: string | null
  /** 验证码位数，1–32，默认 6。 */
  length?: number
  /** 仅接受数字；关闭后允许非空白字符。全角数字会转换为半角。 */
  integerOnly?: boolean
  /** 遮蔽已输入字符，不影响绑定值。 */
  mask?: boolean
  /** 默认继承 Form / ConfigProvider 的尺寸。 */
  size?: ZtComponentSize
  /** 主题或校验状态，error 为 danger 的别名。 */
  status?: ZtInputOtpStatus
  /** 禁用输入，可继承 Form。 */
  disabled?: boolean
  /** 只读。 */
  readonly?: boolean
  /** 两组字符之间的分隔文本，例如 "-"。 */
  separator?: string
  /** 在第几格后显示分隔符，默认位数的一半（向下取整）。 */
  separatorAfter?: number
  /** 浏览器自动填充提示，默认 one-time-code。 */
  autocomplete?: string
  /** 挂载时自动聚焦，默认关闭。 */
  autofocus?: boolean
}
