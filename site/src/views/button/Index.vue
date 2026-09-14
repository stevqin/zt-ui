<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui'
import { ref } from 'vue'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const loading = ref(false)
const circleLoading = ref(false)

function toggleLoading() { loading.value = true; setTimeout(() => { loading.value = false }, 2000) }
function toggleCircleLoading() { circleLoading.value = true; setTimeout(() => { circleLoading.value = false }, 2000) }

const buttonImport = `import { ZtButton } from '@ztechjs/zt-ui'`

const codeBasic = sfc(buttonImport, `<ZtButton>默认按钮</ZtButton>
<ZtButton status="primary">主要按钮</ZtButton>
<ZtButton status="success">成功按钮</ZtButton>
<ZtButton status="warning">警告按钮</ZtButton>
<ZtButton status="danger">危险按钮</ZtButton>
<ZtButton status="info">信息按钮</ZtButton>`)

const codeSize = sfc(buttonImport, `<ZtButton size="mini" status="primary">Mini</ZtButton>
<ZtButton size="small" status="primary">Small</ZtButton>
<ZtButton status="primary">Default</ZtButton>
<ZtButton size="medium" status="primary">Medium</ZtButton>
<ZtButton size="large" status="primary">Large</ZtButton>`)

const codeCircle = sfc(buttonImport, `<ZtButton circle status="primary" aria-label="编辑">
  <span aria-hidden="true">✎</span>
</ZtButton>
<ZtButton circle status="success" aria-label="确认">
  <span aria-hidden="true">✓</span>
</ZtButton>
<ZtButton circle status="danger" aria-label="关闭">
  <span aria-hidden="true">×</span>
</ZtButton>`)

const codeLoading = sfc(`import { ref } from 'vue'
${buttonImport}

const loading = ref(false)
function toggleLoading() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 2000)
}`, `<ZtButton status="primary" :loading="loading" @click="toggleLoading">
  点击加载
</ZtButton>
<ZtButton status="success" :loading="loading" loading-text="处理中…">
  提交
</ZtButton>
<ZtButton circle status="primary" :loading="loading" aria-label="刷新" />`)

const codeDisabled = sfc(buttonImport, `<ZtButton disabled>默认</ZtButton>
<ZtButton status="primary" disabled>主要</ZtButton>
<ZtButton status="success" disabled>成功</ZtButton>
<ZtButton status="danger" disabled>危险</ZtButton>`)
</script>

<template>
  <div class="doc-section">
    <h1>Button 按钮</h1>
    <p>常用的操作按钮，提供颜色状态、尺寸、圆形图标、加载态等能力。</p>

    <h2>基础用法</h2>
    <p>使用 <code>status</code> 设置颜色状态。</p>
    <DemoBlock :code="codeBasic" desc="通过 `status` 属性来定义按钮的颜色状态，默认为 `default`。">
      <div class="demo-row">
        <ZtButton>默认按钮</ZtButton>
        <ZtButton status="primary">主要按钮</ZtButton>
        <ZtButton status="success">成功按钮</ZtButton>
        <ZtButton status="warning">警告按钮</ZtButton>
        <ZtButton status="danger">危险按钮</ZtButton>
        <ZtButton status="info">信息按钮</ZtButton>
      </div>
    </DemoBlock>

    <h2>尺寸</h2>
    <p>提供五种尺寸以适应不同场景。</p>
    <DemoBlock :code="codeSize" desc="通过 `size` 属性设置尺寸，可选值：`mini`、`small`、`default`、`medium`、`large`。">
      <div class="demo-row">
        <ZtButton size="mini" status="primary">Mini</ZtButton>
        <ZtButton size="small" status="primary">Small</ZtButton>
        <ZtButton status="primary">Default</ZtButton>
        <ZtButton size="medium" status="primary">Medium</ZtButton>
        <ZtButton size="large" status="primary">Large</ZtButton>
      </div>
      <div class="demo-row">
        <ZtButton size="mini">Mini</ZtButton>
        <ZtButton size="small">Small</ZtButton>
        <ZtButton>Default</ZtButton>
        <ZtButton size="medium">Medium</ZtButton>
        <ZtButton size="large">Large</ZtButton>
      </div>
    </DemoBlock>

    <h2>圆形按钮</h2>
    <p>设置 <code>circle</code> 属性可得到圆形图标按钮。</p>
    <DemoBlock :code="codeCircle" desc="第一行：`status` 全色系。第二行：不同 `size` 的圆形按钮。">
      <div class="demo-row">
        <ZtButton circle aria-label="搜索">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </ZtButton>
        <ZtButton circle status="primary" aria-label="编辑">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        </ZtButton>
        <ZtButton circle status="success" aria-label="确认">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </ZtButton>
        <ZtButton circle status="warning" aria-label="收藏">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </ZtButton>
        <ZtButton circle status="danger" aria-label="关闭">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </ZtButton>
        <ZtButton circle status="info" aria-label="详情">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </ZtButton>
      </div>
      <div class="demo-row">
        <ZtButton circle size="mini" aria-label="搜索">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </ZtButton>
        <ZtButton circle size="small" status="primary" aria-label="编辑">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        </ZtButton>
        <ZtButton circle status="success" aria-label="确认">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </ZtButton>
        <ZtButton circle size="medium" status="danger" aria-label="关闭">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </ZtButton>
        <ZtButton circle size="large" status="warning" aria-label="收藏">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </ZtButton>
      </div>
    </DemoBlock>

    <h2>加载态</h2>
    <p>点击按钮加载数据，显示 loading 状态。</p>
    <DemoBlock :code="codeLoading" desc="通过 `loading` 属性设置加载状态。使用 `loading-text` 自定义加载文案。">
      <div class="demo-row">
        <ZtButton status="primary" :loading="loading" @click="toggleLoading">点击加载</ZtButton>
        <ZtButton status="success" :loading="loading" loading-text="处理中…" @click="toggleLoading">提交</ZtButton>
        <ZtButton status="primary" circle :loading="circleLoading" @click="toggleCircleLoading" aria-label="刷新">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
        </ZtButton>
      </div>
    </DemoBlock>

    <h2>禁用态</h2>
    <DemoBlock :code="codeDisabled" desc="通过 `disabled` 属性禁用按钮。">
      <div class="demo-row">
        <ZtButton disabled>默认</ZtButton>
        <ZtButton status="primary" disabled>主要</ZtButton>
        <ZtButton status="success" disabled>成功</ZtButton>
        <ZtButton status="danger" disabled>危险</ZtButton>
      </div>
    </DemoBlock>

    <h2>API</h2>
    <h3>Props</h3>
    <table class="doc-table">
      <thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
      <tbody>
        <tr><td><code>status</code></td><td><code>'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'</code></td><td><code>'default'</code></td><td>颜色状态</td></tr>
        <tr><td><code>size</code></td><td><code>'mini' | 'small' | 'default' | 'medium' | 'large'</code></td><td><code>'default'</code></td><td>尺寸</td></tr>
        <tr><td><code>circle</code></td><td><code>boolean</code></td><td><code>false</code></td><td>圆形按钮</td></tr>
        <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用</td></tr>
        <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>加载态</td></tr>
        <tr><td><code>loadingText</code></td><td><code>string</code></td><td><code>'正在处理…'</code></td><td>加载文案</td></tr>
        <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>原生 button type</td></tr>
      </tbody>
    </table>
    <h3>Events</h3>
    <table class="doc-table">
      <thead><tr><th>事件名</th><th>参数</th><th>说明</th></tr></thead>
      <tbody><tr><td><code>click</code></td><td><code>(event: MouseEvent)</code></td><td>点击事件，loading 或 disabled 时不触发</td></tr></tbody>
    </table>
    <h3>Slots</h3>
    <table class="doc-table">
      <thead><tr><th>插槽</th><th>说明</th></tr></thead>
      <tbody><tr><td><code>default</code></td><td>按钮内容。loading 时若未提供内容，显示 loadingText</td></tr></tbody>
    </table>
  </div>
</template>
