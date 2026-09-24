import type { ZtSelectModelValue, ZtSelectOption, ZtSelectValue } from './types'

export function filterSelectOptions(options: ZtSelectOption[], keyword: string) {
  const normalized = keyword.trim().toLocaleLowerCase()
  return normalized
    ? options.filter(option =>
        String(option.label ?? option.value)
          .toLocaleLowerCase()
          .includes(normalized),
      )
    : options
}

export function singleValue(value: ZtSelectModelValue | undefined): ZtSelectValue | null {
  return Array.isArray(value) || value == null ? null : value
}

export function multipleValues(value: ZtSelectModelValue | undefined): ZtSelectValue[] {
  return Array.isArray(value) ? [...new Set(value)] : []
}

export function isOptionSelected(option: ZtSelectOption, values: ZtSelectValue[]) {
  return values.includes(option.value)
}
