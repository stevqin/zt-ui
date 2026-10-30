import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Dynamic from '../site/src/examples/form/Dynamic.vue';
import Groups from '../site/src/examples/form/Groups.vue';
import ValidationActions from '../site/src/examples/form/ValidationActions.vue';
import ServerErrors from '../site/src/examples/form/ServerErrors.vue';
import Underline from '../site/src/examples/form/Underline.vue';
import Layout from '../site/src/examples/form/Layout.vue';
import ZtForm from '../src/components/form/ZtForm.vue';

const wrappers: ReturnType<typeof mount>[] = [];
function render(component: Parameters<typeof mount>[0]) {
  const wrapper = mount(component, { attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount());
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('standalone form examples', () => {
  it('adds and removes dynamic fields and validates nested paths', async () => {
    const wrapper = render(Dynamic);
    await wrapper.get('button[aria-label="删除联系人 1"]').trigger('click');
    expect(wrapper.findAll('input')).toHaveLength(1);
    const add = wrapper.findAll('button').find(button => button.text() === '添加联系人')!;
    await add.trigger('click');
    expect(wrapper.findAll('input')).toHaveLength(2);
    await wrapper.findAll('input')[1]!.setValue('reader@example.com');
    await wrapper.findAll('button').find(button => button.text() === '校验所有字段')!.trigger('click');
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toBe('所有字段验证通过');
  });
  it('only locks the targeted group and unlocks it through the switch', async () => {
    const wrapper = render(Groups);
    expect(wrapper.findAll('fieldset')[1]!.attributes('disabled')).toBeDefined();
    expect(wrapper.findAll('input')[0]!.attributes('disabled')).toBeUndefined();
    await wrapper.findAll('[role="switch"]')[0]!.trigger('click');
    expect(wrapper.findAll('fieldset')[1]!.attributes('disabled')).toBeUndefined();
  });
  it('catches field validation errors, preserves values on clear, and restores initial values', async () => {
    const wrapper = render(ValidationActions);
    const button = (text: string) => wrapper.findAll('button').find(item => item.text() === text)!;
    await wrapper.findAll('input')[0]!.setValue('修改后的姓名');
    await button('仅校验邮箱').trigger('click');
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toContain('邮箱验证失败');
    await button('清除校验提示').trigger('click');
    expect(wrapper.findAll('input')[0]!.element.value).toBe('修改后的姓名');
    expect(wrapper.findAll('.is-error')).toHaveLength(0);
    await button('仅重置姓名').trigger('click');
    expect(wrapper.findAll('input')[0]!.element.value).toBe('初始姓名');
  });
  it('shows server rejection and releases busy state; editing clears the server error', async () => {
    vi.useFakeTimers();
    const wrapper = render(ServerErrors);
    await wrapper.get('input').setValue('demo');
    await vi.advanceTimersByTimeAsync(300);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined();
    await vi.advanceTimersByTimeAsync(1000);
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toBe('服务器拒绝了本次提交');
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('.is-error').exists()).toBe(true);
    await wrapper.get('input').setValue('reader');
    await flushPromises();
    expect(wrapper.find('.is-error').exists()).toBe(false);
  });
  it('switches underline appearance and exposes custom readable labels', async () => {
    const wrapper = render(Underline);
    expect(wrapper.findComponent(ZtForm).props('underline')).toBe(true);
    expect(wrapper.findAll('label')[0]!.text()).toContain('任务名称');
    await wrapper.get('[role="switch"]').trigger('click');
    expect(wrapper.findComponent(ZtForm).props('underline')).toBe(false);
  });
  it('switches label placement while retaining automatic width', async () => {
    const wrapper = render(Layout);
    expect(wrapper.findAllComponents(ZtForm)[0]!.props('labelWidth')).toBe('auto');
    await wrapper.get('[role="switch"]').trigger('click');
    expect(wrapper.findAllComponents(ZtForm)[0]!.props('labelPosition')).toBe('top');
  });
});
