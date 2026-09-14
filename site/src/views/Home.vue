<template>
  <div class="doc-section">
    <h1>Zt UI</h1>
    <p>基于 Portal 设计语言的 Vue 3 UI 组件库，为 BIP 项目提供统一的视觉规范和交互体验。</p>

    <h2>安装</h2>
    <div class="doc-demo">
      <div class="doc-demo__source">npm install @ztechjs/zt-ui</div>
    </div>

    <h2>引入</h2>
    <div class="doc-demo">
      <div class="doc-demo__source"><span class="kw">import</span> <span class="str">'@ztechjs/zt-ui/style.css'</span>
<span class="kw">import</span> { ZtButton } <span class="kw">from</span> <span class="str">'@ztechjs/zt-ui'</span></div>
    </div>

    <h2>组件列表</h2>
    <router-link to="/button" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:10px;background:#fff;border:1px solid #e5e7eb;text-decoration:none;color:#111827;font-size:14px;font-weight:500;transition:box-shadow .15s">
      Button 按钮
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </router-link>
  </div>
</template>
