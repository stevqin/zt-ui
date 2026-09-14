export type ZtBadgeStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface ZtBadgeProps {
  value?: string | number
  max?: number
  isDot?: boolean
  hidden?: boolean
  status?: ZtBadgeStatus
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  offset?: [number, number]
  showZero?: boolean
}
