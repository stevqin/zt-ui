import { toRaw } from 'vue'
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

export function cloneFormValue<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (value == null || typeof value !== 'object') return value
  const raw = toRaw(value)
  // File/Blob contents are immutable; preserving them also preserves upload metadata.
  if (typeof Blob !== 'undefined' && raw instanceof Blob) return raw
  if (raw instanceof Date) return new Date(raw.getTime()) as T
  if (seen.has(raw)) return seen.get(raw) as T
  if (Array.isArray(raw)) {
    const copy: unknown[] = []; seen.set(raw, copy)
    for (const item of raw) copy.push(cloneFormValue(item, seen))
    return copy as T
  }
  if (raw instanceof Map) {
    const copy = new Map(); seen.set(raw, copy)
    raw.forEach((item, key) => copy.set(cloneFormValue(key, seen), cloneFormValue(item, seen)))
    return copy as T
  }
  if (raw instanceof Set) {
    const copy = new Set(); seen.set(raw, copy)
    raw.forEach(item => copy.add(cloneFormValue(item, seen)))
    return copy as T
  }
  if (Object.getPrototypeOf(raw) === Object.prototype || Object.getPrototypeOf(raw) === null) {
    const copy: Record<string, unknown> = {}; seen.set(raw, copy)
    for (const [key, item] of Object.entries(raw)) Object.defineProperty(copy, key, {value:cloneFormValue(item, seen), enumerable:true, writable:true, configurable:true})
    return copy as T
  }
  if (typeof structuredClone === 'function') return structuredClone(raw)
  return raw
}
