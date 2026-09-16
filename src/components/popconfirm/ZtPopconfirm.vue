<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import ZtIcon from '../icon/ZtIcon.vue'
import ZtPopover from '../popover/ZtPopover.vue'
import type { ZtIconName } from '../icon'
import type { ZtPopconfirmProps } from './types'
import './popconfirm.scss'
defineOptions({name:'ZtPopconfirm'})
const props=withDefaults(defineProps<ZtPopconfirmProps>(),{visible:false,status:'warning',hideIcon:false,confirmText:'确定',cancelText:'取消',buttonSize:'small',confirmLoading:false,confirmDisabled:false,cancelDisabled:false,hideAfterConfirm:true,placement:'top',disabled:false})
const emit=defineEmits<{'update:visible':[value:boolean];confirm:[];cancel:[];'confirm-error':[error:unknown]}>()
const open=ref(props.visible),confirming=ref(false)
watch(()=>props.visible,value=>open.value=value)
function visible(value:boolean){open.value=value;emit('update:visible',value)}
const iconValue=computed(()=>props.icon??(props.status==='danger'?'warning':props.status==='success'?'success':'warning'))
const iconProps=computed(()=>typeof iconValue.value==='string'?{name:iconValue.value as ZtIconName}:{component:toRaw(iconValue.value)})
async function confirm(){if(confirming.value||props.confirmDisabled)return;confirming.value=true;try{const allowed=await props.beforeConfirm?.();if(allowed===false)return;emit('confirm');if(props.hideAfterConfirm)visible(false)}catch(error){emit('confirm-error',error)}finally{confirming.value=false}}
function cancel(){if(props.cancelDisabled||confirming.value)return;emit('cancel');visible(false)}
</script>
<template><ZtPopover :visible="open" trigger="click" :placement="placement" :disabled="disabled" @update:visible="visible"><slot/><template #content><div class="zt-popconfirm" :class="`zt-popconfirm--${status}`"><ZtIcon v-if="!hideIcon" class="zt-popconfirm__icon" v-bind="iconProps"/><div class="zt-popconfirm__body"><strong>{{title}}</strong><p v-if="description">{{description}}</p><div class="zt-popconfirm__actions"><button type="button" :disabled="cancelDisabled||confirming" @click="cancel">{{cancelText}}</button><button type="button" class="is-confirm" :disabled="confirmDisabled||confirming" @click="confirm"><ZtIcon v-if="confirming||confirmLoading" name="refresh" spin/>{{confirmText}}</button></div></div></div></template></ZtPopover></template>
