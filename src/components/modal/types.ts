import type { ZtOverlayCommonProps } from '../overlay/types'

export interface ZtModalProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  width?: number | string
  top?: number | string
  fullscreen?: boolean
  showFullscreenButton?: boolean
  draggable?: boolean
}
