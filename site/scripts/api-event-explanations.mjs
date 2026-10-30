const descriptions = new Map()
const add = (component, events) => {
  for (const [name, description] of Object.entries(events)) descriptions.set(`${component}.${name}`, description)
}
const valueEvents = (component, description) => add(component, { 'update:modelValue': description, change: description })

add('ZtAffix', { change: '吸顶状态发生变化时触发；fixed 为 true 表示已固定，false 表示恢复原位置。' })
add('ZtAlert', { close: '关闭当前可见的提示后触发，不携带参数。', 'update:modelValue': '执行关闭操作时触发，值为 false，用于同步提示的显示状态。' })
add('ZtAnchor', { select: '点击并定位到锚点链接时触发，返回该链接的 href。', change: '点击链接或滚动侦测使当前活动锚点改变时触发，返回新活动链接的 href。' })
add('ZtAutocomplete', {
  'update:modelValue': '输入、清空文本或选中建议项时触发，返回输入框文本；选中建议时为该项的 value。',
  input: '输入框输入或清空文本时触发，返回当前文本，同时更新建议搜索；选中建议项不触发此事件。',
  change: '原生输入框提交 change、选中建议或清空时触发，返回提交后的文本。',
  select: '选中可用的建议项后触发，返回完整的建议项对象。',
  clear: '通过输入框清除操作清空文本并关闭建议面板后触发。',
})
for (const component of ['ZtAvatar', 'ZtImage']) add(component, {
  load: `${component === 'ZtAvatar' ? '头像' : '图片'}加载成功时触发，返回原生图片 load 事件。`,
  error: `${component === 'ZtAvatar' ? '头像' : '图片'}加载失败并切换到回退内容时触发，返回原生图片 error 事件。`,
})
add('ZtBacktop', { click: '点击返回顶部按钮并发起目标容器滚动到顶部后触发，返回原始鼠标事件。' })
add('ZtButton', { click: '按钮可用时点击触发，返回原始鼠标事件；禁用或加载状态下不触发。' })
add('ZtCalendar', {
  'update:modelValue': '选择可用日期时触发，返回 YYYY-MM-DD 格式的选中日期。',
  change: '选择可用日期时触发，依次返回 YYYY-MM-DD 日期字符串和对应的 Date 对象。',
  'update:view': '切换月视图或周视图时触发，返回 month 或 week。',
  'panel-change': '通过导航切换日期面板或切换月／周视图时触发，返回面板锚定日期字符串及当前视图。',
})
valueEvents('ZtCarousel', '通过自动播放、切换按钮、指示器或切换方法改变轮播项时触发，返回从 0 开始的新索引。')
valueEvents('ZtCascader', '选择或清空级联选项时触发；单选返回从根节点到所选节点的完整 key 路径，多选返回路径数组；清空分别为 null 或 []。')
add('ZtCascader', { clear: '点击清除按钮并将级联选中值置为 null（多选为 []）后触发。', 'load-error': '懒加载子节点失败时触发，依次返回错误对象和加载失败的节点。', 'visible-change': '级联选择面板展开或收起时触发，返回是否可见。' })
valueEvents('ZtCheckbox', '独立使用的复选框切换勾选状态时触发，返回是否勾选；处于 CheckboxGroup 内时由组统一更新。')
valueEvents('ZtCheckboxGroup', '组内复选项在数量限制允许的范围内切换勾选时触发，返回全部已勾选项的 value 数组。')
valueEvents('ZtCollapse', '切换折叠项时触发；手风琴模式返回展开项名称或 null，普通模式返回全部展开项名称数组。')
for (const component of ['ZtColorPicker', 'ZtColorPickerPanel']) {
  valueEvents(component, '确认颜色或执行清除时触发，返回提交的 HEX 颜色字符串（启用透明度时包含 Alpha）；清除时为空字符串。')
  add(component, {
    confirm: '点击确定且颜色校验通过时触发，返回提交的 HEX 颜色字符串。',
    cancel: component === 'ZtColorPicker' ? '点击取消，丢弃颜色草稿并关闭颜色面板后触发。' : '点击取消并将颜色草稿恢复为 modelValue 后触发。',
    clear: '点击清除并提交空颜色字符串后触发。',
  })
}
add('ZtColorPicker', { 'visible-change': '颜色选择浮层展开或关闭时触发，返回是否可见。' })
valueEvents('ZtDatePicker', '选定日期／月份／年份、完成范围选择或使用快捷项时提交所选值；返回相应格式的字符串或范围数组，清除时为 null。')
valueEvents('ZtDatePickerPanel', '选定日期／月份／年份、完成范围选择或使用快捷项时触发，返回相应格式的日期字符串或起止日期数组。')
valueEvents('ZtDateTimePicker', '确认日期时间选择或清除时触发，返回日期时间字符串或起止日期时间数组；清除时为 null。')
for (const component of ['ZtDatePicker', 'ZtDateTimePicker']) add(component, {
  clear: '点击清除按钮并提交 null 后触发，同时关闭选择面板。',
  'visible-change': '日期选择面板展开或关闭时触发，返回是否可见。',
  focus: '日期输入框获得焦点时触发，返回原生 FocusEvent。',
  blur: '焦点离开日期选择器及其面板并关闭面板时触发，返回原生 FocusEvent。',
})
for (const [component, label] of [['ZtDrawer', '抽屉'], ['ZtModal', '对话框']]) add(component, {
  'update:modelValue': `关闭请求通过 beforeClose 检查后触发，返回 false，用于同步${label}的显示状态。`,
  open: `${label}开始显示、注册浮层并绑定键盘监听时触发。`,
  opened: `${label}进入过渡完成后触发。`,
  show: `${label}进入过渡完成时触发，为 opened 的别名。`,
  hide: `${label}离开过渡完成时触发，为 closed 的别名。`,
  close: `关闭请求通过检查并更新显示状态后触发，返回关闭原因（如关闭按钮、遮罩、Escape、取消或 API 关闭）。`,
  closed: `${label}离开过渡结束并释放浮层资源后触发，返回本次关闭原因。`,
  cancel: '以 cancel 原因关闭且关闭检查通过时触发。',
  confirm: '点击确定或调用 confirm 方法，且未处于忙碌状态、确定按钮未禁用时触发；由调用方处理提交和关闭。',
  'close-error': 'beforeClose 执行抛错或返回的 Promise 被拒绝时触发，返回错误对象并保留打开状态。',
})
add('ZtModal', { 'update:fullscreen': '切换全屏按钮或调用全屏切换方法时触发，返回新的全屏状态。', 'fullscreen-change': '全屏状态通过切换操作改变时触发，返回是否全屏。' })
add('ZtDropdown', { command: '点击或键盘选中可用菜单项时触发，依次返回该项的 key 和完整菜单项对象。', 'visible-change': '下拉菜单实际展开或关闭时触发，返回是否可见。' })
add('ZtForm', { validate: '表单项完成一次校验时触发，依次返回字段路径、是否校验通过及校验消息。' })
add('ZtImage', { show: '点击可预览的图片并打开预览器时触发。', switch: '预览器切换图片后触发，返回从 0 开始的新图片索引。', close: '关闭图片预览器时触发，并将焦点恢复到图片容器。' })
add('ZtImageViewer', { switch: '通过预览器上一张／下一张操作切换到不同图片时触发，返回从 0 开始的新索引。', close: '处于顶层的预览器执行关闭操作时触发。' })
add('ZtInfiniteScroll', { load: '满足触底距离或触发重试并开始一轮加载时触发，随后调用 load 回调。', error: 'load 回调抛错或返回的 Promise 被拒绝且请求未中止时触发，返回错误对象。' })
for (const [component, label] of [['ZtInput', '文本'], ['ZtPassword', '密码']]) add(component, {
  'update:modelValue': `输入或清空时触发，返回当前${label}字符串。`,
  input: `原生输入或清除操作时触发，返回当前${label}字符串；清除时为空字符串。`,
  change: `原生输入框触发 change 或执行清除时触发，返回提交的${label}字符串。`,
  focus: `${label}输入框获得焦点时触发，返回原生 FocusEvent。`,
  blur: `${label}输入框失去焦点时触发，返回原生 FocusEvent。`,
  clear: `通过清除按钮清空${label}并发送空字符串更新后触发。`,
})
add('ZtPassword', { 'visibility-change': '点击密码可见性按钮切换显示方式时触发，返回是否以明文显示。' })
add('ZtInputNumber', {
  'update:modelValue': '输入可解析的有限数字、清空或通过步进操作更新数值时触发，返回数字或 null；提交时会应用范围与精度约束。',
  input: '输入有效数字、清空或步进调整时触发，返回当前数字或 null；提交归一化产生不同数值时也会触发。',
  change: '原生输入框触发 change 完成提交，或执行步进调整时触发，依次返回处理后的数值及原 modelValue；空输入返回 null。',
  focus: '数字输入框获得焦点时触发，返回原生 FocusEvent。', blur: '数字输入框失去焦点时触发，返回原生 FocusEvent。',
})
add('ZtInputOtp', {
  'update:modelValue': '输入、粘贴、删除或清空使验证码改变时触发，返回按字符规则过滤并截断到 length 的完整字符串。',
  input: '验证码内容实际改变时触发，返回规范化后的完整验证码字符串。',
  change: '验证码内容实际改变时立即触发，返回规范化后的字符串；无需等待失焦。',
  complete: '验证码改变后字符数恰好达到 length 时触发，返回完整验证码字符串。',
  focus: '验证码原生输入框获得焦点时触发，返回 FocusEvent。', blur: '验证码原生输入框失去焦点时触发，返回 FocusEvent。', clear: '调用 clear 方法清空验证码后触发，并将输入焦点移到首格。',
})
valueEvents('ZtInputTag', '确认添加标签、移除标签或清空时触发，返回更新后的全部标签字符串数组。')
add('ZtInputTag', { remove: '移除单个标签后触发，依次返回被移除的文本及其在原数组中的索引。', clear: '执行清空操作，将标签数组和输入草稿清空后触发。' })
add('ZtLink', { click: '点击可用链接时触发，返回原始鼠标事件；配置 to 和路由器时同时发起路由跳转。' })
valueEvents('ZtMention', '编辑提及文本、选择候选项插入提及内容或清空时触发，返回完整文本。')
add('ZtMention', { select: '选中候选并将提及内容插入文本后触发，依次返回候选项对象和匹配的前缀字符。', clear: '清空完整文本并关闭提及候选面板后触发。' })
add('ZtMenu', {
  'update:modelValue': '选择叶子菜单或路由同步改变选中项时触发，返回选中菜单项的 key。',
  select: '选择可用叶子菜单时触发，依次返回 key、完整菜单项及鼠标事件；路由模式在导航前触发，可通过 preventDefault 阻止导航。',
  'route-error': '路由模式缺少路由器或路由跳转失败时触发，依次返回错误对象和目标菜单项。',
  'update:expandedKeys': '展开或收起子菜单时触发，返回全部展开子菜单的 key 数组。',
  'expand-change': '用户操作改变子菜单展开状态时触发，返回更新后的展开 key 数组。',
  'update:collapsed': '通过折叠操作收起或展开侧栏时触发，返回折叠状态。',
  'collapse-change': '侧栏执行折叠切换后触发，返回是否折叠。',
  'update:width': '拖动或键盘调整菜单宽度时触发，返回受 minWidth／maxWidth 限制后的宽度值（像素）。',
  resize: '调整菜单宽度时触发，返回新的菜单 width 值（像素）。',
  'update:activeKey': '选择双栏菜单主分类或根据选中叶子／路由同步主分类时触发，返回主分类 key。',
  'active-change': '选择双栏菜单的可用主分类时触发，返回该分类的 key。',
})
add('ZtPageHeader', { back: '点击页头返回按钮时触发，返回原始鼠标事件；由调用方处理返回行为。' })
add('ZtPagination', {
  'update:currentPage': '翻页、跳页或总页数缩小导致当前页被修正时触发，返回从 1 开始的页码；修改每页条数导致越界时也会修正。',
  'update:pageSize': '选择不同的每页条数时触发，返回新的每页条数。',
  'current-change': '当前页因翻页、跳页或越界修正而改变时触发，返回新页码。',
  'size-change': '每页条数实际改变时触发，返回新条数。',
  change: '页码或每页条数改变时触发，依次返回更新后的页码和每页条数。',
  'prev-click': '点击可用的上一页按钮并发起翻页后触发，返回目标页码。',
  'next-click': '点击可用的下一页按钮并发起翻页后触发，返回目标页码。',
})
add('ZtPopconfirm', {
  'update:visible': '确认浮层通过触发器或确认／取消操作改变可见状态时触发，返回是否显示。',
  confirm: '点击确定且 beforeConfirm 检查通过时触发；hideAfterConfirm 控制之后是否关闭浮层。',
  cancel: '点击取消或在未确认、未忙碌时通过外部操作关闭浮层时触发。',
  'confirm-error': 'beforeConfirm 抛错或返回的 Promise 被拒绝时触发，返回错误对象。',
})
add('ZtPopover', {
  'update:visible': '浮层实际展开或收起时触发，返回新的可见状态。',
  'before-enter': '浮层即将从关闭状态切换为打开状态时触发。',
  'after-enter': '浮层内容完成下一轮渲染、尺寸观察和位置计算后触发。',
  'before-leave': '浮层即将关闭、关闭子浮层之前触发。',
  'after-leave': '浮层关闭并移除外部监听后触发。',
})
add('ZtQRCode', { error: '二维码编码、绘制或下载处理失败时触发，返回错误对象。', download: '生成下载内容并触发浏览器下载后触发，返回实际使用的文件名。' })
valueEvents('ZtRadio', '独立使用的单选框选中时触发，返回该项的 label；位于 RadioGroup 内时由组统一更新。')
valueEvents('ZtRadioGroup', '组内可用单选项被选中时触发，返回所选项的 label。')
valueEvents('ZtRate', '鼠标或键盘改变评分时触发，返回新的分数；启用 clearable 后再次点击当前评分可返回 0。')
add('ZtScrollbar', { scroll: '内部滚动容器滚动时触发，返回当前 scrollTop 和 scrollLeft（像素）。' })
valueEvents('ZtSegmented', '点击或键盘选择不同的可用分段选项时触发，返回新选项的 value。')
valueEvents('ZtSelect', '选择选项、移除已选标签或清空时触发；单选返回选项 value 或 null，多选返回已选 value 数组。')
add('ZtSelect', {
  'visible-change': '选择下拉面板实际展开或收起时触发，返回是否可见。',
  search: '搜索输入改变时触发，返回搜索关键字；远程模式随后按防抖配置请求选项。',
  clear: '执行清除操作后触发；单选值置为 null，多选置为 []，同时重置搜索文本。',
  'remove-tag': '移除多选标签时触发，返回被移除选项的 value。',
  'remote-error': '远程搜索请求失败时触发，返回请求失败原因。',
  focus: '选择器的输入／组合框获得焦点时触发，返回 FocusEvent。',
  blur: '焦点离开选择器及其下拉面板后触发，返回 FocusEvent，并关闭下拉面板。',
})
valueEvents('ZtSelectBox', '确认选择面板中的草稿选项或执行清空时触发，返回提交后的全部选项 value 数组。')
add('ZtSelectBox', {
  'update:pageSize': '面板分页器修改每页条数时触发，返回新条数，同时将面板页码重置为 1。',
  'visible-change': '多选面板展开或关闭时触发，返回是否可见。',
  search: '面板搜索文本改变时触发，返回关键字，同时重置页码；远程模式会请求搜索结果。',
  clear: '执行清除操作，将已提交选项、选择草稿和搜索条件重置后触发。',
  'remote-error': '远程分页搜索或批量匹配请求失败时触发，返回失败原因。',
  focus: '多选框触发按钮获得焦点时触发，返回 FocusEvent。',
  blur: '焦点离开多选框及其面板后触发，返回 FocusEvent，并关闭面板。',
})
add('ZtSlider', {
  'update:modelValue': '拖动、点击轨道或键盘操作使滑块值改变时实时触发，返回数值；范围模式返回起止值数组。',
  input: '滑块值经步长和范围约束后实际改变时实时触发，返回数值或起止值数组。',
  change: '指针操作结束且值发生变化，或键盘操作改变值后触发，返回最终数值或起止值数组。',
})
valueEvents('ZtSplitter', '拖动分隔条、键盘调整或折叠／恢复第一栏时触发，返回第一栏占比（0–100）。')
add('ZtSplitter', { 'resize-start': '按下可拖动分隔条并开始调整栏宽时触发。', 'resize-end': '结束分隔条拖动时触发，返回本轮最终的第一栏百分比。', collapse: '切换第一栏折叠状态后触发，true 表示收起到 0%，false 表示恢复先前占比。' })
add('ZtSteps', { change: 'active 属性改变时触发，依次返回当前步骤索引和上一次步骤索引。' })
valueEvents('ZtSwitch', '开关可用且未加载时切换触发，返回对应的 activeValue 或 inactiveValue。')
add('ZtTable', {
  'update:selectedKeys': '行单选、多选或表头全选改变选中状态时触发，返回所选行 key 数组。',
  'selection-change': '表格选中状态改变时触发，返回当前 data 中命中已选 key 的行对象数组。',
  'update:expandedKeys': '切换行展开状态时触发，返回更新后的全部展开行 key 数组。',
  'expand-change': '切换一行的展开状态时触发，依次返回行对象和是否展开。',
  'column-resize': '拖动列宽结束且宽度改变，或键盘调整列宽后触发，返回列 prop 和新宽度（像素）。',
  'sort-change': '操作可排序表头切换排序状态时触发，返回排序字段和排序方向。',
  'update:sort': '操作可排序表头切换排序状态时触发，用于同步包含字段和方向的 sort 对象。',
  'row-click': '点击数据行时触发，依次返回该行对象和原始鼠标事件。',
})
add('ZtTabs', {
  'update:modelValue': '选择不同标签且 beforeLeave 检查通过后触发，返回目标标签的 name。',
  'tab-change': '通过切换检查并切换到不同标签时触发，返回新标签的 name。',
  'tab-click': '点击或键盘激活可用标签时触发，返回标签 name；即使已选中或切换检查未通过也会触发。',
  'tab-remove': '点击可用标签的关闭按钮时触发，返回待移除标签的 name；由调用方删除标签。',
  'tab-add': '点击新增标签按钮时触发，由调用方创建标签页。',
})
add('ZtTag', { close: '点击标签关闭按钮时触发，返回鼠标事件并阻止其冒泡；由调用方移除标签。' })
valueEvents('ZtTimePicker', '确认时间选择或执行清空时触发，返回按 format 格式化的时间字符串或起止时间数组；清空时为 null。')
add('ZtTimePicker', { clear: '点击清除按钮并提交 null、关闭时间面板后触发。', 'visible-change': '时间选择面板展开或关闭时触发，返回是否可见。' })
valueEvents('ZtTimeSelect', '从固定时间选项中选择或清空时触发，返回时间字符串；清空时为 null。')
add('ZtTimeSelect', { clear: '清除当前时间选项后触发，选中值同时更新为 null。' })
add('ZtTooltip', { 'update:visible': '提示经显示／隐藏延迟切换可见状态，或因 Escape、禁用及父浮层关闭而隐藏时触发，返回是否显示。' })
add('ZtTour', {
  'update:modelValue': '关闭引导或在最后一步完成引导时触发，返回 false。',
  'update:current': '点击上一步或下一步切换步骤时触发，返回从 0 开始的目标步骤索引。',
  change: '上一步或下一步操作改变当前步骤时触发，返回目标步骤索引。',
  finish: '在最后一步点击完成并成功关闭引导后触发。',
  close: '引导关闭请求通过时触发，返回关闭原因字符串；完成引导时为 confirm。',
})
add('ZtTransfer', {
  'update:modelValue': '将勾选项移入或移出右侧目标列表时触发，返回右侧全部项目的 key 数组。',
  change: '执行列表间移动后触发，依次返回右侧全部 key、移动方向（right／left）和本次移动的 key 数组。',
  'left-check-change': '左侧勾选项改变或移出后清空勾选时触发，返回左侧当前勾选的 key 数组。',
  'right-check-change': '右侧勾选项改变或移出后清空勾选时触发，返回右侧当前勾选的 key 数组。',
})
add('ZtTree', {
  'update:checkedKeys': '勾选或取消勾选节点时触发，返回按父子联动规则计算后的全部勾选 key。',
  'update:selectedKeys': '选择可用树节点时触发，返回仅含该节点 key 的数组。',
  'update:expandedKeys': '展开或收起树节点时触发，返回更新后的全部展开 key。',
  check: '节点勾选操作后触发，依次返回更新后的勾选 key 数组和本次操作的节点对象。',
  select: '选择可用节点时触发，返回被选中的节点对象。',
  'load-error': '展开节点时懒加载子节点失败后触发，依次返回错误对象和加载失败的节点。',
})
valueEvents('ZtTreeSelect', '选择树节点、改变多选勾选、移除选中项或清空时触发；单选返回节点 key 或 null，多选返回 key 数组。')
add('ZtTreeSelect', { clear: '清空树选择值后触发；单选置为 null，多选置为 []。', 'visible-change': '树选择下拉面板展开或收起时触发，返回是否可见。', 'load-error': '懒加载树节点失败时触发，依次返回错误对象和加载失败的节点。' })
add('ZtTypography', { copy: '将待复制文本成功写入剪贴板后触发，返回实际复制的文本。', 'copy-error': '写入剪贴板失败时触发，返回错误对象。' })
add('ZtUpload', {
  'update:fileList': '添加、上传状态／进度变化、取消、移除或清空文件时触发，返回当前文件列表快照。',
  change: '单个文件被添加、开始／完成上传、取消或移除时触发，依次返回该文件快照和当前列表快照；进度更新不触发。',
  progress: '上传请求报告有效进度时触发，依次返回百分比、文件快照和当前列表；传输阶段百分比最高为 99。',
  success: '上传请求成功完成后触发，依次返回服务端响应、成功文件快照和当前列表，文件进度为 100。',
  error: '上传请求失败后触发，依次返回错误、失败文件快照和当前列表。',
  remove: '移除请求通过 beforeRemove 检查并从列表删除文件后触发，依次返回被移除文件和剩余列表。',
  cancel: '中止正在上传的请求后触发，返回已恢复 ready 状态、进度归零的文件快照。',
  preview: '请求预览文件时触发，返回文件快照；图片文件还会打开内置预览器。',
  exceed: '待加入文件会使数量超过 limit 时触发，依次返回本次超限的原生 File 数组和已有文件列表。',
  reject: '文件格式／大小校验或 beforeUpload 检查不通过时触发，依次返回原生 File 和拒绝原因文本。',
  blur: '焦点离开上传组件容器时触发，返回原生 FocusEvent。',
})
add('ZtVTableGrid', {
  'link-click': '点击可用的业务列链接并执行 handler 后触发，返回 row、field、原始 value、从零开始的显示 rowIndex、求值后的 params 和 Canvas 原始事件；禁用、忙碌及汇总行不触发。',
  'update:currentPage': '分页操作改变页码时触发，返回从 1 开始的页码；修改每页条数时返回 1。',
  'update:pageSize': '修改分页器的每页条数时触发，返回新的条数。',
  loaded: '当前有效的本地或远程查询完成并应用数据后触发，返回 data、total 和 summaryData；本地查询汇总数据为 null。',
  error: '加载数据、加载编辑器选项或执行导出失败时触发，返回错误对象。',
  'page-change': '页码或每页条数改变并准备重新查询时触发，返回 currentPage 和 pageSize。',
  'sort-change': '表头排序改变时触发，返回 field 与 order，随后按新排序重新查询。',
  'selection-change': '行勾选、全选、清空或数据刷新使选中集合改变时触发，返回当前选中行对象数组。',
  action: '点击可用的行操作项并执行其 handler 后触发，返回操作 type、行 row、操作项 item，以及显示 rowIndex、求值后的 params 和原始事件。',
  create: '点击工具栏新增操作时触发，由调用方处理新增业务。',
  import: '点击工具栏导入操作时触发，由调用方打开导入流程。',
  export: '生成当前显示记录的 CSV 内容时触发，返回 CSV 字符串，随后尝试触发浏览器下载。',
  'cell-change': '可编辑单元格的值实际改变时触发，返回 row、field、oldValue、value 及底层编辑事件。',
  save: '保存检查及保存回调成功完成、编辑草稿清理后触发，返回本次保存的行、字段变更和变更数量。',
  'save-error': '保存前检查、确认或保存回调抛错时触发，返回错误对象。',
  'row-click': '点击数据行单元格并成功解析行记录时触发，依次返回行对象和底层表格事件。',
  'row-dblclick': '双击数据行单元格并成功解析行记录时触发，依次返回行对象和底层表格事件。',
  'column-settings-change': '调整或重置列设置后触发，返回当前列顺序、显隐等列设置值。',
  'update:records': '本地模式编辑记录或撤销修改后触发，返回更新后的完整记录数组副本。',
  saved: '保存成功并清理编辑草稿后触发，返回本次保存的变更载荷，与 save 同时发出。',
  'save-start': '保存检查与确认通过、调用保存回调之前触发，返回本次待保存的行和字段变更载荷。',
  'cancel-edit': '撤销编辑并恢复记录后触发，返回被撤销的修改载荷，包括变更行、字段和数量。',
  'toolbar-action': '点击可用的内置工具栏操作时触发，返回操作类型，随后执行对应新增、导入、导出或刷新逻辑。',
  reload: '点击工具栏刷新操作时触发，随后重新加载表格。',
  'export-request': '执行导出且 exportMode 为 external、未配置 exportMethod 时触发，由调用方处理导出。',
  'context-menu-click': '选择可用的行右键菜单项并执行其 handler 后触发，返回 type、row 和 item。',
  'filter-change': '应用或清除表头列筛选并更新展示数据后触发，返回当前显示行数组副本。',
  paste: '底层表格完成粘贴数据操作时透传 pasted-data 的原始载荷。',
  'row-reorder': '底层拖动行位置事件包含有效数据行索引时触发，返回从 0 开始的 sourceIndex 和 targetIndex。',
})
add('ZtVTableGridImportDialog', {
  'update:modelValue': '非忙碌状态下请求关闭导入对话框时触发，返回 false。',
  'update:file': '选择或拖入通过格式校验的文件时返回 File；移除已选文件时返回 null。',
  'update:loading': '声明的 loading 双向绑定事件；当前实现不主动触发，导入忙碌状态由调用方通过 loading 属性控制。',
  confirm: '确认导入且已选文件通过格式校验、当前未忙碌时触发，返回待导入的 File；实际导入由调用方执行。',
  template: '请求模板下载且没有配置 templateUrl 时触发，由调用方提供模板下载。',
  'invalid-file': '选择、拖入或确认的文件不符合允许扩展名时触发，返回未通过校验的 File。',
})
add('ZtWatermark', { error: '水印图片加载失败时触发，返回原生图片错误事件；同一次失败状态仅通知一次。' })

export function eventDescription(component, name, type) {
  return descriptions.get(`${component}.${name}`)
}
