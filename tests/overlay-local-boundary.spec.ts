import { readFileSync } from 'node:fs'
import { flushPromises, mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import { resolvePopupZIndex } from '../src/components/overlay/resolvePopupZIndex'

it('does not adopt foreign drawer DOM as a portal host or a named overlay scope', async () => {
  const host = document.createElement('div')
  host.className = 'zt-drawer'
  host.style.zIndex = '6400'
  const panel = document.createElement('section')
  panel.className = 'zt-drawer__panel'
  host.append(panel)
  document.body.append(host)
  const wrapper = mount(ZtSelectBox, { attachTo: panel })
  try {
    expect(resolvePopupZIndex(wrapper.element as HTMLElement)).toBe(2000)
    expect(resolvePopupZIndex(wrapper.element as HTMLElement, 3200)).toBe(3201)
    await wrapper.get('[role="combobox"]').trigger('click')
    await flushPromises()
    const popup = document.querySelector<HTMLElement>('.zt-select-box__popup')!
    expect(popup.parentElement).toBe(document.body)
    expect(popup.style.position).toBe('fixed')
    // SelectBox still honors generic ancestor stacking contexts, regardless of class.
    expect(popup.style.zIndex).toBe('6401')
  } finally { wrapper.unmount(); host.remove() }
})

it('keeps popup infrastructure free of external Drawer adapters', () => {
  const source = [
    'src/components/overlay/resolvePopupZIndex.ts',
    'src/components/selection/useAnchoredDropdown.ts',
  ].map(path => readFileSync(path, 'utf8')).join('\n')
  expect(source).not.toContain('.zt-drawer__panel')
  expect(source).not.toMatch(/\.zt-drawer(?=[,'"\s])/)
  expect(source).not.toContain('@ztechjs/zt-alert')
})
