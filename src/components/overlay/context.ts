import type { InjectionKey, Ref } from 'vue'

/** A teleported child popup remains part of its containing overlay's focus scope. */
export interface OverlayBranch {
  trigger: Ref<HTMLElement | undefined>
  popup: Ref<HTMLElement | undefined>
  visible: Ref<boolean>
  /** Traverse popup controls before returning to the parent focus scope. */
  tabThroughPopup?: boolean
  close: () => void
  focus: () => void
}

export interface OverlayContext {
  interactive: Readonly<Ref<boolean>>
  registerBranch: (branch: OverlayBranch) => () => void
}

export const overlayContextKey: InjectionKey<OverlayContext> = Symbol('zt-overlay-context')
