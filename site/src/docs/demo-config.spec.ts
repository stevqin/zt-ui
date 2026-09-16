import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { demoConfig, demoConfigKey, readDemoConfig, resetDemoConfig } from './demo-config'

afterEach(async () => { resetDemoConfig(); await nextTick(); localStorage.clear() })
describe('global demo configuration', () => {
  it('persists all three settings for reloads', async () => {
    Object.assign(demoConfig, { size: 'large', theme: 'dark', borderRadius: 0 })
    await nextTick()
    expect(readDemoConfig()).toEqual({ size: 'large', theme: 'dark', borderRadius: 0 })
  })
  it('recovers from invalid stored settings', () => {
    localStorage.setItem(demoConfigKey, '{')
    expect(readDemoConfig()).toEqual({ size: 'default', theme: 'light', borderRadius: 11 })
    localStorage.setItem(demoConfigKey, JSON.stringify({ size: 'huge', theme: 'unknown', borderRadius: -4 }))
    expect(readDemoConfig()).toEqual({ size: 'default', theme: 'light', borderRadius: 11 })
  })
  it('resets and persists the original defaults', async () => {
    Object.assign(demoConfig, { size: 'mini', theme: 'dark', borderRadius: 24 })
    resetDemoConfig()
    await nextTick()
    expect(readDemoConfig()).toEqual({ size: 'default', theme: 'light', borderRadius: 11 })
  })
})
