import type { Ref } from 'vue'

export type ZtSelectValue = string | number | boolean

export interface ZtSelectOption {
  label: string
  value: ZtSelectValue
  disabled?: boolean
}

export interface RemoteRunOptions {
  delay?: number
  clearOnError?: boolean
  onError?: (reason: unknown) => void
}

export interface RemoteOptionsState<Query, Result> {
  result: Ref<Result>
  loading: Ref<boolean>
  failed: Ref<boolean>
  error: Ref<unknown>
  run: (query: Query, options?: RemoteRunOptions) => Promise<Result | undefined>
  schedule: (query: Query, options?: Omit<RemoteRunOptions, 'delay'>) => void
  reset: () => void
  dispose: () => void
}
