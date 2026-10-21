import type { ZtOverlayCommonProps } from '../overlay/types'
import type { ZtComponentSize } from '../types'

export type ZtModalSize = ZtComponentSize

export interface ZtModalProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  width?: number | string
  height?: number | string
  maxHeight?: number | string
  subtitle?: string
  closeLabel?: string
  loading?: boolean
  loadingText?: string
  bodyScroll?: boolean
  placement?: 'center' | 'bottom'
  fullscreenBelow?: number
  /** Compatibility alias; showFullscreenButton takes precedence. */
  showZoom?: boolean
  /** Body padding in pixels or CSS shorthand. 0 removes padding; omit for size defaults. */
  bodyPadding?: number | string
  top?: number | string
  fullscreen?: boolean
  showFullscreenButton?: boolean
  draggable?: boolean
  size?: ZtModalSize
}
