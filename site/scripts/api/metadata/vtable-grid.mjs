const result = {}
const add = (owner,section,entries) => { for (const [name, row] of Object.entries(entries)) result[`vtable-grid.${owner}.${section}.${name}`] = typeof row === 'string' ? {description:row} : {description:row[0],defaultValue:row[1],...(row[2] ? {type:row[2]} : {})} }
add('ZtVTableGrid','props',{
  originalRecords:['独立的整表原始快照，用于新增、删除、修改和撤销；应用在保存成功后更新。','无默认值'],
  localPagination:['本地记录是否分页；false 展示全部筛选结果并隐藏本地分页，远程分页规则不变。','true'],
  filterMethod:['本地过滤函数 (row, form) => boolean，先过滤再排序、分页和汇总。','无默认值'],
  formConfig:['配置式搜索表单，支持校验、布局、折叠、字段插槽和自定义控件；显式 formData 优先于配置 data。','无默认值'],
  showForm:['搜索区域开关；null 时按 form 插槽或 formConfig.items 自动判断。','null'],
  optionLoader:['注入选项加载器 (source, { signal })；搜索字段与编辑器在当前 Grid 内共享请求缓存，不绑定字典服务。','无默认值'],
  toolbarConfig:['增强工具栏入口；明确传入时优先于 toolbar，false 隐藏内置按钮。','undefined（沿用 toolbar）'],
  actionDisplay:['行操作显示方式；menu 保留菜单交互，inline 直接显示 Canvas 按钮。',"'menu'"],
  exportMode:['csv 导出当前记录 CSV；external 仅触发 export-request，由应用决定格式和范围。',"'csv'"],
  exportLoading:['外部导出的忙碌状态，阻止重复点击导出。','false'],
  summaryConfig:['增强汇总入口，支持后端字段映射、all/page 范围、标题合并及样式；明确传入时优先于 summary，后端缺失字段留空。','undefined（沿用 summary）'],
  batchEdit:['是否跟踪草稿并显示保存区域；省略时保留原草稿行为，false 不关闭已启用的单元格编辑，editable 仍控制编辑权限。','undefined（草稿跟踪按 true 处理）'],
  saveConfirm:['保存前确认；true 使用确认弹窗，回调返回 false 则取消保存并保留草稿。','false'],
  beforeSave:['保存前同步或异步校验；返回 false 阻止提交，失败或取消时保留草稿。','无默认值'],
  rowContextMenu:['按行配置右键菜单，支持禁用、隐藏、分隔线和应用回调。','无默认值'],
  checkboxCheckMethod:['逐行判断是否允许勾选；返回 false 的行不可通过复选框或全选选中。','无默认值'],
  rowHeight:['数据行高度；数字使用固定高度，auto 启用自动行高。','按 size 计算'],
  headerRowHeight:['独立表头行高，支持数字或 auto。','按 size 计算'],
  cellStyle:['全局数据单元格样式，显式列样式优先。','无默认值'],
  headerStyle:['全局表头样式，与显式列表头样式合并。','无默认值'],
  highlightEditableCell:['突出显示可编辑单元格，不改变 editable 或列级权限。','true'],
  editableCellStyle:['可编辑单元格默认样式，显式列样式与修改状态样式优先。','无默认值'],
  readonlyCellStyle:['只读单元格默认样式，显式列样式优先。','无默认值'],
  stripe:['显示隔行背景。','false'], cellSelection:['允许 Canvas 单元格选择。','true'],
  borderMode:['边框模式：none 无分隔、row 行分隔、cell 单元格分隔。',"'cell'"],
  hoverMode:['悬停高亮模式：cell 单元格或 row 整行。',"'row'"],
  reserveScrollbar:['始终预留并显示滚动条区域。','false'], scrollbarSize:['预留滚动条宽度，单位 px。','10（reserveScrollbar=true 时）'],
  filterConfig:['显式启用已加载记录的表头枚举筛选，仅对 filter=true 列生效，不作为远程全量条件。','无默认值（不启用）'],
})
add('ZtVTableGridImportDialog','props',{
  modelValue:['可见状态，支持 v-model；loading 时阻止用户关闭。','false'],
  file:['选择的文件，支持 v-model:file；组件不上传或解析文件。','null'],
  loading:['导入忙碌状态，支持 v-model:loading；阻止关闭、更换、删除和重复确认。','false'],
  title:['弹窗标题。',"'导入数据'"],description:['导入说明。',"''"],templateUrl:['标准模板链接；优先于 templateDownload 显示。',"''"],
  templateDownload:['未设置 templateUrl 时显示模板按钮，点击触发 template。','false'],formatHint:['文件区域上方的格式提示。',"'仅支持 .xlsx 文件'"],
  instructions:['导入规则说明列表。','[]'],accept:['原生文件选择器的 accept 提示，实际扩展名校验由 allowedExtensions 执行。',"'.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"],
  allowedExtensions:['允许的扩展名，忽略大小写并接受带或不带点号；空数组不限制扩展名。',"['.xlsx']"],fileSpec:['空文件区域的规格文字。',"'仅支持 .xlsx'"],fileTypeLabel:['文件类型提示文字。',"'XLSX'"],
})
add('ZtVTableGrid','events',{
  'update:records':'整表记录改变后触发，支持 v-model:records 同步新增、删除、导入和撤销。',
  'save-start':'实际开始保存请求时触发，包含当前记录和整表草稿差异。',saved:'保存成功后触发；应用可在此更新独立 originalRecords 快照。',save:'兼容既有的保存成功事件；不表示请求开始。',
  'cancel-edit':'撤销草稿后触发，恢复原始快照并通知应用同步记录。','toolbar-action':'点击内置工具栏动作时触发，参数为动作名称。',reload:'刷新动作通知，同时保留重新查询行为。',
  'export-request':'exportMode=external 时请求应用导出，不同时生成 CSV。','context-menu-click':'执行右键菜单项时触发，包含动作类型、原始行与菜单项。','filter-change':'已加载记录的表头枚举筛选改变后触发，返回筛选记录。',paste:'Canvas 粘贴事件通知，底层编辑流程处理有效单元格。','row-reorder':'行拖动完成时触发，包含原始记录的源索引和目标索引。',
})
add('ZtVTableGrid','exposes',{
  isSaving:'是否正在执行保存流程，只读状态。',hasChanges:'是否存在待保存的整表草稿，只读状态。',tableInstance:'底层 ListTable 实例，延迟加载前或卸载后为 null。',formRef:'配置式搜索表单的 ZtForm 方法实例；未渲染配置表单时为 null。',
  getEditChanges:'读取整表草稿，与 getChanges 访问同一内部状态。',getColumnSettings:'读取当前列顺序和显示、隐藏字段。',resetColumnSettings:'恢复默认列顺序和可见性，并同步持久化设置。',refreshRecords:'按当前页重新刷新记录。',
})
add('ZtVTableGrid','slots',{
  default:'动态字段插槽透传，通过 formConfig.items[].slots.default、列 slot 或 headerSlot 指定实际名称。',
  actions:'自定义行操作 Canvas 内容，作用域包含原始业务行和单元格几何信息。',
  'pager-right':'分页右侧内容，包含记录总数、选中记录与选中数量。',
  form:'自定义搜索区域，存在时优先于配置式搜索表单。',
  'toolbar-left':'工具栏左侧附加内容，继承表格尺寸和复选状态。','toolbar-right':'工具栏右侧附加内容，继承表格尺寸和复选状态。',
  'edit-actions':'自定义草稿保存区域；save 失败时拒绝 Promise，调用方应处理异常。',
})
add('ZtVTableGridImportDialog','events',{
  confirm:'已选择有效文件且未处于 loading 时确认，参数为 File；由应用执行导入。',template:'点击模板下载按钮时触发，由应用提供模板。','invalid-file':'选择或拖入扩展名不符合要求的文件时触发，参数为被拒绝的 File。',
})
add('ZtVTableGridImportDialog','slots',{options:'文件选择区域之前的业务导入选项，组件不解释其值。'})
result['vtable-grid.ZtVTableGrid.slots.default'].type = 'ZtVTableGridFormScope<FormData> | ZtVTableGridCellSlotScope<Row>'
export default result
