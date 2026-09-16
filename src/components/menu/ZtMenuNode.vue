<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { menuKey } from './context'
import type { ZtMenuItem } from './types'
defineOptions({name:'ZtMenuNode'})
const props=withDefaults(defineProps<{item:ZtMenuItem; level?:number; parentKey?:string; parentDisabled?:boolean; flyout?:boolean}>(),{level:0,parentDisabled:false})
const menu=inject(menuKey)!
const id=useId()
const href=computed(()=>menu.href(props.item))
const disabled=computed(()=>menu.disabled.value||props.parentDisabled||props.item.disabled)
const branch=computed(()=>props.item.type!=='group'&&Boolean(props.item.children?.length))
const collapsed=computed(()=>menu.collapsed.value&&!props.flyout)
const open=computed(()=>collapsed.value ? menu.popupKey.value===props.item.key : menu.expanded.value.includes(props.item.key))
function click(event:MouseEvent){
 if(disabled.value){event.preventDefault();return}
 if(branch.value){menu.toggle(props.item);return}
 if(href.value&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return
 menu.activate(props.item,event)
}
</script>
<template>
 <li v-if="item.type==='group'" class="zt-menu__group" role="presentation">
  <div :id="id+'-label'" class="zt-menu__heading">{{item.label}}</div>
  <ul role="group" :aria-labelledby="id+'-label'">
   <ZtMenuNode v-for="child in item.children" :key="child.key" :item="child" :level="level" :parent-key="parentKey" :parent-disabled="disabled" :flyout="flyout" />
  </ul>
 </li>
 <li v-else class="zt-menu__item" role="presentation" :class="{'is-open':open,'is-disabled':disabled}">
  <component :is="!branch && href ? 'a':'button'" :type="!branch&&href ? undefined:'button'" :href="!branch&&!disabled ? href:undefined" role="menuitem" class="zt-menu__row" :class="{'is-selected':!branch&&menu.selected.value===item.key}" :data-menu-key="item.key" :data-parent-key="parentKey" :aria-disabled="disabled||undefined" :aria-current="!branch&&menu.selected.value===item.key?'page':undefined" :aria-haspopup="branch?'menu':undefined" :aria-expanded="branch?open:undefined" :aria-controls="branch?(collapsed?menu.popupId:id+'-children'):undefined" :title="collapsed ? item.label : undefined" :aria-label="collapsed ? item.label : undefined" :tabindex="!disabled&&menu.tabKey.value===item.key?0:-1" :style="{'--menu-level':level}" @click="click" @focus="menu.focused.value=item.key">
   <component v-if="item.icon" :is="item.icon" class="zt-menu__icon" aria-hidden="true" />
   <span v-if="collapsed && !item.icon" class="zt-menu__abbreviation" aria-hidden="true">{{item.label.slice(0,2)}}</span>
   <span class="zt-menu__label">{{item.label}}</span><small v-if="item.description" class="zt-menu__description">{{item.description}}</small>
   <svg v-if="branch" class="zt-menu__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="m5 6 3 3 3-3" /></svg>
  </component>
  <ul v-if="branch" v-show="open && !collapsed" :id="id+'-children'" role="menu" :aria-label="item.label" class="zt-menu__children"><ZtMenuNode v-for="child in item.children" :key="child.key" :item="child" :level="level+1" :parent-key="item.key" :parent-disabled="disabled" :flyout="flyout" /></ul>
 </li>
</template>
