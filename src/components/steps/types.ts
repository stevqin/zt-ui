import type { Component, ComputedRef, InjectionKey } from 'vue'
import type { ZtComponentSize } from '../types'

export type ZtStepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success'
export type ZtStepsDirection = 'horizontal' | 'vertical'
export type ZtStepsSize = ZtComponentSize

export interface ZtStepsProps {
  active?: number
  direction?: ZtStepsDirection
  alignCenter?: boolean
  simple?: boolean
  space?: number | string
  finishStatus?: ZtStepStatus
  processStatus?: ZtStepStatus
  size?: ZtStepsSize
}

export interface ZtStepProps {
  title?: string
  description?: string
  icon?: string | Component
  status?: ZtStepStatus
}

export interface ZtStepsContext {
  active: ComputedRef<number>
  direction: ComputedRef<ZtStepsDirection>
  alignCenter: ComputedRef<boolean>
  simple: ComputedRef<boolean>
  space: ComputedRef<number | string>
  finishStatus: ComputedRef<ZtStepStatus>
  processStatus: ComputedRef<ZtStepStatus>
  registerStep: (id: number) => void
  unregisterStep: (id: number) => void
  setStepElement: (id: number, element: HTMLElement | null) => void
  getIndex: (id: number) => number
}

export const ztStepsKey: InjectionKey<ZtStepsContext> = Symbol('ztSteps')
