import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, createCommentVNode, Fragment } from 'vue';
import { describe, expect, it } from 'vitest';
import * as library from '../src/components/timeline';
import Timeline from '../src/components/timeline/ZtTimeline.vue';
const Item = () => (library as Record<string, any>).ZtTimelineItem;
it('exports the Timeline item declaration component', () =>
  expect(Item()).toBeDefined());
describe('Timeline template items', () => {
  it('renders item props, rich content and per-item node slots without stretching ordinary nodes', () => {
    const w = mount(Timeline, {
      props: { placement: 'alternate' },
      slots: {
        default: () => [
          h(
            Item(),
            {
              key: 'a',
              time: '09:00',
              status: 'success',
              hollow: '',
              id: 'first-event',
            },
            {
              default: ({ item, index }: any) =>
                h('strong', `${index}:${item.time} 已完成`),
              node: () => h('svg', { viewBox: '0 0 24 24' }),
            },
          ),
          h(Item(), {
            key: 'b',
            time: '10:00',
            content: '处理中',
            placement: 'left',
          }),
        ],
      },
    });
    expect(w.findAll('li')).toHaveLength(2);
    expect(w.get('strong').text()).toBe('0:09:00 已完成');
    expect(w.get('#first-event').classes()).toContain('is-hollow');
    expect(w.get('#first-event').classes()).toContain(
      'zt-timeline__item--success',
    );
    expect(w.findAll('.zt-timeline__node.is-custom')).toHaveLength(1);
    expect(w.findAll('li')[1]!.classes()).toContain('zt-timeline__item--left');
    expect(w.findAll('time').map((t) => t.text())).toEqual(['09:00', '10:00']);
  });
  it('supports v-if/v-for, reactive props and reverse with indices in display order', async () => {
    const records = ref([
        { key: 'a', time: '09:00' },
        { key: 'b', time: '10:00' },
      ]),
      show = ref(true),
      reverse = ref(false);
    const Host = defineComponent({
      components: { Timeline, Item: Item() },
      setup: () => ({ records, show, reverse }),
      template: `<Timeline :reverse="reverse" placement="alternate"><template v-for="entry in records" :key="entry.key"><Item v-if="show || entry.key === 'a'" :time="entry.time"><template #default="{index}">{{entry.key}}:{{index}}</template></Item></template></Timeline>`,
    });
    const w = mount(Host);
    expect(w.findAll('.zt-timeline__content').map((n) => n.text())).toEqual([
      'a:0',
      'b:1',
    ]);
    reverse.value = true;
    await w.vm.$nextTick();
    expect(w.findAll('.zt-timeline__content').map((n) => n.text())).toEqual([
      'b:0',
      'a:1',
    ]);
    records.value = [
      { key: 'b', time: '11:00' },
      { key: 'a', time: '12:00' },
    ];
    await w.vm.$nextTick();
    expect(w.findAll('time').map((n) => n.text())).toEqual(['12:00', '11:00']);
    show.value = false;
    await w.vm.$nextTick();
    expect(w.findAll('li')).toHaveLength(1);
  });
  it('updates when the parent replaces declaration slots without reactive reads inside them', async () => {
    const changed = ref(false);
    const w = mount({
      render: () => {
        const title = changed.value ? '更新节点' : '原节点';
        return h(
          Timeline,
          {},
          { default: () => [h(Item(), { content: title })] },
        );
      },
    });
    expect(w.text()).toContain('原节点');
    changed.value = true;
    await w.vm.$nextTick();
    expect(w.text()).toContain('更新节点');
  });
  it('preserves array items, root scoped slots and root attributes, including explicit empty arrays', async () => {
    const data = [
      { key: 1, content: 'A' },
      { key: 2, content: 'B' },
    ];
    const w = mount(Timeline, {
      props: { items: data, reverse: true },
      attrs: { 'aria-label': '事件记录' },
      slots: {
        default: ({ item, index }: any) => h('b', `${index}:${item.content}`),
        node: () => h('i', '图标'),
      },
    });
    expect(w.attributes('aria-label')).toBe('事件记录');
    expect(w.findAll('b').map((n) => n.text())).toEqual(['0:B', '1:A']);
    expect(w.findAll('.is-custom')).toHaveLength(2);
    expect(data[0]!.key).toBe(1);
    await w.setProps({ items: [] });
    expect(w.findAll('li')).toHaveLength(0);
  });
  it('uses root node slots as fallback while keeping each item override', () => {
    const w = mount(Timeline, {
      slots: {
        default: () => [
          h(Item(), { content: 'A' }, { node: () => h('b', '局部图标') }),
          h(Item(), { content: 'B' }),
          h(Item(), { content: 'C' }, { node: () => createCommentVNode('v-if') }),
        ],
        node: ({ index }: any) => h('i', `全局图标${index}`),
      },
    });
    expect(w.findAll('.zt-timeline__node').map((n) => n.text())).toEqual([
      '局部图标',
      '全局图标1',
      '全局图标2',
    ]);
  });
});

it('keeps fallback content and ordinary markers when conditional slots render no content', () => {
  const w = mount(Timeline, {
    props: {
      items: [
        { key: 1, content: '备用内容' },
        { key: 2, content: '第二项' },
      ],
    },
    slots: {
      default: () => createCommentVNode('v-if'),
      node: ({ index }: any) =>
        index === 0 ? h('svg') : createCommentVNode('v-if'),
    },
  });
  expect(w.findAll('.zt-timeline__content').map((n) => n.text())).toEqual([
    '备用内容',
    '第二项',
  ]);
  expect(w.findAll('.zt-timeline__node.is-custom')).toHaveLength(1);
  const template = mount(Timeline, {
    slots: {
      default: () =>
        h(Item(), { content: '模板备用内容' }, { default: () => [] }),
    },
  });
  expect(template.text()).toContain('模板备用内容');
});
it('namespaces local item keys within keyed fragments so child state follows reordered groups', async () => {
  const order = ref(['a', 'b']);
  const Stateful = defineComponent({
    props: { name: String },
    setup(props) {
      const initial = props.name;
      return () => h('b', initial);
    },
  });
  const w = mount({
    render: () =>
      h(
        Timeline,
        {},
        {
          default: () =>
            order.value.map((group) =>
              h(Fragment, { key: group }, [
                h(
                  Item(),
                  { key: 'local-key' },
                  { default: () => h(Stateful, { name: group }) },
                ),
              ]),
            ),
        },
      ),
  });
  expect(w.findAll('b').map((n) => n.text())).toEqual(['a', 'b']);
  order.value = ['b', 'a'];
  await w.vm.$nextTick();
  expect(w.findAll('b').map((n) => n.text())).toEqual(['b', 'a']);
});
