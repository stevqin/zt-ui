import type { CSSProperties } from 'vue';
import type { ZtEntryStatus } from './types';
import './status.scss';
export function entryStatusStyle(
  status: ZtEntryStatus = 'primary',
): CSSProperties {
  const tokens = {
    default: ['default', '#414141', '#e2e2e2', 'rgba(255,255,255,.85)'],
    primary: ['accent', '#245edb', '#bfd2ff', '#f0f5ff'],
    success: ['success', '#166534', '#bbf7d0', '#f0fdf4'],
    warning: ['warning', '#92400e', '#fde68a', '#fffbeb'],
    danger: ['danger', '#991b1b', '#fecaca', '#fef2f2'],
    info: ['info', '#374151', '#d1d5db', '#f9fafb'],
  }[status];
  return {
    '--zt-entry-ink': `var(--zt-${tokens[0]}${status === 'primary' ? '' : '-ink'}, ${tokens[1]})`,
    '--zt-entry-line': `var(--zt-${tokens[0]}-line, ${tokens[2]})`,
    '--zt-entry-soft': `var(--zt-${tokens[0]}-soft, ${tokens[3]})`,
  };
}
