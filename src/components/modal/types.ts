import type { ZtOverlayCommonProps } from '../overlay/types'
import type { ZtComponentSize } from '../types'

export type ZtModalSize = ZtComponentSize

export interface ZtModalProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  width?: number | string
  top?: number | string
  fullscreen?: boolean
  showFullscreenButton?: boolean
  draggable?: boolean
  size?: ZtModalSize
}
