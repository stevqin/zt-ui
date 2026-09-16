import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { compile } from 'sass'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtModal, ZtSelect } from '../src'
import type {
  ZtSelectInstance,
  ZtSelectModelValue,
  ZtSelectOption,
  ZtSelectProps,
  ZtSelectRemoteMethod,
  ZtSelectValue,
} from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const selectSource = () => readFileSync(resolve(process.cwd(), 'src/components/select/ZtSelect.vue'), 'utf8')
const styleSource = () => readFileSync(resolve(process.cwd(), 'src/components/select/select.scss'), 'utf8')
const compiledStyle = () => compile(resolve(process.cwd(), 'src/components/select/select.scss')).css

afterEach(() => {
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('ZtSelect public style contract', () => {
  it('exports the component and every public Select type from the package root', () => {
    const value: ZtSelectValue = 'hangzhou'
    const option: ZtSelectOption = { label: '杭州', value }
    const model: ZtSelectModelValue = option.value
    const remoteMethod: ZtSelectRemoteMethod = async () => [option]
    const props: ZtSelectProps = { modelValue: model, options: [option], remoteMethod }
    const instance: ZtSelectInstance = { focus() {}, blur() {}, open() {}, close() {} }

    expect(ZtSelect.name).toBe('ZtSelect')
    expect(props.options).toEqual([option])
    expect(instance.open).toBeTypeOf('function')
  })

  it.each(['mini', 'small', 'medium', 'large'] as const)('supports %s size', (size) => {
    expect(mount(ZtSelect, { props: { size } }).classes()).toContain(`zt-select--${size}`)
  })

  it('uses the unmodified base class for the default fifth size', () => {
    const classes = mount(ZtSelect, { props: { size: 'default' } }).classes()

    expect(classes).toContain('zt-select')
    expect(classes.some(className => className.startsWith('zt-select--'))).toBe(false)
  })

  it('loads a stylesheet that covers the complete Select visual state contract', () => {
    expect(selectSource()).toContain("import './select.scss'")

    const source = styleSource()
    for (const selector of [
      '.zt-select',
      '&__control',
      '&__tags',
      '&__tag',
      '&__tag-remove',
      '&__clear',
      '.zt-select__dropdown',
      '.zt-select__option',
      '.zt-select__loading',
      '.zt-select__error',
      '.zt-select__empty',
      '.zt-select__footer',
      '.is-upward',
      '.is-downward',
      '.is-active',
      '.is-selected',
      '.is-disabled',
      '.zt-form-item.is-error',
      '.zt-form-item.is-success',
    ]) {
      expect(source, `missing ${selector}`).toContain(selector)
    }
  })

  it('defines concrete five-size heights, responsive behavior and reduced motion', () => {
    const source = styleSource()

    expect(source).toContain('--zt-select-height: 34px')
    for (const [size, height] of [
      ['mini', '26px'],
      ['small', '30px'],
      ['medium', '36px'],
      ['large', '40px'],
    ]) {
      expect(source, `${size} height`).toContain(`&--${size} { --zt-select-height: ${height}`)
    }
    expect(source).toContain('@media (max-width: 640px)')
    expect(source).toContain('@media (prefers-reduced-motion: reduce)')
    expect(source).toContain('transition: none !important')
  })

  it('keeps default tag labels transparent while the built-in remove stays interactive', async () => {
    const wrapper = mount(ZtSelect, {
      props: {
        modelValue: ['hz'],
        multiple: true,
        options: [{ label: '杭州', value: 'hz' }],
      },
    })
    const css = compiledStyle()
    const tagRule = css.match(/\.zt-select__tag\s*\{([^}]*)\}/)?.[1]
    const removeRule = css.match(/\.zt-select__tag-remove\s*\{([^}]*)\}/)?.[1]

    expect(tagRule).toContain('pointer-events: none')
    expect(removeRule).toContain('pointer-events: auto')
    expect(wrapper.get('.zt-select__tag').classes()).not.toContain('is-custom')

    wrapper.get<HTMLButtonElement>('.zt-select__tag-remove').element.click()
    await nextTick()
    expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
    wrapper.unmount()
  })

  it('keeps custom tag controls and the tag row visible during active search', async () => {
    const wrapper = mount(ZtSelect, {
      props: {
        filterable: true,
        modelValue: ['hz'],
        multiple: true,
        options: [{ label: '杭州', value: 'hz' }],
      },
      slots: {
        tag: ({ option, remove }: { option: ZtSelectOption; remove: () => void }) =>
          h('button', { class: 'custom-tag-remove', type: 'button', onClick: remove }, option.label),
      },
    })
    const css = compiledStyle()
    const tagRule = css.match(/\.zt-select__tag\s*\{([^}]*)\}/)?.[1]
    const customContentRule = css.match(/\.zt-select__tag\.is-custom > \*\s*\{([^}]*)\}/)?.[1]

    expect(tagRule).toContain('pointer-events: none')
    expect(customContentRule).toContain('pointer-events: auto')
    expect(wrapper.get('.zt-select__tag').classes()).toContain('is-custom')

    await wrapper.get('input').setValue('杭')
    expect(wrapper.get('.zt-select__tags').attributes('inert')).toBeUndefined()
    expect(getComputedStyle(wrapper.get('.zt-select__tags').element).opacity).not.toBe('0')
    expect(getComputedStyle(wrapper.get('.custom-tag-remove').element).pointerEvents).not.toBe('none')

    wrapper.get<HTMLButtonElement>('.custom-tag-remove').element.click()
    await nextTick()
    expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])

    await wrapper.get('input').setValue('杭')
    expect(wrapper.classes()).toContain('has-keyword')
    expect(wrapper.get('.zt-select__tags').attributes('inert')).toBeUndefined()
    wrapper.unmount()
  })

  it('keeps the teleported dropdown one layer above its containing overlay', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: { autoFocus: false, modelValue: true, zIndex: 6400 },
      slots: {
        default: () => h(ZtSelect, { options: [{ label: '杭州', value: 'hz' }] }),
      },
    })
    await nextTick()

    document.querySelector<HTMLInputElement>('[role="combobox"]')!.click()
    await nextTick()
    await nextTick()
    const overlay = document.querySelector<HTMLElement>('.zt-modal')!
    const selectRoot = document.querySelector<HTMLElement>('.zt-select')!
    const dropdown = document.querySelector<HTMLElement>('.zt-select__dropdown')!
    expect(selectRoot.closest('.zt-modal')).toBe(overlay)
    expect(overlay.style.zIndex).toBe('6400')
    expect(dropdown.style.zIndex).toBe('6401')

    overlay.style.zIndex = '7200'
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(dropdown.style.zIndex).toBe('7201')
    wrapper.unmount()
  })

  it('keeps Form error and success borders authoritative during Select interaction', () => {
    const css = compiledStyle()
    const hoverRule = css.indexOf('.zt-select:hover:not(.is-disabled) .zt-select__control')

    for (const state of ['error', 'success']) {
      const selector = `.zt-form-item.is-${state} .zt-select .zt-select__control`
      const stateRule = css.indexOf(selector)
      expect(stateRule, `${state} selector specificity`).toBeGreaterThanOrEqual(0)
      expect(stateRule, `${state} cascade order`).toBeGreaterThan(hoverRule)
    }
  })
})
