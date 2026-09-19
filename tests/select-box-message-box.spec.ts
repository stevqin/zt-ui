import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import { ZtMessageBox } from '@ztechjs/zt-alert'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'

const wrappers: VueWrapper[] = []

afterEach(() => {
  ZtMessageBox.close()
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  vi.useRealTimers()
  document.body.innerHTML = ''
})

it('keeps the SelectBox open until unmatched entries are acknowledged', async () => {
  const wrapper = mount(ZtSelectBox, {
    attachTo: document.body,
    props: {
      options: [
        { value: 'east', label: '华东' },
        { value: 'south', label: '华南' },
      ],
    },
  })
  wrappers.push(wrapper)

  await wrapper.get('[role="combobox"]').trigger('click')
  const panel = wrapper.findComponent(SelectBoxPanel)
  await panel.find('.zt-select-box-panel__mode').trigger('click')
  await panel.find('textarea').setValue('华东\n不存在')
  await panel.find('.zt-select-box-panel__confirm').trigger('click')
  await flushPromises()

  expect(document.querySelector('.zt-box')?.textContent).toContain('不存在')
  expect(document.querySelector('.zt-select-box__popup')).not.toBeNull()

  vi.useFakeTimers()
  document.querySelector<HTMLButtonElement>('.zt-box__button--primary')!.click()
  await vi.runAllTimersAsync()
  await flushPromises()

  expect(document.querySelector('.zt-box')).toBeNull()
  expect(document.querySelector('.zt-select-box__popup')).not.toBeNull()
  expect(document.querySelectorAll('.zt-select-box-panel__option')).toHaveLength(1)
  expect(document.querySelector('.zt-select-box-panel__option')?.textContent).toBe('华东')
  expect(document.querySelector('.zt-select-box-panel__pager')).toBeNull()
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})
