import type { ZtButtonStatus } from '../button/types';
import type { ZtComponentSize } from '../types';
import type {
  ZtTreeNode,
  ZtTreeKey,
  ZtTreeFields,
  ZtTreeLoader,
} from '../tree/types';
export type ZtTreeSelectValue = ZtTreeKey | ZtTreeKey[] | null;
export interface ZtTreeSelectProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
  underline?: boolean;
  /** 六种语义状态，控制选中、勾选和焦点颜色，默认 primary。 */
  status?: ZtButtonStatus;
  /** 单选为 key 或 null；多选为 key 数组；清空分别发出 null 或 []。 */
  modelValue?: ZtTreeSelectValue;
  /** 树节点数据，整棵树 key 唯一。 */
  data?: ZtTreeNode[];
  /** 映射树节点 key、label、children、disabled、isLeaf 字段。 */
  fields?: ZtTreeFields;
  /** 多选使用 Tree 勾选框；单选使用行选择。 */
  multiple?: boolean;
  /** 启用独立节点勾选，忽略 checkStrategy 联动归并。 */
  checkStrictly?: boolean;
  /** all 保留全部勾选 key；parent 省略已选父节点的子孙；leaf 仅保留叶节点。 */
  checkStrategy?: 'all' | 'parent' | 'leaf';
  /** 在浮层中显示标签过滤输入框并保留匹配祖先。 */
  filterable?: boolean;
  /** 有值时显示清空按钮。 */
  clearable?: boolean;
  /** 禁用打开、清空及选择；同时继承 Form 禁用状态。 */
  disabled?: boolean;
  /** 无值时的触发器提示文本。 */
  placeholder?: string;
  /** 多选触发器最多展示的标签数，默认 3，至少展示 1 个。 */
  collapseTags?: number;
  /** 异步加载子节点；失败由 Tree 显示重试，并发出 load-error。 */
  load?: ZtTreeLoader;
  /** 五档尺寸，依次继承 Form 和 ConfigProvider。 */
  size?: ZtComponentSize;
  /** 启用内部 Tree 的窗口渲染。 */
  virtual?: boolean;
  /** 内部 Tree 最大高度，省略时为 280 像素。 */
  height?: number;
  /** 内部 Tree 行高；省略时随 mini/small/default/medium/large 分别为 24/28/32/36/40 像素。 */
  itemHeight?: number;
  /** 是否将浮层传送到 body，默认 true；保留主题与 overlay 上下文。 */
  teleported?: boolean;
}
