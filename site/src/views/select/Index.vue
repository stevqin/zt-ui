<script setup lang="ts">
import { ref } from 'vue'
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const cityOptions: ZtSelectOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
]
const selectedCity = ref('hangzhou')
const emptyCity = ref('')
const nullCity = ref<string | null>(null)

const storeOptions: ZtSelectOption[] = [
  { label: '杭州大厦店', value: 'hz-tower' },
  { label: '上海港汇店', value: 'sh-grand-gateway' },
  { label: '北京国贸店', value: 'bj-skpmall' },
  { label: '深圳万象城店', value: 'sz-mixc' },
]
const selectedStores = ref<Array<string | number | boolean>>(['hz-tower', 'sh-grand-gateway'])

const categoryOptions: ZtSelectOption[] = [
  { label: '连衣裙 Dresses', value: 'dress' },
  { label: '针织衫 Knitwear', value: 'knitwear' },
  { label: '风衣 Trench coat', value: 'trench-coat' },
  { label: '西装 Blazer', value: 'blazer' },
]
const selectedCategory = ref<string | null>(null)

const userDirectory: ZtSelectOption[] = [
  { label: '陈晨 · 商品企划部', value: 'u-1001' },
  { label: '林晓 · 零售运营部', value: 'u-1002' },
  { label: '周远 · 供应链中心', value: 'u-1003' },
  { label: '王静 · 财务管理部', value: 'u-1004' },
]
const selectedUser = ref<string | null>(null)

function searchUsers(keyword: string): Promise<ZtSelectOption[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const normalized = keyword.trim().toLowerCase()
      if (normalized === '失败') {
        reject(new Error('员工目录服务暂时不可用'))
        return
      }
      resolve(userDirectory.filter(option => option.label.toLowerCase().includes(normalized)))
    }, 900)
  })
}

const brandOptions: ZtSelectOption[] = [
  { label: '玖姿 JUZUI', value: 'JZ' },
  { label: '尹默 IMM', value: 'IMM' },
  { label: '安正 ANZHENG', value: 'AZ' },
  { label: '摩萨克 MOISSAC', value: 'MSK', disabled: true },
]
const selectedBrand = ref('JZ')
const regionOptions: ZtSelectOption[] = [
  { label: '华东一区 · 18 家门店', value: 'east-1' },
  { label: '华东二区 · 13 家门店', value: 'east-2' },
  { label: '华北区 · 16 家门店', value: 'north' },
]
const selectedRegions = ref<Array<string | number | boolean>>(['east-1'])

function searchRegions(keyword: string): Promise<ZtSelectOption[]> {
  return new Promise(resolve => {
    window.setTimeout(() => {
      const normalized = keyword.trim().toLowerCase()
      resolve(regionOptions.filter(option => option.label.toLowerCase().includes(normalized)))
    }, 700)
  })
}

const disabledStore = ref('hz-tower')
const disabledOptionStore = ref<string | null>(null)
const sizeValue = ref('hangzhou')

const baseImports = `import { ref } from 'vue'
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui'`

const codeBasic = sfc(`${baseImports}

const options: ZtSelectOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
]
const city = ref('hangzhou')
const emptyCity = ref('')
const nullCity = ref<string | null>(null)`, `<ZtSelect v-model="city" :options="options" clearable aria-label="经营城市" placeholder="选择经营城市" />
<ZtSelect v-model="emptyCity" :options="options" clearable aria-label="空字符串城市" placeholder="请选择城市（空字符串）" />
<ZtSelect v-model="nullCity" :options="options" clearable aria-label="null 城市" placeholder="请选择城市（null）" />
<p>当前城市：{{ city || '未选择' }}</p>`)

const codeMultiple = sfc(`${baseImports}

const options: ZtSelectOption[] = [
  { label: '杭州大厦店', value: 'hz-tower' },
  { label: '上海港汇店', value: 'sh-grand-gateway' },
  { label: '北京国贸店', value: 'bj-skpmall' },
]
const stores = ref<Array<string | number | boolean>>(['hz-tower', 'sh-grand-gateway'])`, `<ZtSelect
  v-model="stores"
  :options="options"
  multiple
  clearable
  aria-label="活动门店"
  placeholder="选择参与活动的门店"
/>
<p>已选 {{ stores.length }} 家门店</p>`)

const codeFilterable = sfc(`${baseImports}

const options: ZtSelectOption[] = [
  { label: '连衣裙 Dresses', value: 'dress' },
  { label: '针织衫 Knitwear', value: 'knitwear' },
  { label: '风衣 Trench coat', value: 'trench-coat' },
  { label: '西装 Blazer', value: 'blazer' },
]
const category = ref<string | null>(null)`, `<ZtSelect
  v-model="category"
  :options="options"
  filterable
  clearable
  aria-label="商品品类"
  placeholder="输入中英文品类名"
/>
<p>当前品类：{{ category || '未选择' }}</p>`)

const codeRemote = sfc(`${baseImports}

const users: ZtSelectOption[] = [
  { label: '陈晨 · 商品企划部', value: 'u-1001' },
  { label: '林晓 · 零售运营部', value: 'u-1002' },
  { label: '周远 · 供应链中心', value: 'u-1003' },
  { label: '王静 · 财务管理部', value: 'u-1004' },
]
const userId = ref<string | null>(null)

const searchUsers = (keyword: string): Promise<ZtSelectOption[]> => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const normalized = keyword.trim().toLowerCase()
      if (normalized === '失败') {
        reject(new Error('员工目录服务暂时不可用'))
        return
      }
      resolve(users.filter(option => option.label.toLowerCase().includes(normalized)))
    }, 900)
  })
}`, `<ZtSelect
  v-model="userId"
  remote
  :remote-method="searchUsers"
  :debounce="0"
  clearable
  aria-label="员工目录"
  remote-error-text="员工目录加载失败，请修改关键词后重试"
  placeholder="输入姓名或部门；输入“失败”查看错误"
  multiple
>
  <template #loading>正在查询员工目录...</template>
</ZtSelect>
<p>每次查询固定等待 900 ms，便于观察加载状态。</p>`)

const codeSlots = sfc(`${baseImports}

const brands: ZtSelectOption[] = [
  { label: '玖姿 JUZUI', value: 'JZ' },
  { label: '尹默 IMM', value: 'IMM' },
  { label: '安正 ANZHENG', value: 'AZ' },
  { label: '摩萨克 MOISSAC', value: 'MSK', disabled: true },
]
const regions: ZtSelectOption[] = [
  { label: '华东一区 · 18 家门店', value: 'east-1' },
  { label: '华东二区 · 13 家门店', value: 'east-2' },
  { label: '华北区 · 16 家门店', value: 'north' },
]
const brand = ref('JZ')
const selectedRegions = ref<Array<string | number | boolean>>(['east-1'])

const searchRegions = (keyword: string): Promise<ZtSelectOption[]> => {
  return new Promise(resolve => {
    window.setTimeout(() => {
      const normalized = keyword.trim().toLowerCase()
      resolve(regions.filter(option => option.label.toLowerCase().includes(normalized)))
    }, 700)
  })
}`, `<ZtSelect v-model="brand" :options="brands" clearable aria-label="主推品牌">
  <template #prefix><strong>主推品牌</strong></template>
  <template #option="{ option, selected, disabled }">
    <span>{{ option.label }}</span>
    <small>{{ disabled ? '本季暂停订货' : selected ? '当前主推' : '品牌代码 ' + option.value }}</small>
  </template>
  <template #selected="{ option }">主推：{{ option.label }}</template>
  <template #footer>数据范围：2026 秋冬订货会</template>
</ZtSelect>

<ZtSelect
  v-model="selectedRegions"
  :options="regions"
  multiple
  remote
  :remote-method="searchRegions"
  :debounce="0"
  clearable
  aria-label="经营区域"
  placeholder="搜索有权限的经营区域"
>
  <template #tag="{ option, remove }">
    <span>{{ option.label }}</span>
    <button type="button" :aria-label="'移除经营区域：' + option.label" @click.stop="remove">移除</button>
  </template>
  <template #empty>没有匹配的经营区域，请检查关键词。</template>
  <template #loading>正在同步经营区域和门店数...</template>
</ZtSelect>`)

const codeDisabled = sfc(`${baseImports}

const options: ZtSelectOption[] = [
  { label: '杭州大厦店', value: 'hz-tower' },
  { label: '上海港汇店（闭店盘点）', value: 'sh-grand-gateway', disabled: true },
  { label: '北京国贸店', value: 'bj-skpmall' },
]
const lockedStore = ref('hz-tower')
const availableStore = ref<string | null>(null)`, `<ZtSelect v-model="lockedStore" :options="options" disabled aria-label="锁定门店" />
<ZtSelect v-model="availableStore" :options="options" clearable aria-label="可选门店" placeholder="禁用选项不可选择" />`)

const codeSizes = sfc(`${baseImports}

const options: ZtSelectOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
]
const city = ref('hangzhou')`, `<ZtSelect v-model="city" :options="options" size="mini" aria-label="经营城市（迷你尺寸）" />
<ZtSelect v-model="city" :options="options" size="small" aria-label="经营城市（小尺寸）" />
<ZtSelect v-model="city" :options="options" size="default" aria-label="经营城市（默认尺寸）" />
<ZtSelect v-model="city" :options="options" size="medium" aria-label="经营城市（中尺寸）" />
<ZtSelect v-model="city" :options="options" size="large" aria-label="经营城市（大尺寸）" />`)
</script>

<template>
  <div class="doc-section select-doc">
    <h1>Select 选择器</h1>
    <p>从结构化选项中选择一个或多个值，支持本地筛选、远程搜索、键盘操作和业务化插槽。</p>

    <h2>基础单选与清空</h2>
    <DemoBlock :code="codeBasic" desc="使用 v-model 绑定单个值；clearable 允许快速清空当前城市。">
      <div class="select-demo-stack">
        <ZtSelect v-model="selectedCity" :options="cityOptions" clearable aria-label="经营城市" placeholder="选择经营城市" />
        <ZtSelect v-model="emptyCity" :options="cityOptions" clearable aria-label="空字符串城市" placeholder="请选择城市（空字符串）" />
        <ZtSelect v-model="nullCity" :options="cityOptions" clearable aria-label="null 城市" placeholder="请选择城市（null）" />
        <span>当前城市：{{ selectedCity || '未选择' }}</span>
      </div>
    </DemoBlock>

    <h2>多选与可移除标签</h2>
    <DemoBlock :code="codeMultiple" desc="multiple 输出去重后的值数组，标签可单独移除，也可一次清空。">
      <div class="select-demo-stack">
        <ZtSelect v-model="selectedStores" :options="storeOptions" multiple clearable aria-label="活动门店" placeholder="选择参与活动的门店" />
        <span>已选 {{ selectedStores.length }} 家门店</span>
      </div>
    </DemoBlock>

    <h2>本地筛选</h2>
    <DemoBlock :code="codeFilterable" desc="filterable 按选项标签做不区分大小写的本地匹配；选中、关闭或失焦后保留关键词，清空按钮会同时清空选择和关键词。">
      <div class="select-demo-stack">
        <ZtSelect v-model="selectedCategory" :options="categoryOptions" filterable clearable aria-label="商品品类" placeholder="输入中英文品类名" />
        <span>当前品类：{{ selectedCategory || '未选择' }}</span>
      </div>
    </DemoBlock>

    <h2>远程用户搜索</h2>
    <DemoBlock :code="codeRemote" desc="查询固定等待 900 ms，便于观察加载；选中结果后保留远程搜索词，输入“失败”可稳定触发错误提示。">
      <div class="select-demo-stack">
        <ZtSelect
          v-model="selectedUser"
          remote
          :remote-method="searchUsers"
          :debounce="0"
          clearable
          style="width: 660px;"
          aria-label="员工目录"
          remote-error-text="员工目录加载失败，请修改关键词后重试"
          placeholder="输入姓名或部门；输入“失败”查看错误"
          multiple
        >
          <template #loading>正在查询员工目录...</template>
        </ZtSelect>
        <span>每次查询固定等待 900 ms，搜索“陈”可返回结果。</span>
      </div>
    </DemoBlock>

    <h2>业务插槽</h2>
    <DemoBlock :code="codeSlots" desc="prefix、option、selected、tag、empty、loading 和 footer 可承载品牌、区域与权限信息。">
      <div class="select-demo-grid">
        <ZtSelect v-model="selectedBrand" :options="brandOptions" clearable aria-label="主推品牌">
          <template #prefix><strong class="slot-label">主推品牌</strong></template>
          <template #option="{ option, selected, disabled }">
            <span class="slot-option">
              <span>{{ option.label }}</span>
              <small>{{ disabled ? '本季暂停订货' : selected ? '当前主推' : `品牌代码 ${option.value}` }}</small>
            </span>
          </template>
          <template #selected="{ option }">主推：{{ option.label }}</template>
          <template #footer><span class="slot-footer">数据范围：2026 秋冬订货会</span></template>
        </ZtSelect>
        <ZtSelect
          v-model="selectedRegions"
          :options="regionOptions"
          multiple
          remote
          :remote-method="searchRegions"
          :debounce="0"
          clearable
          aria-label="经营区域"
          placeholder="搜索有权限的经营区域"
        >
          <template #tag="{ option, remove }">
            <span>{{ option.label }}</span>
            <button type="button" class="slot-tag-remove" :aria-label="'移除经营区域：' + option.label" @click.stop="remove">移除</button>
          </template>
          <template #empty>没有匹配的经营区域，请检查关键词。</template>
          <template #loading>正在同步经营区域和门店数...</template>
        </ZtSelect>
      </div>
    </DemoBlock>

    <h2>禁用状态</h2>
    <DemoBlock :code="codeDisabled" desc="disabled 可锁定整个选择器；单个选项也可按业务状态禁止选择。">
      <div class="select-demo-grid">
        <ZtSelect v-model="disabledStore" :options="storeOptions" disabled aria-label="锁定门店" />
        <ZtSelect
          v-model="disabledOptionStore"
          :options="[
            storeOptions[0],
            { ...storeOptions[1], label: '上海港汇店（闭店盘点）', disabled: true },
            storeOptions[2],
          ]"
          clearable
          aria-label="可选门店"
          placeholder="禁用选项不可选择"
        />
      </div>
    </DemoBlock>

    <h2>五档尺寸</h2>
    <DemoBlock :code="codeSizes" desc="size 支持 mini、small、default、medium、large，适配不同信息密度。">
      <div class="select-size-list">
        <ZtSelect v-model="sizeValue" :options="cityOptions" size="mini" aria-label="经营城市（迷你尺寸）" />
        <ZtSelect v-model="sizeValue" :options="cityOptions" size="small" aria-label="经营城市（小尺寸）" />
        <ZtSelect v-model="sizeValue" :options="cityOptions" size="default" aria-label="经营城市（默认尺寸）" />
        <ZtSelect v-model="sizeValue" :options="cityOptions" size="medium" aria-label="经营城市（中尺寸）" />
        <ZtSelect v-model="sizeValue" :options="cityOptions" size="large" aria-label="经营城市（大尺寸）" />
      </div>
    </DemoBlock>

    <h2>API</h2>
    <h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>v-model</code></td><td><code>ZtSelectModelValue</code></td><td><code>null</code></td><td>单选值、多选值数组或空值</td></tr>
      <tr><td><code>options</code></td><td><code>ZtSelectOption[]</code></td><td><code>[]</code></td><td>本地选项或远程初始选项</td></tr>
      <tr><td><code>multiple / filterable / remote / clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>多选、筛选、远程与清空能力</td></tr>
      <tr><td><code>remoteMethod</code></td><td><code>(keyword) =&gt; Promise&lt;ZtSelectOption[]&gt;</code></td><td>—</td><td>远程搜索函数</td></tr>
      <tr><td><code>debounce</code></td><td><code>number</code></td><td><code>300</code></td><td>远程搜索防抖毫秒数</td></tr>
      <tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>控件尺寸</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用组件</td></tr>
      <tr><td><code>placeholder / noDataText / remoteErrorText</code></td><td><code>string</code></td><td>内置中文文案</td><td>空值、无数据与远程失败提示</td></tr>
    </tbody></table>
    <h3>Events</h3>
    <table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>change</code></td><td><code>ZtSelectModelValue</code></td><td>选择值变化</td></tr>
      <tr><td><code>visible-change</code></td><td><code>boolean</code></td><td>下拉层打开或关闭</td></tr>
      <tr><td><code>search</code></td><td><code>string</code></td><td>搜索关键词变化</td></tr>
      <tr><td><code>clear / remove-tag</code></td><td>— / <code>ZtSelectValue</code></td><td>清空或移除多选标签</td></tr>
      <tr><td><code>remote-error</code></td><td><code>unknown</code></td><td>当前远程请求失败</td></tr>
      <tr><td><code>focus / blur</code></td><td><code>FocusEvent</code></td><td>焦点变化</td></tr>
    </tbody></table>
    <h3>Slots 与方法</h3>
    <table class="doc-table"><thead><tr><th>类型</th><th>名称</th><th>说明</th></tr></thead><tbody>
      <tr><td>插槽</td><td><code>prefix / option / selected / tag / empty / loading / footer</code></td><td>定制输入区、选项、状态和下拉底部</td></tr>
      <tr><td>方法</td><td><code>focus / blur / open / close</code></td><td>控制焦点和下拉层</td></tr>
    </tbody></table>
  </div>
</template>

<style scoped>
.select-demo-stack { display: grid; gap: 10px; width: min(100%, 480px); }
.select-demo-stack > span { color: #6b7280; font-size: 13px; }
.select-demo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.select-size-list { display: grid; align-items: start; gap: 12px; width: min(100%, 480px); }
.slot-label { white-space: nowrap; color: #475569; font-size: 12px; }
.slot-option { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; }
.slot-option small { color: #64748b; }
.slot-footer { color: #64748b; font-size: 12px; }
.slot-tag-remove { border: 0; padding: 0 2px; background: transparent; color: inherit; cursor: pointer; }
@media (max-width: 720px) { .select-demo-grid { grid-template-columns: 1fr; } }
</style>
