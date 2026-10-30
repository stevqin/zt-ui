const slots = {
  ZtAffix: { default: '需要吸附在滚动容器指定位置的元素；fixed 表示当前是否已进入固定状态。' },
  ZtAlert: { icon: '提示框左侧的状态图标，替换默认状态符号。', title: '提示框标题，替换 title 文字。', default: '提示框标题下方的详细说明，替换 description 文字。' },
  ZtAnchor: { link: '锚点链接的显示内容；link 为当前链接配置，active 表示该链接是否对应当前滚动位置。' },
  ZtAside: { default: '布局侧栏区域，用于导航菜单或辅助面板。' },
  ZtFooter: { default: '布局底部区域，用于页脚信息或底部操作。' },
  ZtHeader: { default: '布局顶部区域，用于标题、导航或顶栏操作。' },
  ZtLayout: { default: '按布局方向排列的 Header、Aside、Main、Footer 或嵌套 Layout。' },
  ZtMain: { default: '布局中的主要业务内容区域。' },
  ZtAutocomplete: { option: '下拉建议项的显示内容；option 为当前建议项，包含 value、可选 label 和 disabled。' },
  ZtAvatar: { default: '未设置图片或图片加载失败时显示的头像内容，优先于 icon 和姓名首字显示。' },
  ZtBacktop: { default: '返回顶部按钮中的图标或文字，替换默认向上箭头。' },
  ZtBadge: { default: '被徽标标注的目标元素，如按钮或头像；徽标叠加在该元素旁。' },
  ZtBreadcrumb: { default: '按层级顺序排列的 ZtBreadcrumbItem 导航项。' },
  ZtBreadcrumbItem: { separator: '当前导航项前的分隔符，替换面包屑配置的 separator。', default: '当前层级的链接文字或当前页名称。' },
  ZtButton: { default: '按钮的文字或图标；加载时由加载指示和加载文字替代。' },
  ZtCalendar: { header: '日历顶部导航区；date 为面板日期字符串，view 为月或周视图，navigate(direction) 按方向切换面板。', 'date-cell': '单个日期格的显示内容；date 为日期对象，day 为日期字符串，selected、currentMonth、disabled 分别表示选中、本月和禁用状态，holiday 为节假日名称。' },
  ZtCard: { header: '卡片顶部标题，替换 title 文字。', extra: '卡片标题行右侧的附加操作区域。', default: '卡片主体内容；loading 时主体显示骨架屏。', footer: '卡片主体下方的页脚或操作区域。' },
  ZtCarousel: { default: '依次轮播的幻灯片节点，片段展开后的每个有效子节点作为一个轮播项。' },
  ZtCascader: { default: '级联面板中节点的标签；node 为当前层级的树节点。' },
  ZtCheckbox: { default: '复选框右侧的选项标签，替换 label 文字。' },
  ZtCheckboxGroup: { default: '共享复选值数组的 ZtCheckbox 选项。' },
  ZtCol: { default: '当前栅格列内的内容。' },
  ZtCollapse: { default: '组成折叠面板组的 ZtCollapseItem 节点。' },
  ZtCollapseItem: { title: '折叠项头部按钮的标题，替换 title 文字。', default: '折叠项展开后展示的面板正文。' },
  ZtConfigProvider: { default: '接收主题、尺寸及全局配置的后代组件。' },
  ZtDescriptions: { title: '描述列表顶部标题，替换 title 文字。', extra: '描述列表标题行右侧的操作区域。', default: '组成描述列表的 ZtDescriptionsItem 字段。' },
  ZtDescriptionsItem: { label: '描述项的字段名称，替换 label 文字。', default: '描述项的字段值。' },
  ZtDivider: { default: '显示在分割线中的文字或节点。' },
  ZtDropdown: { default: '触发下拉菜单的元素。', dropdown: '完整的下拉菜单面板；提供时替换由 items 生成的菜单。', item: '由 items 生成的单个菜单项内容；item 为当前菜单项配置。' },
  ZtDropdownItem: { default: '下拉菜单项的文字或节点，替换 label。' },
  ZtEmpty: { image: '空状态顶部的插图，替换默认插图。', description: '空状态的说明文字，替换 description。', default: '空状态说明下方的操作区，如新建或重试按钮。' },
  ZtForm: { default: '参与表单布局、数据绑定和校验的表单项及操作按钮。' },
  ZtFormGroup: { title: '表单分组的图例标题，替换 title。', description: '分组标题下方的说明，替换 description。', default: '该分组内的表单项。' },
  ZtFormItem: { label: '表单项的标签区域；label 为当前标签文字。', default: '表单字段的输入控件，继承该表单项的禁用、尺寸和校验上下文。' },
  ZtIcon: { default: '图标容器内的图形节点，替换由 name 或 component 解析的图标。' },
  ZtImage: { placeholder: '图片加载过程中显示的占位内容。', error: '图片加载失败后显示的替代内容。' },
  ZtInfiniteScroll: { default: '随分页加载不断追加的列表或业务内容。', error: '加载失败时显示的提示和操作；retry 为重新发起加载的异步函数。', loading: '正在加载下一批数据时显示的提示。', finished: '所有数据加载完成后显示的结束提示。' },
  ZtInputTag: { tag: '已输入标签的显示内容；value 为标签值，index 为标签在数组中的位置。' },
  ZtLink: { icon: '链接文字前的图标，替换 icon 配置。', default: '链接的主体文字。', suffix: '链接文字后的图标或节点，替换 suffixIcon 配置。' },
  ZtLoading: { default: '被加载遮罩覆盖的业务内容。', indicator: '加载遮罩中的指示图形，替换默认旋转图标。' },
  ZtMention: { option: '提及候选项的显示内容；option 为当前候选项，包含 value、可选 label 和 disabled。' },
  ZtPageHeader: { breadcrumb: '页头顶部的面包屑导航区域。', 'back-icon': '返回按钮内的图标，替换默认向左箭头。', title: '页头主标题，替换 title。', description: '主标题下方的说明文字，替换 description。', extra: '页头标题行右侧的附加操作。', default: '页头标题区下方的补充内容。' },
  ZtPagination: { default: '分页布局中 slot 标记所在位置的附加内容；需在 layout 中包含 slot。' },
  ZtPopconfirm: { default: '点击后打开确认气泡的触发元素。' },
  ZtPopover: { default: '触发浮层的参考元素，同时作为浮层定位锚点。', content: '浮层面板内的正文或交互内容。' },
  ZtProgress: { default: '进度条的文字显示区；percentage 为限制在 0 至 100 范围内的当前进度值。' },
  ZtRadio: { default: '单选按钮旁的选项标签，替换 label。' },
  ZtRadioGroup: { default: '共享同一选中值的 ZtRadio 选项。' },
  ZtRate: { icon: '每个评分单位的图形，同时用于未选中底层和选中覆盖层；index 从 1 开始。' },
  ZtResult: { icon: '结果页顶部的状态图标。', title: '结果页主标题，替换 title。', 'sub-title': '结果页的补充说明，替换 subTitle。', extra: '结果说明下方的操作区域。' },
  ZtRow: { default: '当前栅格行内的 ZtCol 列。' },
  ZtScrollbar: { default: '滚动容器内的内容，由自定义或原生滚动条控制滚动。' },
  ZtSelect: { prefix: '选择框内部、已选值前的前缀区域。', tag: '多选模式下的已选标签；option 为选项，remove() 移除该选项。', selected: '单选模式下选择框中的已选值；option 为当前选项。', loading: '下拉选项加载时显示的提示。', option: '下拉选项的显示内容；option 为选项，selected 和 disabled 为当前选中及禁用状态。', empty: '下拉列表无可显示选项时的提示。', footer: '下拉面板底部的附加操作区域。' },
  ZtSelectBox: { option: '选择面板内选项的显示内容；option 为选项，selected 表示已选，disabled 表示当前不可选。' },
  ZtSkeleton: { template: '加载期间呈现的骨架结构，替换默认骨架行。', default: '加载结束后展示的实际内容。' },
  ZtSkeletonItem: { default: '骨架占位块内部的节点，可用于组合占位结构。' },
  ZtSpace: { default: '按方向与间距排列的子元素。', separator: '相邻子元素之间的分隔节点。' },
  ZtSplitter: { first: '分隔条前的面板；水平布局位于左侧，垂直布局位于上方。', second: '分隔条后的面板；水平布局位于右侧，垂直布局位于下方。' },
  ZtStatistic: { title: '统计数值上方的标题，替换 title。', prefix: '统计数值前的符号或节点，替换 prefix。', suffix: '统计数值后的单位或节点，替换 suffix。' },
  ZtStep: { icon: '步骤圆点内的图标，替换默认序号或状态图标。', title: '步骤标题，替换 title。', description: '步骤标题下方的说明，替换 description。' },
  ZtSteps: { default: '按流程顺序排列的 ZtStep 节点。' },
  ZtTable: { '[name: string]': '动态具名单元格或表头插槽：header-字段名接收 column；列的 slot 名（省略时为字段名）接收 row、column、index、value；expand 接收 row、index；empty 用于空数据提示。' },
  ZtTabPane: { default: '该标签页激活时展示的面板正文；lazy 模式在首次激活后才挂载。' },
  ZtTabs: { default: '标签页容器中的 ZtTabPane 节点，自动生成对应导航标签。' },
  ZtTag: { default: '标签的文字或图标内容。' },
  ZtText: { default: '按指定标签、语义状态和排版样式呈现的文本。' },
  ZtTooltip: { default: '触发文字提示的元素，同时作为提示定位锚点。', content: '提示浮层中的文字或节点，替换 content。' },
  ZtTour: { default: '当前引导步骤的说明正文；step 为步骤配置，index 为从 0 开始的步骤索引。' },
  ZtTransfer: { default: '左右穿梭面板中每个选项的标签；option 为当前选项。', 'left-footer': '左侧待选面板底部的操作区；checked 为左侧当前勾选项的键数组。', 'right-footer': '右侧已选面板底部的操作区；checked 为右侧当前勾选项的键数组。' },
  ZtTree: { 'expand-icon': '树节点的展开按钮图标；node 为节点，expanded、loading、disabled 分别为展开、异步加载和禁用状态。', default: '树节点标签；node 为节点，checked、expanded、disabled、checkable 分别为勾选、展开、禁用及是否显示复选框的状态。' },
  ZtTreeSelect: { default: '下拉树节点的标签，透传 ZtTree 的 node、checked、expanded、disabled 和 checkable 作用域。' },
  ZtTypography: { default: '应用标题或段落排版的正文；未提供时显示 text。' },
  ZtUpload: { trigger: '替换完整的文件选择触发区；open() 打开系统文件选择器，disabled 表示当前禁止选择。', default: '默认文件选择按钮中的文字，替换“选择文件”等默认提示。', tip: '文件选择区下方的格式、大小等说明。', file: '文件列表中的单条文件记录；file 为文件状态，remove、abort、retry、preview 分别操作当前文件的移除、中止、重试与预览。' },
  ZtVTableGrid: { 'pager-right': '分页栏右侧的附加内容；total 为数据总数，selectedRows 和 selectedCount 为已选行及其数量。', actions: '行操作单元格的 Canvas 内容；作用域包含当前 row/record、rowIndex、列位置、单元格尺寸及忙碌状态。', empty: '表格没有数据时覆盖在表体中的空状态提示。', 'pager-left': '分页栏左侧的统计或操作区；total 为数据总数，selectedRows 和 selectedCount 为已选行及其数量。', 'edit-actions': '存在未保存修改时显示的编辑操作区；changes 为修改汇总，saving 为保存状态，save() 提交修改，cancel() 撤销修改。' },
  ZtWatermark: { default: '需要覆盖水印的业务内容，水印层叠加在该区域之上。' },
};

const inputSlots = { prepend: '输入框外部左侧的附加区域，如协议选择或标签。', prefix: '输入框内部、输入文字之前的前缀区域。', suffix: '输入框内部、输入文字之后的后缀区域。', append: '输入框外部右侧的附加区域，如搜索按钮。' };
slots.ZtInput = inputSlots;
slots.ZtPassword = inputSlots;
for (const [component, label] of [['ZtModal', '对话框'], ['ZtDrawer', '抽屉']]) {
  const controls = component === 'ZtModal' ? 'close(reason?) 请求关闭，confirm() 触发确认，cancel() 请求取消关闭，toggleFullscreen() 切换全屏。' : 'close(reason?) 请求关闭，confirm() 触发确认，cancel() 请求取消关闭。';
  slots[component] = {
    title: `${label}头部标题，替换 title；${component === 'ZtModal' ? 'close(reason?) 请求关闭。' : controls}`,
    'header-actions': `${label}头部的附加按钮区；${controls}`,
    content: `${label}的完整正文区域，提供后替代默认正文包装及默认插槽；${controls}`,
    default: `${label}默认正文容器内的业务内容；${controls}`,
    footer: `${label}底部操作区，替换默认确认和取消按钮；${controls}`,
  };
}

const exposes = {
  ZtAffix: { update: '重新计算吸附位置和固定状态；内容尺寸或容器布局变化后可手动调用。' },
  ZtAutocomplete: { focus: '使建议输入框获得焦点。', blur: '使建议输入框失去焦点。', close: '关闭建议下拉面板。' },
  ZtCarousel: { prev: '切换至上一张幻灯片，并遵循 loop 循环设置。', next: '切换至下一张幻灯片，并遵循 loop 循环设置。', goTo: '切换至 index 指定的幻灯片，索引从 0 开始。' },
  ZtColorPicker: { open: '打开颜色选择浮层；禁用或只读时不打开。', close: '关闭颜色选择浮层。', focus: '使颜色选择触发按钮获得焦点。' },
  ZtColorPickerPanel: { confirm: '提交当前有效颜色并触发 confirm；禁用或颜色格式错误时不提交。', cancel: '将面板编辑值恢复为 modelValue，并触发 cancel。' },
  ZtForm: { validate: '校验全部已注册字段；通过时 Promise 解析为 true，失败时以字段名到错误消息数组的映射拒绝。', validateField: '校验 props 指定的一个或多个字段；通过时解析为 true，失败时以字段错误映射拒绝。', resetFields: '将指定字段恢复为挂载时的初始值并清除校验状态；省略 props 时重置全部字段。', clearValidate: '清除指定字段的校验状态和错误消息；省略 props 时清除全部字段，不修改字段值。', scrollToField: '平滑滚动至 prop 对应的第一个表单项，使其居中显示。' },
  ZtFormItem: { validate: '校验当前字段；trigger 可限定匹配该触发方式的规则，Promise 返回是否通过。', resetField: '恢复当前字段的初始值，同时清除校验状态和错误消息。', clearValidate: '清除当前字段的校验状态和错误消息，不修改字段值。', validateState: '当前字段校验状态：空字符串表示未校验，validating、success、error 分别表示校验中、通过和失败。', validateMessage: '当前字段的校验错误消息；无错误或清除校验后为空字符串。' },
  ZtInfiniteScroll: { check: '检查内容底部是否接近滚动视口，满足条件时异步加载；加载中、禁用、已完成或失败待重试时跳过。', retry: '清除失败状态并重新异步加载，跳过距离阈值检查；加载中、禁用或已完成时仍跳过。' },
  ZtInput: { focus: '使原生输入框获得焦点，可通过 options 传入浏览器 FocusOptions。', blur: '使原生输入框失去焦点。', select: '选中原生输入框中的全部文本。', clear: '在允许清空时将值设为空字符串，触发输入和清空事件；Promise 在下一次渲染并重新聚焦后完成。', input: '底层原生 HTMLInputElement；挂载前可能为 undefined。' },
  ZtInputOtp: { focus: '聚焦验证码输入框并选中 index 对应的字符；索引从 0 开始，省略时定位到已输入内容末尾。', blur: '使验证码的原生输入框失去焦点。', clear: '清空验证码并触发 clear，下一次渲染后将输入位置移至首格；禁用或只读时跳过。', input: '承载验证码输入、自动填充和文本选择的原生 HTMLInputElement。' },
  ZtMention: { focus: '使提及文本输入框获得焦点。', blur: '使提及文本输入框失去焦点。' },
  ZtPopover: { show: '立即请求显示浮层；禁用时不显示。', hide: '立即隐藏浮层并关闭子浮层。', toggle: '切换浮层的显示与隐藏状态。', updatePosition: '根据参考元素和浮层当前尺寸重新计算位置。' },
  ZtScrollbar: { wrapRef: '实际承载滚动的容器元素，可读取滚动尺寸；挂载前为 undefined。', update: '根据当前容器和内容尺寸重新计算滚动条滑块。', scrollTo: '滚动至指定位置；可传 ScrollToOptions，或传入横向坐标 options 和纵向坐标 y。', setScrollTop: '将容器纵向滚动位置设置为 value 像素。', setScrollLeft: '将容器横向滚动位置设置为 value 像素。' },
  ZtUpload: { submit: '等待文件检查队列完成后上传全部 ready 文件，Promise 在这些上传任务结束后完成；上传失败通过 error 事件通知。', abort: '中止 file 指定的上传；省略 file 时中止全部进行中的上传，并将状态恢复为 ready。', retry: '重新上传指定 file，Promise 在该次任务结束后完成；失败通过 error 事件通知。', remove: '异步执行 beforeRemove，允许后中止上传并移除指定 file；返回 false 或拒绝时保留文件。', clearFiles: '中止全部上传、释放预览资源并清空文件列表；禁用时跳过。', open: '打开系统文件选择器；禁用或正在检查文件时跳过。' },
  ZtVTableGrid: { isSaving: '是否正在结束单元格编辑、准备保存或执行批量保存，用于判断当前是否处于保存流程。', hasChanges: '是否存在尚未保存的行修改。', tableInstance: '底层 VTable ListTable 实例；创建前或释放后可能为 null。', formRef: '默认查询表单的 ZtForm 实例；未渲染默认表单时为 null。', getEditChanges: '返回当前修改汇总，包含变更行、单元格及其数量；与 getChanges 相同。', getColumnSettings: '返回当前列顺序、可见列及隐藏列的键配置。', resetColumnSettings: '将列设置恢复为初始配置，刷新表头及数据并触发 column-settings-change。', refreshRecords: '保持当前页码重新查询并刷新记录；内部异步执行，方法本身不返回等待句柄。', query: '按当前表单、排序和分页查询数据；resetPage 为 true 时先回到第一页，Promise 在查询及数据应用后完成，失败触发 error。', reload: '保持当前页码重新执行查询；Promise 在查询及数据应用后完成，失败触发 error。', resize: '根据当前可见表体容器尺寸重新调整底层表格布局。', setRecords: '直接替换当前表格数据及总数；省略 total 时使用 records.length。', getTableInstance: '返回底层 VTable ListTable 实例；尚未创建时返回 null。', getSelectedRows: '返回当前选择集合中保存的行记录。', getSelectedKeys: '返回当前选中行的键数组，包括配置为跨页保留的选择。', setSelectedKeys: '按 keys 更新选择集合，剔除不允许勾选的已知行，同步表格并触发 selection-change。', clearSelection: '清空全部选中行及保留的选择，同步表格并触发 selection-change。', getChanges: '返回当前未保存修改的汇总，包括变更行和单元格数量。', saveChanges: '结束当前单元格编辑，执行 beforeSave、保存确认和 batchSave；成功后清除修改，失败触发 save-error 并拒绝 Promise。', cancelChanges: '撤销未保存修改，恢复编辑前或 originalRecords 的数据，并触发 cancel-edit。', exportCsv: '按当前可见列及列顺序导出已展示记录，触发 export 并返回 CSV 字符串；浏览器中以 filename 下载，默认为 data.csv。' },
};

for (const component of ['ZtPassword', 'ZtInputNumber']) {
  exposes[component] = {
    focus: '使内部输入框获得焦点，options 透传给原生 focus。',
    blur: '使内部输入框失去焦点。',
    select: '选中内部输入框的全部文本。',
    ...(component === 'ZtPassword' ? { clear: '调用内部输入框的清空操作并重新聚焦；组件未挂载时返回 undefined，否则返回完成渲染后的 Promise。' } : {}),
  };
}
for (const [component, label] of [['ZtDatePicker', '日期'], ['ZtDateTimePicker', '日期时间'], ['ZtTimePicker', '时间'], ['ZtSelect', '选项'], ['ZtSelectBox', '多选']]) {
  exposes[component] = {
    focus: `使${label}输入框或触发元素获得焦点${component === 'ZtTimePicker' ? '。' : '；options 透传给原生 focus。'}`,
    blur: `使${label}输入框失去焦点并关闭选择面板。`,
    open: `打开${label}选择面板；禁用或只读时不打开。`,
    close: `关闭${label}选择面板。`,
    clear: `清空当前${label}值并触发值更新、change 和 clear 事件；禁用或只读时跳过。`,
  };
}
for (const component of ['ZtSelect', 'ZtSelectBox']) exposes[component].clear = '清空选择并触发值更新、change 和 clear 事件；需启用 clearable、已有选择，且未禁用或只读。';
exposes.ZtSelectBox.blur = '使多选触发元素失去焦点。';
exposes.ZtTimeSelect = { focus: '使时间段选择框获得焦点。', blur: '使时间段选择框失去焦点并关闭下拉列表。', open: '打开可选时间段列表。', close: '关闭可选时间段列表。' };
for (const [component, label] of [['ZtModal', '对话框'], ['ZtDrawer', '抽屉']]) {
  exposes[component] = {
    open: `打开${label}并同步 modelValue。`,
    close: `按 reason 请求关闭${label}并执行 beforeClose，reason 默认为 api；Promise 返回是否关闭，拦截或异常时返回 false。`,
    focus: `将键盘焦点移入${label}面板。`,
    ...(component === 'ZtModal' ? { resetPosition: '清除拖拽位移，将对话框恢复到初始布局位置。', toggleFullscreen: '切换对话框全屏状态并同步 fullscreen。' } : {}),
  };
}

export function slotDescription(component, name, type) {
  return slots[component]?.[name];
}

export function exposeDescription(component, name, type) {
  return exposes[component]?.[name];
}
