import { computed, inject, provide, toValue, type InjectionKey, type MaybeRefOrGetter } from 'vue'
import { ztFormKey } from './context'

const formControlAppearanceBoundaryKey: InjectionKey<boolean> = Symbol('ztFormControlAppearanceBoundary')

// A nearer Form owns its appearance even when rendered inside another control.
export function provideFormControlAppearanceRoot() {
  provide(formControlAppearanceBoundaryKey, false)
}

export function useFormControlAppearance(local?: MaybeRefOrGetter<boolean | undefined>) {
  const form = inject(ztFormKey, undefined)
  const insidePublicControl = inject(formControlAppearanceBoundaryKey, false)
  const inherited = computed(() => Boolean(form?.underline.value && !insidePublicControl))
  const underline = computed(() => toValue(local) ?? inherited.value)
  provide(formControlAppearanceBoundaryKey, true)
  return { underline }
}
