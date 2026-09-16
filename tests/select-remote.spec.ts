import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import { useRemoteSearch } from '../src/components/select/useRemoteSearch'

it('renders remote loading, results and current request errors', async () => {
  vi.useFakeTimers()
  let resolveFirst!: (options: Array<{ label: string; value: string }>) => void
  const method = vi.fn()
    .mockImplementationOnce(() => new Promise(resolve => { resolveFirst = resolve }))
    .mockRejectedValueOnce(new Error('offline'))
  const wrapper = mount(ZtSelect, {
    attachTo: document.body,
    props: { remote: true, remoteMethod: method, debounce: 10 },
  })

  try {
    await wrapper.get('input').setValue('杭')
    await vi.advanceTimersByTimeAsync(10)
    await nextTick()
    expect(document.body.textContent).toContain('加载中...')

    resolveFirst([{ label: '远程杭州', value: 'hz' }])
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).toContain('远程杭州')

    await wrapper.get('input').setValue('失败')
    expect(document.body.textContent).not.toContain('加载失败，请重试')
    await vi.advanceTimersByTimeAsync(10)
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).toContain('加载失败，请重试')
    expect(wrapper.emitted('remote-error')).toHaveLength(1)
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('renders the custom loading slot while the current remote request is pending', async () => {
  vi.useFakeTimers()
  const method = vi.fn(() => new Promise<Array<{ label: string; value: string }>>(() => undefined))
  const wrapper = mount(ZtSelect, {
    attachTo: document.body,
    props: { remote: true, remoteMethod: method, debounce: 0 },
    slots: { loading: '<span class="slot-loading">正在查询</span>' },
  })

  try {
    await wrapper.get('input').setValue('杭州')
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()
    expect(document.querySelector('.slot-loading')?.textContent).toBe('正在查询')
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('keeps a selected remote label after a later search replaces the results', async () => {
  vi.useFakeTimers()
  const method = vi.fn()
    .mockResolvedValueOnce([{ label: '远程杭州', value: 'hz' }])
    .mockResolvedValueOnce([{ label: '远程上海', value: 'sh' }])
  const wrapper = mount(ZtSelect, {
    attachTo: document.body,
    props: { remote: true, remoteMethod: method, debounce: 0 },
  })

  try {
    await wrapper.get('input').setValue('杭')
    await vi.advanceTimersByTimeAsync(0)
    await Promise.resolve()
    await nextTick()
    await document.querySelector<HTMLElement>('[role="option"]')!.click()
    expect(wrapper.emitted('update:modelValue')).toEqual([['hz']])

    await wrapper.setProps({ modelValue: 'hz' })
    expect(wrapper.get('.zt-select__value').text()).toBe('远程杭州')

    await wrapper.get('input').setValue('上海')
    await vi.advanceTimersByTimeAsync(0)
    await Promise.resolve()
    await nextTick()
    expect(wrapper.get('.zt-select__value').text()).toBe('远程杭州')
    expect(document.querySelector('[role="option"]')?.textContent).toBe('远程上海')
    expect(document.querySelector('[role="option"]')?.getAttribute('aria-selected')).toBe('false')
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('keeps a selected remote tag removable after a later result replacement', async () => {
  vi.useFakeTimers()
  const method = vi.fn()
    .mockResolvedValueOnce([{ label: '远程杭州', value: 'hz' }])
    .mockResolvedValueOnce([{ label: '远程上海', value: 'sh' }])
  const wrapper = mount(ZtSelect, {
    attachTo: document.body,
    props: { multiple: true, remote: true, remoteMethod: method, debounce: 0 },
  })

  try {
    await wrapper.get('input').setValue('杭州')
    await vi.advanceTimersByTimeAsync(0)
    await Promise.resolve()
    await nextTick()
    await document.querySelector<HTMLElement>('[role="option"]')!.click()
    await wrapper.setProps({ modelValue: ['hz'] })

    await wrapper.get('input').setValue('上海')
    await vi.advanceTimersByTimeAsync(0)
    await Promise.resolve()
    await nextTick()
    expect(wrapper.text()).toContain('远程杭州')
    expect(document.querySelector('[role="option"]')?.textContent).toBe('远程上海')
    expect(document.querySelector('[role="option"]')?.getAttribute('aria-selected')).toBe('false')

    await wrapper.get('[aria-label="移除远程杭州"]').trigger('click')
    expect(wrapper.emitted('remove-tag')?.at(-1)).toEqual(['hz'])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('does not navigate or select old remote results while loading replaces the list', async () => {
  vi.useFakeTimers()
  const method = vi.fn()
    .mockResolvedValueOnce([{ label: '远程杭州', value: 'hz' }])
    .mockImplementationOnce(() => new Promise(() => undefined))
  const wrapper = mount(ZtSelect, {
    attachTo: document.body,
    props: { remote: true, remoteMethod: method, debounce: 0 },
  })
  const combobox = wrapper.get('[role="combobox"]')

  try {
    await wrapper.get('input').setValue('杭州')
    await vi.advanceTimersByTimeAsync(0)
    await Promise.resolve()
    await nextTick()
    expect(document.querySelector('[role="option"]')?.textContent).toBe('远程杭州')

    await wrapper.get('input').setValue('等待')
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()
    expect(document.querySelector('.zt-select__loading')).not.toBeNull()
    expect(document.querySelector('[role="option"]')).toBeNull()

    await combobox.trigger('keydown', { key: 'ArrowDown' })
    await combobox.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(combobox.attributes('aria-activedescendant')).toBeUndefined()
    expect(combobox.attributes('aria-expanded')).toBe('true')
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('repositions when remote results grow beyond the space below the control', async () => {
  vi.useFakeTimers()
  let resolveSearch!: (options: Array<{ label: string; value: string }>) => void
  let menuHeight = 30
  let notifyResize: (() => void) | undefined
  const observe = vi.fn()
  const disconnect = vi.fn()
  class ResizeObserverStub {
    constructor(callback: ResizeObserverCallback) {
      notifyResize = () => callback([], this as unknown as ResizeObserver)
    }

    observe = observe
    unobserve = vi.fn()
    disconnect = disconnect
  }
  const resizeObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver')
  Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: ResizeObserverStub })
  const innerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
  const getBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      const isControl = this.classList.contains('zt-select__control')
      const height = isControl ? 40 : this.classList.contains('zt-select__dropdown') ? menuHeight : 0
      const top = isControl ? 500 : 0
      return {
        x: isControl ? 40 : 0,
        y: top,
        top,
        right: isControl ? 260 : 0,
        bottom: isControl ? 540 : height,
        left: isControl ? 40 : 0,
        width: isControl ? 220 : 0,
        height,
        toJSON: () => ({}),
      }
    })
  const method = vi.fn(() => new Promise<Array<{ label: string; value: string }>>(resolve => {
    resolveSearch = resolve
  }))
  const wrapper = mount(ZtSelect, {
    attachTo: document.body,
    props: { remote: true, remoteMethod: method, debounce: 0 },
  })

  try {
    await wrapper.get('input').setValue('城市')
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()
    const dropdown = document.querySelector<HTMLElement>('.zt-select__dropdown')!
    expect(dropdown.dataset.placement).toBe('down')
    expect(dropdown.style.top).toBe('540px')
    expect(observe).toHaveBeenCalledWith(dropdown)

    menuHeight = 200
    resolveSearch([
      { label: '远程杭州', value: 'hz' },
      { label: '远程上海', value: 'sh' },
    ])
    await Promise.resolve()
    await nextTick()
    notifyResize!()
    await nextTick()
    expect(dropdown.dataset.placement).toBe('up')
    expect(dropdown.style.top).toBe('300px')

    wrapper.vm.close()
    expect(disconnect).toHaveBeenCalledOnce()
  } finally {
    wrapper.unmount()
    getBoundingClientRect.mockRestore()
    if (innerHeight) Object.defineProperty(window, 'innerHeight', innerHeight)
    else Reflect.deleteProperty(window, 'innerHeight')
    if (resizeObserver) Object.defineProperty(globalThis, 'ResizeObserver', resizeObserver)
    else Reflect.deleteProperty(globalThis, 'ResizeObserver')
    vi.useRealTimers()
  }
})

it('debounces remote searches and keeps only the newest result', async () => {
  vi.useFakeTimers()
  try {
    const resolvers: Array<(value: Array<{ label: string; value: string }>) => void> = []
    const method = vi.fn(() => new Promise(resolve => resolvers.push(resolve)))
    const remote = useRemoteSearch(ref(method), ref(300))

    remote.search('old')
    await vi.advanceTimersByTimeAsync(300)
    remote.search('new')
    await vi.advanceTimersByTimeAsync(300)
    resolvers[1]([{ label: 'New', value: 'new' }])
    await nextTick()
    resolvers[0]([{ label: 'Old', value: 'old' }])
    await nextTick()

    expect(method).toHaveBeenCalledTimes(2)
    expect(remote.options.value).toEqual([{ label: 'New', value: 'new' }])
    expect(remote.loading.value).toBe(false)
    remote.dispose()
  } finally {
    vi.useRealTimers()
  }
})

it('reports only the newest failure and cancels work on dispose', async () => {
  vi.useFakeTimers()
  try {
    const onError = vi.fn()
    const method = vi.fn().mockRejectedValue(new Error('network'))
    const remote = useRemoteSearch(ref(method), ref(-1))
    remote.search('first', onError)
    remote.search('latest', onError)
    await vi.runAllTimersAsync()
    expect(method).toHaveBeenCalledOnce()
    expect(method).toHaveBeenCalledWith('latest')
    expect(onError).toHaveBeenCalledOnce()
    remote.search('cancelled', onError)
    remote.dispose()
    await vi.runAllTimersAsync()
    expect(method).toHaveBeenCalledOnce()
  } finally {
    vi.useRealTimers()
  }
})

it('clears loading when the newest search has no remote method', async () => {
  vi.useFakeTimers()
  try {
    const method = ref<((keyword: string) => Promise<Array<{ label: string; value: string }>>) | undefined>(
      () => new Promise(() => undefined),
    )
    const remote = useRemoteSearch(method, ref(-1))

    remote.search('in-flight')
    await vi.runAllTimersAsync()
    expect(remote.loading.value).toBe(true)

    method.value = undefined
    remote.search('missing-method')
    await vi.runAllTimersAsync()

    expect(remote.loading.value).toBe(false)
    remote.dispose()
  } finally {
    vi.useRealTimers()
  }
})

it('keeps the newest request loading while stale rejection settles', async () => {
  vi.useFakeTimers()
  try {
    const rejectors: Array<(reason?: unknown) => void> = []
    const resolvers: Array<(value: Array<{ label: string; value: string }>) => void> = []
    const method = vi.fn((keyword: string) =>
      keyword === 'old'
        ? new Promise<Array<{ label: string; value: string }>>((_resolve, reject) => rejectors.push(reject))
        : new Promise<Array<{ label: string; value: string }>>(resolve => resolvers.push(resolve)),
    )
    const remote = useRemoteSearch(ref(method), ref(-1))

    remote.search('old')
    await vi.runAllTimersAsync()
    remote.search('new')
    await vi.runAllTimersAsync()
    expect(remote.loading.value).toBe(true)

    rejectors[0](new Error('stale'))
    await nextTick()
    expect(remote.error.value).toBeUndefined()
    expect(remote.loading.value).toBe(true)

    resolvers[0]([{ label: 'New', value: 'new' }])
    await nextTick()
    expect(remote.options.value).toEqual([{ label: 'New', value: 'new' }])
    expect(remote.loading.value).toBe(false)
    remote.dispose()
  } finally {
    vi.useRealTimers()
  }
})
