<script setup lang="ts">
import { Teleport, computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import { useZtConfig } from '../config-provider/context'
import { overlayContextKey } from '../overlay/context'
import { placePopover } from './position'
import type { ZtPopoverPlacement, ZtPopoverProps } from './types'
import './popover.scss'
defineOptions({name:'ZtPopover'})
const props=withDefaults(defineProps<ZtPopoverProps>(),{visible:false,trigger:'click',placement:'bottom',offset:8,disabled:false,showArrow:true,teleported:true,openDelay:0,closeDelay:100,zIndex:1000,persistent:false})
const emit=defineEmits<{'update:visible':[value:boolean];'before-enter':[];'after-enter':[];'before-leave':[];'after-leave':[]}>()
const config=useZtConfig(),parentOverlay=inject(overlayContextKey,undefined),reference=ref<HTMLElement>(),popup=ref<HTMLElement>(),opened=ref(props.visible),actualPlacement=ref<ZtPopoverPlacement>(props.placement),position=ref({top:0,left:0,arrowX:0,arrowY:0})
let openTimer:number|undefined,closeTimer:number|undefined,unregister:(()=>void)|undefined
const width=computed(()=>typeof props.width==='number'?`${props.width}px`:props.width)
const popupStyle=computed<CSSProperties>(()=>({...config.style.value,position:'fixed',top:`${position.value.top}px`,left:`${position.value.left}px`,width:width.value,zIndex:props.zIndex,'--zt-popover-arrow-x':`${position.value.arrowX}px`,'--zt-popover-arrow-y':`${position.value.arrowY}px`}))
function clearTimers(){clearTimeout(openTimer);clearTimeout(closeTimer);openTimer=closeTimer=undefined}
function focusReference(){(reference.value?.querySelector<HTMLElement>('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')??reference.value)?.focus({preventScroll:true})}
function updatePosition(){if(!reference.value||!popup.value)return;const a=reference.value.getBoundingClientRect(),b=popup.value.getBoundingClientRect(),next=placePopover(a,{width:b.width,height:b.height},{width:window.innerWidth,height:window.innerHeight,padding:8},props.placement,props.offset);actualPlacement.value=next.placement;position.value={top:next.top,left:next.left,arrowX:next.arrowX??0,arrowY:next.arrowY??0}}
async function setVisible(value:boolean){if(props.disabled&&value||opened.value===value)return;clearTimers();if(value)emit('before-enter');else emit('before-leave');opened.value=value;emit('update:visible',value);if(value){bind();await nextTick();updatePosition();emit('after-enter')}else{unbind();emit('after-leave');focusReference()}}
function show(){if(props.trigger==='manual'&&!props.visible)return;void setVisible(true)}function hide(){if(props.trigger==='manual')return;void setVisible(false)}function toggle(){opened.value?hide():show()}
function delayed(value:boolean){clearTimeout(value?closeTimer:openTimer);const delay=value?props.openDelay:props.closeDelay;const timer=window.setTimeout(()=>void setVisible(value),delay);if(value)openTimer=timer;else closeTimer=timer}
function click(){if(props.trigger==='click')toggle()}function enter(){if(props.trigger==='hover')delayed(true)}function leave(){if(props.trigger==='hover')delayed(false)}
function focusIn(){if(props.trigger==='focus')void setVisible(true)}function focusOut(event:FocusEvent){if(props.trigger==='focus'&&!reference.value?.contains(event.relatedTarget as Node)&&!popup.value?.contains(event.relatedTarget as Node))void setVisible(false)}
function outside(event:PointerEvent){const target=event.target as Node;if(props.trigger!=='manual'&&!reference.value?.contains(target)&&!popup.value?.contains(target))void setVisible(false)}
function key(event:KeyboardEvent){if(event.key==='Escape'&&props.trigger!=='manual'){event.preventDefault();void setVisible(false)}}
function bind(){document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',key,true);window.addEventListener('resize',updatePosition);window.addEventListener('scroll',updatePosition,true)}
function unbind(){document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',key,true);window.removeEventListener('resize',updatePosition);window.removeEventListener('scroll',updatePosition,true)}
watch(()=>props.visible,value=>{if(value!==opened.value)void setVisible(value)})
onMounted(()=>{unregister=parentOverlay?.registerBranch({trigger:reference,popup,visible:computed(()=>opened.value),close:()=>void setVisible(false),focus:focusReference,tabThroughPopup:true});if(opened.value){bind();void nextTick(updatePosition)}})
onBeforeUnmount(()=>{clearTimers();unbind();unregister?.()})
defineExpose({show:()=>void setVisible(true),hide:()=>void setVisible(false),toggle,updatePosition})
</script>
<template><span ref="reference" class="zt-popover__reference" :aria-expanded="opened" @click="click" @pointerenter="enter" @pointerleave="leave" @focusin="focusIn" @focusout="focusOut"><slot/></span><Teleport :to="teleported?'body':undefined" :disabled="!teleported"><Transition name="zt-popover"><div v-if="opened||persistent" v-show="opened" ref="popup" class="zt-popover" :class="`zt-popover--${actualPlacement}`" :style="popupStyle" role="dialog" tabindex="-1" @pointerenter="enter" @pointerleave="leave" @focusout="focusOut"><span v-if="showArrow" class="zt-popover__arrow"/><div class="zt-popover__content"><slot name="content"/></div></div></Transition></Teleport></template>
