# Icon、Image、Avatar 与常用展示交互组件设计

## 目标

为 zt-ui 增加 Icon、Image、Avatar、Scrollbar、Popover、Popconfirm、Tabs、Breadcrumb、Segmented、Descriptions、Collapse 和 Result。组件保持现有 Vue 3、TypeScript、ConfigProvider、文档生成器和样式 token 约定，并覆盖亮色/暗色、五档尺寸、圆角基准、键盘操作和减少动画偏好。

## 实现策略

采用公共能力优先的分组实现：先完成 Icon、Scrollbar，并抽出轻量的锚点浮层定位与生命周期逻辑，再实现 Popover 和 Popconfirm；随后完成导航选择组件、数据展示组件，最后完成 Image 预览器与 Avatar。组件之间只通过公开 props、provide/inject 或明确的内部工具协作，不让一个高层组件依赖另一个组件的私有 DOM。

每组按测试驱动流程完成：先用组件测试表达公开行为并确认失败，再实现最少代码，最后补样式、文档站示例和 API 生成配置。每组完成后运行聚焦测试；全部完成后运行组件库与文档站的全量测试、类型检查和构建。

## 公共约定

- 所有适用组件通过 `useZtSize` 继承 ConfigProvider 的 `size`，并使用全局主题与 `borderRadius` CSS 变量。
- 状态色统一为 `default | primary | success | warning | danger | info`。只有具有选中、结果或语义状态的组件暴露 `status`。
- 浮层 Teleport 到 body，并携带 Provider 样式变量；打开时安装外部点击、Escape、滚动和窗口尺寸监听，关闭或卸载时释放。
- 动画遵守 `prefers-reduced-motion`。交互元素提供语义角色、可访问名称、当前状态和键盘路径。
- 受控值均提供 `update:*` 事件；业务事件携带稳定的值，而非要求用户解析 DOM。
- 文档页包含基础、不同状态/尺寸、禁用或异常、键盘/复杂用法和完整 API 入口。

## 基础容器组件

### Icon

`ZtIcon` 是统一尺寸、颜色和无障碍语义的 SVG 图标容器。支持 `name`、`component`、`size`（五档或 number/string）、`color`、`status`、`rotate`、`spin`、`strokeWidth` 和 `label`，渲染优先级为默认插槽、自定义 component、内置 name。没有 label 时作为装饰图标设置 `aria-hidden`；存在 label 时使用 `role="img"` 与 `aria-label`。

组件内置一组覆盖库内操作和常用业务界面的线性图标：add、minus、close、check、search、info、warning、error、success、chevron/arrow 四方向、more、user、image、upload、download、calendar、edit、delete、home、settings、refresh、visibility。内置图标共用 `currentColor`，支持 strokeWidth；各图标也以具名 Vue 组件导出，以便按需导入和获得类型提示。未知 name 显示为空并在开发环境给出一次警告。

`spin` 使用匀速旋转并遵守减少动画偏好；`rotate` 接受有限数字并转为 CSS 角度。Icon 本身不承担点击行为，交互图标应放在 Button 或具有完整键盘语义的业务控件中。

### Scrollbar

`ZtScrollbar` 使用真实可滚动容器承载默认插槽，浏览器继续负责滚轮、触控惯性、键盘和程序化滚动；组件只隐藏平台差异明显的原生轨道并绘制一致的横向、纵向轨道与滑块。支持 `height`、`maxHeight`、`native`、`always`、`minSize`、`noresize`、`wrapClass`、`wrapStyle`、`viewClass`、`viewStyle`、`tag` 和 `size`。

内容或容器尺寸变化时通过 ResizeObserver 更新滑块比例与位置；不支持 ResizeObserver 时仍在滚动和窗口 resize 时更新。滑块支持指针拖动，点击轨道按视口翻页；触摸内容区继续使用原生滚动，不劫持手势。内容没有溢出时隐藏对应轨道，`always` 只控制有溢出时是否常显。`native` 保留系统滚动条并跳过自定义轨道。

组件触发 `scroll` 事件，参数为 `{ scrollTop, scrollLeft }`。实例暴露 `wrapRef`、`update`、`scrollTo`、`setScrollTop` 和 `setScrollLeft`。滚动容器可聚焦，并保留 `aria-label`、`role` 等透传属性；自定义滑块本身不替代内容区的滚动语义。

## 浮层组件

### Popover

`ZtPopover` 使用默认插槽作为触发器、`content` 插槽作为浮层内容。支持 `v-model:visible`、`trigger`（click、hover、focus、manual）、`placement`（top/bottom/left/right 及 start/end）、`width`、`offset`、`disabled`、`showArrow`、`teleported`、`openDelay`、`closeDelay`、`zIndex` 和 `persistent`。

浮层根据可视区域自动翻转主方向并限制在视口内。click 模式支持外部点击与 Escape 关闭；hover 在触发器和内容之间移动时保持打开；focus 在焦点离开整个分支后关闭；manual 只响应受控值。实例暴露 `show`、`hide`、`toggle` 和 `updatePosition`。事件包括 visible 更新、before-enter、after-enter、before-leave、after-leave。

### Popconfirm

`ZtPopconfirm` 复用 Popover 的定位和关闭机制，默认 click 触发。支持 `title`、`description`、`status`、`icon`、确认/取消文字、按钮尺寸、`hideIcon`、`confirmLoading`、`confirmDisabled`、`cancelDisabled`、`hideAfterConfirm` 和 `beforeConfirm`。

确认流程支持同步值或 Promise。异步执行期间锁定重复确认并展示 loading；返回 false 或 Promise 拒绝时保留面板，拒绝通过 `confirm-error` 报告；成功触发 `confirm` 并按配置关闭。取消触发 `cancel` 并关闭。按钮顺序和焦点路径保持稳定。

## 导航与选择组件

### Tabs

使用 `ZtTabs` 与 `ZtTabPane` 组合。Tabs 支持 `v-model`、`type`（line、card、border-card）、`position`（top、right、bottom、left）、`closable`、`addable`、`editable`、`stretch`、`beforeLeave` 和 `status`。TabPane 支持 `name`、`label`、`disabled`、`closable`、`lazy`，以及 label/default 插槽。

标签过多时出现可滚动导航和前后按钮。方向键在可用标签间移动，Home/End 到首尾，Enter/Space 激活。切换受 `beforeLeave` 控制；关闭、新增分别触发 `tab-remove`、`tab-add`，激活触发 `tab-change`。面板使用 tablist/tab/tabpanel 语义并建立 aria 关联。

### Breadcrumb

使用 `ZtBreadcrumb` 与 `ZtBreadcrumbItem`。父组件支持 `separator`、separator 插槽、`maxItems` 和 `items` 数据方式；子项支持 `to`、`replace`、`href`、`disabled`。存在 Vue Router 时 `to` 使用 router push/replace，否则不引入强制路由依赖。`maxItems` 超限时折叠中间项，并允许展开查看完整路径。当前项设置 `aria-current="page"`。

### Segmented

`ZtSegmented` 支持字符串、数字或 `{ label, value, disabled, icon }` 选项，提供 `v-model`、`options`、`disabled`、`block`、`size`、`status`、`name` 和 label 插槽。使用 radiogroup/radio 语义，方向键跳过禁用项并立即选择，Home/End 选择首尾可用项。选中背景使用滑动指示器，在尺寸和容器变化后重新定位。

## 数据展示组件

### Descriptions

使用 `ZtDescriptions` 与 `ZtDescriptionsItem`。父组件支持 `title`、`extra`、`column`、`direction`（horizontal、vertical）、`border`、`size`、`labelWidth` 和 `colon`。子项支持 `label`、`span`、`width`、`minWidth`、`labelWidth`、`align`、`labelAlign` 和 label/default 插槽。

组件将 item 注册为结构化数据后按 column 排列，span 会裁剪到剩余列数。窄屏允许通过 CSS 自动降为单列，仍保留定义顺序。输出使用描述列表语义；border 模式提供清晰的行列关系。

### Collapse

使用 `ZtCollapse` 与 `ZtCollapseItem`。父组件支持单值/数组 `v-model`、`accordion`、`border` 和 `status`；子项支持 `name`、`title`、`disabled`，以及 title/default 插槽。点击标题或 Enter/Space 切换，方向键、Home/End 在标题之间移动。内容区域保留 aria-expanded、aria-controls 关联；展开动画以内容高度过渡，减少动画环境直接切换。

### Result

`ZtResult` 支持 `status`（default、primary、success、warning、danger、info、404、403、500）、`title`、`description`、`size`，并提供 icon、title、description、extra、default 插槽。常用状态内置一致的 SVG 图形，HTTP 状态突出数字和简短语义。Result 只负责结果展示与操作区域，不内置路由或重试业务。

## 图片组件

### Image

`ZtImage` 支持 `src`、`alt`、`fit`、`lazy`、`loading`、`objectPosition`、`previewSrcList`、`initialIndex`、`previewTeleported`、`hideOnClickModal`、`infinite`、`zoomRate`、`minScale`、`maxScale` 和 `closeOnPressEscape`。提供 placeholder、error、viewer 插槽以及 load、error、switch、close、show 事件。

加载阶段显示占位，失败后显示错误插槽；src 变化会重置状态。懒加载优先使用原生 loading 属性。存在预览列表时图片可通过点击、Enter 或 Space 打开全屏查看器。查看器支持上一张/下一张、滚轮和按钮缩放、左右旋转、拖动、双击复位、Escape 关闭，并锁定背景滚动。达到边界时根据 infinite 决定循环或禁用按钮。

### Avatar

`ZtAvatar` 支持 `src`、`srcSet`、`alt`、`shape`（circle、square）、`size`（五档或 number/string）、`fit`、`status` 和 `icon`。默认插槽可放文字或自定义图标；图片失败后触发 error，并依次回退至默认插槽、icon 或根据 alt 生成的首字符。

自定义数值尺寸转为像素；字符串尺寸作为 CSS 长度。square 使用全局圆角，circle 始终保持圆形。图片 load/error 事件向外传递，src 变化后允许重新加载。

## 文件组织与文档

每个组件使用 `src/components/<name>/Zt*.vue`、`types.ts`、`*.scss`、`index.ts` 的现有结构，并在 `src/components/index.ts` 公开导出。Popover 的定位与事件管理放在其目录内的独立 composable，Popconfirm 通过公开组件组合复用。

文档站为每个组件增加独立页面、路由、catalog 条目和 API 生成配置。组件索引中的分组为：Icon、Image、Avatar、Scrollbar、Descriptions、Result 进入“基础与反馈”；Segmented 进入“表单与选择”；Tabs、Breadcrumb 进入“导航”；Collapse 进入“数据与流程”；Popover、Popconfirm 进入“弹层与交互”。示例源码保持可复制且不依赖外部网络图片，使用本地 SVG 素材。

## 测试与验收

- Icon：三种渲染来源、尺寸、状态、旋转、减少动画行为和无障碍名称。
- Scrollbar：横纵溢出、尺寸更新、滚动事件、拖动、轨道翻页、原生模式和实例方法。
- Popover/Popconfirm：四种触发方式、定位翻转、外部点击、Escape、焦点、异步确认和清理监听器。
- Tabs/Breadcrumb/Segmented：受控状态、禁用项、增删、路由降级、溢出与完整键盘操作。
- Descriptions/Collapse/Result：布局、span、accordion、插槽、状态与尺寸继承。
- Image/Avatar：加载、错误回退、src 重置、预览切换、缩放旋转、关闭、尺寸与主题。
- 所有组件：公开类型可导入、API 生成成功、亮暗主题样式变量存在、ConfigProvider 继承正确。
- 完整门禁：组件库 `npm test` 和 `npm run build`；文档站 `npm test` 和 `npm run build`。

## 非目标

本轮不实现完整品牌图标库、动态图标下载、服务端图片处理、图片裁剪上传、AvatarGroup、拖拽排序标签、可编辑 Descriptions、面包屑自动读取路由表或跨窗口浮层。这些能力可在基础组件稳定后独立扩展。
