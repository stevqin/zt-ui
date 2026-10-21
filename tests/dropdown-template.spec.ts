import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtDropdown, ZtDropdownItem } from '../src'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})
const actions = () => [...document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')]
async function open(wrapper: VueWrapper) {
  await wrapper.get('.zt-dropdown__trigger').trigger('click')
  await nextTick()
}
function render(dropdown: () => ReturnType<typeof h>[], props = {}) {
  const wrapper = mount(ZtDropdown, {
    attachTo: document.body,
    props,
    slots: { default: '更多操作', dropdown },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('Dropdown template items', () => {
  it('exports a component and renders template labels, groups, separators and aligned icons', async () => {
    expect(ZtDropdownItem).toBeDefined()
    const wrapper = render(() => [
      h(ZtDropdownItem, { type: 'group', label: '订单操作' }),
      h(ZtDropdownItem, { command: 'edit', icon: '✎' }, () => h('strong', '编辑订单')),
      h(ZtDropdownItem, { type: 'divider' }),
      h(ZtDropdownItem, { command: 'copy', label: '复制' }),
    ])
    await open(wrapper)
    expect(document.querySelector('.zt-dropdown__group')?.textContent).toBe('订单操作')
    expect(document.querySelectorAll('[role="separator"]')).toHaveLength(1)
    expect(actions()).toHaveLength(2)
    expect(actions()[0].querySelector('strong')?.textContent).toBe('编辑订单')
    expect(actions()[1].textContent).toBe('复制')
    expect(actions().map(item => item.querySelector('.zt-dropdown__icon') !== null)).toEqual([true, true])
  })

  it('emits numeric command zero with item data, closes and restores focus', async () => {
    const wrapper = render(() => [h(ZtDropdownItem, { command: 0, label: '编辑', icon: '✎' })])
    await open(wrapper)
    actions()[0].click()
    await nextTick()
    expect(wrapper.emitted('command')).toEqual([[0, { key: 0, label: '编辑', icon: '✎', disabled: false, type: 'item' }]])
    expect(document.querySelector('[role="menu"]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get('.zt-dropdown__trigger').element)
  })

  it('skips disabled entries and preserves keyboard navigation for template items', async () => {
    const wrapper = render(() => [
      h(ZtDropdownItem, { command: 'edit', label: '编辑' }),
      h(ZtDropdownItem, { command: 'delete', label: '删除', disabled: true }),
      h(ZtDropdownItem, { command: 'copy', label: '复制' }),
    ])
    await wrapper.get('.zt-dropdown__trigger').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement).toBe(actions()[0])
    actions()[1].click()
    expect(wrapper.emitted('command')).toBeUndefined()
    actions()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(actions()[2])
    actions()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.querySelector('.zt-dropdown')).toBeNull()
  })

  it('keeps the original items and item slot contract, including the source object identity', async () => {
    const source = reactive({ key: 'edit', label: '编辑' })
    const wrapper = mount(ZtDropdown, {
      attachTo: document.body,
      props: { items: [source] },
      slots: { item: ({ item }) => h('strong', item.label) },
    })
    wrappers.push(wrapper)
    await open(wrapper)
    expect(actions()[0].querySelector('strong')?.textContent).toBe('编辑')
    actions()[0].click()
    await nextTick()
    expect(wrapper.emitted('command')?.[0]?.[1]).toBe(source)
  })

  it('gives the dropdown slot precedence over items and respects hideOnClick=false', async () => {
    const wrapper = render(() => [h(ZtDropdownItem, { command: 'template', label: '模板菜单' })], {
      items: [{ key: 'data', label: '数据菜单' }], hideOnClick: false,
    })
    await open(wrapper)
    expect(actions().map(item => item.textContent)).toEqual(['模板菜单'])
    actions()[0].click()
    await nextTick()
    expect(wrapper.emitted('command')?.[0]?.[0]).toBe('template')
    expect(document.querySelector('.zt-dropdown')).not.toBeNull()
  })

  it('updates conditional and loop items and releases their icon columns after removal', async () => {
    const show = ref(true)
    const rows = ref(['first', 'second'])
    const wrapper = mount(defineComponent({
      setup: () => () => h(ZtDropdown, {}, {
        dropdown: () => [
          show.value ? h(ZtDropdownItem, { command: 'icon', icon: '✎', label: '图标菜单' }) : null,
          ...rows.value.map(command => h(ZtDropdownItem, { key: command, command, label: command })),
        ],
      }),
    }), { attachTo: document.body })
    wrappers.push(wrapper)
    await open(wrapper)
    expect(actions()).toHaveLength(3)
    show.value = false
    rows.value = ['second', 'third']
    await nextTick()
    await nextTick()
    expect(actions().map(item => item.textContent)).toEqual(['second', 'third'])
    expect(document.querySelector('.zt-dropdown__icon')).toBeNull()
    rows.value = []
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zt-dropdown__empty')?.textContent).toBe('暂无操作')
  })
})
