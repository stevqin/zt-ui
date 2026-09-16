<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, provide, ref, useId, watch } from 'vue'
import { useZtConfig, useZtSize } from '../config-provider/context'
import type { ZtMenuItem, ZtMenuProps } from './types'
import { menuKey } from './context'
import ZtMenuNode from './ZtMenuNode.vue'
import ZtMenuHorizontal from './ZtMenuHorizontal.vue'
import { useMenuRouter } from './useMenuRouter'
import './menu.scss'
import { menuDimensions } from './dimensions'
defineOptions({name:'ZtMenu'})
const props=withDefaults(defineProps<ZtMenuProps>(),{modelValue:'',items:()=>[],defaultExpandedKeys:()=>[],accordion:false,disabled:false,status:'primary',ariaLabel:'菜单',mode:'vertical',router:false,menuTrigger:'hover',collapsed:false,collapsible:false,resizable:false,minWidth:160,maxWidth:480})
const emit=defineEmits<{
 'update:modelValue':[key:string]
 select:[key:string,item:ZtMenuItem,event:MouseEvent]
 'route-error':[error:unknown,item:ZtMenuItem]
 'update:expandedKeys':[keys:string[]]
 'expand-change':[keys:string[]]
 'update:collapsed':[collapsed:boolean]
 'collapse-change':[collapsed:boolean]
 'update:width':[width:number]
 'resize':[width:number]
 'update:activeKey':[key:string]
 'active-change':[key:string]
}>()
const size=useZtSize(props)
const dimensions=computed(()=>menuDimensions[size.value])
const widthOffset=computed(()=>dimensions.value.width-menuDimensions.default.width)
const rail=computed(()=>Math.max(dimensions.value.rail,(props.railWidth??68)+dimensions.value.rail-68))
const root=ref<HTMLElement>()
const popup=ref<HTMLElement>()
const popupId=useId()
const popupKey=ref<string>()
const popupPosition=ref({left:'0px',top:'0px',width:'260px',maxHeight:'400px'})
const {style:providerStyle}=useZtConfig()
function popupTrigger(){return [...root.value?.querySelectorAll<HTMLElement>('[data-category], [data-menu-key]')??[]].find(el=>(el.dataset.category??el.dataset.menuKey)===popupKey.value)}
function closePopup(restore=false){const trigger=popupTrigger();popupKey.value=undefined;if(restore)void nextTick(()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true})})}
function positionPopup(){
 const trigger=popupTrigger();if(!trigger)return
 const rect=trigger.getBoundingClientRect(),width=Math.min(dimensions.value.popup,window.innerWidth-16)
 const left=rect.right+8+width<=window.innerWidth-8?rect.right+8:Math.max(8,rect.left-width-8)
 const height=popup.value?.scrollHeight??320
 const top=Math.max(8,Math.min(rect.top,window.innerHeight-Math.min(height,window.innerHeight-16)-8))
 popupPosition.value={left:`${left}px`,top:`${top}px`,width:`${width}px`,maxHeight:`${window.innerHeight-top-8}px`}
}
function outside(event:PointerEvent){const target=event.target as Node;if(popupKey.value&&!root.value?.contains(target)&&!popup.value?.contains(target))closePopup()}
function scroll(event:Event){if(popupKey.value&&!popup.value?.contains(event.target as Node))positionPopup()}
function escape(event:KeyboardEvent){if(popupKey.value&&event.key==='Escape'){event.preventDefault();event.stopPropagation();closePopup(true)}}
function focusOut(event:FocusEvent){const target=event.relatedTarget as Node|null;if(popupKey.value&&target&&!root.value?.contains(target)&&!popup.value?.contains(target))closePopup()}
onMounted(()=>{document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape,true);window.addEventListener('scroll',scroll,true);window.addEventListener('resize',positionPopup)})
onBeforeUnmount(()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape,true);window.removeEventListener('scroll',scroll,true);window.removeEventListener('resize',positionPopup)})
const folded=ref(props.collapsed)
watch(()=>props.collapsed,value=>folded.value=value)
function collapse(value=!folded.value){closePopup();folded.value=value;emit('update:collapsed',value);emit('collapse-change',value)}
const localWidth=ref(props.width)
watch(()=>props.width,value=>localWidth.value=value)
const widthStyle=computed(()=>props.mode==='horizontal' ? undefined : folded.value ? `${Math.max(props.mode==='double'?60:48,(props.collapsedWidth??56)+dimensions.value.collapsed-56)}px` : typeof localWidth.value==='number' ? `${Math.max(120,localWidth.value+widthOffset.value)}px` : localWidth.value ? `calc(${localWidth.value} + ${widthOffset.value}px)` : (props.mode==='double'?`${dimensions.value.width}px`:undefined))
const selected=ref(props.modelValue)
watch(()=>props.modelValue,value=>selected.value=value)
const localExpanded=ref([...props.defaultExpandedKeys])
const expanded=computed(()=>props.expandedKeys??localExpanded.value)
const focused=ref<string>()
const categories=computed(()=>{
 function flatten(items:ZtMenuItem[],disabled=false):ZtMenuItem[]{return items.flatMap(item=>item.type==='group'?flatten(item.children??[],disabled||Boolean(item.disabled)):[{...item,disabled:disabled||item.disabled}])}
 return flatten(props.items)
})
function contains(item:ZtMenuItem,key:string):boolean{return item.key===key||Boolean(item.children?.some(child=>contains(child,key)))}
const localActive=ref(props.activeKey)
watch(()=>props.activeKey,value=>localActive.value=value)
watch(()=>props.modelValue,value=>{const category=categories.value.find(item=>!item.disabled&&contains(item,value));if(category){localActive.value=category.key;if(props.mode==='double'&&props.activeKey!==undefined&&props.activeKey!==category.key)emit('update:activeKey',category.key)}})
const activeCategory=computed(()=>categories.value.find(item=>!item.disabled&&item.key===(props.activeKey??localActive.value))??categories.value.find(item=>!item.disabled&&contains(item,selected.value))??categories.value.find(item=>!item.disabled))
watch(size,()=>{if(popupKey.value)void nextTick(positionPopup)})
watch([folded,()=>props.mode,()=>props.disabled],()=>closePopup())
watch(activeCategory,category=>{if(popupKey.value&&(!category||category.key!==popupKey.value||category.disabled))closePopup()})
const menuItems=computed(()=>props.mode==='double' ? activeCategory.value?.children??[] : props.items)
function categoryClick(item:ZtMenuItem,event:MouseEvent){
 if(props.disabled||item.disabled)return
 if(routing.href(item)&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return
 localActive.value=item.key;emit('update:activeKey',item.key);emit('active-change',item.key)
 if(item.children?.length){
  if(folded.value){
   if(popupKey.value===item.key){closePopup();return}
   popupKey.value=item.key;positionPopup();void nextTick(positionPopup)
  }
 }else activate(item,event)
}
function categoryKey(event:KeyboardEvent){
 const rows=[...root.value?.querySelectorAll<HTMLElement>('[data-category]:not([aria-disabled="true"])')??[]]
 const index=rows.indexOf(event.target as HTMLElement);if(index<0)return
 let target:HTMLElement|undefined
 if(event.key==='ArrowDown')target=rows[(index+1)%rows.length]
 else if(event.key==='ArrowUp')target=rows[(index-1+rows.length)%rows.length]
 else if(event.key==='Home')target=rows[0]
 else if(event.key==='End')target=rows.at(-1)
 else if(event.key==='ArrowRight'){(event.target as HTMLElement).click();void nextTick(()=>focus(visible.value[0]?.item.key))}
 else if(event.key===' '&&(event.target as HTMLElement).tagName==='A')(event.target as HTMLElement).click()
 else return
 event.preventDefault();event.stopPropagation();target?.focus()
}
let resizePointer:number|null=null,resizeX=0,resizeStart=0
const widthMin=computed(()=>Math.max(120,props.minWidth,props.mode==='double'?rail.value+100:0))
const widthMax=computed(()=>Math.max(widthMin.value,props.maxWidth))
function resizeTo(value:number){const next=Math.round(Math.max(widthMin.value,Math.min(widthMax.value,value))-widthOffset.value);localWidth.value=next;emit('update:width',next);emit('resize',next)}
function resizeDown(event:PointerEvent){if(event.button!==0||props.disabled)return;event.preventDefault();resizePointer=event.pointerId;resizeX=event.clientX;resizeStart=root.value?.getBoundingClientRect().width??240;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)}
function resizeMove(event:PointerEvent){if(!props.disabled&&resizePointer===event.pointerId)resizeTo(resizeStart+event.clientX-resizeX)}
function resizeEnd(){resizePointer=null}
function resizeKey(event:KeyboardEvent){if(props.disabled)return;const current=root.value?.getBoundingClientRect().width??240;const values:Record<string,number>={ArrowLeft:current-10,ArrowRight:current+10,Home:widthMin.value,End:widthMax.value};if(event.key in values){event.preventDefault();resizeTo(values[event.key]!)}}
const entries=computed(()=>{
 const all:{item:ZtMenuItem;parent?:string;disabled:boolean;visible:boolean}[]=[]
 function visit(items:ZtMenuItem[],parent?:string,disabled=false,visible=true){for(const item of items){const blocked=disabled||Boolean(item.disabled);if(item.type==='group'){visit(item.children??[],parent,blocked,visible);continue}all.push({item,parent,disabled:blocked,visible});visit(item.children??[],item.key,blocked,visible&&(!folded.value||Boolean(popupKey.value)||props.mode==='double')&&expanded.value.includes(item.key))}}
 visit(folded.value&&popupKey.value ? activeCategory.value?.children??[] : menuItems.value,undefined,props.disabled);return all
})
const visible=computed(()=>entries.value.filter(entry=>entry.visible&&!entry.disabled))
const tabKey=computed(()=>visible.value.find(e=>e.item.key===focused.value)?.item.key??visible.value.find(e=>e.item.key===selected.value)?.item.key??visible.value[0]?.item.key)
function toggle(item:ZtMenuItem,open=!expanded.value.includes(item.key)){
 if(folded.value&&props.mode==='vertical'&&categories.value.some(category=>category.key===item.key&&!category.disabled)){
  if(props.disabled)return
  localActive.value=item.key
  if(popupKey.value===item.key)closePopup();else{popupKey.value=item.key;positionPopup();void nextTick(positionPopup)}
  return
 }
 const entry=entries.value.find(e=>e.item.key===item.key)
 if(!entry||entry.disabled||!item.children?.length)return
 let keys=expanded.value.filter(key=>key!==item.key)
 if(open){if(props.accordion)keys=keys.filter(key=>entries.value.find(e=>e.item.key===key)?.parent!==entry.parent);keys.push(item.key)}
 localExpanded.value=keys;emit('update:expandedKeys',[...keys]);emit('expand-change',[...keys])
}
const routing=useMenuRouter(props,(key,ancestors)=>{
 if(selected.value!==key){selected.value=key;emit('update:modelValue',key)}
 if(ancestors.length){localActive.value=ancestors[0];if(props.mode==='double'&&props.activeKey!==undefined&&props.activeKey!==ancestors[0])emit('update:activeKey',ancestors[0]!)}
 if(props.expandedKeys===undefined)localExpanded.value=[...new Set([...localExpanded.value,...ancestors])]
})
async function activate(item:ZtMenuItem,event:MouseEvent){
 if(props.router&&!item.href){
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
  emit('select',item.key,item,event)
  if(event.defaultPrevented)return
  event.preventDefault()
  try{if(!routing.router.value)throw new Error('ZtMenu router 模式需要先安装 Vue Router');await routing.router.value.push(routing.target(item));routing.sync()}catch(error){emit('route-error',error,item)}
 }else{selected.value=item.key;emit('update:modelValue',item.key);emit('select',item.key,item,event)}
 if(popupKey.value)closePopup(true)
}
provide(menuKey,{href:routing.href,popupKey,popupId,collapsed:computed(()=>folded.value&&props.mode==='vertical'),selected:computed(()=>selected.value),expanded,tabKey,focused,disabled:computed(()=>props.disabled),activate,toggle})
async function focus(key?:string){if(!key)return;await nextTick();const target=[...(popupKey.value?popup.value:root.value)?.querySelectorAll<HTMLElement>('[data-menu-key]')??[]].find(el=>el.dataset.menuKey===key);target?.focus()}
function keydown(event:KeyboardEvent){
 const row=(event.target as HTMLElement).closest<HTMLElement>('[data-menu-key]');if(!row)return
 const current=entries.value.find(e=>e.item.key===row.dataset.menuKey)
 if(!current||current.disabled)return
 const index=visible.value.findIndex(e=>e.item.key===current.item.key)
 let target:string|undefined
 if(event.key==='ArrowDown')target=visible.value[(index+1)%visible.value.length]?.item.key
 else if(event.key==='ArrowUp')target=visible.value[(index-1+visible.value.length)%visible.value.length]?.item.key
 else if(event.key==='Home')target=visible.value[0]?.item.key
 else if(event.key==='End')target=visible.value.at(-1)?.item.key
 else if(event.key==='ArrowRight'&&current.item.children?.length){if(!expanded.value.includes(current.item.key))toggle(current.item,true);void nextTick(()=>focus(visible.value.find(e=>e.parent===current.item.key)?.item.key))}
 else if(event.key==='ArrowLeft'||event.key==='Escape'){if(current.item.children?.length&&expanded.value.includes(current.item.key))toggle(current.item,false);else if(current.parent){const parent=entries.value.find(e=>e.item.key===current.parent)!;toggle(parent.item,false);target=current.parent}else if(props.mode==='double'){event.preventDefault();if(popupKey.value)closePopup(true);else root.value?.querySelector<HTMLElement>('[data-category][aria-current]')?.focus();return}else return}
 else if(event.key===' '&&row.tagName==='A'){row.click()}
 else return
 event.preventDefault();void focus(target)
}
</script>
<template>
 <div ref="root" class="zt-menu" :class="[`zt-menu--${size}`,`zt-menu--status-${status}`,`zt-menu--${mode}`,{'is-disabled':disabled,'is-collapsed':folded&&mode!=='horizontal'}]" :style="{width:widthStyle,'--menu-rail-width':`${rail}px`}" @keydown="keydown" @focusout="focusOut">
  <ZtMenuHorizontal v-if="mode==='horizontal'" :items="items" :size="size" :status="status" :trigger="menuTrigger" :label="ariaLabel" />
  <div v-else class="zt-menu__body">
   <ul v-if="mode==='double'" class="zt-menu__rail" role="menu" :aria-label="`${ariaLabel}模块`" aria-orientation="vertical" @keydown.stop="categoryKey">
    <li v-for="item in categories" :key="item.key" role="presentation"><component :is="routing.href(item)&&!item.children?.length?'a':'button'" :href="!disabled&&!item.disabled?routing.href(item):undefined" :type="routing.href(item)&&!item.children?.length?undefined:'button'" class="zt-menu__category" role="menuitem" :data-category="item.key" :title="item.label" :aria-haspopup="folded&&item.children?.length?'menu':undefined" :aria-expanded="folded&&item.children?.length?popupKey===item.key:undefined" :aria-controls="folded&&popupKey===item.key?popupId:undefined" :aria-current="activeCategory?.key===item.key?'true':undefined" :aria-disabled="disabled||item.disabled||undefined" :tabindex="!disabled&&!item.disabled&&activeCategory?.key===item.key?0:-1" @click="disabled||item.disabled?$event.preventDefault():categoryClick(item,$event)">
     <component v-if="item.icon" :is="item.icon" class="zt-menu__icon" aria-hidden="true" /><span v-else class="zt-menu__module-icon" aria-hidden="true">{{item.label.slice(0,1)}}</span><span>{{item.label}}</span>
    </component></li>
   </ul>
   <div v-if="mode!=='double'||!folded" class="zt-menu__content">
    <div v-if="mode==='double'" class="zt-menu__module-title">{{activeCategory?.label??'暂无菜单'}}</div>
    <ul class="zt-menu__list" role="menu" :aria-label="ariaLabel" aria-orientation="vertical"><ZtMenuNode v-for="item in menuItems" :key="item.key" :item="item" /></ul>
    <p v-if="mode==='double'&&!menuItems.length" class="zt-menu__empty">此模块没有子菜单</p>
   </div>
  </div>
  <button v-if="collapsible&&mode!=='horizontal'" type="button" class="zt-menu__collapse" :disabled="disabled" :aria-label="folded?'展开菜单':'折叠菜单'" :aria-expanded="!folded" @click="collapse()"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path :d="folded?'m8 5 5 5-5 5':'m12 5-5 5 5 5'" /></svg><span v-if="!folded">收起导航</span></button>
  <div v-if="resizable&&!folded&&mode!=='horizontal'" class="zt-menu__resize" role="separator" aria-label="调整菜单宽度" aria-orientation="vertical" :aria-valuemin="widthMin" :aria-valuemax="widthMax" :aria-valuenow="typeof localWidth==='number'?Math.max(120,localWidth+widthOffset):Math.round(root?.getBoundingClientRect().width??240)" :tabindex="disabled?-1:0" @pointerdown="resizeDown" @pointermove="resizeMove" @pointerup="resizeEnd" @pointercancel="resizeEnd" @lostpointercapture="resizeEnd" @keydown="resizeKey" />
  <Teleport to="body">
   <div v-if="popupKey&&folded&&mode!=='horizontal'" :id="popupId" ref="popup" class="zt-menu zt-menu__flyout" :class="[`zt-menu--${size}`,`zt-menu--status-${status}`]" :style="[providerStyle,popupPosition]" @keydown="keydown" @focusout="focusOut">
    <div class="zt-menu__module-title">{{activeCategory?.label}}</div>
    <ul role="menu" :aria-label="`${activeCategory?.label}子菜单`"><ZtMenuNode v-for="item in activeCategory?.children" :key="item.key" :item="item" flyout /></ul>
   </div>
  </Teleport>
 </div>
</template>
