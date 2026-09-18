import type { ZtComponentSize } from '../types'

export type ZtBadgeStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtBadgeSize = ZtComponentSize

export interface ZtBadgeProps {
  value?: string | number
  max?: number
  isDot?: boolean
  hidden?: boolean
  status?: ZtBadgeStatus
  size?: ZtBadgeSize
  offset?: [number, number]
  showZero?: boolean
}
