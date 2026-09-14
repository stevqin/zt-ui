import type { ZtComponentSize } from '../types'

export type ZtButtonStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtButtonSize = ZtComponentSize
export type ZtButtonType = 'button' | 'submit' | 'reset'

export interface ZtButtonProps {
  status?: ZtButtonStatus
  size?: ZtButtonSize
  circle?: boolean
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  type?: ZtButtonType
}
