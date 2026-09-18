import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { api } from '../docs/reference';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const readme = read('../README.md');
const page = (id: string) => read(`src/views/${id}/Index.vue`);
const controls = [
  ['input', 'Input'], ['password', 'Password'], ['input-number', 'InputNumber'],
  ['input-tag', 'InputTag'], ['input-otp', 'InputOtp'], ['select', 'Select'],
  ['select-box', 'SelectBox'], ['autocomplete', 'Autocomplete'], ['cascader', 'Cascader'],
  ['tree-select', 'TreeSelect'], ['date-picker', 'DatePicker'], ['date-time-picker', 'DateTimePicker'],
  ['time-picker', 'TimePicker'], ['time-select', 'TimeSelect'], ['mention', 'Mention'],
];
const prop = (id: string, owner: string, name: string) => api[id]!.components.find(c => c.name === owner)!.props.find(p => p.name === name);

describe('published UI/API contracts', () => {
  it.each(controls)('documents %s underline as a tri-state appearance boundary', (id, name) => {
    const row = prop(id!, `Zt${name}`, 'underline');
    expect(row?.type).toBe('boolean');
    expect(row?.default).toContain('Form');
    expect(row?.description).toMatch(/true.*false.*省略.*最近.*Form/);
    expect(readme).toContain(`Zt${name}`);
    expect(page('form')).toContain(name);
  });
  it('documents nested boundaries and exclusions', () => {
    for (const text of [readme, page('form')]) {
      expect(text).toMatch(/显式.*true.*false.*省略/);
      expect(text).toContain('嵌套 Form');
      expect(text).toContain('辅助控件');
      expect(text).toContain('ColorPicker');
    }
  });
  it('publishes only the standard APIs and retains the two status meanings', () => {
    expect(prop('radio', 'ZtRadioGroup', 'variant')).toBeUndefined();
    expect(prop('pagination', 'ZtPagination', 'small')).toBeUndefined();
    expect(prop('badge', 'ZtBadge', 'type')).toBeUndefined();
    for (const text of [readme, JSON.stringify(api), read('src/views/Conventions.vue')]) {
      expect(text).not.toMatch(/@deprecated|兼容(?:原|旧)|向后兼容|backwards compatibility|error 为 danger 的别名|legacy alias/i);
      expect(text).toContain('danger');
      expect(text).toContain('error');
    }
  });
  it('explains SelectBox flipping, sole list scrolling and the tiny viewport ruling', () => {
    for (const text of [readme, page('select-box')]) {
      expect(text).toContain('向上翻转');
      expect(text).toContain('选项列表是唯一');
      expect(text).toMatch(/视口.*固定区域.*裁剪/);
      for (const mode of ['加载', '空', '失败', '粘贴', '已选']) expect(text).toContain(mode);
    }
  });
  it('defines the exact Button radius bands and state feedback', () => {
    for (const text of [readme, page('button'), page('config-provider')]) {
      for (const band of ['小于 5px', '5–8px', '大于 8px']) expect(text).toContain(band);
      expect(text).toContain('禁用');
    }
  });
  it('defines Tooltip content sizing, CSS conversion and inner overflow', () => {
    for (const name of ['width', 'height']) {
      for (const id of ['tooltip', 'popover']) {
        const row = prop(id, id === 'tooltip' ? 'ZtTooltip' : 'ZtPopover', name);
        expect(row?.type).toMatch(/number.*string|string.*number/);
        expect(row?.description).toMatch(/数字.*px.*字符串.*CSS/);
      }
    }
    for (const text of [readme, page('tooltip')]) {
      for (const term of ['max-content', 'width', 'height', '内容区', '视口', 'px', 'CSS']) expect(text).toContain(term);
    }
    expect(page('popover')).toContain('height');
  });
  it('documents contextual controller eligibility, exclusions and copyable source', () => {
    for (const text of [readme, read('src/views/Conventions.vue')]) {
      for (const term of ['六种视觉主题', 'Button', 'Tag', 'Steps', 'Result', '三列两行', '右下角', '跨页', '复制', 'status']) expect(text).toContain(term);
    }
  });
});
