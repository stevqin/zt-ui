import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import {
  ZtButton,
  ZtConfigProvider,
  ZtDrawer,
  ZtInput,
} from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const wrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('Drawer size semantics', () => {
  it.each([
    ['left', '360px', 'width'],
    ['right', '40%', 'width'],
    ['top', '280px', 'height'],
    ['bottom', '35vh', 'height'],
  ] as const)('uses the %s axis only', (placement, expected, axis) => {
    const wrapper = mount(ZtDrawer, {
      props: {
        modelValue: true,
        placement,
        width: placement === 'left' ? 360 : '40%',
        height: placement === 'top' ? 280 : '35vh',
      },
      global: { stubs: { teleport: true }, components: { ZtButton } },
    })
    wrappers.push(wrapper)

    const style = wrapper.get('.zt-drawer-surface__panel').attributes('style')
    expect(style).toContain(`${axis}: ${expected}`)
    expect(style).not.toContain(`${axis === 'width' ? 'height' : 'width'}:`)
  })

  it.each([
    ['left', 'width'],
    ['right', 'width'],
    ['top', 'height'],
    ['bottom', 'height'],
  ] as const)('uses a 420px %s default without reading density as geometry', (placement, axis) => {
    const wrapper = mount(ZtDrawer, {
      props: { modelValue: true, placement, size: 'small' },
      global: { stubs: { teleport: true } },
    })
    wrappers.push(wrapper)

    const panel = wrapper.get<HTMLElement>('.zt-drawer-surface__panel').element
    expect(panel.style[axis]).toBe('420px')
    expect(panel.style[axis === 'width' ? 'height' : 'width']).toBe('')
  })

  it('inherits overlay density and lets a child explicit size win', () => {
    const inherited = mount(ZtConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: () => h(ZtDrawer, { modelValue: true }, {
          default: () => h(ZtButton, null, () => '继承尺寸'),
        }),
      },
      global: { stubs: { teleport: true } },
    })
    wrappers.push(inherited)
    expect(inherited.get('.zt-drawer-surface').classes()).toContain('zt-drawer-surface--large')
    expect(inherited.get('button').classes()).toContain('zt-button--large')

    const explicit = mount(ZtConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: () => h(ZtDrawer, { modelValue: true, size: 'small' }, {
          default: () => [h(ZtInput), h(ZtInput, { size: 'large' })],
        }),
      },
      global: { stubs: { teleport: true } },
    })
    wrappers.push(explicit)
    expect(explicit.get('.zt-drawer-surface').classes()).toContain('zt-drawer-surface--small')
    expect(explicit.findAll('.zt-input')[0]!.classes()).toContain('zt-input--small')
    expect(explicit.findAll('.zt-input')[1]!.classes()).toContain('zt-input--large')
  })
})
