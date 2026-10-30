import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ZtModal from '../src/components/modal/ZtModal.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  vi.useRealTimers()
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('Modal mask close behavior', () => {
  it('starts closing a mask-closable modal without waiting for a timer', async () => {
    vi.useFakeTimers()
    const wrapper = mount(defineComponent({
      setup() {
        const visible = ref(false)
        return () => h('div', [
          h('button', { onClick: () => { visible.value = true } }, '点击遮罩关闭'),
          h(ZtModal, { modelValue: visible.value, 'onUpdate:modelValue': (value: boolean) => { visible.value = value }, title: '点击遮罩关闭', maskClosable: true }),
        ])
      },
    }), { attachTo: document.body })
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
