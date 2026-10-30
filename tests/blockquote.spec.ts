import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import ZtBlockquote from '../src/components/blockquote/ZtBlockquote.vue';
import ZtConfigProvider from '../src/components/config-provider/ZtConfigProvider.vue';

describe('Blockquote', () => {
  it('renders quotation semantics and escapes title/source text', () => {
    const wrapper = mount(ZtBlockquote, {
      props: { title: '<b>引文</b>', cite: 'https://example.com/source' },
      slots: { default: '引用正文' },
    });
    expect(wrapper.element.tagName).toBe('BLOCKQUOTE');
    expect(wrapper.attributes('cite')).toBe('https://example.com/source');
    expect(wrapper.get('.zt-blockquote__title').text()).toBe('<b>引文</b>');
    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.text()).toContain('引用正文');
    expect(wrapper.find('footer').exists()).toBe(false);
    wrapper.unmount();
  });
  it('supports title/footer slots and nested quotations without live region roles', () => {
    const wrapper = mount(ZtBlockquote, {
      props: { title: '后备标题', status: 'warning' },
      slots: { title: '插槽标题', default: () => h(ZtBlockquote, {}, () => '内层'), footer: '来源说明' },
    });
    expect(wrapper.get('.zt-blockquote__title').text()).toBe('插槽标题');
    expect(wrapper.get('footer').text()).toBe('来源说明');
    expect(wrapper.findAll('blockquote')).toHaveLength(2);
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.classes()).toContain('zt-blockquote--status-warning');
    wrapper.unmount();
  });
  it('inherits global size and lets an explicit size override it reactively', async () => {
    const wrapper = mount(ZtConfigProvider, {
      props: { size: 'large' },
      slots: { default: () => [h(ZtBlockquote), h(ZtBlockquote, { size: 'mini' })] },
    });
    expect(wrapper.findAll('blockquote')[0]!.classes()).toContain('zt-blockquote--large');
    expect(wrapper.findAll('blockquote')[1]!.classes()).toContain('zt-blockquote--mini');
    await wrapper.setProps({ size: 'small' });
    expect(wrapper.findAll('blockquote')[0]!.classes()).toContain('zt-blockquote--small');
    wrapper.unmount();
  });
  it.each(['primary', 'default', 'success', 'warning', 'danger', 'info'] as const)(
    'keeps %s status separate from default and small size classes',
    async (status) => {
      const wrapper = mount(ZtBlockquote, { props: { status, size: 'default' } });
      expect(wrapper.classes()).toContain(`zt-blockquote--status-${status}`);
      expect(wrapper.classes().filter(name => name.startsWith('zt-blockquote--status-'))).toHaveLength(1);
      expect(wrapper.classes()).toContain('zt-blockquote--default');
      await wrapper.setProps({ size: 'small' });
      expect(wrapper.classes()).toContain(`zt-blockquote--status-${status}`);
      expect(wrapper.classes()).toContain('zt-blockquote--small');
      expect(wrapper.classes()).not.toContain('zt-blockquote--default');
      wrapper.unmount();
    },
  );

});
