import type { ZtComponentSize } from '../types'

export type ZtBadgeStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtBadgeSize = ZtComponentSize

export interface ZtBadgeProps {
  value?: string | number
  max?: number
  isDot?: boolean
  /** 圆形数字徽标；单字符为正圆，多字符扩展为胶囊形，默认 true。false 时继承全局圆角。 */
  circle?: boolean
  hidden?: boolean
  status?: ZtBadgeStatus
  size?: ZtBadgeSize
  offset?: [number, number]
  showZero?: boolean
}
