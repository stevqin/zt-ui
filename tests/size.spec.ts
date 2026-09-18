import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtBadge, ZtForm, ZtInput, ZtInputNumber, ZtModal, ZtPagination, ZtPassword, ZtSelect, ZtSteps, ZtSwitch } from '../src'
import type { ZtComponentSize } from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('shared component sizes', () => {
  it('exports one five-level size contract', () => {
    const sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']
    expect(sizes).toHaveLength(5)
  })

  it.each(['mini', 'small', 'medium', 'large'] as const)('applies the %s size to Badge, Steps, Switch and Pagination', (size) => {
    const badge = mount(ZtBadge, { props: { value: 8, size } })
    const steps = mount(ZtSteps, { props: { size } })
    const toggle = mount(ZtSwitch, { props: { modelValue: true, size } })
    const pagination = mount(ZtPagination, { props: { total: 30, size, layout: 'pager' } })

    expect(badge.get('.zt-badge__content').classes()).toContain(`zt-badge--${size}`)
    expect(steps.classes()).toContain(`zt-steps--${size}`)
    expect(toggle.classes()).toContain(`zt-switch--${size}`)
    expect(pagination.classes()).toContain(`zt-pagination--${size}`)
  })

  it('uses the shared size contract without a Pagination boolean density override', () => {
    const pagination = mount(ZtPagination, { props: { total: 30, size: 'medium', layout: 'pager' } })

    expect(pagination.classes()).toContain('zt-pagination--medium')
  })

  it('applies Modal size to its layout and built-in controls', () => {
    mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, size: 'mini', showFooter: true, showFullscreenButton: true },
    })

    expect(document.querySelector('.zt-modal')?.classList.contains('zt-modal--mini')).toBe(true)
    expect(document.querySelector('.zt-modal__close')?.classList.contains('zt-button--mini')).toBe(true)
    expect(document.querySelector('.zt-modal__confirm')?.classList.contains('zt-button--mini')).toBe(true)
  })

  it.each(['mini', 'small', 'medium', 'large'] as const)('applies the %s size to every input component', (size) => {
    expect(mount(ZtInput, { props: { size } }).classes()).toContain(`zt-input--${size}`)
    expect(mount(ZtPassword, { props: { size } }).classes()).toContain(`zt-password--${size}`)
    expect(mount(ZtInputNumber, { props: { size } }).classes()).toContain(`zt-input-number--${size}`)
    expect(mount(ZtSelect, { props: { size } }).classes()).toContain(`zt-select--${size}`)
  })

  it.each(['mini', 'small', 'medium', 'large'] as const)('applies the %s size to Form', (size) => {
    expect(mount(ZtForm, { props: { size } }).classes()).toContain(`zt-form--${size}`)
  })

  it('defines concrete mini and medium styles for every newly completed component', () => {
    for (const [component, file] of [
      ['badge', 'badge/badge.scss'],
      ['steps', 'steps/steps.scss'],
      ['switch', 'switch/switch.scss'],
      ['pagination', 'pagination/pagination.scss'],
      ['modal', 'modal/modal.scss'],
      ['vtable-grid', 'vtable-grid/vtable-grid.scss'],
      ['select', 'select/select.scss'],
    ]) {
      const source = readFileSync(resolve(process.cwd(), `src/components/${file}`), 'utf8')
      expect(source, `${component} mini styles`).toContain('&--mini')
      expect(source, `${component} medium styles`).toContain('&--medium')
    }

    const selectComponent = readFileSync(resolve(process.cwd(), 'src/components/select/ZtSelect.vue'), 'utf8')
    expect(selectComponent).toContain('`zt-select--${effectiveSize.value}`')
  })
})
