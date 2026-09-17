import type { ZtButtonStatus } from '../button/types';
import type { ZtComponentSize } from '../types';
export type ZtTreeKey = string | number;
export interface ZtTreeNode {
  key?: ZtTreeKey;
  label?: string;
  disabled?: boolean;
  isLeaf?: boolean;
  children?: ZtTreeNode[];
  [field: string]: unknown;
}
export interface ZtTreeFields {
  key?: string;
  label?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
}
export type ZtTreeLoader = (node: ZtTreeNode) => Promise<ZtTreeNode[]>;
export interface ZtTreeProps {
  /** 六种语义状态，控制选中、勾选和焦点颜色，默认 primary。 */
  status?: ZtButtonStatus;
  /** 层级节点数组；节点 key 必须在整棵树中唯一。 */
  data?: ZtTreeNode[];
  /** 自定义 key、label、children、disabled、isLeaf 的源数据字段名。 */
  fields?: ZtTreeFields;
  /** 受控勾选 key；非严格模式展示时补齐启用的子孙和完整父节点。 */
  checkedKeys?: ZtTreeKey[];
  /** 受控选中行 key 数组；鼠标或 Enter 选择时发出单元素数组。 */
  selectedKeys?: ZtTreeKey[];
  /** 受控展开 key；省略时使用内部展开状态。 */
  expandedKeys?: ZtTreeKey[];
  /** 非受控模式首次展开的 key 数组。 */
  defaultExpandedKeys?: ZtTreeKey[];
  /** 显示勾选框，空格触发勾选。 */
  checkable?: boolean;
  /** 父子勾选独立，不计算半选或自动联动。 */
  checkStrictly?: boolean;
  /** 禁用整棵树的选择、展开、勾选和键盘操作。 */
  disabled?: boolean;
  /** 按标签不区分大小写匹配，并保留匹配节点的祖先。 */
  filter?: string;
  /** 展开无已知子节点的非叶节点时调用；拒绝时显示重试，数据替换或卸载忽略旧结果。 */
  load?: ZtTreeLoader;
  /** 仅挂载展开且匹配过滤条件的可见窗口和缓冲行。 */
  virtual?: boolean;
  /** 滚动区域最大高度，像素，默认 280。 */
  height?: number;
  /** 虚拟及普通行高，像素，最小 20，默认随 size 为 24/28/32/36/40。 */
  itemHeight?: number;
  /** 五档字体尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
