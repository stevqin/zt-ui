import { mount } from '@vue/test-utils'
import {
  Teleport,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
} from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  overlayContextKey,
  type OverlayBranch,
  type OverlayContext,
} from '../src/components/overlay/context'
import { useAnchoredDropdown, type UseAnchoredDropdownOptions } from '../src/components/selection/useAnchoredDropdown'

function rectangle(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    top,
    right: left + width,
    bottom: top + height,
    left,
    width,
    height,
    toJSON: () => ({}),
  }
}

function createHarness(order: string[], configuration: Partial<UseAnchoredDropdownOptions> = {}) {
  return defineComponent({
    setup(_, { expose }) {
      const visible = ref(false)
      const trigger = ref<HTMLElement>()
      const popup = ref<HTMLElement>()
      const childTrigger = ref<HTMLElement>()
      const childPopup = ref<HTMLElement>()
      const childVisible = ref(true)
      const close = () => {
        order.push('parent')
        visible.value = false
      }
      const focus = () => trigger.value?.focus()
      const dropdown = useAnchoredDropdown({
        visible,
        trigger,
        popup,
        minWidth: ref(200),
        ...configuration,
        close,
        focus,
      })
      provide(overlayContextKey, dropdown.overlayContext)
      const child: OverlayBranch = {
        trigger: childTrigger,
        popup: childPopup,
        visible: childVisible,
        close: () => {
          order.push('child')
          childVisible.value = false
        },
        focus: () => childTrigger.value?.focus(),
      }
      const unregisterChild = dropdown.overlayContext.registerBranch(child)
      onBeforeUnmount(unregisterChild)
      expose({
        dropdown,
        visible,
        childVisible,
        setVisible: (next: boolean) => { visible.value = next },
        setChildVisible: (next: boolean) => { childVisible.value = next },
      })

      return () => h('div', [
        h('button', {
          ref: trigger,
          class: 'trigger',
          onClick: () => { visible.value = true },
        }, 'Open'),
        visible.value
          ? h(Teleport, { to: 'body' }, h('section', {
              ref: popup,
              class: 'popup',
              style: dropdown.popupStyle.value,
              'data-placement': dropdown.placement.value,
            }, [
              h('button', { ref: childTrigger, class: 'child-trigger' }, 'Child'),
              h('div', { class: 'blank' }, 'Blank'),
            ]))
          : null,
        visible.value
          ? h(Teleport, { to: 'body' }, h('div', {
              ref: childPopup,
              class: 'child-popup',
            }, 'Nested popup'))
          : null,
      ])
    },
  })
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useAnchoredDropdown', () => {
  it('can reserve a custom gutter, measure natural content, and preserve trigger width and alignment', async () => {
    vi.stubGlobal('innerWidth', 400)
    vi.stubGlobal('innerHeight', 300)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('trigger')
          ? rectangle(2, 140, 430, 34)
          : rectangle(0, 0, 430, 20)
      })
    const wrapper = mount(createHarness([], {
      viewportGutter: 14,
      constrainWidth: false,
      getPopupHeight: () => 330,
    }), { attachTo: document.body })
    try {
      await wrapper.get('.trigger').trigger('click')
      const popup = document.querySelector<HTMLElement>('.popup')!
      expect(popup.style.top).toBe('14px')
      expect(popup.style.maxHeight).toBe('126px')
      expect(popup.dataset.placement).toBe('top')
      expect(popup.style.width).toBe('430px')
      expect(popup.style.left).toBe('2px')
    } finally {
      wrapper.unmount()
    }
  })

  it('can leave focus restoration to the consuming control', async () => {
    const wrapper = mount(createHarness([], { restoreFocus: false }), { attachTo: document.body })
    try {
      await wrapper.get('.trigger').trigger('click')
      document.querySelector<HTMLElement>('.child-trigger')!.focus()
      document.body.click()
      await nextTick()
      expect(document.querySelector('.popup')).toBeNull()
      expect(document.activeElement).toBe(document.body)
    } finally {
      wrapper.unmount()
    }
  })

  it('inherits and propagates the parent overlay layer for teleported popup descendants', async () => {
    const parentLayer = ref(3000)
    const parentOverlay: OverlayContext = {
      layer: parentLayer,
      interactive: ref(true),
      registerBranch: () => () => undefined,
    }
    const wrapper = mount(createHarness([]), {
      attachTo: document.body,
      global: { provide: { [overlayContextKey as symbol]: parentOverlay } },
    })
    await wrapper.get('.trigger').trigger('click')
    expect(document.querySelector<HTMLElement>('.popup')!.style.zIndex).toBe('3001')
    expect((wrapper.vm as any).dropdown.overlayContext.layer.value).toBe(3001)
    parentLayer.value = 4000
    await nextTick()
    expect(document.querySelector<HTMLElement>('.popup')!.style.zIndex).toBe('4001')
    expect((wrapper.vm as any).dropdown.overlayContext.layer.value).toBe(4001)
    wrapper.unmount()
  })

  it('positions within the viewport and reacts to scroll, resize, and observed size changes', async () => {
    vi.stubGlobal('innerWidth', 400)
    vi.stubGlobal('innerHeight', 600)
    let triggerRect = rectangle(2, 100, 120, 40)
    let popupRect = rectangle(0, 0, 200, 180)
    let notifyResize: (() => void) | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this as unknown as ResizeObserver)
      }

      observe = observe
      unobserve = vi.fn()
      disconnect = disconnect
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('trigger')) return triggerRect
        if (this.classList.contains('popup')) return popupRect
        return rectangle(0, 0, 0, 0)
      })
    const wrapper = mount(createHarness([]), { attachTo: document.body })

    await wrapper.get('.trigger').trigger('click')
    await nextTick()
    const popup = document.querySelector<HTMLElement>('.popup')!
    expect(popup.style.position).toBe('fixed')
    expect(popup.style.top).toBe('140px')
    expect(popup.style.left).toBe('8px')
    expect(popup.style.width).toBe('200px')
    expect(popup.style.maxHeight).toBe('452px')
    expect(popup.dataset.placement).toBe('bottom')
    expect(observe).toHaveBeenCalledWith(wrapper.get('.trigger').element)
    expect(observe).toHaveBeenCalledWith(popup)

    triggerRect = rectangle(350, 500, 120, 40)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(popup.style.top).toBe('320px')
    expect(popup.style.left).toBe('192px')
    expect(popup.style.maxHeight).toBe('492px')
    expect(popup.dataset.placement).toBe('top')

    triggerRect = rectangle(80, 200, 120, 40)
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(popup.style.top).toBe('240px')
    expect(popup.dataset.placement).toBe('bottom')

    popupRect = rectangle(0, 0, 200, 370)
    triggerRect = rectangle(80, 300, 120, 40)
    notifyResize!()
    await nextTick()
    expect(popup.style.top).toBe('8px')
    expect(popup.dataset.placement).toBe('top')

    popupRect = rectangle(0, 0, 200, 180)
    triggerRect = rectangle(80, 1000, 120, 40)
    notifyResize!()
    await nextTick()
    expect(popup.style.top).toBe('412px')
    expect(popup.style.maxHeight).toBe('584px')
    expect(popup.dataset.placement).toBe('top')

    triggerRect = rectangle(80, -100, 120, 40)
    notifyResize!()
    await nextTick()
    expect(popup.style.top).toBe('8px')
    expect(popup.style.maxHeight).toBe('584px')
    expect(popup.dataset.placement).toBe('bottom')

    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('retains inside and nested clicks, then closes children and restores focus on an outside click', async () => {
    vi.stubGlobal('ResizeObserver', class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('trigger')
          ? rectangle(40, 100, 160, 40)
          : rectangle(40, 140, 200, 120)
      })
    const order: string[] = []
    const wrapper = mount(createHarness(order), { attachTo: document.body })
    const trigger = wrapper.get<HTMLButtonElement>('.trigger').element

    await wrapper.get('.trigger').trigger('click')
    await nextTick()
    document.querySelector<HTMLElement>('.blank')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect((wrapper.vm as any).visible).toBe(true)

    document.querySelector<HTMLElement>('.child-popup')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect((wrapper.vm as any).visible).toBe(true)
    const dropdown = (wrapper.vm as any).dropdown
    const childPopup = document.querySelector<HTMLElement>('.child-popup')!
    expect(dropdown.containsTarget(childPopup)).toBe(true)
    ;(wrapper.vm as any).setChildVisible(false)
    expect(dropdown.containsTarget(childPopup)).toBe(false)
    ;(wrapper.vm as any).setChildVisible(true)

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(order).toEqual(['child', 'parent'])
    expect((wrapper.vm as any).visible).toBe(false)
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('preserves a parent focus handoff while restoring focus from inside the popup', async () => {
    let currentBranch: OverlayBranch | undefined
    const parentOverlay: OverlayContext = {
      interactive: ref(true),
      registerBranch(branch) {
        currentBranch ??= branch
        return () => undefined
      },
    }
    vi.stubGlobal('ResizeObserver', class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rectangle(40, 100, 160, 40))
    const wrapper = mount(createHarness([]), {
      attachTo: document.body,
      global: { provide: { [overlayContextKey as symbol]: parentOverlay } },
    })
    const trigger = wrapper.get<HTMLButtonElement>('.trigger').element
    const nextControl = document.createElement('button')
    document.body.append(nextControl)

    await wrapper.get('.trigger').trigger('click')
    await nextTick()
    nextControl.focus()
    currentBranch!.close()
    await nextTick()
    expect(document.activeElement).toBe(nextControl)

    ;(wrapper.vm as any).setChildVisible(true)
    await wrapper.get('.trigger').trigger('click')
    await nextTick()
    document.querySelector<HTMLElement>('.child-trigger')!.focus()
    currentBranch!.close()
    await nextTick()
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('forwards overlay branches and removes listeners, observers, registrations, and sets', async () => {
    const unregisterCurrent = vi.fn()
    const unregisterChild = vi.fn()
    const registerBranch = vi.fn()
      .mockReturnValueOnce(unregisterCurrent)
      .mockReturnValueOnce(unregisterChild)
    const parentOverlay: OverlayContext = {
      interactive: ref(true),
      registerBranch,
    }
    const addDocument = vi.spyOn(document, 'addEventListener')
    const removeDocument = vi.spyOn(document, 'removeEventListener')
    const addWindow = vi.spyOn(window, 'addEventListener')
    const removeWindow = vi.spyOn(window, 'removeEventListener')
    const disconnect = vi.fn()
    const constructObserver = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      constructor() { constructObserver() }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = disconnect
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rectangle(40, 100, 160, 40))
    const wrapper = mount(createHarness([]), {
      attachTo: document.body,
      global: { provide: { [overlayContextKey as symbol]: parentOverlay } },
    })
    const dropdown = (wrapper.vm as any).dropdown
    expect(registerBranch).toHaveBeenCalledTimes(2)
    expect(dropdown.childBranches.size).toBe(1)

    await wrapper.get('.trigger').trigger('click')
    await nextTick()
    expect(addDocument).toHaveBeenCalledWith('click', expect.any(Function), true)
    expect(addWindow).toHaveBeenCalledWith('scroll', expect.any(Function), true)
    expect(addWindow).toHaveBeenCalledWith('resize', expect.any(Function))

    ;(wrapper.vm as any).setVisible(false)
    await nextTick()
    expect(removeDocument).toHaveBeenCalledWith('click', expect.any(Function), true)
    expect(removeWindow).toHaveBeenCalledWith('scroll', expect.any(Function), true)
    expect(removeWindow).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(disconnect).toHaveBeenCalled()

    await wrapper.get('.trigger').trigger('click')
    await nextTick()
    await nextTick()
    expect((wrapper.vm as any).visible).toBe(true)
    expect(document.querySelector('.popup')).not.toBeNull()
    expect(addDocument).toHaveBeenCalledTimes(2)
    expect(constructObserver).toHaveBeenCalledTimes(2)
    wrapper.unmount()
    expect(unregisterCurrent).toHaveBeenCalledOnce()
    expect(unregisterChild).toHaveBeenCalledOnce()
    expect(dropdown.childBranches.size).toBe(0)
    expect(disconnect).toHaveBeenCalledTimes(2)
  })
})
