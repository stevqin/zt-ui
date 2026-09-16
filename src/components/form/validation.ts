import type { ZtFormRule, ZtFormValidateOptions } from './types'

function empty(value: unknown) {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0)
}

function sizeOf(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string' || Array.isArray(value)) return value.length
  return undefined
}

function matchesType(value: unknown, type: ZtFormRule['type']) {
  if (!type) return true
  if (type === 'string') return typeof value === 'string'
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value)
  if (type === 'email') return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  if (type === 'url') {
    if (typeof value !== 'string') return false
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }
  return true
}

function appliesToTrigger(rule: ZtFormRule, trigger?: ZtFormValidateOptions['trigger']) {
  if (!trigger || !rule.trigger) return true
  const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
  return triggers.includes(trigger)
}

function defaultMessage(rule: ZtFormRule) {
  if (rule.required) return '该字段为必填项'
  if (rule.type) return `字段类型必须为 ${rule.type}`
  if (rule.pattern) return '字段格式不正确'
  if (rule.len != null) return `字段长度必须为 ${rule.len}`
  if (rule.min != null && rule.max != null) return `字段值必须在 ${rule.min} 到 ${rule.max} 之间`
  if (rule.min != null) return `字段值不能小于 ${rule.min}`
  if (rule.max != null) return `字段值不能大于 ${rule.max}`
  return '字段校验失败'
}

async function customError(rule: ZtFormRule, value: unknown, options: ZtFormValidateOptions) {
  if (!rule.validator) return undefined
  try {
    const result = await rule.validator(rule, value, options.model ?? {})
    if (result instanceof Error) return result.message
    if (typeof result === 'string') return result
    if (result === false) return rule.message ?? defaultMessage(rule)
    return undefined
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}

export async function validateValue(
  value: unknown,
  rules: ZtFormRule[],
  options: ZtFormValidateOptions,
): Promise<string | undefined> {
  for (const rule of rules) {
    if (!appliesToTrigger(rule, options.trigger)) continue
    const message = rule.message ?? defaultMessage(rule)
    const isWhitespace = rule.whitespace && typeof value === 'string' && value.trim() === ''

    if (rule.required && (empty(value) || isWhitespace)) return message
    if (empty(value)) continue
    if (rule.whitespace && typeof value === 'string' && value.trim() === '') return message
    if (!matchesType(value, rule.type)) return message

    const size = sizeOf(value)
    if (rule.len != null && size !== rule.len) return message
    if (rule.min != null && size != null && size < rule.min) return message
    if (rule.max != null && size != null && size > rule.max) return message
    if (rule.pattern) {
      rule.pattern.lastIndex = 0
      if (typeof value !== 'string' || !rule.pattern.test(value)) return message
    }

    const error = await customError(rule, value, options)
    if (error) return error
  }
  return undefined
}
