import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DemoBlock from './DemoBlock.vue'

const code = '<script setup lang="ts">\nconst value = 1\n<\/script>'

afterEach(() => {
  vi.useRealTimers()
})

describe('DemoBlock', () => {
  it('expands a labeled Vue and TypeScript source panel', async () => {
    const wrapper = mount(DemoBlock, { props: { code } })
    expect(wrapper.get('.doc-demo__source').attributes('style')).toContain('display: none')

    await wrapper.get('.doc-demo__toggle').trigger('click')
    expect(wrapper.get('.doc-demo__source').attributes('style') ?? '').not.toContain('display: none')
    expect(wrapper.get('.doc-demo__language').text()).toBe('Vue + TypeScript')
    expect(wrapper.get('pre code').text()).toBe(code)
  })

  it('copies source and announces success before resetting', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    const wrapper = mount(DemoBlock, { props: { code } })

    await wrapper.get('.doc-demo__copy').trigger('click')
    await Promise.resolve()
    expect(writeText).toHaveBeenCalledWith(code)
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('已复制')

    vi.advanceTimersByTime(1800)
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('复制代码')
  })

  it('announces clipboard failures', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    const wrapper = mount(DemoBlock, { props: { code } })

    await wrapper.get('.doc-demo__copy').trigger('click')
    await Promise.resolve()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('复制失败')
  })
})
