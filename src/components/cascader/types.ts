import type { ZtButtonStatus } from '../button/types';
import type { ZtComponentSize } from '../types';
import type {
  ZtTreeNode,
  ZtTreeKey,
  ZtTreeFields,
  ZtTreeLoader,
} from '../tree/types';
export type ZtCascaderPath = ZtTreeKey[];
export type ZtCascaderValue = ZtCascaderPath | ZtCascaderPath[];
export interface ZtCascaderProps {
  /** 六种语义状态，控制选中、勾选和焦点颜色，默认 primary。 */
  status?: ZtButtonStatus;
  /** 单选为完整 key 路径，多选为路径数组；清空发出 []。 */
  modelValue?: ZtCascaderValue;
  /** 层级选项数组，所有节点 key 唯一。 */
  options?: ZtTreeNode[];
  /** 映射 key、label、children、disabled、isLeaf 字段。 */
  fields?: ZtTreeFields;
  /** 允许独立选择多条完整路径。 */
  multiple?: boolean;
  /** 允许选择分支节点；关闭时只能选择叶节点。 */
  checkStrictly?: boolean;
  /** 显示按完整标签路径匹配的搜索框。 */
  filterable?: boolean;
  /** 有值时显示清空按钮。 */
  clearable?: boolean;
  /** 禁用控件；继承 Form 禁用状态。 */
  disabled?: boolean;
  /** 未选择路径时显示的文本。 */
  placeholder?: string;
  /** 展开未加载分支时请求子节点；失败显示重试，过期响应被忽略。 */
  load?: ZtTreeLoader;
  /** 五档尺寸，继承 Form 和 ConfigProvider。 */
  size?: ZtComponentSize;
  /** 是否将浮层传送到 body，默认 true。 */
  teleported?: boolean;
}
