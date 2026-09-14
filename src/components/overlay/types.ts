export type ZtOverlayCloseReason = 'close' | 'cancel' | 'confirm' | 'mask' | 'escape' | 'api'

export type ZtBeforeClose = (
  reason: ZtOverlayCloseReason,
) => boolean | void | Promise<boolean | void>

export interface ZtOverlayCommonProps {
  title?: string
  ariaLabel?: string
  showHeader?: boolean
  showClose?: boolean
  showFooter?: boolean
  showCancelButton?: boolean
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
  confirmDisabled?: boolean
  maskClosable?: boolean
  escClosable?: boolean
  lockScroll?: boolean
  destroyOnClose?: boolean
  autoFocus?: boolean
  focusTrap?: boolean
  zIndex?: number
  beforeClose?: ZtBeforeClose
}
