import { computed, inject, type ComputedRef, type CSSProperties, type InjectionKey } from 'vue'
import type { ZtComponentSize } from '../types'
import type { ZtTheme } from './types'
export interface ZtConfigContext {
  size: ComputedRef<ZtComponentSize>
  theme: ComputedRef<ZtTheme>
  borderRadius: ComputedRef<number>
  style: ComputedRef<CSSProperties>
}
export const configProviderKey: InjectionKey<ZtConfigContext> = Symbol('ztConfigProvider')
const defaults: ZtConfigContext = {
  size: computed(() => 'default'), theme: computed(() => 'light'),
  borderRadius: computed(() => 11), style: computed(() => ({})),
}
export function useZtConfig() { return inject(configProviderKey, defaults) }
export function useZtSize(props: { size?: ZtComponentSize }, parent?: () => ZtComponentSize | undefined) {
  const config = useZtConfig()
  return computed(() => props.size ?? parent?.() ?? config.size.value)
}
