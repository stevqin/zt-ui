import type { ZtOverlayCommonProps } from '../overlay/types'
import type { ZtComponentSize } from '../types'

export type ZtModalSize = ZtComponentSize

export interface ZtModalProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  width?: number | string
  /** Body padding in pixels or CSS shorthand. 0 removes padding; omit for size defaults. */
  bodyPadding?: number | string
  top?: number | string
  fullscreen?: boolean
  showFullscreenButton?: boolean
  draggable?: boolean
  size?: ZtModalSize
}
