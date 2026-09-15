# ZtSelect 组件设计

## 目标

为 zt-ui 增加数据驱动的 `ZtSelect` 组件，支持单选、多选、本地搜索、远程搜索、自定义插槽、键盘操作和 `ZtFormItem` 集成。组件不得依赖 Element Plus、VXE Form 或其他 UI 组件库。

## 公共类型

```ts
export type ZtSelectValue = string | number | boolean

export interface ZtSelectOption {
  label: string
  value: ZtSelectValue
  disabled?: boolean
}

export type ZtSelectModelValue = ZtSelectValue | ZtSelectValue[] | null
export type ZtSelectRemoteMethod = (keyword: string) => Promise<ZtSelectOption[]>
```

选项值限定为可稳定比较的原始类型。单选模式使用单个值或 `null`；多选模式使用值数组。模式切换时不自动转换现有值：单选收到数组时显示空值，多选收到非数组时显示空标签列表，下一次用户选择会输出当前模式对应的正确类型。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `ZtSelectModelValue` | `null` | 当前选择值 |
| `options` | `ZtSelectOption[]` | `[]` | 本地选项；远程模式下作为初始选项 |
| `multiple` | `boolean` | `false` | 是否多选 |
| `filterable` | `boolean` | `false` | 是否允许输入关键词 |
| `remote` | `boolean` | `false` | 是否使用远程搜索 |
| `remoteMethod` | `ZtSelectRemoteMethod` | — | 返回远程选项的异步函数 |
| `debounce` | `number` | `300` | 远程搜索防抖毫秒数 |
| `clearable` | `boolean` | `false` | 是否显示清空按钮 |
| `placeholder` | `string` | `请选择` | 空值提示 |
| `disabled` | `boolean` | `false` | 禁用组件 |
| `size` | `ZtComponentSize` | `default` | `mini/small/default/medium/large` |
| `noDataText` | `string` | `暂无数据` | 无选项提示 |
| `remoteErrorText` | `string` | `加载失败，请重试` | 远程失败提示 |

`remote` 模式会自动启用输入搜索。`remoteMethod` 缺失时不发起请求，列表显示无数据状态。`debounce` 小于零时按零处理。

## Emits

| 事件 | 参数 | 时机 |
|---|---|---|
| `update:modelValue` | `ZtSelectModelValue` | 选择、移除或清空 |
| `change` | `ZtSelectModelValue` | 值发生变化 |
| `visible-change` | `boolean` | 下拉层打开或关闭 |
| `search` | `string` | 搜索关键词变化 |
| `clear` | — | 用户清空选择 |
| `remove-tag` | `ZtSelectValue` | 多选标签被移除 |
| `remote-error` | `unknown` | 当前远程请求失败 |
| `focus` / `blur` | `FocusEvent` | 组件获得或失去焦点 |

## Exposed Methods

组件公开 `focus()`、`blur()`、`open()`、`close()` 方法。

## Slots

- `prefix`：输入区域前缀。
- `option`：作用域 `{ option, selected, disabled }`。
- `selected`：作用域 `{ option }`，自定义单选已选内容。
- `tag`：作用域 `{ option, remove }`，自定义多选标签。
- `empty`：无匹配结果。
- `loading`：远程加载状态。
- `footer`：下拉列表底部扩展内容。

## 选择与搜索行为

普通模式直接显示 `options`。开启 `filterable` 后，组件使用不区分大小写的 `label.includes(keyword)` 做本地过滤。输入搜索词不会修改已选值。

远程模式中，关键词变化立即触发 `search`，然后根据 `debounce` 调用 `remoteMethod`。组件内部维护加载、结果和错误状态。每次调用获得递增请求编号；只有最新请求可以写入结果、加载状态或错误状态，从而避免慢请求覆盖新结果。清空关键词同样发起一次空关键词请求。组件卸载时清除待执行定时器，已返回的旧请求不会写入状态。

单选选择有效选项后更新值、触发表单 `change` 校验并关闭下拉层。多选按选项值去重，选择后保持下拉层打开；再次选择已选项会移除该值。清空和标签移除同样触发 `change` 校验。组件整体失焦时触发表单 `blur` 校验。

## 键盘与无障碍

触发区域使用 `role="combobox"`，维护 `aria-expanded`、`aria-controls`、`aria-haspopup="listbox"` 和 `aria-activedescendant`。下拉列表使用 `role="listbox"`，多选时设置 `aria-multiselectable`；选项使用 `role="option"`、`aria-selected` 和 `aria-disabled`。

- `ArrowDown` / `ArrowUp`：打开列表并在可用选项之间循环移动。
- `Enter`：选择键盘高亮项。
- `Escape`：关闭列表并将焦点保留在触发区域。
- `Tab`：按浏览器默认顺序离开并关闭列表。
- `Backspace`：多选且搜索词为空时移除最后一个可用标签。

## 浮层与视觉

触发区域沿用 zt-ui 输入控件的玻璃质感、圆角、边框、错误焦点环和五档尺寸。多选标签使用紧凑胶囊样式，并在一行内横向滚动。加载、空数据、远程失败、禁用、选中和键盘高亮状态均有独立视觉反馈。

下拉层通过 `Teleport` 挂载到 `body`，使用固定定位，避免被 Form、Modal 和滚动容器裁切。打开时根据触发区域上下空间决定展开方向；窗口滚动和尺寸变化时重新定位。点击组件与下拉层之外的区域关闭列表。关闭和卸载时移除全局事件监听器。

## Form 集成

组件从 `ZtFormItem` 继承 `size` 和 `disabled`。校验失败时响应 FormItem 的错误边框样式，并输出 `aria-invalid` 与 `aria-describedby`。值变更调用 `validate('change')`，整体失焦调用 `validate('blur')`。

## 测试与文档

单元测试覆盖：单选、多选与去重、清空、移除标签、本地过滤、远程防抖、加载状态、旧请求竞态、错误事件、键盘操作、点击外部关闭、公开方法、Form 尺寸/禁用/校验集成以及全部插槽。

演示站新增 Select 页面，提供基础单选、多选、本地搜索、远程搜索、自定义插槽、禁用与清空、五档尺寸示例。每个可视示例都通过 `DemoBlock` 提供完整 Vue + TypeScript SFC 代码。README 增加最小使用示例和远程搜索示例。
