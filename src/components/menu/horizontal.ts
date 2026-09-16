import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ZtComponentSize } from '../types'
import type { ZtMenuStatus } from './types'
export interface HorizontalContext {
 id: string
 path: Ref<string[]>
 size: ComputedRef<ZtComponentSize>
 status: ComputedRef<ZtMenuStatus>
 trigger: ComputedRef<'hover' | 'click'>
 open: (path: string[]) => void
 enter: () => void
 leave: () => void
 close: () => void
}
export const horizontalKey: InjectionKey<HorizontalContext> = Symbol('ztHorizontalMenu')
