import type { ZtOverlayCommonProps } from '../overlay/types'

export type ZtDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface ZtDrawerProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  placement?: ZtDrawerPlacement
  size?: number | string
}
