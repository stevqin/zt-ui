<script setup lang="ts">
import { computed, getCurrentInstance, toRaw } from 'vue'
import { useZtSize } from '../config-provider/context'
import ZtIcon from '../icon/ZtIcon.vue'
import type { ZtIconName } from '../icon'
import type { ZtLinkProps, ZtLinkRoute } from './types'
import './link.scss'
defineOptions({name:'ZtLink',inheritAttrs:false})
const props=withDefaults(defineProps<ZtLinkProps>(),{replace:false,status:'default',disabled:false,underline:'hover'})
const emit=defineEmits<{click:[event:MouseEvent]}>()
interface Router{resolve:(to:ZtLinkRoute)=>{href:string};push:(to:ZtLinkRoute)=>unknown;replace:(to:ZtLinkRoute)=>unknown}
const instance=getCurrentInstance()!,router=computed(()=>instance.appContext.config.globalProperties.$router as Router|undefined)
const size=useZtSize(props)
const warned=new Set<string>()
const href=computed(()=>{if(props.disabled)return undefined;if(props.href)return props.href;if(!props.to)return undefined;if(router.value){try{return router.value.resolve(props.to).href}catch{return undefined}}if(typeof props.to==='string')return props.to;if(import.meta.env.DEV&&!warned.has('object-route')){warned.add('object-route');console.warn('[zt-ui] ZtLink requires Vue Router for an object `to` value.')}return undefined})
const safeRel=computed(()=>props.rel??(props.target==='_blank'?'noopener noreferrer':undefined))
const classes=computed(()=>['zt-link',`zt-link--${props.status}`,`zt-link--${size.value}`,`zt-link--underline-${props.underline}`,{'is-disabled':props.disabled}])
function iconProps(value:ZtLinkProps['icon']){return typeof value==='string'?{name:value as ZtIconName}:{component:value?toRaw(value):undefined}}
function click(event:MouseEvent){if(props.disabled){event.preventDefault();event.stopImmediatePropagation();return}if(props.to&&router.value){event.preventDefault();void (props.replace?router.value.replace(props.to):router.value.push(props.to))}emit('click',event)}
</script>
<template><a v-bind="$attrs" :class="classes" :href="href" :target="target" :rel="safeRel" :download="download===true?'':download||undefined" :aria-disabled="disabled?'true':undefined" :tabindex="disabled?-1:undefined" @click="click"><slot name="icon"><ZtIcon v-if="icon" class="zt-link__icon" v-bind="iconProps(icon)"/></slot><span class="zt-link__content"><slot/></span><slot name="suffix"><ZtIcon v-if="suffixIcon" class="zt-link__icon" v-bind="iconProps(suffixIcon)"/></slot></a></template>
