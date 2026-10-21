export default {
  'tooltip.ZtTooltip.props.width': { description: '浮层外框宽度，数字转换为 px，字符串作为 CSS 长度；受视口边界约束；Tooltip 省略时为 max-content，短文本紧凑、长文本换行。' },
  'tooltip.ZtTooltip.props.height': { description: '浮层外框高度，数字转换为 px，字符串作为 CSS 长度；受视口边界约束；省略时按内容高度展示，指定高度后仅内容区滚动。' },
  'popover.ZtPopover.props.width': { description: '浮层外框宽度，数字转换为 px，字符串作为 CSS 长度；受视口边界约束。' },
  'popover.ZtPopover.props.height': { description: '浮层外框高度，数字转换为 px，字符串作为 CSS 长度；受视口边界约束；省略时按内容高度展示，指定高度后仅内容区滚动。' },

  'drawer.ZtDrawer.props.subtitle': { description:'标题下方的辅助说明。' },
  'drawer.ZtDrawer.props.closeLabel': { description:'关闭按钮的无障碍名称。' },
  'drawer.ZtDrawer.props.bodyScroll': { description:'是否由抽屉内容区管理纵向滚动；设为 false 可让内部表格或树独立滚动。' },
  'drawer.ZtDrawer.props.bodyPadding': {
    description:'正文内边距，数字按像素处理，也支持 CSS padding 简写（如 12px 20px）；可传 0 去掉内边距，不传则保留 size 对应的默认间距。',
    defaultValue:'随 size：mini 14px / small 17px / default 22px / medium 25px / large 28px',
  },
  'modal.ZtModal.props.bodyPadding': {
    description:'正文内边距，数字按像素处理，也支持 CSS padding 简写（如 12px 20px）；可传 0 去掉内边距，不传则保留 size 对应的默认间距。',
    defaultValue:'随 size：mini 14px / small 17px / default 22px / medium 25px / large 28px',
  },
  'drawer.ZtDrawer.props.loadingText': { description:'加载遮罩显示的提示文字。' },
  'drawer.ZtDrawer.events.hide': { description:'关闭过渡结束后触发，与 closed 一致。' },
  'drawer.ZtDrawer.slots.header-actions': { description:'标题栏右侧的额外操作，位于关闭按钮之前。' },
  'modal.ZtModal.events.confirm': { description:'用户点击确认且 beforeConfirm 允许继续后触发。' },
  'drawer.ZtDrawer.events.close': { description:'抽屉开始关闭时触发；beforeClose 拒绝时不会触发。' },
  'popconfirm.ZtPopconfirm.props.size': {
    description: '整体尺寸，统一控制面板间距、标题、说明、图标和按钮；未设置时继承 ConfigProvider。',
    defaultValue: "继承 ConfigProvider（最终为 'default'）",
  },
  'popconfirm.ZtPopconfirm.props.buttonSize': {
    description: '独立设置确认、取消按钮的尺寸，优先于 size；不影响面板、文字、图标和触发器。',
    defaultValue: '跟随 size',
  },
  'popconfirm.ZtPopconfirm.events.confirm-error': { description:'异步确认守卫抛错或 Promise 拒绝时触发，参数为错误对象。' },
}
