import type { InjectionKey, Ref } from 'vue'
export interface BreadcrumbContext { separator: Ref<string>; count: Ref<number>; register: () => number }
export const breadcrumbKey: InjectionKey<BreadcrumbContext> = Symbol('zt-breadcrumb')
