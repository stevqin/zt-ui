import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest'
import { ZtAlert, ZtConfigProvider } from '../src'
import type { ZtAlertProps } from '../src/components/alert/types'

const wrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

function mountAlert(size: 'mini' | 'large') {
  const wrapper = mount(ZtConfigProvider, {
    attachTo: document.body,
    props: { size },
    slots: { default: () => h(ZtAlert, { title: '标题', description: '说明' }) },
  })
  wrappers.push(wrapper)
  return wrapper.get('.zt-alert')
}

describe('Alert size semantics', () => {
  it('keeps the same classes and computed density under mini and large providers', () => {
    const mini = mountAlert('mini')
    const large = mountAlert('large')
    const miniStyle = getComputedStyle(mini.element)
    const largeStyle = getComputedStyle(large.element)

    expect(mini.classes()).toEqual(large.classes())
    expect(miniStyle.padding).toBe(largeStyle.padding)
    expect(miniStyle.fontSize).toBe(largeStyle.fontSize)
  })

  it('does not expose a size prop in its public props type or runtime metadata', () => {
    expectTypeOf<ZtAlertProps>().not.toHaveProperty('size')
    expect('size' in (ZtAlert as { props?: Record<string, unknown> }).props!).toBe(false)
  })
})
