<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { searchDocs } from '../docs/search'
const router=useRouter()
const query=ref(''), open=ref(false), selected=ref(0), input=ref<HTMLInputElement>()
const results=computed(()=>searchDocs(query.value))
watch(selected,async()=>{await nextTick();document.getElementById(`search-result-${selected.value}`)?.scrollIntoView({block:'nearest'})})
function choose(index: number) { const result=results.value[index]; if(result){router.push(result.path);open.value=false;query.value='';input.value?.blur()} }
function keydown(e:KeyboardEvent){
 if(e.key==='Escape'){open.value=false;input.value?.blur()}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();selected.value=Math.max(0,Math.min(results.value.length-1,selected.value+(e.key==='ArrowDown'?1:-1)))}
 if(e.key==='Enter'){e.preventDefault();choose(selected.value)}
}
function focusout(e:FocusEvent){if(!(e.relatedTarget instanceof Node)||!(e.currentTarget as HTMLElement)?.contains(e.relatedTarget))open.value=false}
function shortcut(e:KeyboardEvent){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.value?.focus();open.value=true}}
onMounted(()=>window.addEventListener('keydown',shortcut));onBeforeUnmount(()=>window.removeEventListener('keydown',shortcut))
</script>
<template>
 <div class="doc-search" @focusout="focusout">
  <span aria-hidden="true">⌕</span><input ref="input" v-model="query" role="combobox" aria-label="搜索文档" aria-autocomplete="list" aria-controls="doc-search-results" :aria-expanded="open && !!query" :aria-activedescendant="open && results[selected] ? `search-result-${selected}` : undefined" placeholder="搜索组件、场景或 API…" @focus="open=true" @input="selected=0;open=true" @keydown="keydown" /><kbd>⌘ K</kbd>
  <div v-if="open && query" id="doc-search-results" class="doc-search__results" role="listbox">
   <p v-if="!results.length" class="search-empty">没有找到“{{ query }}”，试试组件名、属性名或场景。</p>
   <button v-for="(result,index) in results" :id="`search-result-${index}`" :key="result.path+result.title" role="option" :aria-selected="selected===index" :class="{'is-active':selected===index}" @mousedown.prevent @click="choose(index)"><strong>{{result.title}}</strong><span>{{result.detail}}</span></button>
  </div>
 </div>
</template>
