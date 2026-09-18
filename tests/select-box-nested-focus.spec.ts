import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import ZtModal from '../src/components/modal/ZtModal.vue'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const wrappers: VueWrapper[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); resetOverlayManager(); document.body.innerHTML = '' })
async function click(selector: string) { document.querySelector<HTMLElement>(selector)!.click(); await flushPromises() }
async function tab(shiftKey = false) {
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true }))
  await flushPromises()
}

describe('nested popup focus ranges', () => {
  it.each(['sizes', 'separator'].flatMap(kind => ['trigger', 'popup'].flatMap(source =>
    [false, true].map(reverse => ({ kind, source, reverse }))),
  ))('returns from nested $kind/$source (reverse=$reverse) through its SelectBox before Modal', async ({ kind, source, reverse }) => {
    const modal = mount(ZtModal, {
      attachTo: document.body, props: { modelValue: true, showHeader: false },
      slots: { default: () => [h('button', { class: 'before' }, 'Before'), h(ZtSelectBox, {
        options: [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }],
      }), h('button', { class: 'after' }, 'After')] },
    })
    wrappers.push(modal)
    await flushPromises()
    const box = modal.findComponent(ZtSelectBox)
    await box.get('.zt-select-box__trigger').trigger('click')
    await click('.zt-select-box-panel__option')
    if (kind === 'separator') await click('.zt-select-box-panel__mode')
    const input = document.querySelector<HTMLInputElement>(kind === 'separator' ? '.zt-select-box-panel__separator input' : '.zt-pagination__sizes input')!
    input.focus(); input.click(); await flushPromises()
    expect(document.querySelector('.zt-select__dropdown')).not.toBeNull()
    if (source === 'popup') {
      const nested = document.querySelector<HTMLElement>('.zt-select__dropdown')!
      nested.tabIndex = -1; nested.focus(); await flushPromises()
    }
    await tab(reverse)
    expect(document.querySelector('.zt-select-box__popup')).not.toBeNull()
    expect(document.querySelector('.zt-select__dropdown')).toBeNull()
    if (!reverse) expect(document.activeElement?.classList.contains('zt-select-box-panel__mode')).toBe(true)
    else if (kind === 'separator') expect(document.activeElement?.tagName).toBe('TEXTAREA')
    else expect(document.activeElement?.getAttribute('aria-current')).toBe('page')
    expect(box.emitted('update:modelValue')).toBeUndefined()
    if (kind === 'separator') await click('.zt-select-box-panel__mode')
    expect(document.querySelector('.zt-select-box-panel__option')?.getAttribute('aria-checked')).toBe('true')
    document.querySelector<HTMLElement>(reverse ? 'input[aria-label="搜索选项"]' : '.zt-select-box-panel__confirm')!.focus()
    await tab(reverse)
    expect(document.activeElement?.classList.contains(reverse ? 'before' : 'after')).toBe(true)
    expect(document.querySelector('.zt-select-box__popup')).toBeNull()
    expect(box.emitted('update:modelValue')).toBeUndefined()
    expect(modal.emitted('update:modelValue')).toBeUndefined()
  })
})
