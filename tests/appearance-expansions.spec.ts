import { mount } from '@vue/test-utils'
import { compile } from 'sass'
import { h, nextTick, ref } from 'vue'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
  ZtButton,
  ZtCheckbox,
  ZtCheckboxGroup,
  ZtConfigProvider,
  ZtPopover,
  ZtRadio,
  ZtRadioGroup,
  ZtSegmented,
  ZtTabPane,
  ZtTabs,
} from '../src'

const wrappers: ReturnType<typeof mount>[] = []
const sheet = document.createElement('style')

beforeAll(() => {
  sheet.textContent = [
    'button.scss',
    'checkbox.scss',
    'radio.scss',
    'segmented.scss',
    'tabs.scss',
    'popover.scss',
  ].map(file => compile(`src/components/${file.replace('.scss', '')}/${file}`).css).join('\n')
  document.head.append(sheet)
})

afterAll(() => sheet.remove())
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('Button appearance variants', () => {
  it.each([
    ['plain', { plain: true }],
    ['dashed', { dashed: true }],
    ['text', { text: true }],
  ] as const)('applies the %s variant class', (variant, props) => {
    const wrapper = mount(ZtButton, { props: props as any })
    wrappers.push(wrapper)
    expect(wrapper.classes()).toContain(`zt-button--${variant}`)
  })

  it('uses text over dashed and plain when variants are combined', () => {
    const wrapper = mount(ZtButton, { props: { plain: true, dashed: true, text: true } as any })
    wrappers.push(wrapper)
    expect(wrapper.classes()).toContain('zt-button--text')
    expect(wrapper.classes()).not.toContain('zt-button--plain')
    expect(wrapper.classes()).not.toContain('zt-button--dashed')
  })

  it('exposes a custom color to every visual state', () => {
    const wrapper = mount(ZtButton, { props: { color: '#7048e8' } as any })
    wrappers.push(wrapper)
    expect((wrapper.element as HTMLElement).style.getPropertyValue('--zt-button-color')).toBe('#7048e8')
  })
})

describe('selection button groups', () => {
  it('renders CheckboxGroup segmented children as connected buttons', async () => {
    const selected = ref<unknown[]>(['a'])
    const wrapper = mount(ZtCheckboxGroup, {
      attachTo: document.body,
      props: { modelValue: selected.value, segmented: true } as any,
      slots: { default: () => [
        h(ZtCheckbox, { value: 'a' }, () => '甲'),
        h(ZtCheckbox, { value: 'b' }, () => '乙'),
      ] },
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.classes()).toContain('zt-checkbox-group--segmented')
    expect(wrapper.findAll('.zt-checkbox').every(item => item.classes().includes('is-segmented'))).toBe(true)
    expect(getComputedStyle(wrapper.get('.zt-checkbox__inner').element).display).toBe('none')
  })

  it('gives every segmented Radio its own equal-height border', async () => {
    const wrapper = mount(ZtRadioGroup, {
      attachTo: document.body,
      props: { modelValue: 'a', segmented: true, size: 'mini' },
      slots: { default: () => [
        h(ZtRadio, { label: 'a' }, () => '甲'),
        h(ZtRadio, { label: 'b' }, () => '乙'),
      ] },
    })
    wrappers.push(wrapper)
    await nextTick()
    const radios = wrapper.findAll('.zt-radio').map(item => item.element)
    expect(getComputedStyle(wrapper.element).borderTopWidth).toBe('0px')
    expect(radios.map(item => getComputedStyle(item).borderTopWidth)).toEqual(['1px', '1px'])
    expect(radios.map(item => getComputedStyle(item).height)).toEqual(['26px', '26px'])
  })
})

describe('theme contrast and natural popup sizing', () => {
  it('backs the dark Segmented selected surface with a theme token', () => {
    const wrapper = mount(ZtConfigProvider, {
      attachTo: document.body,
      props: { theme: 'dark' },
      slots: { default: () => h(ZtSegmented, { modelValue: 'day', options: ['day', 'week'] }) },
    })
    wrappers.push(wrapper)
    const rootStyle = getComputedStyle(wrapper.get('.zt-segmented').element)
    expect(rootStyle.getPropertyValue('--zt-segmented-soft').trim()).toBe('#394e6c')
  })

  it('does not place a near-white shine over dark island tabs', async () => {
    const wrapper = mount(ZtConfigProvider, {
      attachTo: document.body,
      props: { theme: 'dark' },
      slots: { default: () => h(ZtTabs, { modelValue: 'a', type: 'island' }, () => [
        h(ZtTabPane, { name: 'a', label: '甲' }),
        h(ZtTabPane, { name: 'b', label: '乙' }),
      ]) },
    })
    wrappers.push(wrapper)
    await nextTick()
    const image = getComputedStyle(wrapper.get('.zt-tabs__tab.is-active').element).backgroundImage
    expect(image).not.toContain('rgba(255, 255, 255, 0.96)')
  })

  it('sizes Popover to short content unless width or height is provided', async () => {
    const natural = mount(ZtPopover, {
      attachTo: document.body,
      props: { visible: true },
      slots: { content: () => '短内容' },
    })
    wrappers.push(natural)
    await nextTick()
    const popup = document.querySelector<HTMLElement>('.zt-popover')!
    expect(getComputedStyle(popup).width).toBe('max-content')
    expect(getComputedStyle(popup).minWidth).toBe('0')

    natural.unmount()
    wrappers.splice(wrappers.indexOf(natural), 1)
    const fixed = mount(ZtPopover, {
      attachTo: document.body,
      props: { visible: true, width: 240, height: 96 },
      slots: { content: () => '固定尺寸' },
    })
    wrappers.push(fixed)
    await nextTick()
    const fixedPopup = document.querySelector<HTMLElement>('.zt-popover')!
    expect(fixedPopup.style.width).toBe('240px')
    expect(fixedPopup.style.height).toBe('96px')
  })
})
