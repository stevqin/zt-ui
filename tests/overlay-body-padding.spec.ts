import { mount } from '@vue/test-utils'
import { compile } from 'sass'
import { afterEach, describe, expect, it } from 'vitest'
import ZtModal from '../src/components/modal/ZtModal.vue'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const css = ['modal/modal', 'drawer/drawer']
  .map(path => compile(`src/components/${path}.scss`).css).join('\n')
afterEach(() => {
  resetOverlayManager()
  document.querySelector('[data-body-padding-test]')?.remove()
  document.body.innerHTML = ''
})

describe.each([
  ['Modal', ZtModal, '.zt-modal__body'],
  ['Drawer', ZtDrawer, '.zt-drawer-surface__body'],
] as const)('%s body padding', (_name, component, selector) => {
  function setup(size = 'default') {
    const style = document.createElement('style')
    style.dataset.bodyPaddingTest = ''
    style.textContent = css
    document.head.append(style)
    const wrapper = mount(component as typeof ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, size: size as 'default', autoFocus: false },
    })
    return { wrapper, body: document.querySelector<HTMLElement>(selector)! }
  }

  it.each([['mini', 14], ['small', 17], ['default', 22], ['medium', 25], ['large', 28]])(
    'preserves %s defaults, accepts zero, and restores defaults when removed', async (size, padding) => {
      const { wrapper, body } = setup(String(size))
      try {
        expect(body.style.padding).toBe('')
        expect(getComputedStyle(body).paddingTop).toBe(`${padding}px`)
        await wrapper.setProps({ bodyPadding: 0 })
        expect(getComputedStyle(body).paddingTop).toBe('0px')
        expect(getComputedStyle(body).paddingLeft).toBe('0px')
        await wrapper.setProps({ bodyPadding: undefined })
        expect(body.style.padding).toBe('')
        expect(getComputedStyle(body).paddingTop).toBe(`${padding}px`)
      } finally { wrapper.unmount() }
    },
  )

  it.each([[24, '24px'], ['0', '0px'], ['12px 20px', '12px 20px']])(
    'accepts %s as explicit padding', async (value, expected) => {
      const { wrapper, body } = setup()
      try {
        await wrapper.setProps({ bodyPadding: value })
        expect(body.style.padding).toBe(expected)
      } finally { wrapper.unmount() }
    },
  )
})
