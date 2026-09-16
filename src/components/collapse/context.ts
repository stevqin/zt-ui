import type { ComputedRef,InjectionKey } from 'vue';import type { ZtCollapseName } from './types'
export const collapseKey:InjectionKey<{active:ComputedRef<ZtCollapseName[]>;toggle:(name:ZtCollapseName)=>void}>=Symbol('zt-collapse')
