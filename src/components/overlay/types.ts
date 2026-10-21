export type ZtOverlayCloseReason = 'close' | 'cancel' | 'confirm' | 'mask' | 'escape' | 'api'

export type ZtBeforeClose = (
  reason: ZtOverlayCloseReason,
) => boolean | void | Promise<boolean | void>

export type ZtOverlayClassNames = Partial<Record<'panel' | 'header' | 'heading' | 'tools' | 'body' | 'footer' | 'close' | 'fullscreen' | 'bottom' | 'top' | 'narrow' | 'underneath', string>>

export interface ZtOverlayCommonProps {
  /** Additional classes for overlay parts, including teleported content. */
  classNames?: ZtOverlayClassNames
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
