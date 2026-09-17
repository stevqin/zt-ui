import { it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Timeline from './ZtTimeline.vue';
it('reverses chronological presentation without mutating items', () => {
  const items = [
    { key: 'a', time: '09:00', content: '开始' },
    { key: 'b', time: '10:00', content: '结束' },
  ];
  const w = mount(Timeline, {
    props: { items, reverse: true, placement: 'alternate' },
  });
  expect(w.findAll('li')[0]!.text()).toContain('结束');
  expect(items[0]!.key).toBe('a');
});
it('renders custom nodes and semantic status', () => {
  const w = mount(Timeline, {
    props: {
      items: [
        {
          key: 1,
          time: '昨天',
          content: '完成',
          status: 'success',
          hollow: true,
        },
      ],
    },
    slots: { node: '✓', default: ({ item }: any) => `订单${item.content}` },
  });
  expect(w.text()).toContain('✓');
  expect(w.text()).toContain('订单完成');
  expect(w.get('li').classes()).toContain('zt-timeline__item--success');
});
