# 组件与文档扩展

## 范围与兼容性

新增单 SKU 选择面板和引用面板；完善普通 Table 常用能力与 Form/Table 使用场景；搜索使用 ZtModal；文档布局占满可用宽高；VTableGrid 提供可传参数的 Canvas 链接按钮。保留现有 API 与默认行为，沿用全局 size、theme、borderRadius、focusRing，演示使用中性公开数据。

## SKU 选择面板

新增 ZtSkuSelect（src/components/sku-select），products 为 SPU 数组，每项含 code/name/skcs。SKC 含 colorCode/colorName/image/disabled/skus；SKU 含 code/sizeCode/sizeName/disabled。v-model 为 SKU code 或 null，change 返回所选 SPU/SKC/SKU 上下文或 null。产品、颜色、尺码均使用代码作为身份，不用显示名称拼接。单 SPU 隐藏产品切换控件，多 SPU 可切换。SKC 展示图片；颜色禁用或所有尺码禁用时不可选择。切换产品/颜色清除不再适用的尺码；数据变更导致当前 SKU 不可用时同步清除。支持 clearable、disabled，完整受控值回显；不修改传入数据。所有按钮有明确可读标签及键盘交互。新增基础选择、禁用选项、受控变更三个独立示例。

## 引用面板与表单示例

新增 ZtBlockquote（src/components/blockquote），使用 blockquote 语义，左侧强调线及淡色背景；支持 title、cite、status、size，default/title/footer 插槽，明暗主题与全局圆角。内容使用 Vue 文本和插槽。新增基础引用、业务说明与嵌套引用示例。

Form 新增布局与标签宽度、复杂/嵌套字段与动态增删、分组禁用、局部校验/重置、服务端错误与提交状态、下边框与自定义标签等独立示例，说明 prop 路径、Promise 校验失败、异步校验与重置初值语义。示例只调用真实公开 API。

## 普通 Table

在现有排序、选择、展开、固定列、调宽、模板列基础上增加序号列、列筛选、汇总行、单元格合并、当前行高亮、溢出提示、行/单元格样式回调。筛选支持本地处理与远程事件，保持排序及原始行索引上下文。spanMethod 定义 rowspan/colspan，0 隐藏被合并单元格；防止越界，保持工具列和固定列布局。汇总允许默认数值求和和自定义方法。选择、编辑用例保留稳定 rowKey。新增每项功能的独立示例及完整远程分页/筛选/排序组合场景。多级表头、树形数据和虚拟列表不在本轮范围。

## 搜索与布局

DocSearch 替换自建 DocDialog 为 ZtModal，保留搜索索引、方向键/Enter、快捷键、关闭及焦点返回，使用 Modal 的遮罩、滚动锁与焦点管理。打开后搜索框聚焦，重新打开重置活动索引到有效范围；结果变化不留下无效 aria-activedescendant。

文档布局去掉 1440px 总宽与 880px 正文上限。桌面左侧定宽 264px，中间 minmax(0,1fr)，右侧定宽 184px；1199px 及以下移除右栏及其网格轨道；手机保留抽屉式导航。导航与锚点高度使用可视区域高度并独立滚动；长代码/API 表格内部滚动，禁止全页横向溢出。

## VTableGrid 链接按钮

操作按钮新增 mode:link，无填充和外框；保留 type 作为业务动作标识。handler 保留第一个 row 参数，增加第二个事件上下文，包含 field/value/rowIndex/params，params 支持静态值或按行求值；action 事件带同样上下文。业务列提供 link 配置，用 Canvas 链接外观展示字段值或配置文字，点击触发 link-click 事件及可选 handler。禁用/忙碌/汇总行不触发；不自动打开外部 URL，链接可以用于详情面板、路由或业务事件。提供行参数和自定义参数的独立示例。

## 集成与验证

新增组件统一从 components/index.ts 导出，更新组件清单、API 说明生成补充、文档导航与类型说明。为功能先补回归测试，再实施并执行相关单测。最终顺序运行组件库完整测试、类型检查/构建及契约审计、文档站完整测试和构建、浏览器回归。浏览器覆盖 SKU 选择与禁用、引用样式、Form 校验、Table 新功能、搜索键盘/焦点、宽屏/窄屏网格尺寸和真实 Canvas 点击传参。
