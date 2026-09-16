import data from './api.generated.json'
export type ApiRow = { name: string; type: string; description?: string; default?: string; required?: boolean }
export type ApiDocument = { components: { name: string; props: ApiRow[]; events: ApiRow[]; slots: ApiRow[]; methods: ApiRow[] }[]; types: { name: string; code: string; public: boolean }[]; sections: string[] }
export const api = data as Record<string, ApiDocument>
export const descriptions: Record<string, string> = {
 modelValue: '通过 v-model 绑定的当前值，值类型见左侧。', disabled: '禁用此组件或组合内的控件。', size: '组件尺寸；继承关系参见通用约定。', status: '组件的颜色或状态，支持值见类型定义。',
 type: '保留的类型字段；当前颜色由 status 控制。', showZero: '数值为 0 时是否显示徽标。', name: '传递给原生表单控件的名称。', label: '控件旁展示的标签。', checked: '初始选中状态；组合模式会将对应 value 加入选中集合。', min: '组合允许选择的最少数量。', max: '组合允许选择的最多数量。', activeText: '打开状态的文字。', inactiveText: '关闭状态的文字。', width: '控件宽度，数字按像素处理。', autocomplete: '原生自动填充提示，如 username、email、current-password。', maxlength: '允许输入的最大字符数。', showWordLimit: '显示当前字数与字数限制。', small: '兼容的小尺寸开关，推荐使用 size。', fullscreen: '全屏状态，可使用 v-model:fullscreen。', ariaLabel: '弹层的无障碍名称。', showHeader: '是否展示标题区域。', showClose: '是否展示关闭按钮。', showCancelButton: '是否展示取消按钮。', confirmText: '确认按钮文字。', cancelText: '取消按钮文字。', confirmLoading: '确认按钮的加载状态。', confirmDisabled: '禁用确认按钮。', escClosable: '是否允许按 Escape 关闭。', lockScroll: '打开时锁定背景滚动。', destroyOnClose: '关闭后销毁正文内容。', autoFocus: '打开后自动聚焦弹层内控件。', focusTrap: '将键盘焦点限制在当前弹层内。', zIndex: '自定义层叠顺序。',
}
export function eventDescription(name: string) {
 if (name.startsWith('update:')) return `双向绑定更新，对应 v-model${name === 'update:modelValue' ? '' : ':' + name.slice(7)}。`
 return ({change:'值提交或状态变化时触发。',input:'输入值变化时触发。',focus:'获得焦点时触发。',blur:'失去焦点时触发。',clear:'执行清空操作时触发。',click:'点击时触发。',close:'请求关闭时触发。',closed:'关闭动画结束后触发。',open:'开始打开时触发。',opened:'打开动画结束后触发。',confirm:'点击确认时触发。',cancel:'执行取消操作时触发。','visible-change':'弹层展开或收起时触发。','visibility-change':'密码显隐状态改变时触发。','remove-tag':'移除已选标签时触发。','search':'筛选关键词变化时触发。'} as Record<string,string>)[name] ?? '回调参数见签名；具体触发行为参见组件示例。'
}
export const slug = (text: string) => text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')

export const methodDescriptions: Record<string,string> = {
 focus:'将焦点移入组件。',blur:'移出输入焦点。',select:'选中输入框中的文本。',clear:'清空当前输入值，并触发对应更新事件。',input:'原生输入元素，作为实例属性访问。',open:'打开面板。',close:'请求关闭面板；弹层组件会执行 beforeClose，返回是否成功关闭。',resetPosition:'清除拖拽位移，恢复弹窗初始位置。',validate:'校验所有字段。Form 校验失败时 Promise 拒绝，请使用 try/catch；FormItem 返回是否通过。',validateField:'校验指定字段，校验失败时 Promise 拒绝。',resetFields:'将指定字段或全部字段恢复为初始值，并清理校验。',resetField:'恢复当前字段初始值，并清理校验。',clearValidate:'清理校验状态，不修改字段值。',scrollToField:'滚动到指定字段。',validateState:'当前校验状态，作为实例属性读取。',validateMessage:'当前校验消息，作为实例属性读取。',query:'执行数据查询，resetPage 为 true 时回到第一页。',reload:'重新加载当前查询。',resize:'根据容器尺寸重新布局表格。',setRecords:'替换表格数据，可同时更新总数。',getTableInstance:'获取底层 ListTable 实例；未挂载时返回 null。',getSelectedRows:'获取选中行数据。',getSelectedKeys:'获取选中行键。',setSelectedKeys:'设置选中行键。',clearSelection:'清空选择。',getChanges:'获取待保存的编辑变更。',saveChanges:'保存编辑变更，结果通过 save 或 save-error 事件反馈。',cancelChanges:'撤销未保存的编辑。',exportCsv:'导出 CSV 并返回 CSV 内容。',
}
