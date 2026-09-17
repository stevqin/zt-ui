// Generated from the reviewed component API tables; edit grouped metadata to override.
export default {
  "icon.ZtIcon.props.name": {
    "description": "内置图标名称。默认插槽和 component 的优先级更高。"
  },
  "icon.ZtIcon.props.component": {
    "description": "自定义 Vue 图标组件。"
  },
  "icon.ZtIcon.props.size": {
    "description": "五档预设尺寸、像素数值或 CSS 长度，默认继承 ConfigProvider。"
  },
  "icon.ZtIcon.props.color": {
    "description": "自定义图标颜色，覆盖 status。"
  },
  "icon.ZtIcon.props.status": {
    "description": "图标主题颜色。"
  },
  "icon.ZtIcon.props.rotate": {
    "description": "顺时针旋转角度。"
  },
  "icon.ZtIcon.props.spin": {
    "description": "是否持续旋转；系统减少动画时停止。"
  },
  "icon.ZtIcon.props.strokeWidth": {
    "description": "内置线性图标的描边宽度。"
  },
  "icon.ZtIcon.props.label": {
    "description": "图标的无障碍名称；未设置时视为装饰内容。"
  },
  "link.ZtLink.props.href": {
    "description": "原生链接地址。"
  },
  "link.ZtLink.props.to": {
    "description": "Vue Router 路由目标；没有 Router 时字符串目标回退为 href。"
  },
  "link.ZtLink.props.replace": {
    "description": "路由导航时使用 replace。"
  },
  "link.ZtLink.props.target": {
    "description": "原生链接打开目标。"
  },
  "link.ZtLink.props.rel": {
    "description": "原生链接关系；target=_blank 时默认补充安全值。"
  },
  "link.ZtLink.props.download": {
    "description": "原生下载属性。"
  },
  "link.ZtLink.props.status": {
    "description": "链接主题颜色。"
  },
  "link.ZtLink.props.size": {
    "description": "链接尺寸，默认继承 ConfigProvider。"
  },
  "link.ZtLink.props.disabled": {
    "description": "禁用导航、点击事件和键盘聚焦。"
  },
  "link.ZtLink.props.underline": {
    "description": "下划线显示策略。"
  },
  "link.ZtLink.props.icon": {
    "description": "左侧内置图标名或 Vue 图标组件。"
  },
  "link.ZtLink.props.suffixIcon": {
    "description": "右侧内置图标名或 Vue 图标组件。"
  },
  "text.ZtText.props.tag": {
    "description": "安全的 HTML 语义标签。"
  },
  "text.ZtText.props.status": {
    "description": "文本主题颜色。"
  },
  "text.ZtText.props.size": {
    "description": "文本尺寸，默认继承 ConfigProvider。"
  },
  "text.ZtText.props.weight": {
    "description": "预设或数值字重。"
  },
  "text.ZtText.props.truncated": {
    "description": "单行溢出时显示省略号。"
  },
  "text.ZtText.props.lineClamp": {
    "description": "多行省略的最大行数，优先于 truncated。"
  },
  "text.ZtText.props.title": {
    "description": "原生 title；截断纯文本未设置时自动生成。"
  },
  "scrollbar.ZtScrollbar.props.height": {
    "description": "滚动区域高度，数值按像素处理。"
  },
  "scrollbar.ZtScrollbar.props.maxHeight": {
    "description": "滚动区域最大高度，数值按像素处理。"
  },
  "scrollbar.ZtScrollbar.props.native": {
    "description": "使用系统原生滚动条。"
  },
  "scrollbar.ZtScrollbar.props.always": {
    "description": "内容溢出时始终显示自定义轨道。"
  },
  "scrollbar.ZtScrollbar.props.minSize": {
    "description": "自定义滑块最小长度，单位像素。"
  },
  "scrollbar.ZtScrollbar.props.noresize": {
    "description": "关闭 ResizeObserver 自动尺寸更新。"
  },
  "scrollbar.ZtScrollbar.props.wrapClass": {
    "description": "滚动容器的附加类。"
  },
  "scrollbar.ZtScrollbar.props.wrapStyle": {
    "description": "滚动容器的附加样式。"
  },
  "scrollbar.ZtScrollbar.props.viewClass": {
    "description": "内容视图的附加类。"
  },
  "scrollbar.ZtScrollbar.props.viewStyle": {
    "description": "内容视图的附加样式。"
  },
  "scrollbar.ZtScrollbar.props.tag": {
    "description": "内容视图使用的 HTML 标签。"
  },
  "scrollbar.ZtScrollbar.props.size": {
    "description": "轨道密度尺寸，默认继承 ConfigProvider。"
  },
  "popover.ZtPopover.props.visible": {
    "description": "浮层是否显示，支持 v-model:visible。"
  },
  "popover.ZtPopover.props.trigger": {
    "description": "触发方式。"
  },
  "popover.ZtPopover.props.placement": {
    "description": "首选出现方位，空间不足时自动翻转。"
  },
  "popover.ZtPopover.props.width": {
    "description": "浮层宽度，数值按像素处理。"
  },
  "popover.ZtPopover.props.offset": {
    "description": "浮层与触发器的间距。"
  },
  "popover.ZtPopover.props.disabled": {
    "description": "禁用全部打开交互。"
  },
  "popover.ZtPopover.props.showArrow": {
    "description": "是否显示指向触发器的箭头。"
  },
  "popover.ZtPopover.props.teleported": {
    "description": "是否 Teleport 到 body。"
  },
  "popover.ZtPopover.props.openDelay": {
    "description": "打开延迟毫秒数。"
  },
  "popover.ZtPopover.props.closeDelay": {
    "description": "关闭延迟毫秒数。"
  },
  "popover.ZtPopover.props.zIndex": {
    "description": "浮层层级。"
  },
  "popover.ZtPopover.props.persistent": {
    "description": "关闭后保留浮层 DOM。"
  },
  "popconfirm.ZtPopconfirm.props.visible": {
    "description": "是否显示，支持 v-model:visible。"
  },
  "popconfirm.ZtPopconfirm.props.title": {
    "description": "确认标题。"
  },
  "popconfirm.ZtPopconfirm.props.description": {
    "description": "补充说明。"
  },
  "popconfirm.ZtPopconfirm.props.status": {
    "description": "语义主题颜色。"
  },
  "popconfirm.ZtPopconfirm.props.icon": {
    "description": "内置图标名或 Vue 图标组件。"
  },
  "popconfirm.ZtPopconfirm.props.hideIcon": {
    "description": "隐藏状态图标。"
  },
  "popconfirm.ZtPopconfirm.props.confirmText": {
    "description": "确认按钮文字。"
  },
  "popconfirm.ZtPopconfirm.props.cancelText": {
    "description": "取消按钮文字。"
  },
  "popconfirm.ZtPopconfirm.props.buttonSize": {
    "description": "按钮尺寸。"
  },
  "popconfirm.ZtPopconfirm.props.confirmLoading": {
    "description": "外部确认加载状态。"
  },
  "popconfirm.ZtPopconfirm.props.confirmDisabled": {
    "description": "禁用确认按钮。"
  },
  "popconfirm.ZtPopconfirm.props.cancelDisabled": {
    "description": "禁用取消按钮。"
  },
  "popconfirm.ZtPopconfirm.props.hideAfterConfirm": {
    "description": "成功确认后关闭。"
  },
  "popconfirm.ZtPopconfirm.props.beforeConfirm": {
    "description": "确认前钩子；返回 false 或拒绝时保持打开。"
  },
  "popconfirm.ZtPopconfirm.props.placement": {
    "description": "浮层方位。"
  },
  "popconfirm.ZtPopconfirm.props.disabled": {
    "description": "整体禁用。"
  },
  "tabs.ZtTabs.props.modelValue": {
    "description": "当前标签名称，支持 v-model。"
  },
  "tabs.ZtTabs.props.type": {
    "description": "标签外观。"
  },
  "tabs.ZtTabs.props.position": {
    "description": "标签导航位置。"
  },
  "tabs.ZtTabs.props.closable": {
    "description": "全部标签允许关闭。"
  },
  "tabs.ZtTabs.props.addable": {
    "description": "显示新增按钮。"
  },
  "tabs.ZtTabs.props.editable": {
    "description": "同时启用新增和关闭。"
  },
  "tabs.ZtTabs.props.stretch": {
    "description": "标签平均铺满可用空间。"
  },
  "tabs.ZtTabs.props.beforeLeave": {
    "description": "切换前守卫，返回 false 或拒绝时保留当前项。"
  },
  "tabs.ZtTabs.props.status": {
    "description": "选中主题颜色。"
  },
  "tabs.ZtTabs.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "tabs.ZtTabPane.props.name": {
    "description": "标签唯一名称。"
  },
  "tabs.ZtTabPane.props.label": {
    "description": "标签文字。"
  },
  "tabs.ZtTabPane.props.disabled": {
    "description": "禁用选择。"
  },
  "tabs.ZtTabPane.props.closable": {
    "description": "当前标签允许关闭。"
  },
  "tabs.ZtTabPane.props.lazy": {
    "description": "首次激活时才渲染内容。"
  },
  "breadcrumb.ZtBreadcrumb.props.separator": {
    "description": "分隔符文字。"
  },
  "breadcrumb.ZtBreadcrumb.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "breadcrumb.ZtBreadcrumb.props.ariaLabel": {
    "description": "导航的无障碍名称。"
  },
  "breadcrumb.ZtBreadcrumbItem.props.href": {
    "description": "原生链接地址。"
  },
  "breadcrumb.ZtBreadcrumbItem.props.to": {
    "description": "Vue Router 路由目标。"
  },
  "breadcrumb.ZtBreadcrumbItem.props.disabled": {
    "description": "禁用导航。"
  },
  "breadcrumb.ZtBreadcrumbItem.props.target": {
    "description": "链接打开位置。"
  },
  "segmented.ZtSegmented.props.modelValue": {
    "description": "当前值，支持 v-model。"
  },
  "segmented.ZtSegmented.props.options": {
    "description": "字符串、数字、布尔值或完整选项。"
  },
  "segmented.ZtSegmented.props.disabled": {
    "description": "整体禁用。"
  },
  "segmented.ZtSegmented.props.block": {
    "description": "平均铺满容器。"
  },
  "segmented.ZtSegmented.props.status": {
    "description": "选中主题颜色。"
  },
  "segmented.ZtSegmented.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "segmented.ZtSegmented.props.ariaLabel": {
    "description": "无障碍名称。"
  },
  "descriptions.ZtDescriptions.props.title": {
    "description": "标题。"
  },
  "descriptions.ZtDescriptions.props.column": {
    "description": "桌面端列数。"
  },
  "descriptions.ZtDescriptions.props.border": {
    "description": "是否显示边框。"
  },
  "descriptions.ZtDescriptions.props.labelWidth": {
    "description": "标签宽度。"
  },
  "descriptions.ZtDescriptions.props.direction": {
    "description": "标签位置。"
  },
  "descriptions.ZtDescriptions.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "descriptions.ZtDescriptionsItem.props.label": {
    "description": "标签文字。"
  },
  "descriptions.ZtDescriptionsItem.props.span": {
    "description": "占据列数。"
  },
  "descriptions.ZtDescriptionsItem.props.labelWidth": {
    "description": "自定义标签宽度。"
  },
  "descriptions.ZtDescriptionsItem.props.className": {
    "description": "自定义内容类名。"
  },
  "collapse.ZtCollapse.props.modelValue": {
    "description": "展开的面板名称，支持 v-model。"
  },
  "collapse.ZtCollapse.props.accordion": {
    "description": "手风琴模式。"
  },
  "collapse.ZtCollapse.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "collapse.ZtCollapseItem.props.name": {
    "description": "面板唯一名称。"
  },
  "collapse.ZtCollapseItem.props.title": {
    "description": "标题。"
  },
  "collapse.ZtCollapseItem.props.disabled": {
    "description": "禁用面板。"
  },
  "collapse.ZtCollapseItem.props.lazy": {
    "description": "首次展开时才渲染内容。"
  },
  "result.ZtResult.props.status": {
    "description": "结果状态或 HTTP 状态。"
  },
  "result.ZtResult.props.title": {
    "description": "主标题。"
  },
  "result.ZtResult.props.subTitle": {
    "description": "补充说明。"
  },
  "result.ZtResult.props.icon": {
    "description": "自定义图标名。"
  },
  "image.ZtImage.props.src": {
    "description": "图片地址。"
  },
  "image.ZtImage.props.alt": {
    "description": "替代文字。"
  },
  "image.ZtImage.props.fit": {
    "description": "object-fit 模式。"
  },
  "image.ZtImage.props.position": {
    "description": "object-position。"
  },
  "image.ZtImage.props.lazy": {
    "description": "启用原生懒加载。"
  },
  "image.ZtImage.props.previewSrcList": {
    "description": "预览图片地址列表。"
  },
  "image.ZtImage.props.initialIndex": {
    "description": "预览初始索引。"
  },
  "image.ZtImage.props.infinite": {
    "description": "是否循环预览。"
  },
  "image.ZtImage.props.hideOnClickModal": {
    "description": "点击遮罩关闭预览。"
  },
  "image.ZtImage.props.closeOnPressEscape": {
    "description": "Escape 关闭预览。"
  },
  "image.ZtImage.props.zIndex": {
    "description": "预览层级。"
  },
  "image.ZtImageViewer.props.urls": {
    "description": "图片地址列表。"
  },
  "image.ZtImageViewer.props.initialIndex": {
    "description": "初始索引。"
  },
  "image.ZtImageViewer.props.infinite": {
    "description": "是否循环。"
  },
  "image.ZtImageViewer.props.zoomRate": {
    "description": "缩放倍率。"
  },
  "image.ZtImageViewer.props.minScale": {
    "description": "最小缩放。"
  },
  "image.ZtImageViewer.props.maxScale": {
    "description": "最大缩放。"
  },
  "image.ZtImageViewer.props.hideOnClickModal": {
    "description": "点击遮罩关闭。"
  },
  "image.ZtImageViewer.props.closeOnPressEscape": {
    "description": "Escape 关闭。"
  },
  "image.ZtImageViewer.props.zIndex": {
    "description": "层级。"
  },
  "avatar.ZtAvatar.props.src": {
    "description": "图片地址。"
  },
  "avatar.ZtAvatar.props.srcSet": {
    "description": "响应式图片集合。"
  },
  "avatar.ZtAvatar.props.alt": {
    "description": "图片替代文字及文字后备。"
  },
  "avatar.ZtAvatar.props.size": {
    "description": "头像尺寸。"
  },
  "avatar.ZtAvatar.props.shape": {
    "description": "形状。"
  },
  "avatar.ZtAvatar.props.fit": {
    "description": "图片适应方式。"
  },
  "avatar.ZtAvatar.props.status": {
    "description": "状态主题。"
  },
  "avatar.ZtAvatar.props.icon": {
    "description": "后备图标名。"
  },
  "upload.ZtUpload.props.fileList": {
    "description": "文件列表，支持 v-model:file-list。回显项需有唯一 uid、name 和 status。"
  },
  "upload.ZtUpload.props.action": {
    "description": "上传地址。默认请求使用 multipart/form-data；未配置地址或自定义请求时仅选择文件。"
  },
  "upload.ZtUpload.props.method": {
    "description": "请求方法。"
  },
  "upload.ZtUpload.props.name": {
    "description": "multipart 文件字段名。"
  },
  "upload.ZtUpload.props.headers": {
    "description": "附加请求头。"
  },
  "upload.ZtUpload.props.data": {
    "description": "附加表单字段。"
  },
  "upload.ZtUpload.props.withCredentials": {
    "description": "跨域请求是否携带 Cookie 等凭据。"
  },
  "upload.ZtUpload.props.timeout": {
    "description": "请求超时毫秒数，0 表示不限。"
  },
  "upload.ZtUpload.props.accept": {
    "description": "接受的扩展名或 MIME，逗号分隔；选择和拖拽都会校验。"
  },
  "upload.ZtUpload.props.multiple": {
    "description": "允许一次选择多个文件；false 时批量拖入只取第一个文件。"
  },
  "upload.ZtUpload.props.limit": {
    "description": "列表最多容纳文件数，0 不限制。批量选择超限时整批拒绝并触发 exceed。"
  },
  "upload.ZtUpload.props.maxSize": {
    "description": "单个文件上限，单位 MB，0 不限制。"
  },
  "upload.ZtUpload.props.autoUpload": {
    "description": "选择完成后自动上传；false 时通过 submit() 上传。"
  },
  "upload.ZtUpload.props.drag": {
    "description": "开启拖拽区域。"
  },
  "upload.ZtUpload.props.disabled": {
    "description": "启用后阻止用户交互，并应用禁用状态样式。"
  },
  "upload.ZtUpload.props.size": {
    "description": "组件尺寸；未显式设置时继承最近的 ConfigProvider 或组合组件。"
  },
  "upload.ZtUpload.props.status": {
    "description": "组件的语义颜色，支持 default、primary、success、warning、danger 和 info。"
  },
  "upload.ZtUpload.props.listType": {
    "description": "列表样式：普通文件、图片缩略图列表或照片墙。照片墙达到 limit 时隐藏添加入口。"
  },
  "upload.ZtUpload.props.showFileList": {
    "description": "是否展示文件列表。"
  },
  "upload.ZtUpload.props.beforeUpload": {
    "description": "文件加入列表前的异步校验，可返回 false 拒绝或返回 File / Blob 替换上传内容。"
  },
  "upload.ZtUpload.props.beforeRemove": {
    "description": "移除前校验，返回 false 或 Promise 拒绝时保留文件。"
  },
  "upload.ZtUpload.props.request": {
    "description": "已封装的业务接口方法。组件传入 FormData 和请求上下文，可直接复用 Axios 实例及其拦截器。"
  },
  "upload.ZtUpload.props.httpRequest": {
    "description": "自定义上传：返回 Promise 或调用回调；通过 signal 或返回 abort() 支持取消。"
  },
  "input-otp.ZtInputOtp.props.modelValue": {
    "description": "输入值。使用字符串以保留开头的 0。"
  },
  "input-otp.ZtInputOtp.props.length": {
    "description": "验证码位数，1–32，默认 6。"
  },
  "input-otp.ZtInputOtp.props.integerOnly": {
    "description": "仅接受数字；关闭后允许非空白字符。全角数字会转换为半角。"
  },
  "input-otp.ZtInputOtp.props.mask": {
    "description": "遮蔽已输入字符，不影响绑定值。"
  },
  "input-otp.ZtInputOtp.props.size": {
    "description": "默认继承 Form / ConfigProvider 的尺寸。"
  },
  "input-otp.ZtInputOtp.props.status": {
    "description": "主题或校验状态，error 为 danger 的别名。"
  },
  "input-otp.ZtInputOtp.props.disabled": {
    "description": "禁用输入，可继承 Form。"
  },
  "input-otp.ZtInputOtp.props.readonly": {
    "description": "只读。"
  },
  "input-otp.ZtInputOtp.props.separator": {
    "description": "两组字符之间的分隔文本，例如 \"-\"。"
  },
  "input-otp.ZtInputOtp.props.separatorAfter": {
    "description": "在第几格后显示分隔符，默认位数的一半（向下取整）。"
  },
  "input-otp.ZtInputOtp.props.autocomplete": {
    "description": "浏览器自动填充提示，默认 one-time-code。"
  },
  "input-otp.ZtInputOtp.props.autofocus": {
    "description": "挂载时自动聚焦，默认关闭。"
  },
  "menu.ZtMenu.props.modelValue": {
    "description": "当前选中叶子项的 key，支持 v-model。"
  },
  "menu.ZtMenu.props.items": {
    "description": "菜单配置，支持分组和多级子菜单。"
  },
  "menu.ZtMenu.props.expandedKeys": {
    "description": "纵向/双栏树中展开的子菜单 key；支持 v-model:expanded-keys。"
  },
  "menu.ZtMenu.props.defaultExpandedKeys": {
    "description": "非受控模式的初始展开项。"
  },
  "menu.ZtMenu.props.accordion": {
    "description": "同一父级下只展开一个子菜单。"
  },
  "menu.ZtMenu.props.disabled": {
    "description": "禁用全部交互。"
  },
  "menu.ZtMenu.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "menu.ZtMenu.props.status": {
    "description": "选中项的主题颜色。"
  },
  "menu.ZtMenu.props.mode": {
    "description": "布局：纵向树形、模块与内容双栏、横向导航。横向模式不使用折叠和宽度拖动。"
  },
  "menu.ZtMenu.props.router": {
    "description": "启用应用已安装的 Vue Router，点击叶子项跳转并跟随当前路由选中。"
  },
  "menu.ZtMenu.props.menuTrigger": {
    "description": "横向子菜单触发方式；键盘和触屏始终支持点击。"
  },
  "menu.ZtMenu.props.collapsed": {
    "description": "整栏折叠，支持 v-model:collapsed；折叠时点击父菜单弹出子菜单，选择叶子项后自动收起浮层。"
  },
  "menu.ZtMenu.props.collapsible": {
    "description": "显示底部折叠按钮。"
  },
  "menu.ZtMenu.props.width": {
    "description": "default 尺寸下的展开基准宽度；其他 size 加上对应偏移（mini -60、small -32、medium +28、large +56px）。支持数字、CSS 长度及 v-model:width；拖动回传基准值。"
  },
  "menu.ZtMenu.props.collapsedWidth": {
    "description": "default 尺寸下的折叠基准宽度，单位 px；其他 size 偏移为 -8/-4/+4/+8px；双栏折叠时最小 60px，保留四字标签空间。"
  },
  "menu.ZtMenu.props.railWidth": {
    "description": "default 尺寸下的双栏主栏基准宽度，单位 px；其他 size 偏移为 -4/0/+4/+8px；不低于对应尺寸的默认主栏宽度。"
  },
  "menu.ZtMenu.props.resizable": {
    "description": "允许拖动右边缘调整展开宽度。"
  },
  "menu.ZtMenu.props.minWidth": {
    "description": "拖动宽度的最小值。"
  },
  "menu.ZtMenu.props.maxWidth": {
    "description": "拖动宽度的最大值。"
  },
  "menu.ZtMenu.props.activeKey": {
    "description": "双栏模式当前业务模块 key，支持 v-model:active-key。"
  },
  "menu.ZtMenu.props.ariaLabel": {
    "description": "菜单的无障碍名称。"
  },
  "slider.ZtSlider.props.modelValue": {
    "description": "当前数值；range 时使用 [起点, 终点]。"
  },
  "slider.ZtSlider.props.min": {
    "description": "最小值。"
  },
  "slider.ZtSlider.props.max": {
    "description": "最大值，必须大于 min；否则禁用交互。"
  },
  "slider.ZtSlider.props.step": {
    "description": "步长，以 min 为起点；无效值按 1 处理。"
  },
  "slider.ZtSlider.props.range": {
    "description": "双滑块范围选择，不允许交叉。"
  },
  "slider.ZtSlider.props.disabled": {
    "description": "禁用交互。"
  },
  "slider.ZtSlider.props.size": {
    "description": "尺寸，默认继承 Form 或 ConfigProvider。"
  },
  "slider.ZtSlider.props.status": {
    "description": "主题颜色。"
  },
  "slider.ZtSlider.props.showTooltip": {
    "description": "悬停、拖动或键盘聚焦时显示数值。"
  },
  "slider.ZtSlider.props.formatTooltip": {
    "description": "格式化数值提示和辅助技术读数。"
  },
  "slider.ZtSlider.props.ariaLabel": {
    "description": "控件的无障碍名称，范围模式会附加起点或终点。"
  },
  "progress.ZtProgress.props.percentage": {
    "description": "完成百分比，自动限制在 0 到 100。"
  },
  "progress.ZtProgress.props.status": {
    "description": "主题颜色。"
  },
  "progress.ZtProgress.props.size": {
    "description": "尺寸，默认继承 ConfigProvider。"
  },
  "progress.ZtProgress.props.showText": {
    "description": "是否显示进度文字。"
  },
  "progress.ZtProgress.props.indeterminate": {
    "description": "无法确定进度时使用循环动画，不向辅助技术报告百分比。"
  },
  "progress.ZtProgress.props.format": {
    "description": "格式化完成率文字。"
  },
  "progress.ZtProgress.props.ariaLabel": {
    "description": "无障碍名称。"
  },
  "config-provider.ZtConfigProvider.props.size": {
    "description": "子组件的默认尺寸，可被组件或表单显式配置覆盖。"
  },
  "config-provider.ZtConfigProvider.props.theme": {
    "description": "子组件的配色与原生控件 color-scheme，包含 Teleport 浮层。"
  },
  "config-provider.ZtConfigProvider.props.borderRadius": {
    "description": "圆角基准，单位 px；0 为直角，圆形与胶囊控件保持形状。"
  },
  "button.ZtButton.props.status": {
    "description": "颜色状态"
  },
  "button.ZtButton.props.size": {
    "description": "尺寸"
  },
  "button.ZtButton.props.circle": {
    "description": "圆形按钮"
  },
  "button.ZtButton.props.disabled": {
    "description": "禁用"
  },
  "button.ZtButton.props.loading": {
    "description": "加载态"
  },
  "button.ZtButton.props.loadingText": {
    "description": "加载文案"
  },
  "button.ZtButton.props.type": {
    "description": "原生 button type"
  },
  "tag.ZtTag.props.status": {
    "description": "颜色"
  },
  "tag.ZtTag.props.size": {
    "description": "尺寸"
  },
  "tag.ZtTag.props.effect": {
    "description": "主题"
  },
  "tag.ZtTag.props.closable": {
    "description": "可关闭"
  },
  "tag.ZtTag.props.round": {
    "description": "圆角"
  },
  "tag.ZtTag.props.hit": {
    "description": "描边"
  },
  "badge.ZtBadge.props.value": {
    "description": "显示值"
  },
  "badge.ZtBadge.props.max": {
    "description": "最大值"
  },
  "badge.ZtBadge.props.isDot": {
    "description": "圆点模式"
  },
  "badge.ZtBadge.props.hidden": {
    "description": "隐藏"
  },
  "badge.ZtBadge.props.status": {
    "description": "颜色"
  },
  "badge.ZtBadge.props.size": {
    "description": "尺寸"
  },
  "badge.ZtBadge.props.type": {
    "description": "兼容的类型字段；具体可选值见左侧类型。"
  },
  "badge.ZtBadge.props.offset": {
    "description": "偏移量"
  },
  "badge.ZtBadge.props.showZero": {
    "description": "数值为 0 时是否仍显示徽标。"
  },
  "radio.ZtRadio.props.modelValue": {
    "description": "绑定值"
  },
  "radio.ZtRadio.props.label": {
    "description": "选项值"
  },
  "radio.ZtRadio.props.disabled": {
    "description": "禁用"
  },
  "radio.ZtRadio.props.size": {
    "description": "尺寸"
  },
  "radio.ZtRadio.props.status": {
    "description": "颜色"
  },
  "radio.ZtRadio.props.border": {
    "description": "边框样式"
  },
  "radio.ZtRadio.props.name": {
    "description": "传递给内部原生表单控件的 name 属性。"
  },
  "radio.ZtRadioGroup.props.modelValue": {
    "description": "当前绑定值；使用 v-model 读取和更新。空值结构由组件值类型决定。"
  },
  "radio.ZtRadioGroup.props.disabled": {
    "description": "启用后阻止用户交互，并应用禁用状态样式。"
  },
  "radio.ZtRadioGroup.props.size": {
    "description": "组件尺寸；未显式设置时继承最近的 ConfigProvider 或组合组件。"
  },
  "radio.ZtRadioGroup.props.status": {
    "description": "组件的语义颜色，支持 default、primary、success、warning、danger 和 info。"
  },
  "checkbox.ZtCheckbox.props.modelValue": {
    "description": "单独使用时的状态"
  },
  "checkbox.ZtCheckbox.props.label": {
    "description": "控件旁展示的标签；在选项组件中也可作为选项值。"
  },
  "checkbox.ZtCheckbox.props.value": {
    "description": "组内选项值"
  },
  "checkbox.ZtCheckbox.props.disabled": {
    "description": "禁用"
  },
  "checkbox.ZtCheckbox.props.indeterminate": {
    "description": "半选"
  },
  "checkbox.ZtCheckbox.props.size": {
    "description": "尺寸"
  },
  "checkbox.ZtCheckbox.props.status": {
    "description": "颜色"
  },
  "checkbox.ZtCheckbox.props.border": {
    "description": "边框"
  },
  "checkbox.ZtCheckbox.props.checked": {
    "description": "非受控用法下的初始选中状态。"
  },
  "checkbox.ZtCheckbox.props.name": {
    "description": "传递给内部原生表单控件的 name 属性。"
  },
  "checkbox.ZtCheckboxGroup.props.modelValue": {
    "description": "当前绑定值；使用 v-model 读取和更新。空值结构由组件值类型决定。"
  },
  "checkbox.ZtCheckboxGroup.props.disabled": {
    "description": "启用后阻止用户交互，并应用禁用状态样式。"
  },
  "checkbox.ZtCheckboxGroup.props.min": {
    "description": "组合中至少需要选中的项目数量。"
  },
  "checkbox.ZtCheckboxGroup.props.max": {
    "description": "组合中最多允许选中的项目数量。"
  },
  "checkbox.ZtCheckboxGroup.props.size": {
    "description": "组件尺寸；未显式设置时继承最近的 ConfigProvider 或组合组件。"
  },
  "checkbox.ZtCheckboxGroup.props.status": {
    "description": "组件的语义颜色，支持 default、primary、success、warning、danger 和 info。"
  },
  "switch.ZtSwitch.props.modelValue": {
    "description": "绑定值"
  },
  "switch.ZtSwitch.props.disabled": {
    "description": "禁用"
  },
  "switch.ZtSwitch.props.loading": {
    "description": "加载中"
  },
  "switch.ZtSwitch.props.size": {
    "description": "尺寸"
  },
  "switch.ZtSwitch.props.status": {
    "description": "开启颜色"
  },
  "switch.ZtSwitch.props.activeText": {
    "description": "开关打开时显示的文字。"
  },
  "switch.ZtSwitch.props.inactiveText": {
    "description": "开关关闭时显示的文字。"
  },
  "switch.ZtSwitch.props.activeValue": {
    "description": "自定义值"
  },
  "switch.ZtSwitch.props.inactiveValue": {
    "description": "自定义值"
  },
  "switch.ZtSwitch.props.width": {
    "description": "控件宽度；数字按像素处理，字符串按 CSS 宽度处理。"
  },
  "input.ZtInput.props.modelValue": {
    "description": "绑定值，输入时输出字符串"
  },
  "input.ZtInput.props.type": {
    "description": "原生 input 类型"
  },
  "input.ZtInput.props.size": {
    "description": "尺寸"
  },
  "input.ZtInput.props.status": {
    "description": "校验状态"
  },
  "input.ZtInput.props.disabled": {
    "description": "禁用或只读"
  },
  "input.ZtInput.props.readonly": {
    "description": "禁用或只读"
  },
  "input.ZtInput.props.autocomplete": {
    "description": "传递给原生输入框的 autocomplete 提示，例如 username 或 current-password。"
  },
  "input.ZtInput.props.clearable": {
    "description": "显示清空按钮"
  },
  "input.ZtInput.props.maxlength": {
    "description": "最大字符数"
  },
  "input.ZtInput.props.showWordLimit": {
    "description": "显示字数，需要 maxlength"
  },
  "password.ZtPassword.props.showToggle": {
    "description": "显示密码显隐按钮"
  },
  "password.ZtPassword.props.modelValue": {
    "description": "密码值"
  },
  "password.ZtPassword.props.size": {
    "description": "尺寸"
  },
  "password.ZtPassword.props.status": {
    "description": "校验状态"
  },
  "password.ZtPassword.props.disabled": {
    "description": "禁用或只读"
  },
  "password.ZtPassword.props.readonly": {
    "description": "禁用或只读"
  },
  "password.ZtPassword.props.autocomplete": {
    "description": "传递给原生输入框的 autocomplete 提示，例如 username 或 current-password。"
  },
  "password.ZtPassword.props.clearable": {
    "description": "允许清空"
  },
  "password.ZtPassword.props.maxlength": {
    "description": "允许输入的最大字符数。"
  },
  "password.ZtPassword.props.showWordLimit": {
    "description": "是否在设置 maxlength 后显示已输入字符数。"
  },
  "input-number.ZtInputNumber.props.modelValue": {
    "description": "绑定数值"
  },
  "input-number.ZtInputNumber.props.min": {
    "description": "数值范围"
  },
  "input-number.ZtInputNumber.props.max": {
    "description": "数值范围"
  },
  "input-number.ZtInputNumber.props.step": {
    "description": "步进值"
  },
  "input-number.ZtInputNumber.props.precision": {
    "description": "小数精度"
  },
  "input-number.ZtInputNumber.props.stepStrictly": {
    "description": "输入值必须是步进倍数"
  },
  "input-number.ZtInputNumber.props.size": {
    "description": "尺寸"
  },
  "input-number.ZtInputNumber.props.disabled": {
    "description": "禁用或只读"
  },
  "input-number.ZtInputNumber.props.readonly": {
    "description": "禁用或只读"
  },
  "input-number.ZtInputNumber.props.controls": {
    "description": "显示增减按钮"
  },
  "input-number.ZtInputNumber.props.controlsPosition": {
    "description": "按钮分置、左侧堆叠或右侧堆叠"
  },
  "select.ZtSelect.props.modelValue": {
    "description": "单选值、多选值数组或空值"
  },
  "select.ZtSelect.props.options": {
    "description": "本地选项或远程初始选项"
  },
  "select.ZtSelect.props.multiple": {
    "description": "多选、筛选、远程与清空能力"
  },
  "select.ZtSelect.props.filterable": {
    "description": "多选、筛选、远程与清空能力"
  },
  "select.ZtSelect.props.remote": {
    "description": "多选、筛选、远程与清空能力"
  },
  "select.ZtSelect.props.remoteMethod": {
    "description": "远程搜索函数"
  },
  "select.ZtSelect.props.debounce": {
    "description": "远程搜索防抖毫秒数"
  },
  "select.ZtSelect.props.clearable": {
    "description": "多选、筛选、远程与清空能力"
  },
  "select.ZtSelect.props.placeholder": {
    "description": "空值、无数据与远程失败提示"
  },
  "select.ZtSelect.props.disabled": {
    "description": "禁用组件"
  },
  "select.ZtSelect.props.size": {
    "description": "控件尺寸"
  },
  "select.ZtSelect.props.noDataText": {
    "description": "空值、无数据与远程失败提示"
  },
  "select.ZtSelect.props.remoteErrorText": {
    "description": "空值、无数据与远程失败提示"
  },
  "form.ZtForm.props.model": {
    "description": "表单数据对象"
  },
  "form.ZtForm.props.rules": {
    "description": "字段校验规则"
  },
  "form.ZtForm.props.size": {
    "description": "表单及子控件尺寸"
  },
  "form.ZtForm.props.disabled": {
    "description": "行内布局或整体禁用"
  },
  "form.ZtForm.props.inline": {
    "description": "行内布局或整体禁用"
  },
  "form.ZtForm.props.labelPosition": {
    "description": "标签位置"
  },
  "form.ZtForm.props.labelWidth": {
    "description": "标签宽度"
  },
  "form.ZtForm.props.hideRequiredAsterisk": {
    "description": "隐藏必填星号"
  },
  "form.ZtForm.props.showMessage": {
    "description": "错误消息及错误滚动"
  },
  "form.ZtForm.props.scrollToError": {
    "description": "错误消息及错误滚动"
  },
  "form.ZtFormItem.props.label": {
    "description": "标签和模型路径，支持嵌套路径"
  },
  "form.ZtFormItem.props.prop": {
    "description": "标签和模型路径，支持嵌套路径"
  },
  "form.ZtFormItem.props.required": {
    "description": "添加必填规则"
  },
  "form.ZtFormItem.props.rules": {
    "description": "字段局部规则"
  },
  "form.ZtFormItem.props.error": {
    "description": "直接显示外部错误"
  },
  "form.ZtFormItem.props.showMessage": {
    "description": "覆盖表单默认配置"
  },
  "form.ZtFormItem.props.labelWidth": {
    "description": "覆盖表单默认配置"
  },
  "form.ZtFormItem.props.size": {
    "description": "覆盖表单默认配置"
  },
  "form.ZtFormGroup.props.title": {
    "description": "分组标题与说明，也支持同名插槽"
  },
  "form.ZtFormGroup.props.description": {
    "description": "分组标题与说明，也支持同名插槽"
  },
  "form.ZtFormGroup.props.disabled": {
    "description": "边框样式或整组禁用"
  },
  "form.ZtFormGroup.props.bordered": {
    "description": "边框样式或整组禁用"
  },
  "steps.ZtSteps.props.active": {
    "description": "当前步骤索引"
  },
  "steps.ZtSteps.props.direction": {
    "description": "排列方向"
  },
  "steps.ZtSteps.props.alignCenter": {
    "description": "居中排列"
  },
  "steps.ZtSteps.props.simple": {
    "description": "简洁箭头布局"
  },
  "steps.ZtSteps.props.space": {
    "description": "步骤宽度，数字单位为 px"
  },
  "steps.ZtSteps.props.finishStatus": {
    "description": "已完成步骤状态"
  },
  "steps.ZtSteps.props.processStatus": {
    "description": "当前步骤状态"
  },
  "steps.ZtSteps.props.size": {
    "description": "步骤条尺寸"
  },
  "steps.ZtStep.props.title": {
    "description": "步骤标题"
  },
  "steps.ZtStep.props.description": {
    "description": "步骤说明"
  },
  "steps.ZtStep.props.icon": {
    "description": "自定义图标或组件"
  },
  "steps.ZtStep.props.status": {
    "description": "覆盖当前步骤状态"
  },
  "pagination.ZtPagination.props.status": {
    "description": "主题颜色"
  },
  "pagination.ZtPagination.props.currentPage": {
    "description": "当前页，支持 v-model"
  },
  "pagination.ZtPagination.props.pageSize": {
    "description": "每页条数，支持 v-model"
  },
  "pagination.ZtPagination.props.total": {
    "description": "数据总数"
  },
  "pagination.ZtPagination.props.pageCount": {
    "description": "总页数，优先于 total"
  },
  "pagination.ZtPagination.props.pagerCount": {
    "description": "最多显示的页码按钮数"
  },
  "pagination.ZtPagination.props.pageSizes": {
    "description": "每页条数选项"
  },
  "pagination.ZtPagination.props.layout": {
    "description": "模块排列方式"
  },
  "pagination.ZtPagination.props.size": {
    "description": "组件尺寸"
  },
  "pagination.ZtPagination.props.small": {
    "description": "兼容的小尺寸开关；新代码应使用 size。"
  },
  "pagination.ZtPagination.props.background": {
    "description": "按钮背景样式"
  },
  "pagination.ZtPagination.props.disabled": {
    "description": "禁用分页"
  },
  "pagination.ZtPagination.props.hideOnSinglePage": {
    "description": "单页时隐藏"
  },
  "pagination.ZtPagination.props.prevText": {
    "description": "上一页、下一页文字"
  },
  "pagination.ZtPagination.props.nextText": {
    "description": "上一页、下一页文字"
  },
  "modal.ZtModal.props.modelValue": {
    "description": "显示状态"
  },
  "modal.ZtModal.props.width": {
    "description": "宽度"
  },
  "modal.ZtModal.props.top": {
    "description": "顶部偏移"
  },
  "modal.ZtModal.props.fullscreen": {
    "description": "弹层是否以全屏状态展示，支持 v-model:fullscreen。"
  },
  "modal.ZtModal.props.showFullscreenButton": {
    "description": "显示 header 全屏按钮"
  },
  "modal.ZtModal.props.draggable": {
    "description": "允许拖动 header"
  },
  "modal.ZtModal.props.size": {
    "description": "内容密度"
  },
  "modal.ZtModal.props.title": {
    "description": "标题"
  },
  "modal.ZtModal.props.ariaLabel": {
    "description": "弹层或控件的无障碍名称。"
  },
  "modal.ZtModal.props.showHeader": {
    "description": "是否渲染标题和关闭操作所在的头部区域。"
  },
  "modal.ZtModal.props.showClose": {
    "description": "是否显示内置关闭按钮。"
  },
  "modal.ZtModal.props.showFooter": {
    "description": "默认底部"
  },
  "modal.ZtModal.props.showCancelButton": {
    "description": "是否显示内置取消按钮。"
  },
  "modal.ZtModal.props.confirmText": {
    "description": "内置确认按钮的文字。"
  },
  "modal.ZtModal.props.cancelText": {
    "description": "内置取消按钮的文字。"
  },
  "modal.ZtModal.props.confirmLoading": {
    "description": "确认按钮是否显示加载状态并阻止重复提交。"
  },
  "modal.ZtModal.props.confirmDisabled": {
    "description": "是否禁用内置确认按钮。"
  },
  "modal.ZtModal.props.maskClosable": {
    "description": "遮罩关闭"
  },
  "modal.ZtModal.props.escClosable": {
    "description": "Escape 关闭"
  },
  "modal.ZtModal.props.lockScroll": {
    "description": "弹层打开期间是否锁定背景滚动。"
  },
  "modal.ZtModal.props.destroyOnClose": {
    "description": "关闭动画完成后是否销毁正文内容。"
  },
  "modal.ZtModal.props.autoFocus": {
    "description": "打开后是否自动将焦点移入弹层。"
  },
  "modal.ZtModal.props.focusTrap": {
    "description": "是否将键盘焦点限制在当前弹层内。"
  },
  "modal.ZtModal.props.zIndex": {
    "description": "自定义弹层的层叠顺序；省略时由浮层管理器分配。"
  },
  "modal.ZtModal.props.beforeClose": {
    "description": "关闭拦截"
  },
  "drawer.ZtDrawer.props.modelValue": {
    "description": "显示状态"
  },
  "drawer.ZtDrawer.props.placement": {
    "description": "方向"
  },
  "drawer.ZtDrawer.props.size": {
    "description": "宽度或高度"
  },
  "drawer.ZtDrawer.props.title": {
    "description": "标题"
  },
  "drawer.ZtDrawer.props.ariaLabel": {
    "description": "弹层或控件的无障碍名称。"
  },
  "drawer.ZtDrawer.props.showHeader": {
    "description": "是否渲染标题和关闭操作所在的头部区域。"
  },
  "drawer.ZtDrawer.props.showClose": {
    "description": "是否显示内置关闭按钮。"
  },
  "drawer.ZtDrawer.props.showFooter": {
    "description": "默认底部"
  },
  "drawer.ZtDrawer.props.showCancelButton": {
    "description": "是否显示内置取消按钮。"
  },
  "drawer.ZtDrawer.props.confirmText": {
    "description": "内置确认按钮的文字。"
  },
  "drawer.ZtDrawer.props.cancelText": {
    "description": "内置取消按钮的文字。"
  },
  "drawer.ZtDrawer.props.confirmLoading": {
    "description": "确认按钮是否显示加载状态并阻止重复提交。"
  },
  "drawer.ZtDrawer.props.confirmDisabled": {
    "description": "是否禁用内置确认按钮。"
  },
  "drawer.ZtDrawer.props.maskClosable": {
    "description": "遮罩关闭"
  },
  "drawer.ZtDrawer.props.escClosable": {
    "description": "是否允许按 Escape 请求关闭弹层。"
  },
  "drawer.ZtDrawer.props.lockScroll": {
    "description": "弹层打开期间是否锁定背景滚动。"
  },
  "drawer.ZtDrawer.props.destroyOnClose": {
    "description": "关闭动画完成后是否销毁正文内容。"
  },
  "drawer.ZtDrawer.props.autoFocus": {
    "description": "打开后是否自动将焦点移入弹层。"
  },
  "drawer.ZtDrawer.props.focusTrap": {
    "description": "是否将键盘焦点限制在当前弹层内。"
  },
  "drawer.ZtDrawer.props.zIndex": {
    "description": "自定义弹层的层叠顺序；省略时由浮层管理器分配。"
  },
  "drawer.ZtDrawer.props.beforeClose": {
    "description": "关闭拦截"
  },
  "date-picker.ZtDatePicker.props.modelValue": {
    "description": "YYYY-MM-DD；范围为两个同格式字符串。清空返回 null。无效值显示占位提示。"
  },
  "date-picker.ZtDatePicker.props.range": {
    "description": "范围选择"
  },
  "date-picker.ZtDatePicker.props.holidays": {
    "description": "key 是 YYYY-MM-DD 日期，value 是节日名；重复日期使用最后一项，无效日期和空名称忽略"
  },
  "date-picker.ZtDatePicker.props.showHolidays": {
    "description": "是否展示传入的节假日名称；不内置节假日数据"
  },
  "date-picker.ZtDatePicker.props.placeholder": {
    "description": "随单值、范围模式提供中文默认提示"
  },
  "date-picker.ZtDatePicker.props.size": {
    "description": "控制输入框和日历面板尺寸；默认继承 FormItem 尺寸"
  },
  "date-picker.ZtDatePicker.props.status": {
    "description": "颜色主题，默认 primary；兼容原 error 校验状态，danger 仅代表红色主题"
  },
  "date-picker.ZtDatePicker.props.disabled": {
    "description": "禁用 / 只读"
  },
  "date-picker.ZtDatePicker.props.readonly": {
    "description": "禁用 / 只读"
  },
  "date-picker.ZtDatePicker.props.clearable": {
    "description": "显示清空按钮"
  },
  "date-picker.ZtDatePicker.props.disabledDate": {
    "description": "返回 true 禁止选择该日期"
  },
  "date-time-picker.ZtDateTimePicker.props.modelValue": {
    "description": "YYYY-MM-DD HH:mm:ss；范围为两个同格式字符串。清空返回 null。无效值显示占位提示。"
  },
  "date-time-picker.ZtDateTimePicker.props.range": {
    "description": "范围选择"
  },
  "date-time-picker.ZtDateTimePicker.props.holidays": {
    "description": "key 是 YYYY-MM-DD 日期，value 是节日名；重复日期使用最后一项，无效日期和空名称忽略"
  },
  "date-time-picker.ZtDateTimePicker.props.showHolidays": {
    "description": "是否展示传入的节假日名称；不内置节假日数据"
  },
  "date-time-picker.ZtDateTimePicker.props.placeholder": {
    "description": "随单值、范围模式提供中文默认提示"
  },
  "date-time-picker.ZtDateTimePicker.props.size": {
    "description": "控制输入框和日历面板尺寸；默认继承 FormItem 尺寸"
  },
  "date-time-picker.ZtDateTimePicker.props.status": {
    "description": "颜色主题，默认 primary；兼容原 error 校验状态，danger 仅代表红色主题"
  },
  "date-time-picker.ZtDateTimePicker.props.disabled": {
    "description": "禁用 / 只读"
  },
  "date-time-picker.ZtDateTimePicker.props.readonly": {
    "description": "禁用 / 只读"
  },
  "date-time-picker.ZtDateTimePicker.props.clearable": {
    "description": "显示清空按钮"
  },
  "date-time-picker.ZtDateTimePicker.props.disabledDate": {
    "description": "返回 true 禁止选择该日期"
  },
  "vtable-grid.ZtVTableGrid.props.columns": {
    "description": "列配置，支持固定、排序、编辑、格式化和汇总"
  },
  "vtable-grid.ZtVTableGrid.props.records": {
    "description": "本地数据或远程查询函数"
  },
  "vtable-grid.ZtVTableGrid.props.proxyConfig": {
    "description": "本地数据或远程查询函数"
  },
  "vtable-grid.ZtVTableGrid.props.formData": {
    "description": "传给远程查询的表单对象"
  },
  "vtable-grid.ZtVTableGrid.props.pagination": {
    "description": "分页开关和页容量配置"
  },
  "vtable-grid.ZtVTableGrid.props.currentPage": {
    "description": "支持 v-model 的页码和页容量"
  },
  "vtable-grid.ZtVTableGrid.props.pageSize": {
    "description": "优先使用 pageSize，其次 pagination.pageSize，均未设置时为 200。支持 v-model:page-size。"
  },
  "vtable-grid.ZtVTableGrid.props.rowKey": {
    "description": "行唯一键字段或计算函数"
  },
  "vtable-grid.ZtVTableGrid.props.height": {
    "description": "表格高度和五档整体尺寸"
  },
  "vtable-grid.ZtVTableGrid.props.size": {
    "description": "表格高度和五档整体尺寸"
  },
  "vtable-grid.ZtVTableGrid.props.loading": {
    "description": "外部加载态、自动查询和禁用状态"
  },
  "vtable-grid.ZtVTableGrid.props.autoLoad": {
    "description": "外部加载态、自动查询和禁用状态"
  },
  "vtable-grid.ZtVTableGrid.props.disabled": {
    "description": "外部加载态、自动查询和禁用状态"
  },
  "vtable-grid.ZtVTableGrid.props.checkbox": {
    "description": "选择列和跨页选择"
  },
  "vtable-grid.ZtVTableGrid.props.reserveCheckbox": {
    "description": "选择列和跨页选择"
  },
  "vtable-grid.ZtVTableGrid.props.actionButtons": {
    "description": "操作列及其显示、禁用、状态和处理函数"
  },
  "vtable-grid.ZtVTableGrid.props.showActionsColumn": {
    "description": "操作列及其显示、禁用、状态和处理函数"
  },
  "vtable-grid.ZtVTableGrid.props.editable": {
    "description": "单元格编辑与批量保存"
  },
  "vtable-grid.ZtVTableGrid.props.batchSave": {
    "description": "单元格编辑与批量保存"
  },
  "vtable-grid.ZtVTableGrid.props.summary": {
    "description": "只读汇总行"
  },
  "vtable-grid.ZtVTableGrid.props.columnSettings": {
    "description": "列显隐、排序和持久化"
  },
  "vtable-grid.ZtVTableGrid.props.toolbar": {
    "description": "新建、导入、导出、列设置、刷新"
  },
  "vtable-grid.ZtVTableGrid.props.tableOptions": {
    "description": "其他 VTable ListTable 配置"
  }
}
