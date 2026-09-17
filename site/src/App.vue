<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { componentGroups, components, guides, groupOf, scenarios } from './docs/catalog'
import { slug } from './docs/reference'
import DocSearch from './components/DocSearch.vue'
import DemoSettings from './components/DemoSettings.vue'
import ApiReference from './components/ApiReference.vue'
import { ZtConfigProvider, ZtMenu } from '@ztechjs/zt-ui'
import type { ZtMenuItem } from '@ztechjs/zt-ui'
import { demoConfig } from './docs/demo-config'
const route=useRoute()
const router=useRouter()
const scrollArea=ref<HTMLElement>()
const mobile=ref(window.innerWidth<=800)
function resize(){mobile.value=window.innerWidth<=800}
function escapeMenu(event:KeyboardEvent){if(event.key==='Escape'&&menu.value){menu.value=false;document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()}}
const menu=ref(false), content=ref<HTMLElement>(), outline=ref<{id:string;title:string;level:number}[]>([]), active=ref('')
const component=computed(()=>components.find(c=>route.path===c.path))
const navigation=computed<ZtMenuItem[]>(()=>[
 {key:'guides',label:'文档',type:'group',children:guides.map(g=>({key:g.path,label:g.title,href:g.path}))},
 ...componentGroups.map(group=>({key:'group-'+group.id,label:group.title,type:'group' as const,children:components.filter(c=>c.group===group.id).map(c=>({key:c.path,label:c.title,description:c.name,href:c.path}))})),
])
function navigate(key:string,_item:ZtMenuItem,event:MouseEvent){event.preventDefault();menu.value=false;void router.push(key)}
const related=computed(()=>scenarios.filter(s=>s.components.includes(component.value?.path.slice(1)??'')))
let observer:MutationObserver|undefined
let pendingHash=true
function collect(){
 const headings=[...content.value?.querySelectorAll<HTMLElement>('h2,h3')??[]].filter(el=>!el.closest('.doc-demo, .scene-card, .component-card'))
 const counts=new Map<string,number>()
 const items=headings.map(el=>{const base=slug(el.textContent??'section'); const count=counts.get(base)??0; counts.set(base,count+1); if(!el.id)el.id=base+(count?'-'+count:''); el.tabIndex=-1;return{id:el.id,title:el.textContent??'',level:Number(el.tagName.slice(1))}})
 if(JSON.stringify(items)!==JSON.stringify(outline.value))outline.value=items
 if(pendingHash&&route.hash){let id='';try{id=decodeURIComponent(route.hash.slice(1))}catch{return}const target=document.getElementById(id);if(target){target.scrollIntoView();pendingHash=false}}
 updateActive()
}
function updateActive(){const items=outline.value.filter(h=>(document.getElementById(h.id)?.getBoundingClientRect().top??Infinity)<160);active.value=items.at(-1)?.id??outline.value[0]?.id??''}
watch(()=>route.fullPath,async()=>{menu.value=false;pendingHash=true;await nextTick();collect();document.title=`${component.value?component.value.name+' '+component.value.title:route.meta.title??'文档'} · Zt UI`},{immediate:true})
onMounted(()=>{window.addEventListener('resize',resize);window.addEventListener('keydown',escapeMenu);observer=new MutationObserver(collect);if(content.value)observer.observe(content.value,{childList:true,subtree:true});collect();scrollArea.value?.addEventListener('scroll',updateActive,{passive:true})})
onBeforeUnmount(()=>{window.removeEventListener('resize',resize);window.removeEventListener('keydown',escapeMenu);observer?.disconnect();scrollArea.value?.removeEventListener('scroll',updateActive)})
</script>
<template>
 <ZtConfigProvider v-bind="demoConfig" class="doc-site" :class="`doc-site--${demoConfig.size}`">
 <a class="skip-link" href="#doc-content">跳转到正文</a>
 <header class="doc-header">
  <div class="doc-header__main">
  <RouterLink class="doc-brand" to="/"><span class="doc-brand__mark">zt<span>·</span></span><strong>Zt UI</strong><span class="doc-brand__sub">开发文档</span></RouterLink>
  <DocSearch />
  <DemoSettings />
  <nav class="doc-header__links" aria-label="主要导航"><RouterLink to="/scenarios">场景指南</RouterLink><RouterLink to="/api">API 手册</RouterLink><span class="version">v0.4.2</span></nav>
  <button class="menu-toggle" :aria-expanded="menu" aria-controls="doc-sidebar" @click="menu=!menu">{{menu?'关闭导航':'导航'}}</button>
  </div>
 </header>
 <div ref="scrollArea" class="doc-layout" :class="{'is-home':route.path==='/' }">
  <button v-if="menu" class="nav-backdrop" aria-label="关闭导航" @click="menu=false" />
  <aside id="doc-sidebar" class="doc-aside" :inert="mobile && !menu" :class="{'is-open':menu}">
   <ZtMenu :items="navigation" :model-value="component?.path ?? route.path" aria-label="文档导航" @select="navigate" />
   <div class="doc-sidebar-note"><span>{{components.length}} components</span><strong>Vue 3 · TypeScript</strong><p>为业务界面提供一致的交互。</p></div>
  </aside>
  <main id="doc-content" ref="content" class="doc-main" tabindex="-1">
   <div class="doc-breadcrumb"><RouterLink to="/">Zt UI</RouterLink><span>/</span><span>{{component?groupOf(component.group).title:'文档'}}</span><template v-if="component"><span>/</span><strong>{{component.title}}</strong></template></div>
   <RouterView />
   <ApiReference v-if="component" :component-id="component.path.slice(1)" />
   <section v-if="component && related.length" class="doc-related"><h2>相关场景</h2><div class="related-links"><RouterLink v-for="s in related" :key="s.id" :to="'/scenarios/'+s.id">{{s.title}} <span>↗</span></RouterLink></div></section>
   <footer class="doc-footer"><span>Zt UI · 组件、场景与接口参考</span><RouterLink to="/components">浏览全部组件 →</RouterLink></footer>
  </main>
  <aside class="doc-outline" aria-label="本页目录"><span class="doc-outline__title">本页内容</span><a v-for="item in outline" :key="item.id" :href="'#'+encodeURIComponent(item.id)" :class="{'is-active':active===item.id,'is-sub':item.level===3}">{{item.title}}</a><a class="back-top" href="#doc-content">返回顶部 ↑</a></aside>
 </div>
 </ZtConfigProvider>
</template>
