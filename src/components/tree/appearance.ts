import type { CSSProperties } from 'vue';
import type { ZtButtonStatus } from '../button/types';
export function hierarchyStyle(
  status: ZtButtonStatus = 'primary',
): CSSProperties {
  const tokens = {
    default: ['default-ink', '#606266'],
    primary: ['accent', '#409eff'],
    success: ['success-ink', '#67c23a'],
    warning: ['warning-ink', '#e6a23c'],
    danger: ['danger-ink', '#f56c6c'],
    info: ['info-ink', '#909399'],
  } as const;
  const [token, fallback] = tokens[status];
  return { '--hierarchy-accent': `var(--zt-${token},${fallback})` };
}
