import type { CSSProperties } from 'vue'
import type { ZtTheme } from './types'
// Separate provider variables from component-local --glass-* tokens, so nested
// components can retain their own token declarations without masking a theme.
const dark: Record<string, string> = {
  ink: '#e4eaf3', muted: '#a6b1c2', line: '#535f70',
  shadow: '0 5px 18px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.05)',
  island: 'linear-gradient(145deg, #414b59, #37414f)', 'island-line': '#586578',
  selected: 'linear-gradient(145deg, #40577a, #384c68)', 'selected-ink': '#b8d0ff',
  'default-ink': '#dae2ef', 'default-soft': '#404a59', 'default-line': '#5c697c',
  'default-button': '#465160', 'default-button-hover': '#526071',
  accent: '#82abff', 'accent-ink': '#adc8ff', 'accent-soft': '#394e6c', 'accent-line': '#46659a', 'accent-rgb': '130, 171, 255', 'accent-title': '#c2d7ff',
  'success-ink': '#8fe0af', 'success-soft': '#304e40', 'success-line': '#32694d',
  'warning-ink': '#f3ce87', 'warning-soft': '#574a32', 'warning-line': '#7a6337',
  'danger-ink': '#f7a3ab', 'danger-soft': '#593e46', 'danger-line': '#7e454d',
  'info-ink': '#c1ccdd', 'info-soft': '#434e5f', 'info-line': '#536078',
  surface: '#343c49', 'surface-soft': '#3b4554', 'surface-disabled': '#3a424e',
  'panel-bg': '#343c49', 'text': '#dae2ef', 'text-muted': '#a6b1c2',
  'border': '#5c697c', 'shine': 'rgba(255,255,255,.05)', 'highlight-line': '#5c697c',
}
// These provider-owned tokens must all be emitted, including `none`, so a
// nested flat provider cannot inherit an outer provider's raised treatment.
function buttonDepth(radius: number): Record<string, string> {
  const flat = radius < 5
  const raised = radius > 8
  return {
    '--zt-button-depth-image': raised ? 'linear-gradient(165deg, rgba(255,255,255,.12), rgba(0,0,0,.06))' : 'none',
    '--zt-button-depth-shadow': flat ? 'none' : raised ? 'inset 0 1px 0 rgba(255,255,255,.2), 0 3px 8px rgba(0,0,0,.14)' : 'inset 0 1px 0 rgba(255,255,255,.12), 0 1px 0 rgba(0,0,0,.06)',
    '--zt-button-depth-hover-shadow': flat ? 'none' : raised ? 'inset 0 1px 0 rgba(255,255,255,.2), 0 4px 10px rgba(0,0,0,.18)' : 'inset 0 1px 0 rgba(255,255,255,.12), 0 1px 0 rgba(0,0,0,.09)',
    '--zt-button-depth-active-shadow': flat ? 'none' : 'inset 0 1px 2px rgba(0,0,0,.12)',
    '--zt-button-depth-active-transform': flat ? 'none' : raised ? 'scale(.97)' : 'scale(.99)',
    '--zt-button-depth-status-border-width': flat ? '0px' : '1px',
  }
}
export function configStyle(theme: ZtTheme, radius: number): CSSProperties {
  // Explicitly reset every theme variable in a nested light provider.
  const values = Object.fromEntries(Object.entries(dark).map(([key,value]) => [`--zt-${key}`, theme === 'dark' ? value : 'initial']))
  return { ...values, ...buttonDepth(radius), '--zt-radius': `${radius}px`, colorScheme: theme } as CSSProperties
}
