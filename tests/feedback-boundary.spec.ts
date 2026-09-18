import { mount, flushPromises } from '@vue/test-utils'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import { describe, expect, it } from 'vitest'
import * as ztUi from '../src'
import { ZtMessage, ZtLoading as ZtAlertLoading } from '@ztechjs/zt-alert'

describe('imperative feedback boundary', () => {
  it('keeps imperative services in zt-alert and only exposes declarative loading', () => {
    expect(typeof ZtMessage.success).toBe('function')
    expect(typeof ZtAlertLoading.open).toBe('function')
    expect('ZtMessage' in ztUi).toBe(false)
    expect('ZtNotification' in ztUi).toBe(false)
    expect('ZtMessageBox' in ztUi).toBe(false)
    expect('ZtLoadingService' in ztUi).toBe(false)
    expect('useZtLoading' in ztUi).toBe(false)
    expect(ztUi.ZtLoading.name).toBe('ZtLoading')
  })
})


it('shows SelectBox feedback through zt-alert after its popup closes', async () => {
  const wrapper = mount(ZtSelectBox, { attachTo: document.body, props: { options: [{ value: 'east', label: '华东' }] } })
  try {
    await wrapper.find('[role="combobox"]').trigger('click')
    const panel = wrapper.findComponent(SelectBoxPanel)
    await panel.find('.zt-select-box-panel__mode').trigger('click')
    await panel.find('textarea').setValue('华东')
    await panel.find('.zt-select-box-panel__confirm').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[['east']]])
    expect(document.querySelector('.zt-select-box__popup')).toBeNull()
    expect(document.body.textContent).toContain('批量粘贴 1 项，匹配 1 项，已自动勾选 1 项')
  } finally {
    wrapper.unmount()
    // The test DOM does not load zt-alert CSS; close notices without an exit animation.
    document.querySelectorAll<HTMLElement>('.zt-notice').forEach(element => { element.style.transitionDuration = '0s' })
    ZtMessage.clear()
    document.body.innerHTML = ''
  }
})
