import { mount, flushPromises } from '@vue/test-utils'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import ZtModal from '../src/components/modal/ZtModal.vue'
import ZtLoading from '../src/components/loading/ZtLoading.vue'
import { readFileSync } from 'node:fs'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'
import * as ztUi from '../src'
import { ZtMessage, ZtLoading as ZtAlertLoading } from '@ztechjs/zt-alert'

describe('imperative feedback boundary', () => {
  it.each([false, true])('keeps local Loading layout independent of global feedback CSS (alert loaded last=%s)', alertLast => {
    const alertCss = readFileSync('node_modules/@ztechjs/zt-alert/dist/style.css', 'utf8')
    const localCss = compile('src/components/loading/loading.scss').css
    const style = document.createElement('style')
    style.textContent = (alertLast ? [localCss, alertCss] : [alertCss, localCss]).join('\n')
    document.head.append(style)
    const wrapper = mount(ZtLoading, { attachTo: document.body, slots: { default: '<div>选项列表</div>' } })
    try {
      const surface = getComputedStyle(wrapper.element)
      expect(surface.display).toBe('block')
      expect(surface.width).not.toBe('max-content')
      expect(surface.transform).not.toMatch(/translate|scale/)
      expect(surface.padding).not.toBe('24px 28px')
      const spinner = getComputedStyle(wrapper.find('[aria-hidden="true"]').element)
      expect(spinner.position).not.toBe('absolute')
      expect(spinner.borderRightColor).toBe('transparent')
    } finally {
      wrapper.unmount()
      style.remove()
    }
  })

  it('keeps imperative services in zt-alert and only exposes declarative loading', () => {
    expect(typeof ZtMessage.success).toBe('function')
    expect(typeof ZtAlertLoading.open).toBe('function')
    expect('ZtMessage' in ztUi).toBe(false)
    expect('ZtNotification' in ztUi).toBe(false)
    expect('ZtMessageBox' in ztUi).toBe(false)
    expect('ZtLoadingService' in ztUi).toBe(false)
    expect('useZtLoading' in ztUi).toBe(false)
    expect(ztUi.ZtLoading.name).toBe('ZtLoading')
    expect(ztUi.ZtDrawer).toBe(ZtDrawer)
    expect(ztUi.ZtModal).toBe(ZtModal)
  })
})


it('keeps SelectBox open for review after batch validation and commits separately', async () => {
  const wrapper = mount(ZtSelectBox, { attachTo: document.body, props: { options: [{ value: 'east', label: '华东' }] } })
  try {
    await wrapper.find('[role="combobox"]').trigger('click')
    const panel = wrapper.findComponent(SelectBoxPanel)
    await panel.find('.zt-select-box-panel__mode').trigger('click')
    await panel.find('textarea').setValue('华东')
    await panel.find('.zt-select-box-panel__confirm').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(document.querySelector('.zt-select-box__popup')).not.toBeNull()
    expect(document.querySelector('.zt-select-box-panel__pager')).toBeNull()
    await panel.find('.zt-select-box-panel__confirm').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['east']]])
    expect(document.querySelector('.zt-select-box__popup')).toBeNull()
  } finally {
    wrapper.unmount()
    ZtMessage.clear()
    document.body.innerHTML = ''
  }
})
