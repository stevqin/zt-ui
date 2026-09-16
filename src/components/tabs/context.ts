import type { ComputedRef,InjectionKey,Slots } from 'vue'
import type { ZtTabName,ZtTabPaneProps } from './types'
export interface PaneRecord{uid:number;props:ZtTabPaneProps;slots:Slots;tabId:string;panelId:string;header?:HTMLElement}
export interface TabsContext{active:ComputedRef<ZtTabName|undefined>;register:(pane:PaneRecord)=>void;unregister:(uid:number)=>void}
export const tabsKey:InjectionKey<TabsContext>=Symbol('ztTabs')
