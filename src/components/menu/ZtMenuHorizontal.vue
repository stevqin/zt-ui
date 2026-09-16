<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useId, watch } from 'vue'
import type { ZtMenuItem, ZtMenuStatus } from './types'
import type { ZtComponentSize } from '../types'
import { menuKey } from './context'
import { horizontalKey } from './horizontal'
import ZtMenuHorizontalNode from './ZtMenuHorizontalNode.vue'
const props=defineProps<{items:ZtMenuItem[];size:ZtComponentSize;status:ZtMenuStatus;trigger:'hover'|'click';label:string}>()
const menu=inject(menuKey)!
const id=useId(),path=ref<string[]>([])
let timer:ReturnType<typeof setTimeout>|undefined
function enter(){clearTimeout(timer)}
function close(){enter();path.value=[]}
function leave(){if(props.trigger==='hover'){enter();timer=setTimeout(close,180)}}
function open(keys:string[]){enter();path.value=keys}
function owns(target:EventTarget|null){return target instanceof Element&&target.closest('[data-menu-owner]')?.getAttribute('data-menu-owner')===id}
function outside(event:Event){if(!owns(event.target))close()}
onMounted(()=>{document.addEventListener('pointerdown',outside);document.addEventListener('focusin',outside)})
onBeforeUnmount(()=>{enter();document.removeEventListener('pointerdown',outside);document.removeEventListener('focusin',outside)})
watch([menu.selected,menu.disabled,()=>props.items],close)
provide(horizontalKey,{id,path,size:computed(()=>props.size),status:computed(()=>props.status),trigger:computed(()=>props.trigger),open,enter,leave,close})
function flatten(items:ZtMenuItem[],disabled=false):ZtMenuItem[]{return items.flatMap(item=>item.type==='group'?flatten(item.children??[],disabled||Boolean(item.disabled)):[{...item,disabled:disabled||item.disabled}])}
const roots=computed(()=>flatten(props.items))
const tabKey=computed(()=>roots.value.find(item=>contains(item,menu.selected.value)&&!item.disabled)?.key??roots.value.find(item=>!item.disabled)?.key)
function contains(item:ZtMenuItem,key:string):boolean{return item.key===key||Boolean(item.children?.some(child=>contains(child,key)))}
</script>
<template><ul class="zt-menu__horizontal" role="menubar" :aria-label="label" aria-orientation="horizontal" :data-menu-owner="id" @pointerenter="enter" @pointerleave="leave"><ZtMenuHorizontalNode v-for="item in roots" :key="item.key" :item="item" :path="[]" :tab-stop="item.key===tabKey" /></ul></template>
