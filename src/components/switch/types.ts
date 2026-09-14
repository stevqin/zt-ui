export type ZtSwitchStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtSwitchSize = 'small' | 'default' | 'large'

export interface ZtSwitchProps {
  modelValue?: boolean | string | number
  disabled?: boolean
  loading?: boolean
  size?: ZtSwitchSize
  status?: ZtSwitchStatus
  activeText?: string
  inactiveText?: string
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
  width?: number | string
}
