import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { h, ref, type Ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZtMessage } from '@ztechjs/zt-alert'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import type { ZtSelectBoxProps, ZtSelectBoxRemoteResult, ZtSelectValue } from '../src/components/select-box/types'

vi.mock('@ztechjs/zt-alert', () => ({ ZtMessage: { success: vi.fn(), warning: vi.fn(), info: vi.fn(), error: vi.fn() } }))
const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Gamma' }]
const wrappers: VueWrapper[] = []
const changes = [
  { name: 'replacement', change: (model: Ref<ZtSelectValue[]>) => { model.value = [] }, expected: [] },
  { name: 'splice', change: (model: Ref<ZtSelectValue[]>) => { model.value.splice(0) }, expected: [] },
  { name: 'push', change: (model: Ref<ZtSelectValue[]>) => { model.value.push('c') }, expected: ['a', 'c'] },
  { name: 'index assignment', change: (model: Ref<ZtSelectValue[]>) => { model.value[0] = 'c' }, expected: ['c'] },
]
function host(props: ZtSelectBoxProps = {}) {
  const model = ref<ZtSelectValue[]>(['a'])
  const wrapper = mount({ setup: () => () => h(ZtSelectBox, {
    options, ...props, modelValue: model.value, 'onUpdate:modelValue': value => { model.value = value },
  }) }, { attachTo: document.body })
  wrappers.push(wrapper)
  return { box: wrapper.findComponent(ZtSelectBox), model }
}
async function click(selector: string) { document.querySelector<HTMLElement>(selector)!.click(); await flushPromises() }
async function open(box: VueWrapper) { await box.get('.zt-select-box__trigger').trigger('click'); await flushPromises() }
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = ''; vi.clearAllMocks() })

describe('SelectBox external model authority', () => {
  it.each(changes)('rebuilds an open draft after external $name and confirms only the new values', async ({ change, expected }) => {
    const { box, model } = host()
    await open(box)
    await click('.zt-select-box-panel__option:nth-child(2)')
    change(model)
    await flushPromises()
    expect(document.querySelector('.zt-select-box-panel__selection strong')?.textContent).toBe(String(expected.length))
    expect([...document.querySelectorAll('.zt-select-box-panel__option[aria-checked="true"]')].map(row => row.getAttribute('aria-label')))
      .toEqual(options.filter(option => expected.includes(option.value)).map(option => option.label))
    expect(box.emitted('update:modelValue')).toBeUndefined()
    await click('.zt-select-box-panel__confirm')
    expect(model.value).toEqual(expected)
    expect(box.emitted('update:modelValue')).toEqual([[expected]])
    expect(document.querySelector('.zt-select-box__popup')).toBeNull()
  })

  it.each(changes.flatMap(change => [false, true].map(reject => ({ ...change, reject }))))(
    'invalidates a pending batch after $name (reject=$reject) without invalidating search', async ({ change, expected, reject }) => {
      let resolveBatch!: (value: ZtSelectBoxRemoteResult) => void
      let rejectBatch!: (reason: unknown) => void
      let resolveSearch!: (value: ZtSelectBoxRemoteResult) => void
      const pendingBatch = new Promise<ZtSelectBoxRemoteResult>((resolve, reject) => { resolveBatch = resolve; rejectBatch = reject })
      const pendingSearch = new Promise<ZtSelectBoxRemoteResult>(resolve => { resolveSearch = resolve })
      const remoteMethod = vi.fn(request => request.mode === 'batch' ? pendingBatch : pendingSearch)
      const { box, model } = host({ remote: true, remoteMethod })
      await open(box)
      await click('.zt-select-box-panel__mode')
      await box.findComponent(SelectBoxPanel).get('textarea').setValue('Beta')
      await click('.zt-select-box-panel__confirm')
      expect(document.querySelector<HTMLButtonElement>('.zt-select-box-panel__confirm')!.disabled).toBe(true)
      change(model)
      // Resolve in the same turn as the parent write, before Vue flushes props.
      if (reject) rejectBatch(new Error('obsolete batch'))
      else resolveBatch({ mode: 'batch', matches: [{ keyword: 'Beta', option: options[1]! }] })
      resolveSearch({ mode: 'search', options, total: options.length })
      await flushPromises()
      expect(model.value).toEqual(expected)
      expect(box.emitted('update:modelValue')).toBeUndefined()
      expect(box.emitted('remote-error')).toBeUndefined()
      for (const method of [ZtMessage.success, ZtMessage.warning, ZtMessage.info, ZtMessage.error]) expect(method).not.toHaveBeenCalled()
      expect(document.querySelector('.zt-select-box__popup')).not.toBeNull()
      expect(document.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe('Beta')
      expect(document.querySelector<HTMLButtonElement>('.zt-select-box-panel__confirm')!.disabled).toBe(false)
      await click('.zt-select-box-panel__mode')
      expect(document.querySelectorAll('.zt-select-box-panel__option')).toHaveLength(3)
      expect(document.querySelector('.zt-select-box-panel__selection strong')?.textContent).toBe(String(expected.length))
      expect(remoteMethod).toHaveBeenCalledTimes(2)
    },
  )

  it('clears a remote page after page one with one request and preserves clear events/focus', async () => {
    const remoteMethod = vi.fn().mockResolvedValue({ mode: 'search', options, total: 100 })
    const { box, model } = host({ remote: true, remoteMethod, clearable: true })
    await open(box)
    await click('[aria-label="下一页"]')
    remoteMethod.mockClear()
    box.vm.clear()
    await flushPromises()
    expect(remoteMethod.mock.calls.map(call => call[0])).toEqual([{ mode: 'search', keyword: '', page: 1, pageSize: 10 }])
    expect(model.value).toEqual([])
    expect(box.emitted('update:modelValue')).toEqual([[[]]])
    expect(box.emitted('change')).toEqual([[[]]])
    expect(box.emitted('clear')).toEqual([[]])
    expect(box.emitted('visible-change')).toEqual([[true]])
    expect(document.activeElement).toBe(box.get('.zt-select-box__trigger').element)
  })
})
