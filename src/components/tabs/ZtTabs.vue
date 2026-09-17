<script setup lang="ts">
import { computed,nextTick,provide,reactive,ref } from 'vue'
import { useZtSize } from '../config-provider/context'
import ZtIcon from '../icon/ZtIcon.vue'
import { tabsKey,type PaneRecord } from './context'
import type { ZtTabName,ZtTabsProps } from './types'
import './tabs.scss'
defineOptions({name:'ZtTabs'})
const props=withDefaults(defineProps<ZtTabsProps>(),{type:'line',position:'top',closable:false,addable:false,editable:false,stretch:false,status:'primary'})
const emit=defineEmits<{'update:modelValue':[value:ZtTabName];'tab-change':[value:ZtTabName];'tab-click':[value:ZtTabName];'tab-remove':[value:ZtTabName];'tab-add':[]}>()
const size=useZtSize(props),panes=reactive<PaneRecord[]>([]),pending=ref(false)
const active=computed(()=>props.modelValue)
function register(pane:PaneRecord){if(!panes.some(item=>item.uid===pane.uid))panes.push(pane)}function unregister(uid:number){const index=panes.findIndex(item=>item.uid===uid);if(index>=0)panes.splice(index,1)}
provide(tabsKey,{active,register,unregister})
const classes=computed(()=>['zt-tabs',`zt-tabs--${props.type}`,`zt-tabs--${props.position}`,`zt-tabs--${props.status}`,`zt-tabs--status-${props.status}`,`zt-tabs--${size.value}`,{'is-stretch':props.stretch}])
async function select(pane:PaneRecord){if(pane.props.disabled||pending.value)return;emit('tab-click',pane.props.name);if(pane.props.name===props.modelValue)return;pending.value=true;try{if(await props.beforeLeave?.(pane.props.name,props.modelValue!)===false)return;emit('update:modelValue',pane.props.name);emit('tab-change',pane.props.name)}catch{/* Rejected guards preserve the current tab. */}finally{pending.value=false}}
function close(pane:PaneRecord,event:MouseEvent){event.stopPropagation();if(!pane.props.disabled)emit('tab-remove',pane.props.name)}
function move(index:number,key:string){const enabled=panes.filter(item=>!item.props.disabled);if(!enabled.length)return;const current=enabled.indexOf(panes[index]);let next=current;if(key==='Home')next=0;else if(key==='End')next=enabled.length-1;else if(key==='ArrowRight'||key==='ArrowDown')next=(current+1+enabled.length)%enabled.length;else if(key==='ArrowLeft'||key==='ArrowUp')next=(current-1+enabled.length)%enabled.length;else return;void nextTick(()=>enabled[next]?.header?.focus())}
function key(pane:PaneRecord,index:number,event:KeyboardEvent){if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(event.key)){event.preventDefault();move(index,event.key)}else if(event.key==='Enter'||event.key===' '){event.preventDefault();void select(pane)}}
</script>
<template><div :class="classes"><div class="zt-tabs__nav-wrap"><div class="zt-tabs__nav" role="tablist"><div v-for="(pane,index) in panes" :id="pane.tabId" :key="pane.uid" :ref="el=>pane.header=el as HTMLElement" class="zt-tabs__tab" role="tab" :aria-selected="pane.props.name===modelValue" :aria-controls="pane.panelId" :aria-disabled="pane.props.disabled||undefined" :tabindex="pane.props.name===modelValue?0:-1" :class="{'is-active':pane.props.name===modelValue,'is-disabled':pane.props.disabled}" @click="select(pane)" @keydown="key(pane,index,$event)"><component :is="pane.slots.label" v-if="pane.slots.label"/><template v-else>{{pane.props.label}}</template><button v-if="(editable||closable||pane.props.closable)&&!pane.props.disabled" type="button" class="zt-tabs__close" :aria-label="`关闭 ${pane.props.label||pane.props.name}`" @click="close(pane,$event)"><ZtIcon name="close"/></button></div><button v-if="editable||addable" type="button" class="zt-tabs__add" aria-label="新增标签" @click="emit('tab-add')"><ZtIcon name="add"/></button></div></div><div class="zt-tabs__content"><slot/></div></div></template>
