const descriptions = {
  ZtBadge: {
    max: '数字徽标的显示上限，超过此值时显示 max+，不影响文字徽标。',
    value: '徽标显示的数字或文字；数字超过 max 时显示为 max+。',
    isDot: '仅显示圆点，隐藏 value 的数字或文字。',
    hidden: '隐藏徽标标记，保留包裹的内容。',
    offset: '徽标相对包裹内容的位置偏移，依次为水平和垂直像素值；独立展示时不生效。',
    showZero: 'value 为 0 时仍显示数字徽标。',
  },
  ZtButton: {
    circle: '使用圆形按钮外观。', type: '原生 button 的类型，控制普通点击、提交表单或重置表单。',
    loading: '显示加载图标并阻止按钮点击；设置 loadingText 时替换按钮文字。',
  },
  ZtCheckbox: {
    modelValue: '独立使用时的勾选状态；在 CheckboxGroup 内由组的值数组决定。',
    label: '复选框旁显示的文字；默认插槽优先。', value: '在 CheckboxGroup 的选中值数组中代表此复选框的值。',
    name: '传给原生 checkbox 输入框的 name。',
    indeterminate: '显示半选外观，不改变绑定的勾选值。', border: '为复选框及文字显示外框。',
    checked: '在 CheckboxGroup 内挂载时将此项的 value 加入选中数组；独立使用请通过 modelValue 控制。',
  },
  ZtCheckboxGroup: { modelValue: '已勾选复选框的 value 数组。', min: '最少保留的勾选数量。', max: '最多允许的勾选数量。' },
  ZtForm: {
    underline: '让表单内支持此模式的输入控件默认使用下边框样式，控件可单独覆盖。',
    model: '表单字段数据对象，校验、字段重置与 FormItem 的 prop 均以此对象为基础。',
    rules: '按字段路径配置校验规则，可被 FormItem 的局部规则补充。',
    inline: '将表单项排列为行内布局。', labelPosition: '标签相对输入区域的位置：左对齐、右对齐或上方。',
    labelWidth: '表单项标签区域的统一宽度；数字按 px 处理，auto 按实际标签统一测量。',
    hideRequiredAsterisk: '隐藏必填字段标签前的星号，不影响必填校验。',
    showMessage: '是否展示字段校验错误文字；单个 FormItem 可覆盖。',
    scrollToError: '整表校验失败时滚动到首个校验失败的字段。',
  },
  ZtFormGroup: { bordered: '为表单分组显示边框。' },
  ZtFormItem: {
    prop: '此表单项在 Form.model 中的字段路径，支持点分字符串或路径数组，用于校验与重置。',
    label: '字段标签文字，也是自动生成必填错误提示时使用的字段名称。',
    required: '标记为必填项；已有规则未声明 required 时自动加入必填校验。',
    rules: '此字段的局部校验规则，与 Form.rules 中对应字段的规则合并。',
    error: '外部指定的错误提示，设置后将字段显示为校验失败状态。',
    showMessage: '是否显示此字段的错误文字；省略时继承 Form。',
    labelWidth: '此字段标签区域的宽度；数字按 px 处理，auto 参与自动测量，省略时继承 Form。',
  },
  ZtInput: {
    modelValue: '输入框显示的值；用户输入时回传字符串，null 显示为空。',
    type: '原生 input 的输入类型，例如 text、email 或 password。',
    autocomplete: '传给原生输入框的 autocomplete 提示，控制浏览器自动补全。',
    maxlength: '原生输入框允许输入的最大字符长度。', showWordLimit: '在已配置 maxlength 时显示当前字符数及长度上限。',
  },
  ZtPassword: {
    modelValue: '密码输入框的内容；用户输入时回传字符串，null 显示为空。',
    showToggle: '显示切换密码明文和隐藏状态的按钮。',
    autocomplete: '传给密码输入框的 autocomplete 提示，例如 current-password 或 new-password。',
    maxlength: '密码输入框允许输入的最大字符长度。', showWordLimit: '在已配置 maxlength 时显示已输入密码的字符数及长度上限。',
  },
  ZtInputNumber: {
    modelValue: '数字输入框的数值，清空时为 null。', precision: '数值保留的小数位数，同时用于数值归一化及显示。',
    stepStrictly: '将输入值归一化为 step 的整数倍。', controls: '显示增加和减少数值的操作按钮。',
    controlsPosition: '步进按钮的位置：默认分居两侧，或统一置于左侧、右侧。',
  },
  ZtPagination: {
    pageCount: '直接指定总页数，设置后优先于 total 与 pageSize 的计算结果。',
    pagerCount: '页码按钮数量；超出可显示范围时折叠为快速跳页按钮。',
    pageSizes: '每页条数选择器提供的可选数量。',
    layout: '按逗号排列分页元素，支持 prev、pager、next、jumper、sizes、total；-> 将后续元素推至右侧。',
    background: '为分页按钮显示背景。', hideOnSinglePage: '总页数不超过一页时隐藏整个分页器。',
    prevText: '上一页按钮的文字，设置后替换默认箭头。', nextText: '下一页按钮的文字，设置后替换默认箭头。',
  },
  ZtRadio: { modelValue: '当前选中的单选值，与本项 label 相等时选中；组内由 RadioGroup 管理。', label: '本项被选中后写入绑定值的值；未提供默认插槽时也作为显示文字。', name: '原生 radio 的分组名称；组内优先使用 RadioGroup 的 name。', border: '为单选框及文字显示外框。' },
  ZtRadioGroup: { modelValue: '当前选中的 Radio.label 值。', name: '组内原生 radio 共用的 name；省略时自动生成，避免不同组相互影响。' },
  ZtSelect: {
    modelValue: '选中项的 value；多选时为 value 数组，未选择时可为 null。',
    options: '下拉选项列表，每项以 value 标识，label 展示文字，disabled 禁用该项。',
    remote: '启用远程搜索，使用 remoteMethod 加载结果。',
    remoteMethod: '接收搜索关键字并返回选项数组的 Promise，结果作为远程下拉列表。',
    debounce: '远程搜索的防抖等待时间，单位 ms。', noDataText: '列表没有可显示选项时的提示文字。', remoteErrorText: '远程搜索失败时的提示文字。',
  },
  ZtSelectBox: {
    options: '供选择面板使用的选项列表，每项包含 value、label 与可选 disabled。',
    remoteMethod: '接收 search 请求（keyword、page、pageSize）或 batch 请求（keywords）；分别返回分页 options/total 或关键字匹配 matches。',
    debounce: '远程关键字搜索的防抖等待时间，单位 ms。', pageSizes: '面板分页器中每页选项数量的候选列表。',
    noDataText: '面板没有可显示选项时的提示文字。', remoteErrorText: '面板远程搜索失败时的提示文字。',
  },
  ZtStep: { icon: '步骤图标，支持内置图标名称或 Vue 组件；icon 插槽可覆盖。', status: '此步骤的状态；省略时根据 Steps.active、finishStatus 和 processStatus 推导。' },
  ZtSteps: { active: '当前进行中步骤的索引，从 0 开始；此前步骤使用 finishStatus。', alignCenter: '使步骤标题和说明居中对齐。', simple: '使用简洁步骤条外观。', space: '水平非简洁模式下每个步骤的固定占用宽度；数字按 px 处理，字符串使用 CSS 长度。', finishStatus: 'active 之前已完成步骤的状态。', processStatus: 'active 对应的当前步骤状态。' },
  ZtSwitch: {
    modelValue: '开关绑定值，等于 activeValue 时开启，切换时回传 activeValue 或 inactiveValue。',
    activeText: '开启状态的说明文字。', inactiveText: '关闭状态的说明文字。',
    activeValue: '开关开启时写入的绑定值。', inactiveValue: '开关关闭时写入的绑定值。',
    loading: '显示加载指示并阻止开关切换。', width: '开关轨道宽度；数字按 px 处理，也支持 CSS 长度。',
  },
  ZtTag: { effect: '标签的填充风格：dark 深色、light 浅色、plain 描边。', closable: '显示关闭按钮；点击触发 close，由调用方移除标签。', round: '使用胶囊形圆角。', hit: '使用更明显的语义色边框。' },
  ZtVTableGrid: {
    originalRecords: '本地批量编辑的原始记录快照；设置后与 records 按 rowKey 比较，识别新增、删除及字段修改。',
    records: '本地行数据；远程模式下由 proxyConfig 的查询结果提供显示数据。',
    localPagination: '本地数据模式下启用分页；远程查询模式使用服务端分页。',
    filterMethod: '接收行记录与当前查询表单数据，返回 true 保留该行，用于本地过滤。',
    formConfig: '内置搜索表单的字段、控件及布局配置。',
    showForm: '控制搜索表单区域是否显示；null 时根据 form 插槽或 formConfig.items 自动判断。',
    optionLoader: '接收选项源名称与含 AbortSignal 的上下文，返回选项数组的 Promise；相同源在表格内缓存。',
    actionDisplay: '行操作以菜单 menu 或平铺按钮 inline 展示。',
    toolbarConfig: '内置工具栏按钮集合；false 隐藏，设置后优先于 toolbar。',
    exportMode: 'csv 直接生成并下载 CSV，external 触发 export-request 交给外部导出；exportMethod 优先。',
    summaryConfig: '启用增强汇总行，可指定汇总范围、标签、样式和汇总数据；设置后优先于 summary。',
    batchEdit: '记录编辑草稿并提供批量保存与取消操作；关闭时不累计批量修改记录。',
    saveConfirm: '保存前确认；true 弹出确认框，函数接收本次修改 payload，返回或异步返回 false 可取消。',
    beforeSave: '保存前接收本次修改 payload；返回或异步返回 false 中止保存，异常进入 save-error。',
    rowContextMenu: '右键菜单项数组，或接收行记录并返回菜单项的函数。',
    checkboxCheckMethod: '接收行记录，返回 false 禁止勾选该行。',
    rowHeight: '数据行高度，数字单位 px；auto 启用自动行高。', headerRowHeight: '表头行高度，数字单位 px，也可使用 auto。',
    cellStyle: '数据单元格的全局 VTable 样式，如文字、内边距和背景。', headerStyle: '表头单元格的全局 VTable 样式。',
    highlightEditableCell: '以 editableCellStyle 高亮允许编辑的单元格。', editableCellStyle: '启用可编辑高亮时应用于可编辑单元格的 VTable 样式。',
    readonlyCellStyle: '应用于不可编辑单元格的 VTable 样式。', stripe: '交替显示数据行背景色。',
    cellSelection: '显示单元格选中背景和边框；false 时隐藏这些选中样式。', borderMode: '单元格边框模式：none 无边框、row 仅行分隔线、cell 完整网格。',
    hoverMode: '鼠标悬停时高亮单元格 cell 或整行 row。', reserveScrollbar: '为滚动条预留布局空间。', scrollbarSize: '滚动条尺寸，单位 px。',
    filterConfig: '启用列头筛选入口；同时需要对应列声明 filter: true。',
    proxyConfig: '异步查询函数，接收 page、pageSize、sort 和 form，返回 data 或 records、total 及可选汇总数据。',
    formData: '搜索表单的数据对象，作为本地 filterMethod 和远程 proxyConfig 的 form 参数。',
    pagination: '是否显示分页器，或指定每页数量候选、布局与背景；本地模式还需 localPagination。',
    autoLoad: '挂载时自动发起首次查询。', checkbox: '显示行勾选列与表头全选框。', reserveCheckbox: '按 rowKey 保留换页后的勾选状态。',
    actionButtons: '行操作按钮数组，或接收行记录并返回按钮数组的函数，可配置显示、禁用和处理函数。',
    showActionsColumn: '显示行操作列。', editable: '允许启用列级 editable 指定的单元格编辑器。',
    batchSave: '接收本次修改 payload 的异步持久化函数；完成后清除草稿，远程模式重新查询，失败触发 save-error。',
    summary: '启用基础汇总行，可设置标签、空数据时显示及服务端汇总数据；summaryConfig 优先。',
    columnSettings: '启用列设置，可控制排序、显隐及用于持久化的 storageKey。', toolbar: '内置工具栏按钮集合，false 隐藏；toolbarConfig 优先。',
    tableOptions: '传给底层 VTable 的额外选项；records、columns、pagination 由组件管理，不接受覆盖。',
    loading: '显示数据加载状态，并与查询、保存等内部忙碌状态共同限制操作。',
    height: '表格区域高度；数字按 px 处理，字符串支持 CSS 长度。', size: '统一设置行高、表头高度、字号及配套表单和工具栏控件尺寸。',
  },
  ZtVTableGridImportDialog: {
    modelValue: '控制导入对话框是否打开。', loading: '导入任务进行中；阻止关闭、重复确认和文件更换等操作，由调用方在业务完成后解除。',
    file: '当前选择的待导入文件，选择和移除时通过 update:file 同步。',
    templateUrl: '标准模板下载地址；提供后显示下载链接，优先于 templateDownload。',
    templateDownload: '未设置 templateUrl 时显示模板下载按钮，点击触发 template 事件。',
    formatHint: '文件上传区域上方的格式说明文字。', instructions: '在上传区域之前逐条显示的操作说明。',
    accept: '原生文件选择器的文件类型提示；实际扩展名校验使用 allowedExtensions。',
    allowedExtensions: '允许导入的文件扩展名，匹配时忽略大小写及前导点；空数组不限制扩展名。',
    fileSpec: '未选择文件时上传区域显示的格式要求文字。', fileTypeLabel: '已选文件信息中显示的类型名称，也用于无可识别扩展名时的格式标记。',
  },
}

const holidays = {
  holidays: '日期格的节假日与调休信息，key 使用本地日期 YYYY-MM-DD，value 为名称，type 可标记休息日或工作日。',
  showHolidays: '在日期格显示 holidays 提供的名称及休、班标记；关闭时忽略该列表。',
}
for (const component of ['ZtDatePicker', 'ZtDatePickerPanel', 'ZtDateTimePicker']) {
  descriptions[component] = {
    ...holidays,
    status: '输入框与日期选择的主题状态；danger 为危险主题，error 为字段校验失败。',
  }
}

const overlay = {
  modelValue: '控制浮层是否打开，关闭请求通过 update:modelValue 同步。',
  bodyScroll: '允许内容区域在高度受限时自行滚动；false 隐藏溢出，供内容自行管理滚动。',
  loading: '显示加载遮罩并阻止内容交互和关闭，同时将确认按钮置为加载状态。',
}
descriptions.ZtDrawer = { ...overlay }
descriptions.ZtModal = {
  ...overlay,
  width: '弹窗面板宽度；数字按 px 处理，也支持 CSS 长度，全屏时铺满视口。',
  height: '弹窗面板高度；数字按 px 处理，也支持 CSS 长度，内容区域受可用空间约束。',
  fullscreenBelow: '视口窄于此像素断点时自动全屏；0 关闭此行为。',
  top: '非全屏弹窗距容器顶部的距离；数字按 px 处理，设置后采用顶部定位。',
  fullscreen: '控制弹窗全屏状态，可通过 v-model:fullscreen 同步标题栏按钮的切换。',
  showFullscreenButton: '在标题栏显示全屏与还原按钮，优先于兼容属性 showZoom。',
  draggable: '允许通过标题栏拖动弹窗；全屏时禁用拖动。',
}

const canvasChoice = {
  children: '第三方 Vue 声明的文字内容；当前 Grid 适配器未将其转为底层 text，设置后不会显示文字。', textStyle: '第三方 Vue 声明的文字样式；当前 Grid 适配器未将其转为底层 text 样式。',
  checked: 'Canvas 选择控件当前是否选中。', interactive: '是否启用选择控件的内置交互。',
  disabled: '禁用选择交互，并使用禁用状态的文字和图形样式。',
  disableCursor: '禁用状态下鼠标悬停时使用的光标样式。',
  spaceBetweenTextAndIcon: '选择图形与文字之间的间距，单位 px。', visible: '是否绘制此 Canvas 选择控件。',
  onChange: '第三方声明的选中状态回调；当前 Grid 适配器未桥接底层选择事件，不能依赖此属性回传状态。',
}
descriptions.VTableCheckBox = {
  ...canvasChoice,
  boxStyle: '第三方 Vue 声明的方框样式；当前 Grid 适配器未将其转为底层 box 属性。',
  iconStyle: '第三方 Vue 声明的勾选和半选图标样式；当前 Grid 适配器未将其转为底层 icon 属性。', indeterminate: '显示半选标记，与 checked 分开控制。',
}
descriptions.VTableRadio = {
  ...canvasChoice, circleStyle: '第三方 Vue 声明的圆环样式；当前 Grid 适配器未将其转为底层 circle 属性。',
}
descriptions.VTableRawTag = {
  attribute: '第三方 Vue 声明的原生属性容器；当前 Grid 适配器不展开此对象，应直接传递底层图形属性。', children: '第三方 Vue 声明的标签文字；当前 Grid 适配器未将其转为底层 text，建议使用 VTableTag.text。',
  textStyle: '标签文字的 Canvas 样式，如填充色、字号和行高。', panelStyle: '第三方 Vue 声明的背景面板样式；当前 Grid 适配器未将其转为底层 panel，建议使用 VTableTag.panelStyle。',
  padding: '标签文字与背景面板之间的内边距，单位 px，支持数字或方向数组。',
  minWidth: 'Canvas 标签的最小宽度，单位 px。', maxWidth: 'Canvas 标签的最大宽度，单位 px。', visible: '是否绘制此 Canvas 标签。',
}
descriptions.VTableTag = {
  text: '标签文字；数值会转换为字符串，空值显示为空。', type: '标签语义配色，优先于兼容属性 status。',
  status: 'type 的兼容别名，仅在未设置 type 时决定标签语义配色。',
  effect: 'Canvas 标签的填充风格：dark 深色、light 浅色、plain 白底描边。',
  size: '标签字号、行高和默认内边距档位；省略时继承所在表格的尺寸与字体。',
  round: '将标签面板设为胶囊形圆角。', hit: '使用语义色加深标签边框。',
  color: '自定义标签面板的填充颜色，覆盖语义色背景。', textColor: '自定义标签文字颜色。', borderColor: '自定义标签边框颜色。',
  fontWeight: '标签文字字重，可被 textStyle.fontWeight 覆盖。',
  padding: '标签面板内边距，单位 px；数组支持上下、左右或上右下左形式。',
  boundsPadding: 'Canvas 图形包围盒的外扩距离，单位 px，影响布局占位。',
  minWidth: '标签面板的最小宽度，单位 px。', maxWidth: '标签面板的最大宽度，单位 px。', visible: '是否绘制此 Canvas 标签。',
  textStyle: '覆盖生成后的 Canvas 文字样式，优先于 textColor、fontWeight 等简写属性。',
  panelStyle: '覆盖生成后的 Canvas 面板样式，优先于颜色、描边和圆角等简写属性。',
  onClick: '标签被点击时接收 Canvas 点击事件，可在回调中处理所在行的业务操作。',
}

Object.assign(descriptions, {
  ZtAlert: { modelValue: '提示条是否显示；关闭按钮会请求将此值更新为 false。' },
  ZtCard: { loading: '加载时在卡片主体显示骨架屏，完成后显示默认插槽内容。' },
  ZtCalendar: { modelValue: '当前选中的本地日期字符串，格式为 YYYY-MM-DD；null 表示未选中日期。' },
  ZtDescriptionsItem: { label: '该项的字段名称，显示在内容旁或上方；label 插槽优先。' },
  ZtDropdown: { items: '有序菜单条目，支持操作项、分隔线和分组标题，key 必须唯一。', width: '下拉菜单宽度；数字按 px 处理，也支持 CSS 长度。' },
  ZtDropdownItem: { label: '菜单项显示的文字，默认插槽可覆盖。' },
  ZtIcon: { name: '要显示的内置图标名称。', label: '图标的辅助技术名称；有名称时作为可读图像呈现。', status: '图标的语义配色。' },
  ZtLoading: { loading: '是否显示加载遮罩与指示器；包裹的内容始终保留。' },
  ZtPopover: { width: '浮层内容区域的宽度；数字按 px 处理，也支持 CSS 长度。', height: '浮层内容区域的高度；数字按 px 处理，也支持 CSS 长度。' },
  ZtQRCode: { value: '编码到二维码中的文本内容。', label: '二维码图像供辅助技术读取的名称。' },
  ZtSegmented: { modelValue: '当前选中分段的值。', options: '分段选项，支持直接传值或带 label、value、disabled 的选项对象。' },
  ZtSkeleton: { loading: '加载时展示骨架占位，关闭后显示默认插槽的实际内容。' },
  ZtStatistic: { value: '需要格式化展示的统计数值。' },
  ZtTimelineItem: { content: '时间线节点的正文文字，默认插槽可覆盖。' },
  ZtTooltip: { content: '提示浮层的文字内容，content 插槽可覆盖。', width: '提示浮层的宽度；数字按 px 处理，也支持 CSS 长度。', height: '提示浮层的高度；数字按 px 处理，也支持 CSS 长度。' },
})


const sizeMeanings = {
  ZtBadge: '徽标的字号、标记高度和内边距档位；省略时继承 ConfigProvider。',
  ZtButton: '按钮高度、字号和内边距档位；省略时继承 ConfigProvider。',
  ZtCheckbox: '复选框图形与文字尺寸；省略时依次继承 CheckboxGroup、FormItem 和 ConfigProvider。',
  ZtCheckboxGroup: '组内复选框默认的图形和文字尺寸；子项可显式覆盖。',
  ZtDatePicker: '日期输入框与面板控件的尺寸档位；省略时继承 Form 或 ConfigProvider。',
  ZtDatePickerPanel: '内嵌日期面板及内部控件的尺寸档位；省略时继承 Form 或 ConfigProvider。',
  ZtDateTimePicker: '日期时间输入框与面板控件的尺寸档位；省略时继承 Form 或 ConfigProvider。',
  ZtForm: '表单项和支持尺寸继承的录入控件的统一尺寸；子控件可显式覆盖。',
  ZtFormItem: '此表单项及内部录入控件的尺寸；省略时继承 Form。',
  ZtInput: '输入框高度、字号和内边距档位；省略时继承 FormItem 或 ConfigProvider。',
  ZtPassword: '密码输入框高度、字号和内边距档位；省略时继承 FormItem 或 ConfigProvider。',
  ZtInputNumber: '数字输入框及步进按钮的尺寸档位；省略时继承 FormItem 或 ConfigProvider。',
  ZtModal: '弹窗的内边距、字体及内置操作控件的尺寸档位。',
  ZtPagination: '分页按钮、页码和条数选择器的尺寸档位；省略时继承 ConfigProvider。',
  ZtRadio: '单选图形和文字的尺寸档位；省略时优先继承 RadioGroup。',
  ZtRadioGroup: '组内单选框共用的图形和文字尺寸档位。',
  ZtSelect: '选择框、选中标签和选项行的尺寸档位；省略时继承 Form 或 ConfigProvider。',
  ZtSelectBox: '选择框与选择面板内部控件的尺寸档位；省略时继承 Form 或 ConfigProvider。',
  ZtSteps: '步骤序号图形、标题及说明文字的尺寸档位；省略时继承 ConfigProvider。',
  ZtSwitch: '开关轨道、滑块及说明文字的尺寸档位；省略时继承 Form 或 ConfigProvider。',
  ZtTag: '标签高度、字号和内边距档位；省略时继承 ConfigProvider。',
  ZtUpload: '上传按钮、拖拽区域及文件列表的尺寸档位；省略时继承 Form 或 ConfigProvider。',
}
for (const [component, text] of Object.entries(sizeMeanings)) {
  ;(descriptions[component] ??= {}).size = text
}
const statusMeanings = {
  ZtBadge: '徽标背景与文字使用的语义配色。',
  ZtButton: '按钮的语义配色；自定义 color 可覆盖。',
  ZtCheckbox: '复选框选中、边框和焦点的语义配色；组内优先使用 CheckboxGroup.status。',
  ZtCheckboxGroup: '组内复选框共用的选中、边框和焦点语义配色。',
  ZtInput: '输入框边框和焦点的主题状态；error 标记校验失败，FormItem 校验错误也会标记无效。',
  ZtPassword: '密码输入框边框和焦点的主题状态；error 标记校验失败，FormItem 校验错误也会标记无效。',
  ZtPagination: '当前页及分页交互的语义配色。',
  ZtRadio: '单选框选中和焦点的语义配色；组内优先使用 RadioGroup.status。',
  ZtRadioGroup: '组内单选框共用的选中和焦点语义配色。',
  ZtSwitch: '开关开启状态的轨道语义配色。',
  ZtTag: '标签的语义配色，与 effect 共同决定文字、背景和边框。',
  ZtUpload: '上传入口及交互区域的主题配色；不表示文件上传进度或结果。',
}
for (const [component, text] of Object.entries(statusMeanings)) {
  ;(descriptions[component] ??= {}).status = text
}

export function propDescription(component, name) {
  return descriptions[component]?.[name]
}
