import type { InjectionKey } from 'vue'

// Wrapper-owned appearance; each Popover consumes and resets it so nested
// floating components retain their own surface and foreground colors.
export const popoverSurfaceKey: InjectionKey<'default' | 'tooltip' | 'confirm'> = Symbol('ztPopoverSurface')
