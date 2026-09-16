<script setup lang="ts">
import { ref } from 'vue'
import { ZtMenu } from '@ztechjs/zt-ui'
import type { ZtMenuItem, ZtMenuStatus } from '@ztechjs/zt-ui'
import Advanced from './Advanced.vue'
import advancedCode from './Advanced.vue?raw'
import Horizontal from './Horizontal.vue'
import horizontalCode from './Horizontal.vue?raw'
import Routing from './Routing.vue'
import routingCode from './Routing.vue?raw'
import Collapse from './Collapse.vue'
import collapseCode from './Collapse.vue?raw'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const statuses:ZtMenuStatus[]=['default','primary','success','warning','danger','info']
const selected=ref('overview'),nested=ref('orders'),expanded=ref(['business'])
const items:ZtMenuItem[]=[{key:'workspace',label:'工作空间',type:'group',children:[{key:'overview',label:'概览',description:'Overview'},{key:'reports',label:'报表',description:'Reports'},{key:'archive',label:'归档',disabled:true}]},{key:'admin',label:'管理',type:'group',children:[{key:'members',label:'成员'},{key:'settings',label:'设置'}]}]
const tree:ZtMenuItem[]=[{key:'home',label:'工作台'},{key:'business',label:'业务管理',children:[{key:'orders',label:'订单'},{key:'products',label:'商品',children:[{key:'stock',label:'库存'},{key:'pricing',label:'价格'}]}]},{key:'system',label:'系统设置',children:[{key:'users',label:'用户'},{key:'roles',label:'角色'}]}]
const basicCode=sfc("import { ref } from 'vue'\nimport { ZtMenu } from '@ztechjs/zt-ui'\nconst selected = ref('overview')\nconst items = [{ key: 'workspace', label: '工作空间', type: 'group' as const, children: [{ key: 'overview', label: '概览' }, { key: 'reports', label: '报表' }] }]",'<ZtMenu v-model="selected" :items="items" aria-label="工作空间导航" />')
const treeCode=sfc("import { ref } from 'vue'\nimport { ZtMenu } from '@ztechjs/zt-ui'\nconst selected = ref('orders')\nconst expanded = ref(['business'])\nconst items = [{ key: 'business', label: '业务管理', children: [{ key: 'orders', label: '订单' }, { key: 'products', label: '商品' }] }, { key: 'system', label: '系统设置', children: [{ key: 'users', label: '用户' }] }]",'<ZtMenu v-model="selected" v-model:expanded-keys="expanded" :items="items" accordion />')
const colorCode=sfc("import { ZtMenu } from '@ztechjs/zt-ui'\nimport type { ZtMenuStatus } from '@ztechjs/zt-ui'\nconst statuses: ZtMenuStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info']\nconst items = [{ key: 'one', label: '基本信息' }, { key: 'two', label: '安全设置' }, { key: 'three', label: '操作日志', disabled: true }]",'<div v-for="status in statuses" :key="status">\n  <p>{{ status }}</p>\n  <ZtMenu model-value="one" :items="items" size="small" :status="status" />\n</div>')
</script>
<template><div class="doc-section">
 <h1>Menu 菜单</h1><p>用于侧边导航和复杂业务入口，支持六种主题色、整栏折叠、动态宽度、两栏布局和多级菜单。文档站左侧导航也使用此组件。</p>
 <h2>分组与选择</h2><DemoBlock :code="basicCode"><ZtMenu v-model="selected" :items="items" aria-label="工作空间导航" style="max-width:300px" /><p>当前选择：{{selected}}</p></DemoBlock>
 <h2>多级与手风琴</h2><DemoBlock :code="treeCode" desc="点击父级只展开菜单，不触发叶子选择。同一层的子菜单可通过 accordion 保持单项展开。"><ZtMenu v-model="nested" v-model:expanded-keys="expanded" :items="tree" accordion aria-label="业务导航" style="max-width:300px" /><p>当前选择：{{nested}}</p></DemoBlock>
 <h2>六种主题颜色</h2><DemoBlock :code="colorCode"><div class="menu-palettes"><div v-for="color in statuses" :key="color"><p>{{color}}</p><ZtMenu model-value="one" :items="[{key:'one',label:'基本信息'},{key:'two',label:'安全设置'},{key:'three',label:'操作日志',disabled:true}]" size="small" :status="color" :aria-label="color+'主题菜单'" /></div></div></DemoBlock>
 <h2>整栏折叠与动态宽度</h2><DemoBlock :code="collapseCode" desc="collapsed 控制整栏折叠；width 接受数值或 CSS 长度，表示 default 尺寸下的基准宽度；切换 size 会增减偏移。折叠后点击父项弹出子菜单，选择后关闭浮层并保持折叠。拖动右边缘或聚焦边缘后用方向键可调整宽度。"><Collapse /></DemoBlock>
 <h2>两栏复杂菜单</h2><DemoBlock :code="advancedCode" desc="mode=double 将顶层菜单作为业务模块，右栏呈现模块内的分组和多级菜单。activeKey 控制模块，modelValue 控制叶子选择。"><Advanced /></DemoBlock>
 <h2>横向导航</h2><DemoBlock :code="horizontalCode" desc="mode=horizontal 支持多级下拉菜单；menu-trigger 默认为 hover，可设为 click。继承全局 size 和主题，空间不足时横向滚动；横向模式不使用整栏折叠和宽度拖动。"><Horizontal /></DemoBlock>
 <h2>路由模式</h2><DemoBlock :code="routingCode" desc="应用 app.use(router) 后设置 router 即可自动跳转，默认以叶子项 key 为路径；route 可设置路径字符串或命名路由对象，支持 params、query、hash。无需手动处理 select 跳转。"><Routing /></DemoBlock><p>高亮跟随实际路由：普通路径按 path 匹配，带 query 或 hash 的目标按 fullPath 精确匹配。导航守卫取消跳转时保留当前高亮；异常通过 route-error 返回。显式 href 保留普通链接行为，Ctrl / Command 点击路由链接可在新标签页打开。未启用 router 时仍使用 v-model 控制选择。</p>
 <h2>键盘导航</h2><p>横向菜单使用 ← / → 切换主项，↓ 进入子菜单；浮层中 ↑ / ↓ 移动、→ 进入下一级、← / Escape 返回上一级。Enter / Space 激活，点击外部或移出悬停区域会关闭浮层。</p><p>Tab 进入菜单后，↑ / ↓ 在可见且启用的菜单项之间移动；Home / End 跳到首尾；→ 展开并进入子菜单；← / Escape 收起或返回上级。Enter / Space 激活当前项。禁用父项会同时禁用后代。</p>
 <h2>API</h2><p>双栏模式中 activeKey 选择业务模块，modelValue 记录叶子项；模块切换不触发 select。collapsed 折叠后保留模块入口，点击模块会浮出子菜单，选择叶子项后自动关闭并保持折叠。width 为展开宽度，collapsedWidth 为折叠宽度，railWidth 为双栏左栏宽度；resizable 提供拖动及键盘调整，minWidth / maxWidth 限制调整范围。</p><p>key 需在整棵菜单中唯一。items 支持 label、description、icon、href、disabled、children 和 type: 'group'。使用 expandedKeys 时为受控展开状态，否则由 defaultExpandedKeys 初始化。</p><p><RouterLink to="/api/menu">查看完整 Props、Events 和类型定义 →</RouterLink></p>
</div></template>

<style scoped>.menu-palettes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.menu-palettes p{margin:0 0 6px!important}@media(max-width:600px){.menu-palettes{grid-template-columns:1fr}}</style>
