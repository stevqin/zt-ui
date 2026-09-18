<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, provide, ref, useId, watch } from 'vue'
import type { ZtMenuItem } from './types'
import { menuKey } from './context'
import { horizontalKey } from './horizontal'
import { useZtConfig } from '../config-provider/context'
import { menuDimensions } from './dimensions'
import { useAnchoredDropdown } from '../selection/useAnchoredDropdown'
import { overlayContextKey } from '../overlay/context'
const props=withDefaults(defineProps<{item:ZtMenuItem;path:string[];parentDisabled?:boolean;tabStop?:boolean}>(),{parentDisabled:false,tabStop:false})
const menu=inject(menuKey)!,horizontal=inject(horizontalKey)!
const {style:providerStyle}=useZtConfig()
const trigger=ref<HTMLElement>(),panel=ref<HTMLElement>(),id=useId()
const disabled=computed(()=>menu.disabled.value||props.parentDisabled||props.item.disabled)
const branch=computed(()=>Boolean(props.item.children?.length))
const keys=computed(()=>[...props.path,props.item.key])
const open=computed(()=>horizontal.path.value[props.path.length]===props.item.key)
const flyout = useAnchoredDropdown({
 visible: computed(() => branch.value && open.value),
 trigger, popup: panel,
 close: () => horizontal.open(props.path),
 focus: () => trigger.value?.focus({ preventScroll: true }),
 tabThroughPopup: true,
})
provide(overlayContextKey, props.item.type === 'group' ? flyout.triggerOverlayContext : flyout.overlayContext)
const href=computed(()=>menu.href(props.item))
const selected=computed(()=>contains(props.item,menu.selected.value))
const position=ref({left:'0px',top:'0px',width:'232px',maxHeight:'400px'})
function contains(item:ZtMenuItem,key:string):boolean{return item.key===key||Boolean(item.children?.some(child=>contains(child,key)))}
function place(){
 if(!trigger.value||!open.value)return
 const rect=trigger.value.getBoundingClientRect(),width=Math.min(menuDimensions[horizontal.size.value].popup,window.innerWidth-16)
 const height=Math.min(panel.value?.scrollHeight??300,window.innerHeight-16)
 let left=props.path.length?rect.right+6:rect.left
 if(left+width>window.innerWidth-8)left=props.path.length?rect.left-width-6:window.innerWidth-width-8
 const top=props.path.length?rect.top:(rect.bottom+6+height<=window.innerHeight-8?rect.bottom+6:rect.top-height-6)
 position.value={left:`${Math.max(8,left)}px`,top:`${Math.max(8,Math.min(top,window.innerHeight-height-8))}px`,width:`${width}px`,maxHeight:`${window.innerHeight-16}px`}
}
function scroll(event:Event){if(!(event.target instanceof Node)||!panel.value?.contains(event.target))place()}
watch(open,async value=>{if(value){await nextTick();place();window.addEventListener('resize',place);window.addEventListener('scroll',scroll,true)}else{window.removeEventListener('resize',place);window.removeEventListener('scroll',scroll,true)}})
watch(horizontal.size,()=>nextTick(place))
onBeforeUnmount(()=>{window.removeEventListener('resize',place);window.removeEventListener('scroll',scroll,true)})
function hover(){horizontal.enter();if(disabled.value||horizontal.trigger.value!=='hover')return;horizontal.open(branch.value?keys.value:props.path)}
function click(event:MouseEvent){
 if(disabled.value){event.preventDefault();return}
 if(branch.value){horizontal.open(open.value&&horizontal.trigger.value==='click'?props.path:keys.value);return}
 if(href.value&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return
 menu.activate(props.item,event);horizontal.close()
 const parent=props.path[0]
 if(parent)void nextTick(()=>{[...document.querySelectorAll<HTMLElement>('[data-horizontal-key]')].find(el=>el.dataset.horizontalKey===parent&&el.closest('[data-menu-owner]')?.getAttribute('data-menu-owner')===horizontal.id)?.focus({preventScroll:true})})
}
function rows(list:Element|null){return [...list?.querySelectorAll<HTMLElement>('[role="menuitem"]')??[]].filter(el=>el.getAttribute('aria-disabled')!=='true')}
async function enterSub(last=false){horizontal.open(keys.value);await nextTick();const list=rows(panel.value??null);(last?list.at(-1):list[0])?.focus()}
function keydown(event:KeyboardEvent){
 if(disabled.value)return
 const top=props.path.length===0
 const siblings=rows(trigger.value?.closest('[role="menubar"], [role="menu"]')??null),index=siblings.indexOf(trigger.value!)
 let target:HTMLElement|undefined
 if(event.key===(top?'ArrowRight':'ArrowDown'))target=siblings[(index+1)%siblings.length]
 else if(event.key===(top?'ArrowLeft':'ArrowUp'))target=siblings[(index-1+siblings.length)%siblings.length]
 else if(event.key==='Home')target=siblings[0]
 else if(event.key==='End')target=siblings.at(-1)
 else if(branch.value&&((top&&(event.key==='ArrowDown'||event.key==='ArrowUp'))||(!top&&event.key==='ArrowRight')))void enterSub(event.key==='ArrowUp')
 else if(event.key==='Escape'||(!top&&event.key==='ArrowLeft')){
  const parent=props.path.at(-1)
  horizontal.open(props.path.slice(0,-1))
  if(parent)target=[...document.querySelectorAll<HTMLElement>('[data-horizontal-key]')].find(el=>el.dataset.horizontalKey===parent&&el.closest('[data-menu-owner]')?.getAttribute('data-menu-owner')===horizontal.id)
  else trigger.value?.focus()
 }else if(event.key===' '&&href.value)trigger.value?.click()
 else return
 event.preventDefault();event.stopPropagation();target?.focus()
 if(top&&target)horizontal.close()
}
</script>
<template>
 <li v-if="item.type==='group'" class="zt-menu__group" role="presentation"><div class="zt-menu__heading">{{item.label}}</div><ul role="group" :aria-label="item.label"><ZtMenuHorizontalNode v-for="child in item.children" :key="child.key" :item="child" :path="path" :parent-disabled="disabled" /></ul></li>
 <li v-else role="presentation" class="zt-menu__horizontal-item" @pointerenter="hover" @pointerleave="horizontal.leave">
  <component :is="!branch&&href?'a':'button'" ref="trigger" :type="!branch&&href?undefined:'button'" :href="disabled?undefined:href" role="menuitem" class="zt-menu__row" :class="{'is-selected':selected}" :data-horizontal-key="item.key" :aria-disabled="disabled||undefined" :aria-haspopup="branch?'menu':undefined" :aria-expanded="branch?open:undefined" :aria-controls="branch&&open?id:undefined" :aria-current="!branch&&selected?'page':undefined" :tabindex="!disabled&&tabStop?0:-1" @click="click" @keydown.stop="keydown">
   <component v-if="item.icon" :is="item.icon" class="zt-menu__icon" aria-hidden="true"/><span class="zt-menu__label">{{item.label}}</span><small v-if="item.description" class="zt-menu__description">{{item.description}}</small><svg v-if="branch" class="zt-menu__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path :d="path.length?'m6 4 4 4-4 4':'m4 6 4 4 4-4'"/></svg>
  </component>
  <Teleport to="body"><div v-if="branch&&open" :id="id" ref="panel" class="zt-menu zt-menu__flyout zt-menu__horizontal-popup" :class="[`zt-menu--${horizontal.size.value}`,`zt-menu--status-${horizontal.status.value}`]" :style="[providerStyle,position,{zIndex:flyout.popupStyle.value.zIndex}]" :data-menu-owner="horizontal.id" @pointerenter="horizontal.enter" @pointerleave="horizontal.leave"><ul role="menu" :aria-label="item.label"><ZtMenuHorizontalNode v-for="child in item.children" :key="child.key" :item="child" :path="keys" :parent-disabled="disabled" /></ul></div></Teleport>
 </li>
</template>
