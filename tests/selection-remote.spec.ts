import { nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useRemoteOptions } from '../src/components/selection/useRemoteOptions'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

afterEach(() => vi.useRealTimers())

describe('useRemoteOptions', () => {
  it('ignores an older response after a newer request wins', async () => {
    const first = deferred<string[]>()
    const second = deferred<string[]>()
    const method = ref(vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise))
    const remote = useRemoteOptions(method, ref(30), () => [])

    const oldRun = remote.run('old')
    const newRun = remote.run('new')
    second.resolve(['new'])
    await newRun
    first.resolve(['old'])
    await oldRun

    expect(remote.result.value).toEqual(['new'])
    expect(remote.loading.value).toBe(false)
    expect(remote.failed.value).toBe(false)
    expect(remote.error.value).toBeUndefined()
  })

  it('leaves the latest request loading when an older request fails', async () => {
    const first = deferred<string[]>()
    const second = deferred<string[]>()
    const firstError = new Error('old failure')
    const method = ref(vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise))
    const remote = useRemoteOptions(method, ref(30), () => [])

    const oldRun = remote.run('old')
    const newRun = remote.run('new')
    first.reject(firstError)
    await oldRun

    expect(remote.loading.value).toBe(true)
    expect(remote.failed.value).toBe(false)
    expect(remote.error.value).toBeUndefined()

    second.resolve(['new'])
    await newRun
    expect(remote.result.value).toEqual(['new'])
    expect(remote.loading.value).toBe(false)
  })

  it('schedules only the latest query using the normalized debounce delay', async () => {
    vi.useFakeTimers()
    const method = ref(vi.fn().mockResolvedValue(['latest']))
    const remote = useRemoteOptions(method, ref(-20), () => [])

    remote.schedule('old')
    remote.schedule('latest')
    await vi.runAllTimersAsync()

    expect(method.value).toHaveBeenCalledTimes(1)
    expect(method.value).toHaveBeenCalledWith('latest')
    expect(remote.result.value).toEqual(['latest'])
  })

  it('uses a replacement method when a scheduled request begins', async () => {
    vi.useFakeTimers()
    const oldMethod = vi.fn().mockResolvedValue(['old'])
    const replacement = vi.fn().mockResolvedValue(['replacement'])
    const method = ref(oldMethod)
    const remote = useRemoteOptions(method, ref(20), () => [])

    remote.schedule('query')
    method.value = replacement
    await vi.advanceTimersByTimeAsync(20)

    expect(oldMethod).not.toHaveBeenCalled()
    expect(replacement).toHaveBeenCalledWith('query')
    expect(remote.result.value).toEqual(['replacement'])
  })

  it('clears state and returns undefined when the method is missing', async () => {
    const method = ref<((query: string) => Promise<string[]>) | undefined>(
      async () => ['initial'],
    )
    const remote = useRemoteOptions(method, ref(30), () => [])
    await remote.run('initial')

    method.value = undefined
    await nextTick()
    const result = await remote.run('missing')

    expect(result).toBeUndefined()
    expect(remote.result.value).toEqual([])
    expect(remote.loading.value).toBe(false)
    expect(remote.failed.value).toBe(false)
    expect(remote.error.value).toBeUndefined()
  })

  it('prevents scheduled and in-flight requests from writing after disposal', async () => {
    vi.useFakeTimers()
    const inFlight = deferred<string[]>()
    const method = ref(vi.fn().mockReturnValue(inFlight.promise))
    const remote = useRemoteOptions(method, ref(20), () => [])

    const active = remote.run('active')
    remote.schedule('scheduled')
    remote.dispose()
    inFlight.resolve(['late'])
    await active
    await vi.runAllTimersAsync()

    expect(method.value).toHaveBeenCalledTimes(1)
    expect(remote.result.value).toEqual([])
    expect(remote.loading.value).toBe(false)
    expect(await remote.run('after-dispose')).toBeUndefined()
  })

  it('retains the previous result after an error when clearOnError is false', async () => {
    const reason = new Error('offline')
    const onError = vi.fn()
    const method = ref(vi.fn()
      .mockResolvedValueOnce(['kept'])
      .mockRejectedValueOnce(reason))
    const remote = useRemoteOptions(method, ref(30), () => [])
    await remote.run('first')

    await remote.run('second', { clearOnError: false, onError })

    expect(remote.result.value).toEqual(['kept'])
    expect(remote.failed.value).toBe(true)
    expect(remote.error.value).toBe(reason)
    expect(onError).toHaveBeenCalledWith(reason)
  })

  it('coordinates shared methods independently per coordinator', async () => {
    const first = deferred<string[]>()
    const second = deferred<string[]>()
    const method = ref(vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise))
    const left = useRemoteOptions(method, ref(30), () => [])
    const right = useRemoteOptions(method, ref(30), () => [])

    const leftRun = left.run('left')
    const rightRun = right.run('right')
    first.resolve(['left'])
    second.resolve(['right'])
    await Promise.all([leftRun, rightRun])

    expect(left.result.value).toEqual(['left'])
    expect(right.result.value).toEqual(['right'])
  })
})
