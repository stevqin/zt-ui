export default {
  'select-box.ZtSelectBox.props.pageSize': {
    description: '本地与远程模式共用的每页条数；支持 v-model:page-size，变化时回到第 1 页。非正数或非有限值回退到 10，有限小数向下取整。',
  },
  'select-box.ZtSelectBox.props.pageSizes': {
    description: '分页器可选每页条数；过滤非正整数并去重，自动补入当前有效 pageSize。',
  },
  'select-box.ZtSelectBox.props.remoteMethod': {
    description: '按 mode 区分 search 分页查询与 batch 全量精确匹配；返回同 mode 的 options/total 或 matches，具体见远程请求与结果类型。',
  },
  'select-box.ZtSelectBox.props.clearable': {
    description: '有已确认值且未禁用时显示清空按钮；即时提交空数组并同步草稿，无需再次确认。',
  },
  'select-box.ZtSelectBox.exposes.clear': {
    description: '仅在 clearable=true 时生效；立即清空已确认值、草稿和搜索，输出 change 与 clear 并触发表单校验；面板保持原开关状态，焦点回到触发器。',
    type: '() => void',
  },
  'select-box.ZtSelectBox.exposes.close': {
    description: '关闭面板并丢弃未确认草稿，已确认值保持不变。',
  },
  'select-box.ZtSelectBox.events.remote-error': {
    description: '当前远程分页或批量匹配请求失败时触发；过期请求不触发。',
  },
  'select-box.ZtSelectBox.slots.option': {
    description: '自定义左侧固定复选框之后的选项内容；点击内容和行空白均切换草稿选择。',
    type: '{ option: ZtSelectOption; selected: boolean; disabled: boolean }',
  },
  'tree.ZtTree.props.status': { defaultValue: "'primary'" },
  'tree-select.ZtTreeSelect.props.status': { defaultValue: "'primary'" },
  'cascader.ZtCascader.props.status': { defaultValue: "'primary'" },
  'transfer.ZtTransfer.props.status': { defaultValue: "'primary'" },
  'tree-select.ZtTreeSelect.props.height': { defaultValue: '280' },
  'tree-select.ZtTreeSelect.props.itemHeight': {
    defaultValue: '随 size 为 24 / 28 / 32 / 36 / 40px',
  },
  'tree.ZtTree.props.itemHeight': {
    defaultValue: '随 size 为 24 / 28 / 32 / 36 / 40px',
  },
  'qrcode.ZtQRCode.exposes.download': {
    description:
      '下载当前成功生成的二维码；SVG 模式下载 SVG，Canvas 模式下载 PNG；无有效码时返回 false。',
  },
  'anchor.ZtAnchor.slots.link': {
    description: '自定义锚点链接正文，接收当前 link 及是否处于活动状态。',
  },
  'page-header.ZtPageHeader.events.back': {
    description:
      '用户点击返回按钮时触发；组件不自动操作浏览器历史，由业务决定目的地。',
  },
  'page-header.ZtPageHeader.slots.breadcrumb': {
    description: '页头上方的面包屑导航区域。',
  },
  'page-header.ZtPageHeader.slots.back-icon': {
    description: '替换返回按钮图标；按钮继续保留返回的可访问名称。',
  },
  'infinite-scroll.ZtInfiniteScroll.slots.finished': {
    description: '所有数据加载完毕时显示的内容。',
  },
  'infinite-scroll.ZtInfiniteScroll.exposes.check': {
    description:
      '立即检查哨兵是否接近容器底部，满足距离且未禁用、未加载、未完成时发起加载。',
  },
  'carousel.ZtCarousel.exposes.prev': {
    description:
      '请求切换到上一项并发出更新事件；非循环模式下到第一项后保持不变。',
  },
  'carousel.ZtCarousel.exposes.next': {
    description:
      '请求切换到下一项并发出更新事件；非循环模式下到最后一项后保持不变。',
  },
  'carousel.ZtCarousel.exposes.goTo': {
    description:
      '按从 0 开始的索引请求切换；循环模式取模，非循环模式限制到合法范围。',
  },
  'tour.ZtTour.events.finish': {
    description: '在最后一步点击完成且成功关闭引导后触发。',
  },
  'date-picker-panel.ZtDatePickerPanel.props.showHolidays': {
    description: '在日期单元内展示 holidays 对应的节日名称，默认 true。',
  },
  'color-picker-panel.ZtColorPickerPanel.exposes.confirm': {
    description:
      '提交合法草稿色值并触发 update:modelValue 和 change；非法输入保留面板并提示。',
  },
  'color-picker-panel.ZtColorPickerPanel.exposes.cancel': {
    description: '丢弃面板草稿并恢复当前 modelValue，触发 cancel。',
  },
  'table.ZtTable.slots.expand': {
    description: '自定义展开行正文，接收当前 row 与行 index。',
  },
  'timeline.ZtTimeline.slots.node': {
    description: '替换时间线节点图标，接收当前 item 与 index。',
  },
  'calendar.ZtCalendar.events.panel-change': {
    description: '工具栏切换显示日期或视图后触发；不代表已选择日期发生变化。',
  },
  'calendar.ZtCalendar.slots.header': {
    description: '替换日历工具栏；使用插槽参数提供的切换方法控制面板。',
  },
  'calendar.ZtCalendar.slots.date-cell': {
    description: '日期单元内容，可读取日期、选中状态、是否本月、禁用和节假日。',
    type: '{ date: Date; day: string; selected: boolean; currentMonth: boolean; disabled: boolean; holiday?: string }',
  },
  'splitter.ZtSplitter.events.resize-start': {
    description: '用户开始拖动分隔条时触发。',
  },
  'splitter.ZtSplitter.events.resize-end': {
    description: '指针拖动结束时触发，参数为第一栏最终百分比。',
  },
  'splitter.ZtSplitter.events.collapse': {
    description: '用户收起或恢复第一栏后触发，参数为是否收起。',
  },
  'tree.ZtTree.events.check': {
    description: '用户勾选节点后触发，携带联动计算后的 key 数组与当前节点。',
  },
  'tree.ZtTree.events.load-error': {
    description:
      '加载子节点失败时触发，携带错误与待加载节点；节点旁提供重试按钮。',
  },
  'cascader.ZtCascader.events.load-error': {
    description: '加载层级子选项失败时触发，参数为错误和当前分支节点。',
  },
  'tree-select.ZtTreeSelect.events.load-error': {
    description: '内部树加载子节点失败时触发，参数为错误和当前分支节点。',
  },
  'transfer.ZtTransfer.events.left-check-change': {
    description:
      '左栏临时勾选集合变化时触发，参数为左栏当前勾选 key 数组；尚未移动目标数据。',
  },
  'transfer.ZtTransfer.events.right-check-change': {
    description:
      '右栏临时勾选集合变化时触发，参数为右栏当前勾选 key 数组；尚未移动目标数据。',
  },
  'card.ZtCard.slots.header': {
    description: '替换卡片标题区内容；右侧操作仍由 extra 插槽提供。',
  },
  'splitter.ZtSplitter.slots.first': { description: '第一个面板的内容。' },
  'splitter.ZtSplitter.slots.second': { description: '第二个面板的内容。' },
  'empty.ZtEmpty.slots.image': {
    description: '替换空状态图形，可放入图片或 SVG。',
  },
  'skeleton.ZtSkeleton.slots.template': {
    description: '自定义加载期间的骨架占位，建议使用 SkeletonItem 组合。',
  },
  'loading.ZtLoading.slots.indicator': {
    description: '替换默认旋转加载指示器；加载说明继续通过 text 展示。',
  },
  'dropdown.ZtDropdown.events.command': {
    description: '用户选择可用操作时触发，参数依次为命令 key 和完整菜单项。',
  },
  'dropdown.ZtDropdown.slots.item': {
    description: '自定义每个可操作菜单项的内容；item 为当前菜单项。',
    type: '{ item: ZtDropdownItem }',
  },
};
