<script setup lang="ts">
import { computed, provide, ref, toRaw, watch } from 'vue'
import ZtIcon from '../icon/ZtIcon.vue'
import ZtButton from '../button/ZtButton.vue'
import ZtPopover from '../popover/ZtPopover.vue'
import { popoverSurfaceKey } from '../popover/surface'
import { provideZtSizeScope, useZtSize } from '../config-provider/context'
import type { ZtIconName } from '../icon'
import type { ZtPopconfirmProps } from './types'
import './popconfirm.scss'
defineOptions({name:'ZtPopconfirm'})
provide(popoverSurfaceKey, 'confirm')
const props=withDefaults(defineProps<ZtPopconfirmProps>(),{visible:false,status:'warning',hideIcon:false,confirmText:'确定',cancelText:'取消',confirmLoading:false,confirmDisabled:false,cancelDisabled:false,hideAfterConfirm:true,placement:'top',disabled:false})
const size = useZtSize(props)
provideZtSizeScope(size)
const effectiveButtonSize = computed(() => props.buttonSize ?? size.value)
const emit=defineEmits<{'update:visible':[value:boolean];confirm:[];cancel:[];'confirm-error':[error:unknown]}>()
const open=ref(props.visible),confirming=ref(false),closingViaCancel=ref(false)
watch(()=>props.visible,value=>open.value=value)
function visible(value:boolean,fromCancel=false){
  if(!value&&open.value&&!fromCancel&&!confirming.value&&!props.confirmDisabled&&!props.confirmLoading) emit('cancel')
  open.value=value;emit('update:visible',value)
}
const iconValue=computed(()=>props.icon??(props.status==='danger'?'warning':props.status==='success'?'success':'warning'))
const iconProps=computed(()=>typeof iconValue.value==='string'?{name:iconValue.value as ZtIconName}:{component:toRaw(iconValue.value)})
async function confirm(){if(confirming.value||props.confirmLoading||props.confirmDisabled)return;confirming.value=true;try{const allowed=await props.beforeConfirm?.();if(allowed===false)return;emit('confirm');if(props.hideAfterConfirm)visible(false)}catch(error){emit('confirm-error',error)}finally{confirming.value=false}}
function cancel(){if(props.cancelDisabled||confirming.value||props.confirmLoading)return;closingViaCancel.value=true;emit('cancel');visible(false,true);closingViaCancel.value=false}
</script>
<template><ZtPopover :visible="open" trigger="click" :placement="placement" :disabled="disabled" @update:visible="visible"><slot/><template #content><div class="zt-popconfirm" :class="`zt-popconfirm--${status}`"><ZtIcon v-if="!hideIcon" class="zt-popconfirm__icon" v-bind="iconProps"/><div class="zt-popconfirm__body"><strong>{{title}}</strong><p v-if="description">{{description}}</p><div class="zt-popconfirm__actions"><ZtButton :size="effectiveButtonSize" plain :disabled="cancelDisabled||confirming||confirmLoading" @click="cancel">{{cancelText}}</ZtButton><ZtButton :size="effectiveButtonSize" status="primary" class="is-confirm" :disabled="confirmDisabled" :loading="confirming||confirmLoading" :loading-text="confirmText" @click="confirm">{{confirmText}}</ZtButton></div></div></div></template></ZtPopover></template>
