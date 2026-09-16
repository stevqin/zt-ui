<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ZtSelect, ZtSlider } from '@ztechjs/zt-ui'
import { demoConfig, resetDemoConfig } from '../docs/demo-config'
const keyboard = ref(false)
const open = ref(false), root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>()
const sizes = [{label:'迷你',value:'mini'},{label:'紧凑',value:'small'},{label:'默认',value:'default'},{label:'宽松',value:'medium'},{label:'加大',value:'large'}]
function close(){open.value=false;trigger.value?.focus()}
function markKeyboard(e:KeyboardEvent){if(e.key==='Tab')keyboard.value=true}
function outside(e:PointerEvent){keyboard.value=false;const target=e.target as HTMLElement;if(!root.value?.contains(target)&&!target.closest('.zt-select__dropdown'))open.value=false}
onMounted(()=>{document.addEventListener('pointerdown',outside);document.addEventListener('keydown',markKeyboard)})
onBeforeUnmount(()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',markKeyboard)})
</script>
<template>
 <div ref="root" class="demo-settings" :class="{'is-keyboard':keyboard}" @keydown="keyboard=true" @pointerdown="keyboard=false" @keydown.esc="close">
  <button ref="trigger" class="appearance-trigger" type="button" :aria-expanded="open" aria-controls="site-appearance" @click="open=!open">外观</button>
  <div id="site-appearance" class="appearance-panel" :class="{'is-open':open}" role="group" aria-label="全站外观配置">
   <div class="appearance-size" title="全站组件尺寸"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M6 10h11M9 15h8" /></svg><ZtSelect v-model="demoConfig.size" :options="sizes" size="mini" aria-label="全站尺寸" /></div>
   <label class="appearance-radius" title="全站圆角基准"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 16V9a5 5 0 0 1 5-5h7" /></svg><ZtSlider :model-value="demoConfig.borderRadius" @update:model-value="value => { if (typeof value === 'number') demoConfig.borderRadius = value }" :min="0" :max="24" size="mini" :show-tooltip="false" aria-label="全站圆角" /><span>{{demoConfig.borderRadius}}<small>px</small></span></label>
   <button class="appearance-theme" type="button" :aria-pressed="demoConfig.theme==='dark'" aria-label="暗色主题" :title="demoConfig.theme==='dark'?'切换为亮色':'切换为暗色'" @click="demoConfig.theme=demoConfig.theme==='dark'?'light':'dark'">
    <svg v-if="demoConfig.theme==='light'" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3" /><path d="M10 2v1m0 14v1M2 10h1m14 0h1M4 4l1 1m10 10 1 1M4 16l1-1M15 5l1-1" /></svg><svg v-else viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z" /></svg><span>{{demoConfig.theme==='dark'?'暗色':'亮色'}}</span>
   </button>
   <button type="button" class="appearance-reset" aria-label="重置外观" title="恢复默认外观" @click="resetDemoConfig"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7a6 6 0 1 1 0 6M4 3v4h4" /></svg></button>
  </div>
 </div>
</template>
<style scoped>
.demo-settings{position:relative;flex-shrink:0;font-size:12px;color:var(--doc-muted)}
.appearance-panel{display:flex;align-items:center;gap:4px;padding:4px;background:var(--doc-wash);border:1px solid var(--doc-line);border-radius:12px}
.demo-settings svg{width:18px;height:18px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.appearance-size,.appearance-radius{display:flex;align-items:center;gap:7px;height:30px;padding:0 8px}
.appearance-size .zt-select{width:94px}
.appearance-size :deep(.zt-select__control){border:0;background:transparent;box-shadow:none;padding-left:0}
.appearance-size :deep(.zt-select__input){cursor:pointer}
.appearance-size :deep(.zt-select.is-focused .zt-select__control){box-shadow:none}
.appearance-radius{border-left:1px solid var(--doc-line);border-right:1px solid var(--doc-line);gap:8px}
.appearance-radius>span{min-width:30px;text-align:right;font-variant-numeric:tabular-nums;color:var(--doc-ink);font-size:11px}
.appearance-radius small{font-size:9px;margin-left:2px;color:var(--doc-muted)}
.appearance-radius .zt-slider{width:64px;min-width:64px}
.appearance-theme,.appearance-reset,.appearance-trigger{display:flex;align-items:center;justify-content:center;gap:6px;height:30px;padding:0 9px;color:var(--doc-muted);border:0;border-radius:8px;background:transparent;cursor:pointer;font-size:11px;white-space:nowrap;transition:background .15s,color .15s}
.appearance-theme:hover,.appearance-reset:hover{background:var(--site-bg);color:var(--doc-blue)}
.appearance-theme[aria-pressed=true]{color:var(--doc-blue)}
.appearance-reset{width:28px;padding:0}.appearance-reset svg{width:15px;height:15px}.appearance-trigger{display:none}
.demo-settings :is(button,input):focus:not(:focus-visible){outline:none}
.demo-settings :is(button,input):focus-visible{outline:2px solid var(--doc-blue);outline-offset:2px}
.is-keyboard .appearance-size:has(:focus-visible){border-radius:7px;outline:2px solid var(--doc-blue);outline-offset:-2px}
.appearance-size :deep(input:focus-visible){outline:none}
@media(max-width:1000px){.appearance-trigger{display:flex;border:1px solid var(--doc-line);background:var(--doc-wash)}.appearance-panel{display:none;position:absolute;top:calc(100% + 14px);right:0;width:288px;padding:14px;background:var(--site-bg);box-shadow:0 12px 32px #0002;flex-wrap:wrap;gap:10px}.appearance-panel.is-open{display:flex}.appearance-radius{border-right:0}}
</style>
