import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ZtMenuItem } from './types'
export interface MenuContext {
 popupKey: Ref<string | undefined>
 popupId: string
 collapsed: ComputedRef<boolean>
 selected: ComputedRef<string>
 expanded: ComputedRef<string[]>
 tabKey: ComputedRef<string | undefined>
 focused: Ref<string | undefined>
 disabled: ComputedRef<boolean>
 href: (item: ZtMenuItem) => string | undefined
 activate: (item: ZtMenuItem, event: MouseEvent) => void
 toggle: (item: ZtMenuItem, open?: boolean) => void
}
export const menuKey: InjectionKey<MenuContext> = Symbol('ztMenu')
