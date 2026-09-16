import { ref, watch, type Ref } from 'vue'
import type { ZtSelectOption, ZtSelectRemoteMethod } from './types'

export function useRemoteSearch(method: Ref<ZtSelectRemoteMethod | undefined>, debounce: Ref<number>) {
  const options = ref<ZtSelectOption[]>([])
  const loading = ref(false)
  const error = ref<unknown>()
  const failed = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0
  let disposed = false

  function reset() {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    requestId += 1
    options.value = []
    loading.value = false
    error.value = undefined
    failed.value = false
  }

  const stopMethodWatch = watch(method, value => {
    if (!value) reset()
  }, { flush: 'sync' })

  function search(keyword: string, onError?: (reason: unknown) => void) {
    if (disposed) return
    if (!method.value) {
      reset()
      return
    }
    if (timer !== undefined) clearTimeout(timer)
    const scheduledId = ++requestId
    error.value = undefined
    failed.value = false
    timer = setTimeout(async () => {
      timer = undefined
      if (disposed) return
      if (!method.value) {
        if (scheduledId === requestId) loading.value = false
        return
      }
      loading.value = true
      try {
        const result = await method.value(keyword)
        if (!disposed && scheduledId === requestId) options.value = result
      } catch (reason) {
        if (!disposed && scheduledId === requestId) {
          error.value = reason
          failed.value = true
          options.value = []
          onError?.(reason)
        }
      } finally {
        if (!disposed && scheduledId === requestId) loading.value = false
      }
    }, Math.max(0, debounce.value))
  }

  function dispose() {
    disposed = true
    stopMethodWatch()
    requestId += 1
    if (timer !== undefined) clearTimeout(timer)
    loading.value = false
  }

  return { options, loading, error, failed, search, dispose }
}
