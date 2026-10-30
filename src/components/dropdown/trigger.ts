import {
  Comment, Fragment, Text, cloneVNode, defineComponent, h, mergeProps, onMounted, onUpdated,
  type Component, type ComponentPublicInstance, type PropType, type Slots, type VNode,
} from 'vue';
import ZtIcon from '../icon/ZtIcon.vue';

function children(nodes: VNode[]): VNode[] {
  return nodes.flatMap(node => node.type === Fragment
    ? children(node.children as VNode[])
    : node.type === Comment || (node.type === Text && !String(node.children).trim()) ? [] : [node]);
}
function isInteractive(node: VNode) {
  if (typeof node.type === 'string') {
    return ['button', 'input', 'select', 'textarea', 'summary'].includes(node.type)
      || (node.type === 'a' && node.props?.href != null)
      || node.props?.role === 'button' || node.props?.tabindex != null;
  }
  return (typeof node.type === 'object' && 'name' in node.type && node.type.name === 'ZtButton')
    || node.props?.role === 'button' || node.props?.tabindex != null;
}
function indicator() {
  return h(ZtIcon, { name: 'chevron-down', class: 'zt-dropdown__arrow' });
}

export default defineComponent({
  name: 'ZtDropdownTrigger',
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    expanded: Boolean,
    size: { type: String, required: true },
    reference: { type: Function as PropType<(element: HTMLElement | undefined) => void>, required: true },
    onReferenceKey: { type: Function as PropType<(event: KeyboardEvent) => void>, required: true },
    onDisabledChange: { type: Function as PropType<(disabled: boolean) => void>, required: true },
  },
  setup(props, { slots, attrs }) {
    let element: HTMLElement | undefined;
    function setReference(value: Element | ComponentPublicInstance | null) {
      const root = value && '$el' in value ? value.$el : value;
      element = root instanceof HTMLElement ? root : undefined;
      props.reference(element);
    }
    function syncDisabled() {
      props.onDisabledChange(!!element?.matches(':disabled, [aria-disabled="true"]'));
    }
    function guard(event: Event) {
      if (props.disabled || element?.matches(':disabled, [aria-disabled="true"]')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
    onMounted(syncDisabled);
    onUpdated(syncDisabled);
    return () => {
      const content = slots.default?.() ?? [];
      const roots = children(content);
      const custom = roots.length === 1 && isInteractive(roots[0]!);
      const triggerAttrs = mergeProps(attrs, {
        ref: setReference,
        'aria-haspopup': 'menu',
        'aria-expanded': props.expanded,
        onKeydown: props.onReferenceKey,
      });
      if (custom) {
        const source = roots[0]!;
        const disabled = props.disabled || source.props?.disabled === '' || !!source.props?.disabled;
        const nativeActivation = typeof source.type === 'string'
          ? ['button', 'input', 'select', 'textarea', 'summary'].includes(source.type)
            || (source.type === 'a' && source.props?.href != null)
          : typeof source.type === 'object' && 'name' in source.type && source.type.name === 'ZtButton';
        const semantics = nativeActivation ? {} : {
          role: source.props?.role ?? 'button',
          tabindex: source.props?.tabindex ?? 0,
          onKeydown: (event: KeyboardEvent) => {
            if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              element?.click();
            }
          },
        };
        const trigger = cloneVNode(source, mergeProps(triggerAttrs, semantics, {
          disabled, class: 'zt-dropdown__custom-trigger',
        }), true);
        if (typeof source.type !== 'string' || !['input', 'textarea', 'select'].includes(source.type)) {
          const originalSlots = source.children && !Array.isArray(source.children) && typeof source.children === 'object'
            ? source.children as Slots : null;
          const originalContent = (...args: unknown[]) => typeof source.children === 'string' ? [source.children]
            : Array.isArray(source.children) ? source.children : originalSlots?.default?.(...args) ?? [];
          const decorated = typeof source.type === 'string'
            ? h(source.type, null, [...originalContent(), indicator()])
            : h(source.type as Component, null, {
              ...originalSlots,
              default: (...args: unknown[]) => [...originalContent(...args), indicator()],
            });
          trigger.children = decorated.children;
          trigger.shapeFlag = decorated.shapeFlag;
          // Decorated children must not retain the original text-only patch hint.
          trigger.patchFlag = -2;
        }
        // Guard in capture before consumer handlers, including synthetic clicks
        // dispatched on a disabled native button.
        const capture = trigger.props?.onClickCapture;
        trigger.props = {
          ...trigger.props,
          onClickCapture: [guard, ...(Array.isArray(capture) ? capture : capture ? [capture] : [])],
        };
        return trigger;
      }
      return h('button', {
        ...triggerAttrs,
        class: ['zt-dropdown__trigger', `zt-dropdown__trigger--${props.size}`, attrs.class],
        type: 'button', disabled: props.disabled,
      }, [
        h('span', { class: 'zt-dropdown__trigger-content' }, roots.length ? content : '操作'),
        indicator(),
      ]);
    };
  },
});
