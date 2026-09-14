import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'
import { useOverlay } from '../src/components/overlay/useOverlay'

const Harness = defineComponent({
  props: {
    modelValue: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true },
    escClosable: { type: Boolean, default: true },
    lockScroll: { type: Boolean, default: true },
    autoFocus: { type: Boolean, default: true },
    focusTrap: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: false },
    zIndex: { type: Number, default: 1000 },
    beforeClose: Function,
  },
  emits: ['update:modelValue', 'open', 'opened', 'close', 'closed', 'cancel', 'confirm', 'close-error'],
  setup(props, { emit, expose }) {
    const model = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })
    const overlay = useOverlay({ modelValue: model, props, emit })
    expose(overlay)
    return () => overlay.alive.value
      ? h('div', {
          class: 'mask',
          onMousedown: overlay.maskDown,
          onClick: overlay.maskClick,
        }, [
          h('section', { ref: overlay.panel, tabindex: -1 }, [
            h('button', { class: 'first' }, 'First'),
            h('button', { class: 'last' }, 'Last'),
          ]),
        ])
      : null
  },
})

afterEach(() => {
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('useOverlay', () => {
  it('activates, locks scrolling, moves focus in, and restores focus on release', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const wrapper = mount(Harness, { attachTo: document.body })

    await nextTick()
    expect(wrapper.emitted('open')).toHaveLength(1)
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(wrapper.find('.first').element)

    await (wrapper.vm as any).requestClose('api')
    await wrapper.setProps({ modelValue: false })
    ;(wrapper.vm as any).afterLeave()
    await nextTick()
    expect(document.activeElement).toBe(opener)
    expect(document.body.style.overflow).toBe('')
  })

  it('respects synchronous and asynchronous beforeClose gates', async () => {
    let resolveGate!: (value: boolean) => void
    const gate = vi.fn(() => new Promise<boolean>(resolve => { resolveGate = resolve }))
    const wrapper = mount(Harness, { props: { beforeClose: gate } })

    const first = (wrapper.vm as any).requestClose('close')
    const duplicate = await (wrapper.vm as any).requestClose('mask')
    expect(duplicate).toBe(false)
    expect(gate).toHaveBeenCalledTimes(1)

    resolveGate(false)
    expect(await first).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('lets only the top overlay handle Escape', async () => {
    const first = mount(Harness)
    const second = mount(Harness)
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(first.emitted('update:modelValue')).toBeUndefined()
    expect(second.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('closes from a true mask click but not a drag starting in the panel', async () => {
    const wrapper = mount(Harness)
    await wrapper.find('section').trigger('mousedown')
    await wrapper.find('.mask').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('.mask').trigger('mousedown')
    await wrapper.find('.mask').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('wraps focus while trapping Tab', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await nextTick()
    const first = wrapper.find('.first').element as HTMLElement
    const last = wrapper.find('.last').element as HTMLElement
    last.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(first)
  })

  it('reclaims focus after the enter transition completes', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    const wrapper = mount(Harness, {
      attachTo: document.body,
      props: { modelValue: false, focusTrap: false },
    })
    opener.focus()
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    opener.focus()

    ;(wrapper.vm as any).afterEnter()
    expect(document.activeElement).toBe(wrapper.find('.first').element)
  })
})
