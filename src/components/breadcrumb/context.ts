import type { ComputedRef, InjectionKey, Ref } from 'vue'
export interface BreadcrumbContext {
  separator: ComputedRef<string> | Ref<string>
  /** Live count of mounted items (kept for API stability). */
  count: ComputedRef<number>
  register: () => () => void
}
export const breadcrumbKey: InjectionKey<BreadcrumbContext> = Symbol('zt-breadcrumb')
