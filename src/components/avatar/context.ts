import type { ComputedRef, InjectionKey } from 'vue'
import type { ZtAvatarShape, ZtAvatarSize } from './types'

export const avatarGroupKey: InjectionKey<{
  size: ComputedRef<ZtAvatarSize>
  shape: ComputedRef<ZtAvatarShape>
}> = Symbol('ztAvatarGroup')

export const avatarSizes = ['mini', 'small', 'default', 'medium', 'large'] as const
export function avatarSizeStyle(size: ZtAvatarSize) {
  return typeof size === 'number'
    ? size > 0 && Number.isFinite(size) ? `${size}px` : undefined
    : avatarSizes.includes(size as typeof avatarSizes[number]) ? undefined : size || undefined
}
