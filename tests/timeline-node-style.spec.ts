import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { compile } from 'sass';
import Timeline from '../src/components/timeline/ZtTimeline.vue';
import Icon from '../src/components/icon/ZtIcon.vue';
const style = document.createElement('style');
const wrappers: ReturnType<typeof mount>[] = [];
beforeAll(() => {
  style.textContent = compile('src/components/timeline/timeline.scss').css;
  document.head.append(style);
});
afterEach(() => wrappers.splice(0).forEach((w) => w.unmount()));
afterAll(() => style.remove());
function render(slots: Record<string, any> = {}, size: any = 'large') {
  const w = mount(Timeline, {
    attachTo: document.body,
    props: {
      items: [
        {
          key: 1,
          time: '09:00',
          status: 'success',
          content: '很长的事件详情，节点不应随内容高度拉伸',
        },
      ],
      size,
    },
    slots,
  });
  wrappers.push(w);
  return w;
}
describe('Timeline node geometry', () => {
  it('keeps custom element nodes square and prevents flex stretching for tall events', () => {
    const w = render({ node: () => h('span', '✓') });
    const css = getComputedStyle(w.get('.zt-timeline__node').element);
    expect(css.alignSelf).toBe('flex-start');
    expect(css.width).not.toBe('auto');
    expect(css.height).not.toBe('auto');
    expect(css.width).toBe(css.height);
  });
  it('applies custom geometry to plain text and SVG icon slots across density changes', async () => {
    const w = render({ node: () => h(Icon, { name: 'check' }) }, 'mini');
    expect(w.get('.zt-timeline__node').classes()).toContain('is-custom');
    expect(w.findAll('svg')).toHaveLength(1);
    await w.setProps({ size: 'large', placement: 'left' });
    const css = getComputedStyle(w.get('.zt-timeline__node').element);
    expect(css.width).toBe(css.height);
    expect(css.lineHeight).toBe('1');
    const text = render({ node: () => '✓' });
    expect(text.get('.zt-timeline__node').classes()).toContain('is-custom');
  });
  it('retains the original circular 12px default node without a node slot', () => {
    const w = render();
    const node = w.get('.zt-timeline__node');
    expect(node.classes()).not.toContain('is-custom');
    const css = getComputedStyle(node.element);
    expect(css.width).toBe('12px');
    expect(css.height).toBe('12px');
    expect(css.borderRadius).toBe('50%');
  });
});
