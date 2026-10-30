import type { ZtSelectOption } from '../selection/types'

export type ZtVTableGridOption = ZtSelectOption
export interface ZtVTableGridOptionContext { signal: AbortSignal }
export type ZtVTableGridOptionLoader = (source: string, context: ZtVTableGridOptionContext) => Promise<ZtVTableGridOption[]>
export interface ZtVTableGridOptionCache {
  load: (source: string) => Promise<ZtVTableGridOption[]>
  invalidate: (source?: string) => void
  dispose: () => void
}
const aborted = () => new DOMException('选项请求已取消', 'AbortError')

/** Cache lifetime belongs to a grid, or an explicitly shared cache owner. */
export function createGridOptionLoader(loader: ZtVTableGridOptionLoader): ZtVTableGridOptionCache {
  const cache = new Map<string, { controller: AbortController; request: Promise<ZtVTableGridOption[]> }>()
  let disposed = false
  const invalidate = (source?: string) => {
    for (const [key, entry] of cache) if (source === undefined || source === key) {
      entry.controller.abort()
      cache.delete(key)
    }
  }
  return {
    load(source) {
      if (disposed) return Promise.reject(aborted())
      const previous = cache.get(source)
      if (previous) return previous.request
      const controller = new AbortController()
      let request: Promise<ZtVTableGridOption[]>
      try { request = Promise.resolve(loader(source, { signal: controller.signal })) }
      catch (error) { request = Promise.reject(error) }
      let cancel!: () => void
      const cancelled = new Promise<never>((_resolve, reject) => {
        cancel = () => reject(aborted())
        controller.signal.addEventListener('abort', cancel, { once: true })
      })
      request = Promise.race([request, cancelled]).then(options => {
        if (controller.signal.aborted) throw aborted()
        return options
      }).catch(error => {
        if (cache.get(source)?.request === request) cache.delete(source)
        throw error
      }).finally(() => controller.signal.removeEventListener('abort', cancel))
      cache.set(source, { controller, request })
      return request
    },
    invalidate,
    dispose() { disposed = true; invalidate() },
  }
}
