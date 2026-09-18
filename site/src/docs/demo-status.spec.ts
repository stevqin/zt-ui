import { describe, expect, it, vi } from 'vitest';
import { components } from './catalog';
import {
  createDemoStatusStore,
  resolveDemoStatus,
  DEMO_STATUS_STORAGE_KEY,
} from './demo-status';

const page = (path: string) =>
  components.find((c) => c.path === path)!.visualStatus!;
describe('documentation visual status state', () => {
  it('uses page defaults before a choice and persists valid choices across providers', () => {
    localStorage.clear();
    const store = createDemoStatusStore(localStorage);
    expect(resolveDemoStatus(page('/radio'), store.selected.value)).toBe(
      'primary',
    );
    expect(resolveDemoStatus(page('/badge'), store.selected.value)).toBe(
      'danger',
    );
    expect(resolveDemoStatus(page('/alert'), store.selected.value)).toBe(
      'info',
    );
    store.select('success');
    expect(resolveDemoStatus(page('/radio'), store.selected.value)).toBe(
      'success',
    );
    expect(localStorage.getItem(DEMO_STATUS_STORAGE_KEY)).toBe('success');
    expect(createDemoStatusStore(localStorage).selected.value).toBe('success');
  });
  it('rejects validation and corrupt storage values without mapping error to danger', () => {
    localStorage.setItem(DEMO_STATUS_STORAGE_KEY, 'error');
    const store = createDemoStatusStore(localStorage);
    expect(store.selected.value).toBeUndefined();
    store.select('error' as never);
    expect(store.selected.value).toBeUndefined();
    store.select('danger');
    expect(resolveDemoStatus(page('/input'), store.selected.value)).toBe(
      'default',
    );
    expect(
      resolveDemoStatus(
        {
          supported: ['default', 'primary'],
          default: 'primary',
          controller: true,
        },
        'danger',
      ),
    ).toBe('primary');
  });
  it('keeps the controller usable when browser storage is unavailable', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('denied');
      }),
      setItem: vi.fn(() => {
        throw new Error('quota');
      }),
    };
    const store = createDemoStatusStore(storage);
    store.select('warning');
    expect(store.selected.value).toBe('warning');
  });
  it('declares defaults and exclusions for every catalog page', () => {
    expect(components).toHaveLength(79);
    for (const c of components) {
      expect(c.visualStatus, c.name).toBeDefined();
      if (c.visualStatus!.controller)
        expect(c.visualStatus!.supported).toEqual([
          'default',
          'primary',
          'success',
          'warning',
          'danger',
          'info',
        ]);
      else expect(c.visualStatus!.reason, c.name).toBeTruthy();
    }
    for (const id of [
      'button',
      'tag',
      'steps',
      'result',
      'input',
      'password',
      'select',
      'select-box',
      'form',
      'timeline',
    ])
      expect(page('/' + id).controller).toBe(false);
    for (const id of [
      'radio',
      'badge',
      'date-picker',
      'date-time-picker',
      'input-otp',
      'typography',
      'color-picker-panel',
    ])
      expect(page('/' + id).controller).toBe(true);
  });
});
