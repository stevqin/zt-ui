import { reactive, watch } from 'vue'
import type { ZtComponentSize, ZtTheme } from '@ztechjs/zt-ui'

export const demoConfigKey = 'zt-ui-demo-config'
export const demoSizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']
export interface DemoConfig { size: ZtComponentSize; theme: ZtTheme; borderRadius: number }
export function readDemoConfig(): DemoConfig {
  const defaults: DemoConfig = { size: 'default', theme: 'light', borderRadius: 11 }
  try {
    const saved = JSON.parse(localStorage.getItem(demoConfigKey) ?? '{}')
    return {
      size: demoSizes.includes(saved?.size) ? saved.size : defaults.size,
      theme: saved?.theme === 'dark' ? 'dark' : 'light',
      borderRadius: typeof saved?.borderRadius === 'number' && Number.isFinite(saved.borderRadius) && saved.borderRadius >= 0 && saved.borderRadius <= 24 ? saved.borderRadius : defaults.borderRadius,
    }
  } catch { return defaults }
}
export const demoConfig = reactive(readDemoConfig())
watch(demoConfig, value => {
  try { localStorage.setItem(demoConfigKey, JSON.stringify(value)) } catch { /* Storage may be disabled. */ }
})
export function resetDemoConfig() {
  Object.assign(demoConfig, { size: 'default', theme: 'light', borderRadius: 11 })
}
