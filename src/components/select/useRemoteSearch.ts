import type { Ref } from 'vue'
import { useRemoteOptions } from '../selection'
import type { ZtSelectOption } from '../selection'
import type { ZtSelectRemoteMethod } from './types'

export function useRemoteSearch(method: Ref<ZtSelectRemoteMethod | undefined>, debounce: Ref<number>) {
  const remote = useRemoteOptions(method, debounce, () => [] as ZtSelectOption[])

  return {
    options: remote.result,
    loading: remote.loading,
    error: remote.error,
    failed: remote.failed,
    search: (keyword: string, onError?: (reason: unknown) => void) => {
      remote.schedule(keyword, { onError, clearOnError: true })
    },
    dispose: remote.dispose,
  }
}
