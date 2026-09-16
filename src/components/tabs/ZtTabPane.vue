<script setup lang="ts">
import { computed,getCurrentInstance,inject,onBeforeUnmount,ref,useId,useSlots,watch } from 'vue'
import { tabsKey } from './context'
import type { ZtTabPaneProps } from './types'
defineOptions({name:'ZtTabPane'})
const props=withDefaults(defineProps<ZtTabPaneProps>(),{label:'',disabled:false,closable:false,lazy:false}),slots=useSlots(),context=inject(tabsKey)
const uid=getCurrentInstance()!.uid,id=useId(),tabId=`zt-tab-${id}`,panelId=`zt-panel-${id}`,seen=ref(false)
const active=computed(()=>context?.active.value===props.name)
watch(active,value=>{if(value)seen.value=true},{immediate:true})
context?.register({uid,props,slots,tabId,panelId})
onBeforeUnmount(()=>context?.unregister(uid))
</script>
<template><section v-if="!lazy||seen" v-show="active" :id="panelId" class="zt-tab-pane" role="tabpanel" :aria-labelledby="tabId" :tabindex="active?0:-1"><slot/></section></template>
