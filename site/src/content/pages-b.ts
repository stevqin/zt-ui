import type { DocPage } from "../app/types";

export const pagesB: DocPage[] = [
  {
    id: "sku-select", name: "SkuSelect", title: "商品 SKU 选择面板", group: "form",
    description: "通过颜色缩略图与尺码选择当前商品规格，桌面与手机自动适配。",
    usage: ["商品使用 product_no 或 spu，颜色使用 skc，尺码使用 sku；名称、图片使用 product_name、color_name、size_name、image_url。", "默认选中当前商品首个可用 SKC，不自动选择尺码或触发 SKU 更新；禁用颜色会被跳过。", "v-model 绑定 SKU；显式 null 为受控空值，省略时内部保存。change 返回原始商品、SKC 和 SKU 对象。", "面板只选择当前商品的颜色与尺码，商品选择由页面或其他组件负责。", "主图保持图片自身比例，随面板宽度缩放并限制最大高度；showMainImage=false 可关闭 PC 主图，规格区自动铺满。窄容器仍自动隐藏主图，颜色缩略图不受影响。", "清空时取消尺码并恢复首个可用 SKC。支持桌面、移动端及弹层内的窄容器布局。"],
    examples: [
      { id: "basic", title: "商品、颜色与尺码", description: "默认首个可用颜色，选择尺码后确定 SKU；业务层通过面板外的下拉框切换商品，change 保留原始 snake_case 数据。", file: "src/examples/sku-select/Basic.vue" },
      { id: "preview", title: "自适应主图与关闭主图", description: "主图按图片自身比例和面板宽度缩放；通过 showMainImage 关闭 PC 主图后，规格区自动铺满，已选 SKU 保持不变。", file: "src/examples/sku-select/Preview.vue" },
      { id: "single", title: "单个颜色", description: "单个 SKC 同样默认选中，尺码保持未选；清空后保留默认颜色。", file: "src/examples/sku-select/Single.vue" },
      { id: "responsive", title: "响应式弹层", description: "在 ZtModal 中展示商品选择；宽屏并排展示大图与规格，手机聚焦颜色与尺码，自动跳过禁用首色。", file: "src/examples/sku-select/Responsive.vue" },
      { id: "disabled", title: "禁用颜色与尺码", description: "明确禁用指定颜色或尺码组合；无可用尺码的颜色自动不可选。", file: "src/examples/sku-select/Disabled.vue" },
      { id: "controlled", title: "受控回显与数据更新", description: "外部设置 SKU 回显完整规格；商品数据变化导致当前选项失效时同步清除。", file: "src/examples/sku-select/Controlled.vue" },
    ],
  },
  {
    id: "sku-input", name: "SkuInput", title: "SKU 数量快速录入", group: "form",
    description: "面向 PC 订货与配货场景，以颜色为行、尺码为列批量录入 SKU 数量。",
    usage: [
      "product 接收单个 SPU，复用 SkuSelect 的 product_no/spu、skc、sku、color_code、size_code 与 image_url；同一颜色内尺码代码不重复，SKU 全局唯一。商品切换由业务层处理。",
      "valueType 默认 object，v-model 为 { [sku]: quantity }；设置 value-type=\"array\" 后返回 { sku, quantity }[]。空白或 0 移除对应键或记录；数组按矩阵行列排序。省略绑定时内部保存，显式传入时受控，不修改输入。",
      "对象和数组都可用于回显；数组同一 SKU 最后一条生效，非法数量及未知 SKU 不显示。切换 valueType 不自动更新或清空数量，下次有效编辑时以新模式输出。change.values 与输出模式一致，change.entries 始终为完整商品明细。",
      "横向尺码列由所有 SKC 的 skus[].size_code 自动去重合并，默认按首次出现顺序排列；sizeOrder 可调整优先顺序，其余尺码追加。缺失组合显示横杠，不提供输入框。",
      "showProductInfo 默认 true；使用 :show-product-info=\"false\" 传入布尔值可隐藏商品名称、代码及录入说明，矩阵不留顶部空白，数量和汇总保持不变。数量为空时输入框保持空白。",
      "disabled 可作用于整块面板、SKC 或 SKU；readonly 保留聚焦和复制。禁用规格已有数量继续显示并参与汇总。外部数量仅采用当前商品的正安全整数，并受 max 限制，不主动触发更新。",
      "每格仅接受非负整数，max 默认 999999；超上限自动截断，负数、小数和非数字输入恢复当前值。数量没有变化时不触发事件。",
      "Tab 使用原生焦点顺序；Enter/Shift+Enter 前后移动，上下方向键同列跳转，跳过缺失、禁用和只读格。支持从 Excel 粘贴矩形数量，按原坐标填入，非法值忽略、空白清除，单次粘贴仅发出一次更新。",
      "本组件仅面向 PC；尺码列均分可用宽度，颜色列随容器宽度调整；过窄时保留可读宽度并在组件内部滚动，颜色列、合计列及表头保持固定。size 同步调整表头、数据行、合计行与留白；主题、圆角和焦点策略沿用 ConfigProvider。",
    ],
    examples: [
      { id: "basic", title: "颜色尺码数量矩阵", description: "尺码列自动合并，颜色列及合计列固定显示。支持开关商品信息、行列汇总和由业务层清空数量；示例直接展示完整商品结构。", file: "src/examples/sku-input/Basic.vue", wide: true },
      { id: "array", title: "数组模式与批量提交", description: "value-type=\"array\" 将数量绑定为 { sku, quantity }[]；支持外部回显、单次粘贴更新和清空为空数组，保留完整业务明细事件。", file: "src/examples/sku-input/Array.vue", wide: true },
      { id: "constraints", title: "禁用规格、缺失尺码与数量上限", description: "禁用单个尺码和整行颜色，区分缺失组合；切换只读与全部禁用，单 SKU 最多录入 20 件。", file: "src/examples/sku-input/Constraints.vue", wide: true },
      { id: "keyboard", title: "键盘连续录入与 Excel 粘贴", description: "通过 focus 聚焦首格，使用 Enter 和上下方向键快速录入，支持制表符、换行组成的矩形粘贴。", file: "src/examples/sku-input/Keyboard.vue", wide: true },
      { id: "shared", title: "自定义汇总与 SkuSelect 共享数据", description: "指定尺码顺序，通过 summary 自定义汇总，使用相同商品数据预览单个 SKU 和对应录入数量。", file: "src/examples/sku-input/Shared.vue", wide: true },
    ],
  },
  {
    id: "blockquote", name: "Blockquote", title: "引用面板", group: "data",
    description: "以强调边线和淡色背景展示引用内容、来源说明与业务备注，使用原生 blockquote 语义。",
    usage: ["正文通过默认插槽传入，可放段落、链接或嵌套引用。", "cite 是原生来源 URL 属性；可见来源放在 footer 插槽。", "status 设置语义色，尺寸、主题与圆角继承全局配置。"],
    examples: [
      { id: "basic", title: "正文与引用来源", description: "展示标题、引用内容和可见来源；cite 保留原始来源 URL。", file: "src/examples/blockquote/Basic.vue" },
      { id: "statuses", title: "语义色与业务说明", description: "使用不同强调色区分说明内容，不创建额外警告角色或自动播报。", file: "src/examples/blockquote/Statuses.vue" },
      { id: "nested", title: "嵌套引用与自定义标题", description: "通过标题、正文和 footer 插槽组合多层引用内容。", file: "src/examples/blockquote/Nested.vue" },
    ],
  },
  {
    id: "input",
    name: "Input",
    title: "输入框",
    group: "form",
    description: "收集单行文本，支持清空、字数统计和密码输入。",
    usage: [
      "搜索条件和简短文本适合单行输入。",
      "只读值仍可聚焦；禁用状态阻止编辑。",
    ],
    examples: [
      {
        id: "basic",
        title: "文本与清空",
        description: "v-model 绑定字符串，clearable 在有内容时显示清空入口。",
        file: "src/examples/input/Basic.vue",
      },
      {
        id: "states",
        title: "密码与状态",
        description: "Password 继承输入框能力；状态用于显示具体字段的反馈。",
        file: "src/examples/input/States.vue",
      },
    ],
  },
  {
    id: "input-number",
    name: "InputNumber",
    title: "数字输入框",
    group: "form",
    description: "在指定范围内录入数值，控制精度和步长。",
    usage: [
      "数量、价格等数值字段应提供上下界。",
      "空值使用 null，与数值 0 区分。",
    ],
    examples: [
      {
        id: "basic",
        title: "数量与金额",
        description: "步长控制每次调整，precision 控制小数精度。",
        file: "src/examples/input-number/Basic.vue",
      },
      {
        id: "controls",
        title: "步长与按钮布局",
        description: "严格步长将值约束到步长网格，可关闭调整按钮。",
        file: "src/examples/input-number/Controls.vue",
      },
    ],
  },
  {
    id: "input-otp",
    name: "InputOtp",
    title: "验证码输入",
    group: "form",
    description: "按字符分格录入验证码，保留开头的零。",
    usage: [
      "通过字符串绑定短信验证码或安全口令。",
      "可粘贴整段验证码，也可使用方向键移动。",
    ],
    examples: [
      {
        id: "basic",
        title: "六位验证码",
        description: "complete 事件在验证码填写完整时提供结果。",
        file: "src/examples/input-otp/Basic.vue",
      },
      {
        id: "mask",
        title: "遮蔽与分组",
        description: "关闭 integerOnly 可以输入字母；mask 只遮蔽显示。",
        file: "src/examples/input-otp/Mask.vue",
      },
    ],
  },
  {
    id: "input-tag",
    name: "InputTag",
    title: "标签输入",
    group: "form",
    description: "将自由文本提交为可移除的标签列表。",
    usage: [
      "用于关键词、收件人或业务编码。",
      "分隔符用于提交和拆分粘贴内容；默认精确去重。",
    ],
    examples: [
      {
        id: "basic",
        title: "新增与移除标签",
        description: "输入文字后按 Enter 或失焦提交，可清空全部标签。",
        file: "src/examples/input-tag/Basic.vue",
      },
      {
        id: "limits",
        title: "粘贴拆分与数量限制",
        description: "逗号、分号作为额外分隔符，最多保留四个标签。",
        file: "src/examples/input-tag/Limits.vue",
      },
    ],
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    title: "自动补全",
    group: "form",
    description: "保留自由输入能力，同时提供本地或异步建议。",
    usage: [
      "适合有常用值但不限制输入的字段。",
      "fetchSuggestions 接收 AbortSignal，过期查询不会覆盖新结果。",
    ],
    examples: [
      {
        id: "basic",
        title: "本地建议",
        description: "选项使用 value 和 label，选择建议仍绑定文本。",
        file: "src/examples/autocomplete/Basic.vue",
      },
      {
        id: "remote",
        title: "异步建议",
        description: "本地延迟模拟远程接口，响应前检查取消信号。",
        file: "src/examples/autocomplete/Remote.vue",
      },
    ],
  },
  {
    id: "mention",
    name: "Mention",
    title: "提及输入",
    group: "form",
    description: "在多行文本的前缀位置插入人员或话题。",
    usage: [
      "用于评论、任务描述和协作消息。",
      "选择建议只替换前缀至光标之间的文本。",
    ],
    examples: [
      {
        id: "basic",
        title: "提及人员",
        description: "在开头或空格后输入 @，使用键盘选择人员。",
        file: "src/examples/mention/Basic.vue",
      },
      {
        id: "prefixes",
        title: "人员与话题",
        description: "异步数据源根据前缀切换建议集合。",
        file: "src/examples/mention/Prefixes.vue",
      },
    ],
  },
  {
    id: "select",
    name: "Select",
    title: "选择器",
    group: "form",
    description: "从明确的选项集合中选择单个或多个值。",
    usage: [
      "选项使用 value、label，禁用项通过 disabled 标记。",
      "大数据量可以启用 virtual；远程查询返回选项数组。",
    ],
    examples: [
      {
        id: "basic",
        title: "单选与多选",
        description: "筛选按标签匹配，折叠标签适合较长的多选结果。",
        file: "src/examples/select/Basic.vue",
      },
      {
        id: "remote",
        title: "远程搜索与虚拟列表",
        description: "本地模拟接口，输入编码后匹配结果；virtual 控制可视窗口。",
        file: "src/examples/select/Remote.vue",
      },
    ],
  },
  {
    id: "select-box",
    name: "SelectBox",
    title: "批量选择框",
    group: "form",
    description: "在带搜索的面板中维护多选草稿，确认后提交。",
    usage: [
      "用于编码批量粘贴和较大的候选集合。",
      "取消关闭面板不会提交未确认的草稿。",
    ],
    examples: [
      {
        id: "basic",
        title: "本地批量选择",
        description: "打开面板选择条目后点击确定，绑定值只包含确认结果。",
        file: "src/examples/select-box/Basic.vue",
      },
      {
        id: "remote",
        title: "分页搜索与批量匹配",
        description: "远程方法分别响应 search 分页和 batch 精确匹配请求。",
        file: "src/examples/select-box/Remote.vue",
      },
    ],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    title: "复选框",
    group: "form",
    description: "表达独立的布尔状态或一组可多选的值。",
    usage: [
      "Checkbox 使用 value 参与组选择。",
      "min、max 约束组内选择数量，indeterminate 仅表示半选视觉。",
    ],
    examples: [
      {
        id: "basic",
        title: "单项与组选择",
        description: "复选组绑定数组，禁用项不可修改。",
        file: "src/examples/checkbox/Basic.vue",
      },
      {
        id: "all",
        title: "全选与半选",
        description: "父级勾选状态由数组长度计算，点击全选切换全部值。",
        file: "src/examples/checkbox/All.vue",
      },
    ],
  },
  {
    id: "radio",
    name: "Radio",
    title: "单选框",
    group: "form",
    description: "从互斥选项中选择唯一值。",
    usage: [
      "Radio 使用 label 作为选项值，默认插槽作为可见文案。",
      "选项较少且需要直接比较时适合单选组。",
    ],
    examples: [
      {
        id: "basic",
        title: "单选组",
        description: "同组值共享一个 v-model。",
        file: "src/examples/radio/Basic.vue",
      },
      {
        id: "segmented",
        title: "连体选项",
        description: "segmented 将互斥选项展示为一组连续按钮。",
        file: "src/examples/radio/Segmented.vue",
      },
    ],
  },
  {
    id: "switch",
    name: "Switch",
    title: "开关",
    group: "form",
    description: "立即切换两个互斥的业务状态。",
    usage: [
      "适合启用、停用等立即生效的设置。",
      "异步提交期间通过 loading 防止重复操作。",
    ],
    examples: [
      {
        id: "basic",
        title: "自定义业务值",
        description: "activeValue 和 inactiveValue 可以映射字符串或数字。",
        file: "src/examples/switch/Basic.vue",
      },
      {
        id: "async",
        title: "异步保存",
        description: "更新时进入加载态，完成后显示提交结果。",
        file: "src/examples/switch/Async.vue",
      },
    ],
  },
  {
    id: "slider",
    name: "Slider",
    title: "滑块",
    group: "form",
    description: "在连续数值区间内选择一个值或范围。",
    usage: [
      "用于比例、区间筛选和近似参数调整。",
      "范围模式绑定二元数组，两个滑块不能交叉。",
    ],
    examples: [
      {
        id: "basic",
        title: "数值与格式化提示",
        description: "step 指定调整粒度，键盘方向键也可操作。",
        file: "src/examples/slider/Basic.vue",
      },
      {
        id: "range",
        title: "双端区间",
        description: "range 模式使用 [最小值, 最大值] 绑定。",
        file: "src/examples/slider/Range.vue",
      },
    ],
  },
  {
    id: "rate",
    name: "Rate",
    title: "评分",
    group: "form",
    description: "通过星形选项表达评价等级。",
    usage: ["支持键盘操作、半分和清空。", "只读模式适合展示已有评价。"],
    examples: [
      {
        id: "basic",
        title: "评分与评价文案",
        description: "再次点击当前分值可以清空，半分对应向上取整的文案。",
        file: "src/examples/rate/Basic.vue",
      },
      {
        id: "readonly",
        title: "只读分值",
        description: "readonly 保留分值展示且禁止编辑。",
        file: "src/examples/rate/Readonly.vue",
      },
    ],
  },
  {
    id: "date-picker",
    name: "DatePicker",
    title: "日期选择器",
    group: "form",
    description: "按日、月或年选择日期及范围，绑定本地日期字符串。",
    usage: [
      "单值对应 YYYY-MM-DD、YYYY-MM 或 YYYY。",
      "范围使用二元字符串数组，空值为 null。",
    ],
    examples: [
      {
        id: "basic",
        title: "日期与禁用规则",
        description: "禁用周末，清空后绑定值恢复 null。",
        file: "src/examples/date-picker/Basic.vue",
      },
      {
        id: "ranges",
        title: "范围、月份与年份",
        description: "使用 type 选择真实支持的粒度，范围可使用双面板。",
        file: "src/examples/date-picker/Ranges.vue",
      },
      {
        id: "periods",
        title: "月份范围与年度范围",
        description:
          "monthrange 和 yearrange 分别绑定 YYYY-MM 与 YYYY 二元数组。",
        file: "src/examples/date-picker/Periods.vue",
      },
    ],
  },
  {
    id: "date-picker-panel",
    name: "DatePickerPanel",
    title: "日期面板",
    group: "form",
    description: "将日期选择直接嵌入页面，无需触发浮层。",
    usage: [
      "适合看板、筛选侧栏和预约页面。",
      "值格式和选择粒度与 DatePicker 一致。",
    ],
    examples: [
      {
        id: "basic",
        title: "内嵌日历",
        description: "节假日使用本地日期 key 和名称 value。",
        file: "src/examples/date-picker-panel/Basic.vue",
      },
      {
        id: "range",
        title: "内嵌范围",
        description: "范围选中第二个有效端点后提交。",
        file: "src/examples/date-picker-panel/Range.vue",
      },
    ],
  },
  {
    id: "date-time-picker",
    name: "DateTimePicker",
    title: "日期时间选择器",
    group: "form",
    description: "在日期基础上选择精确到秒的本地时间。",
    usage: [
      "绑定 YYYY-MM-DD HH:mm:ss 格式字符串。",
      "不包含时区换算，服务端接入时约定时区。",
    ],
    examples: [
      {
        id: "basic",
        title: "日期与时分秒",
        description: "选择日期和时间后确认提交，支持清空。",
        file: "src/examples/date-time-picker/Basic.vue",
      },
      {
        id: "range",
        title: "活动起止时间",
        description: "范围值的两个端点都包含完整日期时间。",
        file: "src/examples/date-time-picker/Range.vue",
      },
    ],
  },
  {
    id: "time-picker",
    name: "TimePicker",
    title: "时间选择器",
    group: "form",
    description: "通过滚动列选择时分或时分秒。",
    usage: [
      "绑定 HH:mm 或 HH:mm:ss，范围绑定二元数组。",
      "disabledTime 接收候选完整时间及当前端点。",
    ],
    examples: [
      {
        id: "basic",
        title: "分钟步长",
        description: "使用分钟步长减少候选项；确认后提交值。",
        file: "src/examples/time-picker/Basic.vue",
      },
      {
        id: "range",
        title: "时间范围与禁用规则",
        description: "禁用早于 09:00 的候选值，秒列按 15 秒递增。",
        file: "src/examples/time-picker/Range.vue",
      },
    ],
  },
  {
    id: "time-select",
    name: "TimeSelect",
    title: "固定时间选择",
    group: "form",
    description: "按起止时间和间隔生成固定的时间选项。",
    usage: [
      "适合会议时段和固定班次。",
      "minTime 和 maxTime 排除边界值，disabledRanges 为闭区间。",
    ],
    examples: [
      {
        id: "basic",
        title: "固定时段",
        description: "从 09:00 到 18:00 每半小时一个选项。",
        file: "src/examples/time-select/Basic.vue",
      },
      {
        id: "linked",
        title: "联动起止时间",
        description: "结束时间必须晚于开始时间，同时排除午休。",
        file: "src/examples/time-select/Linked.vue",
      },
    ],
  },
  {
    id: "color-picker",
    name: "ColorPicker",
    title: "颜色选择器",
    group: "form",
    description: "选择颜色和透明度，确定后输出规范 HEX 字符串。",
    usage: [
      "输入支持 HEX、RGB 和 HSL 文本。",
      "编辑过程使用面板草稿，确定提交，取消恢复绑定值。",
    ],
    examples: [
      {
        id: "basic",
        title: "颜色与预设",
        description: "预设颜色可以快速复用品牌色，清空值为空字符串。",
        file: "src/examples/color-picker/Basic.vue",
      },
      {
        id: "alpha",
        title: "透明度",
        description: "showAlpha 显示透明度滑杆，输出包含 alpha 字节。",
        file: "src/examples/color-picker/Alpha.vue",
      },
    ],
  },
  {
    id: "color-picker-panel",
    name: "ColorPickerPanel",
    title: "颜色面板",
    group: "form",
    description: "选择颜色和透明度，确定后输出规范 HEX 字符串。",
    usage: [
      "输入支持 HEX、RGB 和 HSL 文本。",
      "编辑过程使用面板草稿，确定提交，取消恢复绑定值。",
    ],
    examples: [
      {
        id: "basic",
        title: "颜色与预设",
        description: "预设颜色可以快速复用品牌色，清空值为空字符串。",
        file: "src/examples/color-picker-panel/Basic.vue",
      },
      {
        id: "alpha",
        title: "透明度",
        description: "showAlpha 显示透明度滑杆，输出包含 alpha 字节。",
        file: "src/examples/color-picker-panel/Alpha.vue",
      },
    ],
  },
  {
    id: "form",
    name: "Form",
    title: "表单",
    group: "form",
    description: "组织字段布局、嵌套与动态数据、分组禁用、同步/异步校验、服务端反馈和完整提交过程。",
    usage: [
      "FormItem 的 prop 必须与 model 字段及 rules 键一致。",
      "validate 返回 Promise，失败时拒绝；重置恢复挂载时的字段值。",
    ],
    examples: [
      { id: "layout", title: "布局与标签宽度", description: "比较标签位置、auto 标签宽度与行内布局。", file: "src/examples/form/Layout.vue" },
      { id: "dynamic", title: "嵌套与动态字段", description: "使用路径定位动态字段；新增和删除行时保持稳定标识。", file: "src/examples/form/Dynamic.vue" },
      { id: "groups", title: "分组与禁用继承", description: "使用 FormGroup 组织字段并控制组内禁用状态。", file: "src/examples/form/Groups.vue" },
      { id: "validationactions", title: "局部校验、清除与重置", description: "调用 validateField、clearValidate、resetFields 和 scrollToField，观察作用范围及初值语义。", file: "src/examples/form/ValidationActions.vue" },
      { id: "servererrors", title: "服务端错误与提交状态", description: "异步提交期间阻止重复操作，显示并清理外部字段错误。", file: "src/examples/form/ServerErrors.vue" },
      { id: "underline", title: "下边框与自定义标签", description: "表单统一下边框外观，并使用标签插槽及字段覆盖。", file: "src/examples/form/Underline.vue" },
      {
        id: "basic",
        title: "必填与邮箱校验",
        description: "提交前调用 validate；错误在对应字段的反馈提示中显示。",
        file: "src/examples/form/Basic.vue",
      },
      {
        id: "linked",
        title: "联动与异步校验",
        description: "密码变化时重新校验确认字段，自定义校验器读取最新模型。",
        file: "src/examples/form/Linked.vue",
      },
    ],
  },
  {
    id: "upload",
    name: "Upload",
    title: "上传",
    group: "form",
    description: "管理文件选择、校验、上传进度和失败重试。",
    usage: [
      "request 复用业务 FormData 接口；httpRequest 可使用回调或 Promise。",
      "示例请求完全在本地模拟，业务接入时替换为实际接口。",
      "移除、卸载和取消会中断请求，处理函数应尊重 AbortSignal。",
    ],
    examples: [
      {
        id: "basic",
        title: "模拟上传与失败重试",
        description:
          "每个文件首次请求失败，再次点击重试成功；仅接受 CSV、TXT 且最大 2 MB。",
        file: "src/examples/upload/Basic.vue",
      },
      {
        id: "manual",
        title: "手动提交与文件校验",
        description:
          "选择后停留 ready 状态，调用 submit 才执行上传；空文件由异步校验拦截。",
        file: "src/examples/upload/Manual.vue",
      },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    title: "树形控件",
    group: "data",
    description: "呈现层级数据，支持展开、勾选、筛选和异步加载。",
    usage: [
      "节点 key 在整棵树中必须唯一，默认使用 key、label、children。",
      "checkedKeys、selectedKeys 和 expandedKeys 可以分别受控。",
    ],
    examples: [
      {
        id: "basic",
        title: "选择、勾选与筛选",
        description: "筛选保留匹配节点的祖先；父子勾选默认联动。",
        file: "src/examples/tree/Basic.vue",
      },
      {
        id: "lazy",
        title: "字段映射与懒加载",
        description: "展开分支时模拟读取子节点，字段映射沿用到异步返回的数据。",
        file: "src/examples/tree/Lazy.vue",
      },
    ],
  },
  {
    id: "tree-select",
    name: "TreeSelect",
    title: "树形选择",
    group: "form",
    description: "通过下拉树选择层级节点。",
    usage: [
      "单选绑定 key 或 null，多选绑定 key 数组。",
      "checkStrategy 控制联动后的归并结果，不改变数据结构。",
    ],
    examples: [
      {
        id: "basic",
        title: "单选与搜索",
        description: "使用与 Tree 相同的节点字段，选择节点后显示标签。",
        file: "src/examples/tree-select/Basic.vue",
      },
      {
        id: "multiple",
        title: "多选归并与标签折叠",
        description:
          "leaf 策略仅保留叶节点，collapseTags 指定最多显示标签数量。",
        file: "src/examples/tree-select/Multiple.vue",
      },
    ],
  },
  {
    id: "cascader",
    name: "Cascader",
    title: "级联选择",
    group: "form",
    description: "逐级展开层级选项，提交完整路径。",
    usage: [
      "单选为 key 路径，多选为路径数组。",
      "默认只能选叶节点；checkStrictly 允许选择分支。",
    ],
    examples: [
      {
        id: "basic",
        title: "完整路径选择",
        description: "filterable 按完整标签路径搜索。",
        file: "src/examples/cascader/Basic.vue",
      },
      {
        id: "multiple",
        title: "多路径与分支选择",
        description: "多选保持每条完整路径，允许独立选择分支。",
        file: "src/examples/cascader/Multiple.vue",
      },
    ],
  },
  {
    id: "transfer",
    name: "Transfer",
    title: "穿梭框",
    group: "form",
    description: "在待选和已选两栏之间移动扁平选项。",
    usage: [
      "绑定目标栏 key 数组，源数据 key 必须唯一。",
      "禁用条目不能勾选或移动；两侧搜索独立。",
    ],
    examples: [
      {
        id: "basic",
        title: "选择与移动",
        description: "搜索仅改变可见项，移动后更新目标 key 数组。",
        file: "src/examples/transfer/Basic.vue",
        wide: true,
      },
      {
        id: "filter",
        title: "自定义检索字段",
        description: "除标签外也允许用门店编码匹配。",
        file: "src/examples/transfer/Filter.vue",
        wide: true,
      },
    ],
  },
  {
    id: "table",
    name: "Table",
    title: "表格",
    group: "data",
    description: "展示结构化数据，支持序号、筛选、排序、选择、展开、固定列、调宽、汇总、合并与自定义单元格。",
    usage: [
      "每行 rowKey 必须稳定且唯一。",
      "显式 columns 优先于模板中的 TableColumn；服务端排序使用 remote。",
    ],
    examples: [
      { id: "index", title: "序号与自定义编号", description: "展示连续序号或自定义编号，并与排序后的可见行保持一致。", file: "src/examples/table/Index.vue", wide: true },
      { id: "filter", title: "列筛选与状态控制", description: "配置选项和筛选函数，观察本地过滤与受控筛选状态。", file: "src/examples/table/Filter.vue", wide: true },
      { id: "summary", title: "数值汇总与自定义结果", description: "在表尾展示默认数值合计，或通过 summaryMethod 自定义汇总内容。", file: "src/examples/table/Summary.vue", wide: true },
      { id: "span", title: "单元格合并", description: "使用 spanMethod 合并相邻记录，正确隐藏被覆盖单元格。", file: "src/examples/table/Span.vue", wide: true },
      { id: "currentrow", title: "当前行与键盘选择", description: "单击或使用 Enter、空格设置当前行，受控状态同步外部详情。", file: "src/examples/table/CurrentRow.vue", wide: true },
      { id: "overflow", title: "溢出提示与完整内容", description: "窄列截断内容，悬停或聚焦查看完整值。", file: "src/examples/table/Overflow.vue", wide: true },
      { id: "style", title: "行与单元格样式", description: "按行数据设置状态样式，回调取得原始行与列上下文。", file: "src/examples/table/Style.vue", wide: true },
      { id: "fixed", title: "固定表头与左右固定列", description: "设置最大高度和列宽，在滚动中保留关键字段及操作列。", file: "src/examples/table/Fixed.vue", wide: true },
      { id: "resize", title: "列宽调整", description: "拖动表头调整宽度，遵循列的最小宽度约束。", file: "src/examples/table/Resize.vue", wide: true },
      { id: "selection", title: "单选、多选与禁用行", description: "控制选中 key，展示全选、跨页保留及不可选择行。", file: "src/examples/table/Selection.vue", wide: true },
      { id: "expand", title: "可控展开与详情", description: "通过受控 expandedKeys 展开业务详情，保持原始行标识。", file: "src/examples/table/Expand.vue", wide: true },
      { id: "remote", title: "远程分页、筛选与排序", description: "组合请求参数，筛选或排序回到第一页，并防止延迟请求覆盖新结果。", file: "src/examples/table/Remote.vue", wide: true },
      {
        id: "basic",
        title: "配置列、排序与选择",
        description:
          "单击库存表头排序；选择列保留受控 key，操作槽可以更新数据。",
        file: "src/examples/table/Basic.vue",
        wide: true,
      },
      {
        id: "template",
        title: "模板列与展开行",
        description:
          "TableColumn 的 default 插槽取得行上下文，expand 列提供详情。",
        file: "src/examples/table/Template.vue",
        wide: true,
      },
    ],
  },
  {
    id: "modal",
    name: "Modal",
    title: "对话框",
    group: "overlay",
    description: "在浮层中承载需要用户处理的内容与操作。",
    usage: [
      "v-model 控制打开状态，showFooter 启用内置确认与取消。",
      "异步提交通过 confirmLoading 防止重复；beforeClose 可以拦截关闭。",
    ],
    examples: [
      {
        id: "basic",
        title: "打开与内容交互",
        description: "表单内容直接放在默认插槽中，确认事件由业务控制。",
        file: "src/examples/modal/Basic.vue",
      },
      {
        id: "async",
        title: "异步提交与关闭守卫",
        description:
          "保护未保存内容时拦截取消、遮罩和 Escape；保存成功后允许关闭。",
        file: "src/examples/modal/Async.vue",
      },
    ],
  },
  {
    id: "drawer",
    name: "Drawer",
    title: "抽屉",
    group: "overlay",
    description: "在浮层中承载需要用户处理的内容与操作。",
    usage: [
      "v-model 控制打开状态，showFooter 启用内置确认与取消。",
      "异步提交通过 confirmLoading 防止重复；beforeClose 可以拦截关闭。",
    ],
    examples: [
      {
        id: "basic",
        title: "打开与内容交互",
        description: "表单内容直接放在默认插槽中，确认事件由业务控制。",
        file: "src/examples/drawer/Basic.vue",
      },
      {
        id: "async",
        title: "异步提交与关闭守卫",
        description:
          "保护未保存内容时拦截取消、遮罩和 Escape；保存成功后允许关闭。",
        file: "src/examples/drawer/Async.vue",
      },
    ],
  },
  {
    id: "popover",
    name: "Popover",
    title: "气泡卡片",
    group: "overlay",
    description: "在触发元素附近展示可交互的补充内容。",
    usage: [
      "默认插槽是触发器，content 插槽承载浮层内容。",
      "支持 click、hover、focus 和 manual 触发方式。",
    ],
    examples: [
      {
        id: "basic",
        title: "点击卡片",
        description: "卡片内包含真实选择操作，关闭后保留绑定值。",
        file: "src/examples/popover/Basic.vue",
      },
      {
        id: "controlled",
        title: "手动控制",
        description: "manual 模式完全通过 visible 控制开关。",
        file: "src/examples/popover/Controlled.vue",
      },
    ],
  },
  {
    id: "popconfirm",
    name: "Popconfirm",
    title: "气泡确认框",
    group: "overlay",
    description: "在操作附近确认轻量的危险操作。",
    usage: [
      "beforeConfirm 返回 false 或拒绝时保持面板打开。",
      "复杂表单或长说明适合使用 Modal。",
    ],
    examples: [
      {
        id: "basic",
        title: "删除确认",
        description: "确认后更新可见结果，取消不执行删除。",
        file: "src/examples/popconfirm/Basic.vue",
      },
      {
        id: "async",
        title: "异步检查",
        description: "首次确认模拟检查失败并保留面板，第二次确认成功。",
        file: "src/examples/popconfirm/Async.vue",
      },
    ],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    title: "文字提示",
    group: "overlay",
    description: "在悬停或键盘聚焦时显示简短说明。",
    usage: [
      "重要信息应直接展示，提示用于补充解释。",
      "为触发器提供可聚焦元素，保证键盘可访问。",
    ],
    examples: [
      {
        id: "basic",
        title: "位置与内容",
        description: "content 提供纯文本，placement 指定首选方位。",
        file: "src/examples/tooltip/Basic.vue",
      },
      {
        id: "controlled",
        title: "受控显示",
        description: "用 visible 显式控制业务提示是否可见。",
        file: "src/examples/tooltip/Controlled.vue",
      },
    ],
  },
  {
    id: "dropdown",
    name: "Dropdown",
    title: "下拉菜单",
    group: "overlay",
    description: "将一组次要命令收纳在触发器附近。",
    usage: [
      "items 的 key 是 command 事件标识。",
      "分组、分隔线和禁用命令帮助组织操作。",
    ],
    examples: [
      {
        id: "basic",
        title: "命令菜单",
        description: "command 回调获取命令 key，禁用项不能执行。",
        file: "src/examples/dropdown/Basic.vue",
      },
      {
        id: "slots",
        title: "模板菜单",
        description: "dropdown 插槽内使用 DropdownItem 定义命令与自定义内容。",
        file: "src/examples/dropdown/Slots.vue",
      },
    ],
  },
  {
    id: "calendar",
    name: "Calendar",
    title: "日历",
    group: "data",
    description: "在月视图或周视图中浏览日期并展示日程内容。",
    usage: [
      "绑定本地 YYYY-MM-DD 字符串，range 限制可选日期。",
      "日期格插槽可以展示业务提醒，节假日使用 key、value。",
    ],
    examples: [
      {
        id: "basic",
        title: "日历与业务标记",
        description: "日期格保留原日期信息，增加订货会等业务标签。",
        file: "src/examples/calendar/Basic.vue",
        wide: true,
      },
      {
        id: "week",
        title: "周视图与日期范围",
        description: "受控视图可以由外部按钮切换，范围之外禁止选择。",
        file: "src/examples/calendar/Week.vue",
        wide: true,
      },
    ],
  },
  {
    id: "config-provider",
    name: "ConfigProvider",
    title: "全局配置",
    group: "foundation",
    description: "为后代组件提供默认尺寸、主题、基础圆角和统一焦点环策略。",
    usage: [
      "组件显式属性优先于最近的 Provider 默认值。",
      "嵌套 Provider 未指定的配置继续继承上层，Teleport 浮层保留配置。",
      "额外焦点环默认关闭；focus-ring=keyboard 仅键盘显示，all 所有聚焦显示，none 关闭。不会禁用焦点或键盘操作。",
    ],
    examples: [
      {
        id: "focusring",
        title: "焦点环策略与浮层继承",
        description: "默认关闭额外外框与焦点光晕。切换 keyboard 后用 Tab 导航，鼠标点击不显示焦点环；all 模式下鼠标与键盘均显示。弹窗和下拉选项继承当前模式，嵌套 none 可局部关闭。",
        file: "src/examples/config-provider/FocusRing.vue",
      },
      {
        id: "basic",
        title: "继承应用配置",
        description:
          "本示例不覆盖应用 Provider，输入框和浮层继承顶部外观设置。",
        file: "src/examples/config-provider/Basic.vue",
      },
    ],
  },
  {
    id: "vtable-grid",
    name: "VTableGrid",
    title: "高性能业务表格",
    group: "data",
    description:
      "基于 VisActor VTable 的 Canvas 业务表格，整合查询、分页、编辑和导入导出。",
    usage: [
      "需要安装 @visactor/vtable、@visactor/vue-vtable、@visactor/vtable-editors；普通表格从 @ztechjs/zt-ui 导入，Canvas 节点从 @ztechjs/zt-ui/vtable 子入口导入。",
      "业务行使用稳定唯一 rowKey；originalRecords 是保存基线，records 是当前草稿，保存成功后调用方更新基线。",
      "本地全量、localPagination 与 proxyConfig 为不同的数据模式；远程模拟只使用本地数据和延迟。",
      '默认导出 CSV；exportMethod 接收异步任务并自动管理 loading、防重复执行与失败解锁；原有 external 模式继续通过 export-request 和 exportLoading 控制。导入弹窗只负责选文件，解析和提交由调用方实现。',
    ],
    examples: [
      { id: "links", title: "链接按钮与点击传参", description: "业务单元格与操作列均可使用无边框链接，handler 接收当前行及 field/value/rowIndex/params，上层也可监听 link-click 或 action。", file: "src/examples/vtable-grid/Links.vue", wide: true },
      {
        id: "basic",
        title: "本地全量与分页",
        description:
          "切换 localPagination，观察同一份本地数据在全量和分页模式下的呈现。",
        file: "src/examples/vtable-grid/Basic.vue",
        wide: true,
      },
      {
        id: "remote",
        title: "远程分页与配置式查询",
        description:
          "proxyConfig 接收页码、排序和表单，optionLoader 统一加载品牌字典并尊重取消信号。",
        file: "src/examples/vtable-grid/Remote.vue",
        wide: true,
      },
      {
        id: "formslots",
        title: "自定义搜索表单、工具栏与底栏插槽",
        description: "form 插槽组合完整搜索表单；工具栏插槽接收选中记录与统一忙碌状态，底栏和空状态可自定义。查询、重置和批量操作均使用真实业务数据。",
        file: "src/examples/vtable-grid/FormSlots.vue",
        wide: true,
      },
      {
        id: "formfieldslots",
        title: "配置表单的字段与操作插槽",
        description: "formConfig.items[].slots.default 指向具名插槽，自定义字段与内置控件混合布局；原生提交与重置复用表单校验、查询和初始值恢复。",
        file: "src/examples/vtable-grid/FormFieldSlots.vue",
        wide: true,
      },
      {
        id: "editing",
        title: "草稿新增、删除、失败保存与撤销",
        description:
          "新增和删除直接修改 records；保存失败保留草稿，成功后更新 originalRecords；撤销恢复基线。",
        file: "src/examples/vtable-grid/Editing.vue",
        wide: true,
      },
      {
        id: "operations",
        title: "冻结、汇总、筛选、列设置和行命令",
        description:
          "商品列固定在左侧；表头筛选、列设置、行操作及右键操作共用业务数据。",
        file: "src/examples/vtable-grid/Operations.vue",
        wide: true,
      },
      {
        id: "canvas",
        title: "Canvas 单元格、表头与操作列插槽",
        description:
          "通过 column.slot、headerSlot 和 #actions 渲染 Canvas 节点，作用域提供 row/value/column/rowIndex 与忙碌状态；点击商品查看详情、操作列补货后更新库存。render 写法与具名插槽可混用，Canvas 单元格不接收普通 DOM。",
        file: "src/examples/vtable-grid/Canvas.vue",
        wide: true,
      },
      {
        id: "importexport",
        title: "导入弹窗与外部导出",
        description:
          "导入接受 CSV 并解析 name,brand,stock；exportMethod 模拟接口后下载 JSON，可切换导出失败验证错误提示与解锁重试。文件校验由导入弹窗负责。",
        file: "src/examples/vtable-grid/ImportExport.vue",
        wide: true,
      },
      {
        id: "importformats",
        title: "导入对话框的文件格式图标",
        description: "切换 CSV、XLS、XLSX 观察标题图标与格式校验。标题图标优先匹配已选文件扩展名，未选文件时使用允许的格式；confirm 将 File 交给业务处理。",
        file: "src/examples/vtable-grid/ImportFormats.vue",
        wide: true,
      },
      {
        id: "importslots",
        title: "导入对话框的插槽模板",
        description: "自定义标题、说明、选项、模板、文件展示、错误和底部操作。upload 替换整块上传内容并优先于 file；共享动作继续处理文件校验、loading 和重复提交保护。",
        file: "src/examples/vtable-grid/ImportSlots.vue",
        wide: true,
      },
      {
        id: "instance",
        title: "实例方法与容器生命周期",
        description:
          "通过实例重新加载、控制选择并在容器尺寸变化后调用 resize；组件卸载自动释放 Canvas 实例。",
        file: "src/examples/vtable-grid/Instance.vue",
        wide: true,
      },
    ],
  },
];
