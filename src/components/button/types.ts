import type { ZtComponentSize } from '../types'

export type ZtButtonStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtButtonSize = ZtComponentSize
export type ZtButtonType = 'button' | 'submit' | 'reset'

export interface ZtButtonProps {
  status?: ZtButtonStatus
  size?: ZtButtonSize
  /** 浅色填充按钮，保留语义色文字与边框。 */
  plain?: boolean
  /** 透明背景的语义色虚线边框按钮。 */
  dashed?: boolean
  /** 无边框文字按钮；优先级高于 dashed 和 plain。 */
  text?: boolean
  /** 自定义 CSS 颜色，覆盖 status 对应的视觉颜色。 */
  color?: string
  circle?: boolean
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  type?: ZtButtonType
}
