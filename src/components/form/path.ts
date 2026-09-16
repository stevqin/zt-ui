import type { ZtFormProp } from './types'

export function pathSegments(path: ZtFormProp): string[] {
  if (Array.isArray(path)) return path.map(String).filter(Boolean)
  return path.match(/[^.[\]]+/g) ?? []
}

export function pathKey(path: ZtFormProp): string {
  return pathSegments(path).join('.')
}

export function getPathValue(source: unknown, path: ZtFormProp): unknown {
  let current = source
  for (const segment of pathSegments(path)) {
    if (current == null || (typeof current !== 'object' && typeof current !== 'function')) return undefined
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

export function setPathValue(source: Record<string, unknown>, path: ZtFormProp, value: unknown): void {
  const segments = pathSegments(path)
  if (!segments.length) return
  let current: Record<string, unknown> = source
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      current[segment] = value
      return
    }
    const nextSegment = segments[index + 1]
    const existing = current[segment]
    if (existing == null || typeof existing !== 'object') {
      current[segment] = /^\d+$/.test(nextSegment ?? '') ? [] : {}
    }
    current = current[segment] as Record<string, unknown>
  })
}

export function cloneFormValue<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value)
  if (value instanceof Date) return new Date(value.getTime()) as T
  if (Array.isArray(value)) return value.map(cloneFormValue) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneFormValue(item)])) as T
  }
  return value
}
