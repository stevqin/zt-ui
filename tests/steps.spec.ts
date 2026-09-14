import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { ZtStep, ZtSteps } from '../src'
import type { ZtStepStatus, ZtStepsDirection } from '../src'

function mountSteps(props: Record<string, unknown> = {}) {
  return mount(ZtSteps, {
    props: { active: 1, ...props },
    slots: {
      default: () => [
        h(ZtStep, { title: '提交申请', description: '填写申请资料' }),
        h(ZtStep, { title: '主管审批', description: '等待主管确认' }),
        h(ZtStep, { title: '流程完成', description: '查看审批结果' }),
      ],
    },
  })
}

describe('ZtSteps', () => {
  it('derives finish, process and wait states from the active step', () => {
    const wrapper = mountSteps()
    const steps = wrapper.findAll('[role="listitem"]')

    expect(steps).toHaveLength(3)
    expect(steps[0].classes()).toContain('is-finish')
    expect(steps[1].classes()).toContain('is-process')
    expect(steps[1].attributes('aria-current')).toBe('step')
    expect(steps[2].classes()).toContain('is-wait')
    expect(wrapper.findAll('.zt-step__number').map(item => item.text())).toEqual(['1', '2', '3'])
  })

  it('supports custom process and finish states plus a step status override', () => {
    const wrapper = mount(ZtSteps, {
      props: { active: 1, finishStatus: 'success', processStatus: 'error' },
      slots: {
        default: () => [
          h(ZtStep, { title: '已完成' }),
          h(ZtStep, { title: '处理失败' }),
          h(ZtStep, { title: '手动完成', status: 'success' }),
        ],
      },
    })

    const steps = wrapper.findAll('.zt-step')
    expect(steps[0].classes()).toContain('is-success')
    expect(steps[1].classes()).toContain('is-error')
    expect(steps[2].classes()).toContain('is-success')
    expect(wrapper.findAll('.zt-step__status-icon')).toHaveLength(3)
  })

  it('supports centered, vertical, fixed-space and simple layouts', () => {
    const centered = mountSteps({ alignCenter: true, space: 180 })
    expect(centered.classes()).toContain('is-align-center')
    expect(centered.find('.zt-step').attributes('style')).toContain('flex-shrink: 0')
    expect(centered.find('.zt-step').attributes('style')).toContain('flex-basis: 180px')

    const vertical = mountSteps({ direction: 'vertical' })
    expect(vertical.classes()).toContain('zt-steps--vertical')

    const simple = mountSteps({ simple: true, direction: 'vertical', alignCenter: true, space: 180 })
    expect(simple.classes()).toContain('zt-steps--simple')
    expect(simple.classes()).toContain('zt-steps--horizontal')
    expect(simple.classes()).not.toContain('is-align-center')
    expect(simple.find('.zt-step').attributes('style')).toBeUndefined()
    expect(simple.find('.zt-step__description').exists()).toBe(false)
    expect(simple.findAll('.zt-step__arrow')).toHaveLength(3)
  })

  it('renders icon, title and description slots', () => {
    const CustomIcon = defineComponent({ render: () => h('span', { class: 'custom-icon' }, 'A') })
    const wrapper = mount(ZtSteps, {
      slots: {
        default: () => h(ZtStep, null, {
          icon: () => h(CustomIcon),
          title: () => h('strong', '自定义标题'),
          description: () => h('em', '自定义描述'),
        }),
      },
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.zt-step__title strong').text()).toBe('自定义标题')
    expect(wrapper.find('.zt-step__description em').text()).toBe('自定义描述')
  })

  it('accepts string icons through the public component API', () => {
    const status: ZtStepStatus = 'process'
    const direction: ZtStepsDirection = 'horizontal'
    const wrapper = mount(ZtSteps, {
      props: { direction },
      slots: { default: () => h(ZtStep, { title: '图标步骤', icon: 'i', status }) },
    })

    expect(wrapper.find('.zt-step__icon > i').exists()).toBe(true)
  })

  it('keeps aria-current on the active step when status is overridden', () => {
    const wrapper = mount(ZtSteps, {
      props: { active: 1 },
      slots: {
        default: () => [
          h(ZtStep, { title: '步骤一' }),
          h(ZtStep, { title: '步骤二', status: 'error' }),
        ],
      },
    })

    expect(wrapper.findAll('.zt-step')[1].attributes('aria-current')).toBe('step')
  })

  it('recomputes indexes after keyed steps are inserted or reordered', async () => {
    const items = ref([
      { id: 'one', title: '步骤一' },
      { id: 'three', title: '步骤三' },
    ])
    const Host = defineComponent({
      setup: () => () => h(ZtSteps, { active: 1 }, {
        default: () => items.value.map(item => h(ZtStep, { key: item.id, title: item.title })),
      }),
    })
    const wrapper = mount(Host)

    items.value.splice(1, 0, { id: 'two', title: '步骤二' })
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.zt-step__title').map(item => item.text())).toEqual(['步骤一', '步骤二', '步骤三'])
    expect(wrapper.findAll('.zt-step__number').map(item => item.text())).toEqual(['1', '2', '3'])
    expect(wrapper.find('[aria-current="step"] .zt-step__title').text()).toBe('步骤二')

    items.value = [items.value[2], items.value[0], items.value[1]]
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.zt-step__title').map(item => item.text())).toEqual(['步骤三', '步骤一', '步骤二'])
    expect(wrapper.findAll('.zt-step__number').map(item => item.text())).toEqual(['1', '2', '3'])
    expect(wrapper.find('[aria-current="step"] .zt-step__title').text()).toBe('步骤一')
  })

  it('emits change with the new and previous active indexes', async () => {
    const wrapper = mountSteps()
    await wrapper.setProps({ active: 2 })
    expect(wrapper.emitted('change')).toEqual([[2, 1]])
  })
})
