import expansion from './expansion.json';
export type ComponentGroupId =
  | 'foundation'
  | 'layout'
  | 'form'
  | 'data'
  | 'navigation'
  | 'feedback'
  | 'overlay'
  | 'media';
export type RoadmapPhaseId = 'p0' | 'p1' | 'p2';
export interface ComponentGroup {
  id: ComponentGroupId;
  title: string;
  english: string;
  description: string;
  accent: string;
}
export interface ComponentMeta {
  path: string;
  name: string;
  title: string;
  group: ComponentGroupId;
  description: string;
  status: 'stable';
  keywords: string[];
}
export interface PlannedComponent {
  name: string;
  title: string;
  group: ComponentGroupId;
  phase: RoadmapPhaseId;
  description: string;
}

export const componentGroups: ComponentGroup[] = [
  {
    id: 'foundation',
    title: '基础',
    english: 'Foundation',
    description: '文字、图标、链接、按钮与全局设计配置。',
    accent: '#315fdd',
  },
  {
    id: 'layout',
    title: '布局',
    english: 'Layout',
    description: '组织页面结构、间距、分隔和滚动区域。',
    accent: '#6d55c7',
  },
  {
    id: 'form',
    title: '表单',
    english: 'Form',
    description: '输入、选择、上传、校验与数据提交。',
    accent: '#087f8c',
  },
  {
    id: 'data',
    title: '数据展示',
    english: 'Data Display',
    description: '呈现详情、表格、分页和层级数据。',
    accent: '#247559',
  },
  {
    id: 'navigation',
    title: '导航',
    english: 'Navigation',
    description: '在页面、模块和流程之间建立方向感。',
    accent: '#9a6218',
  },
  {
    id: 'feedback',
    title: '反馈',
    english: 'Feedback',
    description: '表达状态、进度、结果与即时消息。',
    accent: '#b04455',
  },
  {
    id: 'overlay',
    title: '浮层',
    english: 'Overlay',
    description: '承载确认、补充信息和上下文编辑。',
    accent: '#9a467c',
  },
  {
    id: 'media',
    title: '媒体',
    english: 'Media',
    description: '展示图片、头像和可视化媒体内容。',
    accent: '#48657e',
  },
];
const stable = (
  path: string,
  name: string,
  title: string,
  group: ComponentGroupId,
  description: string,
  keywords: string[] = [],
): ComponentMeta => ({
  path,
  name,
  title,
  group,
  description,
  status: 'stable',
  keywords,
});
export const components: ComponentMeta[] = [
  stable(
    '/config-provider',
    'ConfigProvider',
    '全局配置',
    'foundation',
    '统一尺寸、明暗主题与圆角基准，支持嵌套覆盖。',
    ['主题', '暗色', '圆角'],
  ),
  stable(
    '/icon',
    'Icon',
    '图标',
    'foundation',
    '内置图标、自定义图标与统一的尺寸颜色语义。',
    ['svg'],
  ),
  stable(
    '/text',
    'Text',
    '文本',
    'foundation',
    '语义标签、字号、字重和单行或多行省略。',
    ['排版', '省略'],
  ),
  stable(
    '/link',
    'Link',
    '链接',
    'foundation',
    '原生或路由导航、图标、状态与禁用行为。',
    ['路由', 'href'],
  ),
  stable(
    '/button',
    'Button',
    '按钮',
    'foundation',
    '触发操作、提交以及加载中的即时反馈。',
    ['操作', 'loading'],
  ),
  stable(
    '/scrollbar',
    'Scrollbar',
    '滚动条',
    'layout',
    '统一轨道样式，同时保留原生滚动与触摸行为。',
    ['容器', '滚动'],
  ),
  stable(
    '/form',
    'Form',
    '表单',
    'form',
    '字段布局、分组、校验与完整提交状态管理。',
    ['校验', '规则'],
  ),
  stable(
    '/input',
    'Input',
    '输入框',
    'form',
    '文本录入、清空、前后内容与组合插槽。',
    ['文本', '字段'],
  ),
  stable(
    '/password',
    'Password',
    '密码框',
    'form',
    '安全输入、密码显隐与浏览器自动填充。',
    ['安全'],
  ),
  stable(
    '/input-number',
    'InputNumber',
    '数字输入框',
    'form',
    '数值范围、精度、步进与多种控制器位置。',
    ['数字', '步进'],
  ),
  stable(
    '/input-otp',
    'InputOtp',
    '一次性密码',
    'form',
    '验证码分格输入、粘贴、自动填充与表单校验。',
    ['验证码', 'OTP'],
  ),
  stable('/radio', 'Radio', '单选框', 'form', '从一组互斥选项中选择一项。', [
    '选择',
  ]),
  stable(
    '/checkbox',
    'Checkbox',
    '多选框',
    'form',
    '多项选择、组合管理与半选状态。',
    ['选择', '半选'],
  ),
  stable('/switch', 'Switch', '开关', 'form', '立即启用或关闭一个独立设置。', [
    '布尔',
  ]),
  stable(
    '/select',
    'Select',
    '选择器',
    'form',
    '单选、多选、本地筛选与远程搜索。',
    ['下拉', '多选'],
  ),
  stable(
    '/segmented',
    'Segmented',
    '分段控制器',
    'form',
    '在少量互斥选项之间即时切换。',
    ['切换'],
  ),
  stable(
    '/slider',
    'Slider',
    '滑块',
    'form',
    '步长调节、范围选择和键盘操作。',
    ['范围'],
  ),
  stable(
    '/date-picker',
    'DatePicker',
    '日期选择器',
    'form',
    '单日期、双面板范围、移动端布局与节假日标识。',
    ['日期', '范围'],
  ),
  stable(
    '/date-time-picker',
    'DateTimePicker',
    '日期时间选择器',
    'form',
    '精确到秒的日期时间与范围选择。',
    ['日期', '时间'],
  ),
  stable(
    '/upload',
    'Upload',
    '上传',
    'form',
    '选择与拖拽、进度、请求接管及图片预览。',
    ['文件', '图片'],
  ),
  stable(
    '/descriptions',
    'Descriptions',
    '描述列表',
    'data',
    '响应式展示结构化标签和值。',
    ['详情'],
  ),
  stable(
    '/collapse',
    'Collapse',
    '折叠面板',
    'data',
    '展开和收起分组内容，支持懒渲染。',
    ['手风琴'],
  ),
  stable(
    '/vtable-grid',
    'VTableGrid',
    '数据表格',
    'data',
    '分页查询、选择、排序、编辑、汇总与导出。',
    ['表格', '数据'],
  ),
  stable(
    '/pagination',
    'Pagination',
    '分页',
    'data',
    '控制页码、每页数量与快速跳页。',
    ['页码'],
  ),
  stable(
    '/menu',
    'Menu',
    '菜单',
    'navigation',
    '纵向、横向、双栏、多级菜单与路由联动。',
    ['导航', '折叠'],
  ),
  stable(
    '/tabs',
    'Tabs',
    '标签页',
    'navigation',
    '切换同层级内容，支持守卫、增删和键盘操作。',
    ['页签'],
  ),
  stable(
    '/breadcrumb',
    'Breadcrumb',
    '面包屑',
    'navigation',
    '呈现页面层级与当前位置。',
    ['层级'],
  ),
  stable(
    '/steps',
    'Steps',
    '步骤条',
    'navigation',
    '呈现流程进度与每个步骤的状态。',
    ['流程'],
  ),
  stable('/tag', 'Tag', '标签', 'feedback', '分类、标记与可移除标签。', [
    '状态',
  ]),
  stable('/badge', 'Badge', '徽标', 'feedback', '数量提醒、状态点与角标。', [
    '数量',
  ]),
  stable(
    '/progress',
    'Progress',
    '进度条',
    'feedback',
    '完成率、任务状态和不确定进度。',
    ['进度'],
  ),
  stable(
    '/result',
    'Result',
    '结果',
    'feedback',
    '反馈完整任务的处理结果和后续动作。',
    ['成功', '失败'],
  ),
  stable(
    '/modal',
    'Modal',
    '弹窗',
    'overlay',
    '集中处理确认、表单和短流程任务。',
    ['对话框'],
  ),
  stable(
    '/drawer',
    'Drawer',
    '抽屉',
    'overlay',
    '在保留页面上下文时展示详情或编辑。',
    ['侧边'],
  ),
  stable(
    '/popover',
    'Popover',
    '弹出框',
    'overlay',
    '锚点浮层、多种触发方式与自动碰撞定位。',
    ['浮层'],
  ),
  stable(
    '/popconfirm',
    'Popconfirm',
    '气泡确认框',
    'overlay',
    '就地确认危险操作，支持异步确认。',
    ['确认'],
  ),
  stable(
    '/image',
    'Image',
    '图片',
    'media',
    '加载后备、适应方式和全屏图片预览。',
    ['预览'],
  ),
  stable('/avatar', 'Avatar', '头像', 'media', '图片、图标或文字后备头像。', [
    '用户',
  ]),
];
components.push(
  ...expansion.map((item) =>
    stable(
      '/' + item.id,
      item.name,
      item.title,
      item.group as ComponentGroupId,
      item.description,
    ),
  ),
);
const planned = (
  name: string,
  title: string,
  group: ComponentGroupId,
  phase: RoadmapPhaseId,
  description: string,
): PlannedComponent => ({ name, title, group, phase, description });
export const componentPlan: PlannedComponent[] = [
  planned(
    'Layout',
    '页面布局',
    'layout',
    'p0',
    '定义页面级容器、侧栏、主区和响应式结构。',
  ),
  planned('Row', '行', 'layout', 'p0', '提供基于栅格的横向排列和间距控制。'),
  planned('Col', '列', 'layout', 'p0', '提供响应式列宽、偏移和断点配置。'),
  planned('Space', '间距', 'layout', 'p0', '统一行内和块级子元素之间的间距。'),
  planned(
    'Divider',
    '分割线',
    'layout',
    'p0',
    '分隔内容区块并支持标题与方向。',
  ),
  planned(
    'Alert',
    '警告提示',
    'feedback',
    'p0',
    '展示页面内持续存在的语义提示信息。',
  ),
  planned(
    'Tooltip',
    '文字提示',
    'overlay',
    'p0',
    '为图标和截断内容提供短说明。',
  ),
  planned(
    'Dropdown',
    '下拉菜单',
    'navigation',
    'p0',
    '承载一组紧凑操作并支持键盘导航。',
  ),
  planned(
    'Empty',
    '空状态',
    'data',
    'p0',
    '为空数据提供说明、插图和下一步动作。',
  ),
  planned(
    'Skeleton',
    '骨架屏',
    'feedback',
    'p0',
    '在内容加载时保持布局稳定并降低等待感。',
  ),
  planned(
    'Cascader',
    '级联选择器',
    'form',
    'p1',
    '从关联的多级数据中逐级选择目标。',
  ),
  planned(
    'TreeSelect',
    '树选择',
    'form',
    'p1',
    '在下拉树中选择单个或多个节点。',
  ),
  planned(
    'TimePicker',
    '时间选择器',
    'form',
    'p1',
    '选择时间点或时间范围并控制精度。',
  ),
  planned(
    'ColorPicker',
    '颜色选择器',
    'form',
    'p1',
    '选择预设或自定义颜色和透明度。',
  ),
  planned('Rate', '评分', 'form', 'p1', '录入和展示离散等级评分。'),
  planned('Transfer', '穿梭框', 'form', 'p1', '在两个集合之间批量移动选项。'),
  planned(
    'Table',
    '基础表格',
    'data',
    'p1',
    '覆盖无需虚拟化和编辑能力的轻量表格。',
  ),
  planned('Tree', '树形控件', 'data', 'p1', '展示、选择和异步加载层级数据。'),
  planned('Timeline', '时间线', 'data', 'p1', '按时间顺序展示事件与状态变化。'),
  planned('Calendar', '日历', 'data', 'p1', '按月展示日期单元与业务日程。'),
  planned('Statistic', '统计数值', 'data', 'p1', '突出展示数值、趋势和单位。'),
  planned(
    'Anchor',
    '锚点',
    'navigation',
    'p2',
    '定位长页面章节并同步当前阅读位置。',
  ),
  planned('Affix', '固钉', 'layout', 'p2', '在滚动过程中固定操作区或导航。'),
  planned(
    'Backtop',
    '回到顶部',
    'navigation',
    'p2',
    '在长内容区域中快速回到顶部。',
  ),
  planned(
    'Carousel',
    '走马灯',
    'media',
    'p2',
    '轮播图片、宣传内容和关键推荐。',
  ),
  planned(
    'Tour',
    '漫游式引导',
    'overlay',
    'p2',
    '按步骤介绍页面中的关键功能。',
  ),
  planned(
    'Watermark',
    '水印',
    'media',
    'p2',
    '为敏感页面添加难以移除的背景标识。',
  ),
  planned(
    'QRCode',
    '二维码',
    'media',
    'p2',
    '从文本生成可配置且可下载的二维码。',
  ),
];
for (let i = componentPlan.length - 1; i >= 0; i--)
  if (components.some((component) => component.name === componentPlan[i].name))
    componentPlan.splice(i, 1);
export const roadmapPhases = [
  {
    id: 'p0' as const,
    title: 'P0 · 补齐通用底座',
    description: '优先解决布局、空状态和全局反馈，让业务页面组合闭环。',
  },
  {
    id: 'p1' as const,
    title: 'P1 · 深化业务录入',
    description: '扩展复杂选择与常用数据展示，覆盖中后台核心页面。',
  },
  {
    id: 'p2' as const,
    title: 'P2 · 丰富体验能力',
    description: '补充长页面导航、引导和媒体呈现。',
  },
];
export const foundations = [
  { id: 'theme', title: '主题', description: 'light / dark 与语义表面颜色。' },
  { id: 'density', title: '密度', description: 'mini 到 large 五档全局尺寸。' },
  {
    id: 'radius',
    title: '圆角',
    description: '由 borderRadius 建立统一形状基准。',
  },
  {
    id: 'status',
    title: '状态色',
    description: 'default、primary、success、warning、danger、info。',
  },
  {
    id: 'accessibility',
    title: '可访问性',
    description: '键盘、焦点、语义结构和辅助文本。',
  },
  {
    id: 'responsive',
    title: '响应式',
    description: '桌面、窄屏与移动端的自适应行为。',
  },
];
export const scenarios = [
  {
    id: 'form-entry',
    category: '录入',
    title: '表单录入',
    description: '从字段校验到提交反馈，构建一份可用的业务表单。',
    components: ['form', 'input', 'select', 'input-number', 'button'],
    points: [
      '用 Form 管理数据和校验，FormItem 的 prop 对应字段名。',
      '提交前调用 validate，校验通过后再处理业务数据。',
      '通过 Form 的 size 和 disabled 统一控制子字段。',
    ],
  },
  {
    id: 'query-filter',
    category: '查询',
    title: '查询筛选',
    description: '组合关键词、状态与日期范围，明确查询和重置行为。',
    components: ['input', 'select', 'date-picker', 'button'],
    points: [
      '区分正在编辑的筛选条件与已提交条件。',
      '空字符串、null 和空数组按各字段的值类型处理。',
      '查询条件变化后重置分页，避免落在不存在的页码上。',
    ],
  },
  {
    id: 'data-list',
    category: '数据',
    title: '数据列表',
    description: '让搜索、列表与分页协同工作，处理无结果状态。',
    components: ['vtable-grid', 'pagination', 'tag', 'input'],
    points: [
      '本地数据先筛选再分页；远程数据由服务端返回当前页与总数。',
      '切换每页数量时将页码重置为第一页。',
      '大量数据、排序、编辑和汇总请使用 VTableGrid。',
    ],
  },
  {
    id: 'overlay-edit',
    category: '编辑',
    title: '浮层编辑',
    description: '在抽屉中编辑草稿，保存或取消后回到原有上下文。',
    components: ['drawer', 'modal', 'form', 'input', 'button'],
    points: [
      '打开时复制草稿，避免输入直接改写已保存数据。',
      '保存通过后关闭，取消则丢弃草稿。',
      '需要阻止意外关闭时使用 beforeClose，并保留键盘退出路径。',
    ],
  },
  {
    id: 'status-flow',
    category: '反馈',
    title: '状态与流程',
    description: '用步骤、标签和提示反馈正在进行的业务操作。',
    components: ['steps', 'tag', 'badge', 'button'],
    points: [
      'Steps 的 active 从 0 开始，表示当前步骤。',
      '用文字补充颜色含义，确保状态不只靠颜色表达。',
      '处理进行中时禁用重复操作，完成后提供明确结果。',
    ],
  },
];
export const groups = componentGroups.map((group) => group.id);
export const guides = [
  { path: '/', title: '文档概览' },
  { path: '/getting-started', title: '快速开始' },
  { path: '/foundations', title: '设计基础' },
  { path: '/conventions', title: '通用约定' },
  { path: '/feedback', title: 'Feedback 命令式反馈 · zt-alert' },
  { path: '/components', title: '组件全景' },
  { path: '/scenarios', title: '场景方案' },
  { path: '/roadmap', title: '组件路线图' },
  { path: '/api', title: 'API 参考' },
];
export function groupOf(id: ComponentGroupId) {
  return componentGroups.find((group) => group.id === id)!;
}
