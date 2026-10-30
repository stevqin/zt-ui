import { describe, expect, it } from 'vitest';
import api from '../src/generated/api.json';
import alerts from '../src/generated/alert-api.json';
import { checkApiDescriptions } from '../scripts/check-api-descriptions.mjs';
import { typeDescription } from '../scripts/api-type-explanations.mjs';

describe('API descriptions', () => {
  it('gives every published property, event, slot, member and type a real explanation', () => {
    expect(checkApiDescriptions({ ...api, ...alerts })).toEqual([]);
  });
  it.each(['props', 'events', 'slots', 'exposes', 'types'])('rejects missing %s explanations with their exact API location', section => {
    expect(checkApiDescriptions({ sample: { components: [{ name: 'ZtSample', [section]: [{ name: 'option', type: 'string' }] }] } })).toEqual([`Missing API description: sample/ZtSample.${section}.option`]);
  });
  it('rejects placeholder wording even when a description field is present', () => {
    expect(checkApiDescriptions({ sample: { components: [{ name: 'ZtSample', props: [{ name: 'option', description: '组件配置属性；具体行为参见上方用法示例。' }] }] } })[0]).toContain('Placeholder API description');
  });
  it('keeps descriptions specific to the actual component contract', () => {
    const radio = api.radio.components.find(component => component.name === 'ZtRadio')!;
    expect(radio.events.find(row => row.name === 'change')?.description).toContain('label');
    expect(api.select.components[0].exposes.find(row => row.name === 'clear')?.description).toContain('clearable');
    const loading = alerts['zt-alert-loading'].components[0];
    expect(loading.exposes.find(row => row.name === 'instance.closed')?.description).toContain('无返回值');
    expect(alerts['zt-alert-message'].components[0].types.find(row => row.name === 'NoticeContent')?.description).not.toContain('DOM');
  });
  it('does not invent status values or instance methods in type explanations', () => {
    const status = typeDescription('ZtInput', 'ZtInputStatus', "export type ZtInputStatus = 'default' | 'success' | 'warning' | 'error'");
    expect(status).toContain('error');
    expect(status).not.toContain('primary');
    expect(typeDescription('ZtQRCode', 'ZtQRCodeInstance', 'interface ZtQRCodeInstance { download: () => boolean }')).toContain('下载');
    expect(typeDescription('ZtQRCode', 'ZtQRCodeInstance', '')).not.toContain('重新渲染');
    expect(typeDescription('ZtUnknown', 'UnknownType', 'unknown')).toBeUndefined();
  });
});
