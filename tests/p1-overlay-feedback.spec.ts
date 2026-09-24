import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZtBreadcrumb, ZtBreadcrumbItem } from '../src/components/breadcrumb'
import { ZtForm, ZtFormItem } from '../src/components/form'
import { ZtModal } from '../src/components/modal'
import { ZtPopconfirm } from '../src/components/popconfirm'
import { ZtSwitch } from '../src/components/switch'
import { ZtTooltip } from '../src/components/tooltip'

describe('P1 overlay and feedback', () => {
  it('Modal refuses close while confirmLoading', async () => {
    const Host = defineComponent({
      components: { ZtModal },
      setup() {
        const visible = ref(true)
        const confirmLoading = ref(true)
        return { visible, confirmLoading }
      },
      template: `<ZtModal v-model="visible" :confirm-loading="confirmLoading" show-footer>body</ZtModal>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const modal = wrapper.findComponent(ZtModal)
    ;(modal.vm as any).close('escape')
    await nextTick()
    expect((wrapper.vm as any).visible).toBe(true)
    ;(wrapper.vm as any).confirmLoading = false
    await nextTick()
    ;(modal.vm as any).close('escape')
    await nextTick()
    expect((wrapper.vm as any).visible).toBe(false)
    wrapper.unmount()
  })

  it('Popconfirm blocks confirm while external confirmLoading', async () => {
    const onConfirm = vi.fn()
    const Host = defineComponent({
      components: { ZtPopconfirm },
      setup() {
        const visible = ref(true)
        const confirmLoading = ref(true)
        return { visible, confirmLoading, onConfirm }
      },
      template: `<ZtPopconfirm v-model:visible="visible" title="t" :confirm-loading="confirmLoading" @confirm="onConfirm"><button id="trig">x</button></ZtPopconfirm>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    await nextTick()
    const confirmBtn = document.querySelector(
      '.zt-popconfirm__actions .is-confirm',
    ) as HTMLButtonElement | null
    expect(confirmBtn?.disabled).toBe(true)
    confirmBtn?.click()
    expect(onConfirm).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('Tooltip Escape closes when document keydown fires', async () => {
    const Host = defineComponent({
      components: { ZtTooltip },
      setup() {
        const visible = ref(true)
        return { visible }
      },
      template: `<ZtTooltip v-model:visible="visible"><button>trig</button><template #content><button class="inner">in</button></template></ZtTooltip>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect((wrapper.vm as any).visible).toBe(true)
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    expect((wrapper.vm as any).visible).toBe(false)
    wrapper.unmount()
  })

  it('Breadcrumb keeps only the last live item as current', async () => {
    const Host = defineComponent({
      components: { ZtBreadcrumb, ZtBreadcrumbItem },
      setup() {
        const items = ref(['a', 'b', 'c'])
        return { items }
      },
      template: `<ZtBreadcrumb><ZtBreadcrumbItem v-for="i in items" :key="i" :href="'#'+i">{{ i }}</ZtBreadcrumbItem></ZtBreadcrumb>`,
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll('.zt-breadcrumb__current')).toHaveLength(1)
    expect(wrapper.findAll('.zt-breadcrumb__current')[0]?.text()).toBe('c')
    ;(wrapper.vm as any).items = ['a', 'b']
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.zt-breadcrumb__current')).toHaveLength(1)
    expect(wrapper.findAll('.zt-breadcrumb__current')[0]?.text()).toBe('b')
  })

  it('Switch validates blur on focusout', async () => {
    const validator = vi.fn(() => true)
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtSwitch },
      setup() {
        const model = ref({ f: false })
        const rules = { f: [{ validator, trigger: 'blur' as const }] }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="f"><ZtSwitch v-model="model.f" /></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    await wrapper.find('.zt-switch').trigger('focusout')
    await nextTick()
    expect(validator).toHaveBeenCalled()
  })
})
