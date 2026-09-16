import type { InjectionKey, Ref } from 'vue'
export const descriptionsKey: InjectionKey<{ labelWidth: Ref<string|number|undefined>; direction: Ref<'horizontal'|'vertical'> }> = Symbol('zt-descriptions')
