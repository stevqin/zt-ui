import { ref, watch, type Ref } from 'vue'
import type { RemoteOptionsState, RemoteRunOptions } from './types'

type RemoteMethod<Query, Result> = (query: Query) => Promise<Result>

export function useRemoteOptions<Query, Result>(
  method: Ref<RemoteMethod<Query, Result> | undefined>,
  debounce: Ref<number>,
  initialResult: () => Result,
): RemoteOptionsState<Query, Result> {
  const result = ref(initialResult()) as Ref<Result>
  const loading = ref(false)
  const failed = ref(false)
  const error = ref<unknown>()
  let generation = 0
  let disposed = false
  let timer: { id: ReturnType<typeof setTimeout>; resolve: (value: undefined) => void } | undefined

  function cancelTimer() {
    if (!timer) return
    clearTimeout(timer.id)
    timer.resolve(undefined)
    timer = undefined
  }

  function reset() {
    if (disposed) return
    generation += 1
    cancelTimer()
    result.value = initialResult()
    loading.value = false
    failed.value = false
    error.value = undefined
  }

  const stopMethodWatch = watch(method, value => {
    if (!value) reset()
  }, { flush: 'sync' })

  function run(query: Query, options: RemoteRunOptions = {}): Promise<Result | undefined> {
    if (disposed) return Promise.resolve(undefined)

    cancelTimer()
    const requestGeneration = ++generation
    failed.value = false
    error.value = undefined

    const execute = async (): Promise<Result | undefined> => {
      if (disposed || requestGeneration !== generation) return undefined

      const activeMethod = method.value
      if (!activeMethod) {
        if (requestGeneration === generation) {
          result.value = initialResult()
          loading.value = false
        }
        return undefined
      }

      loading.value = true
      try {
        const value = await activeMethod(query)
        if (disposed || requestGeneration !== generation) return undefined
        result.value = value
        return value
      } catch (reason) {
        if (!disposed && requestGeneration === generation) {
          error.value = reason
          failed.value = true
          if (options.clearOnError !== false) result.value = initialResult()
          options.onError?.(reason)
        }
        return undefined
      } finally {
        if (!disposed && requestGeneration === generation) loading.value = false
      }
    }

    const delay = options.delay
    if (delay === undefined) return execute()

    return new Promise(resolve => {
      const entry = {
        id: setTimeout(async () => {
          if (timer === entry) timer = undefined
          resolve(await execute())
        }, Math.max(0, delay)),
        resolve,
      }
      timer = entry
    })
  }

  function schedule(query: Query, options: Omit<RemoteRunOptions, 'delay'> = {}) {
    void run(query, { ...options, delay: Math.max(0, debounce.value) })
  }

  function dispose() {
    if (disposed) return
    disposed = true
    generation += 1
    cancelTimer()
    stopMethodWatch()
    loading.value = false
  }

  return { result, loading, failed, error, run, schedule, reset, dispose }
}
