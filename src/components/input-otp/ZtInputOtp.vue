<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance'
import { computed, inject, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { useZtSize } from '../config-provider/context'
import { ztFormItemKey } from '../form/context'
import type { ZtInputOtpProps } from './types'
import './input-otp.scss'
defineOptions({name:'ZtInputOtp',inheritAttrs:false})
const { underline } = useFormControlAppearance()
const props=withDefaults(defineProps<ZtInputOtpProps>(),{modelValue:'',length:6,integerOnly:true,mask:false,status:'default',disabled:false,readonly:false,separator:'',autocomplete:'one-time-code',autofocus:false})
const emit=defineEmits<{
 'update:modelValue':[value:string]
 input:[value:string]
 change:[value:string]
 complete:[value:string]
 focus:[event:FocusEvent]
 blur:[event:FocusEvent]
 clear:[]
}>()
const attrs=useAttrs(),form=inject(ztFormItemKey,undefined)
const input=ref<HTMLInputElement>(),value=ref(''),focused=ref(false),cursor=ref(0),composing=ref(false)
const length=computed(()=>Number.isFinite(props.length)?Math.max(1,Math.min(32,Math.floor(props.length))):6)
const size=useZtSize(props,()=>form?.size.value)
const disabled=computed(()=>props.disabled||form?.disabled.value||false)
const status=computed(()=>form?.validateState.value==='error'?'danger':props.status==='error'?'danger':props.status)
const separatorAt=computed(()=>props.separatorAfter??Math.floor(length.value/2))
const characters=computed(()=>Array.from(value.value))
const inputAttrs=computed(()=>{const {class:_class,style:_style,...rest}=attrs;return rest})
const describedBy=computed(()=>[attrs['aria-describedby'],form?.validateMessage.value?form.errorId:undefined].filter(Boolean).join(' ')||undefined)
function normalize(text:string){return Array.from(text.replace(/[０-９]/g,char=>String.fromCharCode(char.charCodeAt(0)-0xfee0))).filter(char=>props.integerOnly?/^[0-9]$/.test(char):!(/\s/.test(char)))}
watch(()=>[props.modelValue,props.length,props.integerOnly],()=>{value.value=normalize(props.modelValue??'').slice(0,length.value).join('');cursor.value=Math.min(cursor.value,characters.value.length,length.value-1)},{immediate:true})
function commit(text:string){
 const next=normalize(text).slice(0,length.value).join('')
 if(next===value.value)return
 value.value=next;emit('update:modelValue',next);emit('input',next);emit('change',next)
 if(Array.from(next).length===length.value)emit('complete',next)
 void nextTick(()=>form?.validate('change'))
}
// One native input keeps autofill, selection, screen readers and mobile keyboards intact.
// The cells are a presentation of its value, not separate form fields.
function offset(index:number){return characters.value.slice(0,index).join('').length}
function focus(index=characters.value.length){
 if(disabled.value)return
 const at=Math.max(0,Math.min(index,length.value-1,characters.value.length))
 input.value?.focus({preventScroll:true});cursor.value=at
 input.value?.setSelectionRange(offset(at),offset(at+1))
}
function blur(){input.value?.blur()}
function clear(){if(disabled.value||props.readonly)return;commit('');emit('clear');void nextTick(()=>focus(0))}
function selectCursor(){if(!input.value)return;cursor.value=Math.min(Array.from(input.value.value.slice(0,input.value.selectionStart??0)).length,length.value-1)}
function beforeInput(event:InputEvent){if(!event.isComposing&&event.inputType==='insertText'&&event.data&&!normalize(event.data).length)event.preventDefault()}
function onInput(event:Event){
 if(composing.value||(event as InputEvent).isComposing)return
 const el=event.target as HTMLInputElement
 if(disabled.value||props.readonly){el.value=value.value;return}
 const position=normalize(el.value.slice(0,el.selectionStart??el.value.length)).length
 commit(el.value);el.value=value.value
 void nextTick(()=>focus(position))
}
function paste(event:ClipboardEvent){
 if(disabled.value||props.readonly)return
 event.preventDefault()
 const text=normalize(event.clipboardData?.getData('text')??'').join('')
 if(!text)return
 const chars=Array.from(text)
 const start=chars.length>=length.value?0:Array.from(value.value.slice(0,input.value?.selectionStart??0)).length
 const count=Math.min(chars.length,length.value-start)
 const result=[...characters.value];result.splice(start,Math.max(count,Array.from(value.value.slice(0,input.value?.selectionEnd??0)).length-start),...chars.slice(0,count))
 commit(result.join(''));void nextTick(()=>focus(start+count))
}
function keydown(event:KeyboardEvent){
 if(disabled.value||composing.value||event.isComposing||event.ctrlKey||event.metaKey||event.altKey)return
 const moves:Record<string,number>={ArrowLeft:cursor.value-1,ArrowRight:cursor.value+1,Home:0,End:characters.value.length}
 if(event.key in moves){event.preventDefault();focus(moves[event.key]);return}
 if(props.readonly)return
 if(event.key==='Backspace'||event.key==='Delete'){
  event.preventDefault()
  const start=Array.from(value.value.slice(0,input.value?.selectionStart??0)).length
  const end=Array.from(value.value.slice(0,input.value?.selectionEnd??0)).length
  const at=event.key==='Backspace'&&start===end?Math.max(0,start-1):start
  const result=[...characters.value];result.splice(at,Math.max(1,end-start));commit(result.join(''));void nextTick(()=>focus(at))
 }
}
function onFocus(event:FocusEvent){focused.value=true;emit('focus',event)}
function onBlur(event:FocusEvent){focused.value=false;emit('blur',event);void nextTick(()=>form?.validate('blur'))}
onMounted(()=>{if(props.autofocus)focus()})
defineExpose({focus,blur,clear,input})
</script>
<template>
 <div class="zt-input-otp" :class="[`zt-input-otp--${size}`,`zt-input-otp--${status}`,{'is-form-underline':underline,'is-disabled':disabled,'is-readonly':readonly},attrs.class]" :style="attrs.style" @pointerdown.prevent="focus()">
  <input ref="input" v-bind="inputAttrs" class="zt-input-otp__native" :id="String(attrs.id??form?.inputId??'')||undefined" :value="value" :type="mask?'password':'text'" :inputmode="integerOnly?'numeric':'text'" :autocomplete="autocomplete" :name="typeof attrs.name==='string'?attrs.name:undefined" :disabled="disabled" :readonly="readonly" :aria-label="typeof attrs['aria-label']==='string'?attrs['aria-label']:(form?undefined:'一次性密码')" :aria-invalid="status==='danger'?'true':undefined" :aria-describedby="describedBy" :pattern="integerOnly?`[0-9]{${length}}`:undefined" :minlength="length" autocapitalize="off" spellcheck="false" @beforeinput="beforeInput" @input="onInput" @paste="paste" @keydown="keydown" @select="selectCursor" @focus="onFocus" @blur="onBlur" @compositionstart="composing=true" @compositionend="composing=false;onInput($event)" />
  <template v-for="(_,index) in length" :key="index"><span class="zt-input-otp__cell" :class="{'is-active':focused&&cursor===index,'is-filled':characters[index]}" aria-hidden="true" @pointerdown.stop.prevent="focus(index)">{{characters[index]?(mask?'•':characters[index]):''}}</span><span v-if="separator&&index+1===separatorAt&&index+1<length" class="zt-input-otp__separator" aria-hidden="true">{{separator}}</span></template>
 </div>
</template>
