import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZtSelect, type ZtSelectOption } from '../src/components/select'

function stubRect(el: Element, rect: Partial<DOMRect>) {
  el.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      width: 240,
      height: 34,
      top: 0,
      left: 0,
      bottom: 34,
      right: 240,
      toJSON: () => ({}),
      ...rect,
    }) as DOMRect
}

describe('Select dropdown anchors to the trigger rect', () => {
  it('places the popup at the real trigger bottom instead of the viewport gutter', async () => {
    const options: ZtSelectOption[] = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]
    const Host = defineComponent({
      components: { ZtSelect },
      setup: () => ({ options, value: ref('a') }),
      template: `<ZtSelect v-model="value" :options="options" />`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const trigger = document.querySelector('.zt-select__control') as HTMLElement
    // Simulate a trigger scrolled above the viewport (old code clamped this to top:14).
    stubRect(trigger, { top: -366, bottom: -332, height: 34 })
    const select = wrapper.findComponent(ZtSelect)
    ;(select.vm as any).open()
    await nextTick()
    await nextTick()
    const popup = document.querySelector('.zt-select__dropdown') as HTMLElement
    expect(popup).toBeTruthy()
    const popupTop = Number.parseFloat(popup.style.top || 'NaN')
    // Follows triggerRect.bottom (-332), not the clamped viewport edge (~14).
    expect(popupTop).toBeCloseTo(-332, 0)
    wrapper.unmount()
  })

  it('keeps the popup below a fully visible trigger', async () => {
    const options: ZtSelectOption[] = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]
    const Host = defineComponent({
      components: { ZtSelect },
      setup: () => ({ options, value: ref(null) }),
      template: `<ZtSelect v-model="value" :options="options" />`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const trigger = document.querySelector('.zt-select__control') as HTMLElement
    stubRect(trigger, { top: 400, bottom: 434, height: 34 })
    const select = wrapper.findComponent(ZtSelect)
    ;(select.vm as any).open()
    await nextTick()
    await nextTick()
    const popup = document.querySelector('.zt-select__dropdown') as HTMLElement
    const popupTop = Number.parseFloat(popup.style.top || 'NaN')
    expect(popupTop).toBeCloseTo(434, 0)
    wrapper.unmount()
  })
})
