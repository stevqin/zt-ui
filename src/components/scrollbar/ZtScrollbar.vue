<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useZtSize } from '../config-provider/context'
import { calculateThumb } from './scrollbar'
import type { ZtScrollbarProps, ZtScrollbarScroll } from './types'
import './scrollbar.scss'
defineOptions({name:'ZtScrollbar',inheritAttrs:false})
const props=withDefaults(defineProps<ZtScrollbarProps>(),{native:false,always:false,minSize:20,noresize:false,tag:'div',focusable:undefined,ariaLabel:'可滚动区域'})
const emit=defineEmits<{scroll:[value:ZtScrollbarScroll]}>()
const size=useZtSize(props),wrap=ref<HTMLElement>(),view=ref<HTMLElement>()
const vertical=reactive({size:0,offset:0}),horizontal=reactive({size:0,offset:0})
let observer:ResizeObserver|undefined,pointerId:number|undefined,dragAxis:'vertical'|'horizontal'|undefined,startPointer=0,startScroll=0
const length=(value:number|string|undefined)=>typeof value==='number'?`${value}px`:value
const wrapStyle=computed(()=>[props.wrapStyle,{height:length(props.height),maxHeight:length(props.maxHeight)}])
const classes=computed(()=>['zt-scrollbar',`zt-scrollbar--${size.value}`,{'is-always':props.always,'is-native':props.native}])
const vStyle=computed(()=>({height:`${vertical.size}px`,transform:`translateY(${vertical.offset}px)`}))
const hStyle=computed(()=>({width:`${horizontal.size}px`,transform:`translateX(${horizontal.offset}px)`}))
function update(){const element=wrap.value;if(!element)return;Object.assign(vertical,calculateThumb(element.clientHeight,element.scrollHeight,element.scrollTop,props.minSize));Object.assign(horizontal,calculateThumb(element.clientWidth,element.scrollWidth,element.scrollLeft,props.minSize))}
function scrolled(){update();const element=wrap.value;if(element)emit('scroll',{scrollTop:element.scrollTop,scrollLeft:element.scrollLeft})}
function scrollTo(options:ScrollToOptions|number,y?:number){if(typeof options==='number')wrap.value?.scrollTo(options,y??0);else wrap.value?.scrollTo(options)}
function setScrollTop(value:number){if(wrap.value&&Number.isFinite(value)){wrap.value.scrollTop=value;update()}}
function setScrollLeft(value:number){if(wrap.value&&Number.isFinite(value)){wrap.value.scrollLeft=value;update()}}
function stopDrag(){pointerId=undefined;dragAxis=undefined;document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',stopDrag);document.removeEventListener('pointercancel',stopDrag)}
function move(event:PointerEvent){const element=wrap.value;if(pointerId===undefined||event.pointerId!==pointerId||!dragAxis||!element)return;event.preventDefault();const verticalAxis=dragAxis==='vertical',viewport=verticalAxis?element.clientHeight:element.clientWidth,content=verticalAxis?element.scrollHeight:element.scrollWidth,thumb=verticalAxis?vertical:horizontal,delta=(verticalAxis?event.clientY:event.clientX)-startPointer,availableTrack=viewport-thumb.size,availableScroll=content-viewport;if(availableTrack<=0)return;const next=startScroll+delta/availableTrack*availableScroll;if(verticalAxis)setScrollTop(next);else setScrollLeft(next)}
function startDrag(axis:'vertical'|'horizontal',event:PointerEvent){if(event.button!==0)return;const element=wrap.value;if(!element)return;pointerId=event.pointerId;dragAxis=axis;startPointer=axis==='vertical'?event.clientY:event.clientX;startScroll=axis==='vertical'?element.scrollTop:element.scrollLeft;event.preventDefault();event.stopPropagation();document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',stopDrag);document.addEventListener('pointercancel',stopDrag)}
function page(axis:'vertical'|'horizontal',event:PointerEvent){const element=wrap.value,track=event.currentTarget as HTMLElement;if(!element||(event.target as HTMLElement).classList.contains('zt-scrollbar__thumb'))return;const rect=track.getBoundingClientRect(),position=axis==='vertical'?event.clientY-rect.top:event.clientX-rect.left,thumb=axis==='vertical'?vertical:horizontal,current=thumb.offset,size=axis==='vertical'?element.clientHeight:element.clientWidth,delta=position<current?-size:position>current+thumb.size?size:0;if(axis==='vertical')setScrollTop(element.scrollTop+delta);else setScrollLeft(element.scrollLeft+delta)}
function resized(){update()}
onMounted(()=>{void nextTick(update);if(!props.noresize&&typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(update);if(wrap.value)observer.observe(wrap.value);if(view.value)observer.observe(view.value)}window.addEventListener('resize',resized)})
onBeforeUnmount(()=>{observer?.disconnect();window.removeEventListener('resize',resized);stopDrag()})
defineExpose({wrapRef:wrap,update,scrollTo,setScrollTop,setScrollLeft})
</script>
<template><div :class="classes"><div ref="wrap" v-bind="$attrs" class="zt-scrollbar__wrap" :class="[wrapClass,{'is-native':native}]" :style="wrapStyle" :tabindex="focusable === false ? undefined : 0" role="region" :aria-label="ariaLabel" @scroll="scrolled"><component :is="tag" ref="view" class="zt-scrollbar__view" :class="viewClass" :style="viewStyle"><slot/></component></div><template v-if="!native"><div v-if="vertical.size" class="zt-scrollbar__bar zt-scrollbar__bar--vertical" aria-hidden="true" @pointerdown="page('vertical',$event)"><span class="zt-scrollbar__thumb zt-scrollbar__thumb--vertical" :style="vStyle" @pointerdown="startDrag('vertical',$event)"/></div><div v-if="horizontal.size" class="zt-scrollbar__bar zt-scrollbar__bar--horizontal" aria-hidden="true" @pointerdown="page('horizontal',$event)"><span class="zt-scrollbar__thumb zt-scrollbar__thumb--horizontal" :style="hStyle" @pointerdown="startDrag('horizontal',$event)"/></div></template></div></template>
