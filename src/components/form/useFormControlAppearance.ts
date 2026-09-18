import { computed, inject, provide, type InjectionKey } from 'vue'
import { ztFormKey } from './context'

const formControlAppearanceBoundaryKey: InjectionKey<boolean> = Symbol('ztFormControlAppearanceBoundary')

// A nearer Form owns its appearance even when rendered inside another control.
export function provideFormControlAppearanceRoot() {
  provide(formControlAppearanceBoundaryKey, false)
}

export function useFormControlAppearance() {
  const form = inject(ztFormKey, undefined)
  const insidePublicControl = inject(formControlAppearanceBoundaryKey, false)
  const underline = computed(() => Boolean(form?.underline.value && !insidePublicControl))
  provide(formControlAppearanceBoundaryKey, true)
  return { underline }
}
