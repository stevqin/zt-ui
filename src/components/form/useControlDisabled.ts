import { computed, inject, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { ztFormGroupKey, ztFormItemKey } from './context'

/** Resolve effective disabled state across control prop, FormItem, and FormGroup. */
export function useZtControlDisabled(
  local?: MaybeRefOrGetter<boolean | undefined>,
): ComputedRef<boolean> {
  const formItem = inject(ztFormItemKey, undefined)
  const formGroup = inject(ztFormGroupKey, undefined)
  return computed(
    () =>
      Boolean(
        toValue(local) ||
          formItem?.disabled.value ||
          formGroup?.disabled.value,
      ),
  )
}
