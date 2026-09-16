// Behavior documented here cannot be inferred from Vue's declaration macros.
// Keep these signatures aligned with the exposed implementation.
export const methods = {
 ZtScrollbar: {update:'() => void',scrollTo:'(options: ScrollToOptions | number, y?: number) => void',setScrollTop:'(value: number) => void',setScrollLeft:'(value: number) => void',wrapRef:'HTMLElement | undefined'},
 ZtPopover: {show:'() => void',hide:'() => void',toggle:'() => void',updatePosition:'() => void'},
 ZtUpload: {submit:'() => Promise<void>',abort:'(file?: ZtUploadFile) => void',retry:'(file: ZtUploadFile) => Promise<void>',remove:'(file: ZtUploadFile) => Promise<void>',clearFiles:'() => void',open:'() => void'},
 ZtInputOtp: {focus:'(index?: number) => void',blur:'() => void',clear:'() => void',input:'HTMLInputElement | undefined'},
 ZtInput: {focus:'(options?: FocusOptions) => void',blur:'() => void',select:'() => void',clear:'() => void',input:'HTMLInputElement | undefined'},
 ZtPassword: {focus:'(options?: FocusOptions) => void',blur:'() => void',select:'() => void',clear:'() => void'},
 ZtInputNumber: {focus:'(options?: FocusOptions) => void',blur:'() => void',select:'() => void'},
 ZtFormItem: {validate:'(trigger?: ZtFormValidateTrigger) => Promise<boolean>',resetField:'() => void',clearValidate:'() => void',validateState:"'' | 'validating' | 'success' | 'error'",validateMessage:'string'},
 ZtModal: {open:'() => void',close:"(reason?: ZtOverlayCloseReason) => Promise<boolean>",focus:'() => void',resetPosition:'() => void'},
 ZtDrawer: {open:'() => void',close:"(reason?: ZtOverlayCloseReason) => Promise<boolean>",focus:'() => void'},
}
