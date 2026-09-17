import type { ZtButtonStatus } from '../button/types';
import type { ZtComponentSize } from '../types';
export type ZtTransferKey = string | number;
export interface ZtTransferOption {
  key: ZtTransferKey;
  label: string;
  disabled?: boolean;
  [field: string]: unknown;
}
export interface ZtTransferProps {
  /** 六种语义状态，控制选中、勾选和焦点颜色，默认 primary。 */
  status?: ZtButtonStatus;
  /** 受控目标 key 数组；移动已知项时保留未知 key。 */
  modelValue?: ZtTransferKey[];
  /** 扁平选项数组，key 唯一；disabled 项不能勾选或移动。 */
  data?: ZtTransferOption[];
  /** 禁用两栏搜索、勾选和移动，继承 Form 禁用状态。 */
  disabled?: boolean;
  /** 显示两栏独立搜索框；搜索只影响显示和全选范围。 */
  filterable?: boolean;
  /** 左右栏标题，默认待选、已选。 */
  titles?: [string, string];
  /** 五档尺寸，继承 Form 和 ConfigProvider。 */
  size?: ZtComponentSize;
  /** 自定义搜索匹配函数；默认标签不区分大小写包含匹配。 */
  filterMethod?: (query: string, option: ZtTransferOption) => boolean;
}
