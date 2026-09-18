import type { ZtOverlayCommonProps } from '../overlay/types'
import type { ZtComponentSize } from '../types'

export type ZtDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface ZtDrawerProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  subtitle?: string
  closeLabel?: string
  placement?: ZtDrawerPlacement
  /** Component density. */
  size?: ZtComponentSize
  /** Panel width for left/right drawers, in pixels or CSS units. */
  width?: number | string
  /** Panel height for top/bottom drawers, in pixels or CSS units. */
  height?: number | string
  /** Fill the viewport below this breakpoint; 0 disables it. */
  fullscreenBelow?: number
  bodyScroll?: boolean
  bodyPadding?: number | string
  loading?: boolean
  loadingText?: string
}
