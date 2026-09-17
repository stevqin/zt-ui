export default {
  'drawer.ZtDrawer.props.subtitle': { description:'标题下方的辅助说明。' },
  'drawer.ZtDrawer.props.closeLabel': { description:'关闭按钮的无障碍名称。' },
  'drawer.ZtDrawer.props.bodyScroll': { description:'是否由抽屉内容区管理纵向滚动；设为 false 可让内部表格或树独立滚动。' },
  'drawer.ZtDrawer.props.bodyPadding': { description:'内容区内边距，数字按像素处理，也支持 CSS 长度。' },
  'drawer.ZtDrawer.props.loadingText': { description:'加载遮罩显示的提示文字。' },
  'drawer.ZtDrawer.events.hide': { description:'关闭过渡结束后触发，与 closed 一致。' },
  'drawer.ZtDrawer.slots.header-actions': { description:'标题栏右侧的额外操作，位于关闭按钮之前。' },
  'modal.ZtModal.events.confirm': { description:'用户点击确认且 beforeConfirm 允许继续后触发。' },
  'drawer.ZtDrawer.events.close': { description:'抽屉开始关闭时触发；beforeClose 拒绝时不会触发。' },
  'popconfirm.ZtPopconfirm.events.confirm-error': { description:'异步确认守卫抛错或 Promise 拒绝时触发，参数为错误对象。' },
}
