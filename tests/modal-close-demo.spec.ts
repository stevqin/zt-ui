import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CloseDemo from '../site/src/views/modal/Example03.vue'
import ZtModal from '../src/components/modal/ZtModal.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  vi.useRealTimers()
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('Modal mask close demo', () => {
  it('starts closing the default mask example without waiting for a timer', async () => {
    vi.useFakeTimers()
    const wrapper = mount(CloseDemo, { attachTo: document.body })
    try {
      const button = wrapper.findAll('button').find(b => b.text() === '点击遮罩关闭')!
      expect(button).toBeDefined()
      await button.trigger('click')
      const mask = document.querySelector<HTMLElement>('.zt-modal:not([style*="display: none"])')!
      mask.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      mask.click()
      await Promise.resolve()
      await nextTick()
      const modal = wrapper.findAllComponents(ZtModal).find(m => m.props('title') === '点击遮罩关闭')!
      expect(modal.emitted('close')).toEqual([['mask']])
      expect(modal.props('modelValue')).toBe(false)
    } finally { wrapper.unmount() }
  })
})
