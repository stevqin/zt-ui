import type { ZtOverlayCommonProps } from '../overlay/types'

export type ZtDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface ZtDrawerProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  subtitle?: string
  closeLabel?: string
  placement?: ZtDrawerPlacement
  /** Panel width (left/right) or height (top/bottom), in pixels or CSS units. */
  size?: number | string
  /** Width alias for horizontal drawers; takes precedence over size. */
  width?: number | string
  /** Fill the viewport below this breakpoint; 0 disables it. */
  fullscreenBelow?: number
  bodyScroll?: boolean
  bodyPadding?: number | string
  loading?: boolean
  loadingText?: string
}
