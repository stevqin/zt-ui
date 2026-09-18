<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import { hierarchyStyle } from '../tree/appearance';
import { computed, inject, ref, nextTick, watch, onBeforeUnmount } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import ZtPopover from '../popover/ZtPopover.vue';
import ZtTree from '../tree/ZtTree.vue';
import { flattenTree, normalizeChecked } from '../tree/model';
import type { ZtTreeKey, ZtTreeNode } from '../tree/types';
import type { ZtTreeSelectProps, ZtTreeSelectValue } from './types';
import './tree-select.scss';
defineOptions({ name: 'ZtTreeSelect' });
const { underline } = useFormControlAppearance();
const props = withDefaults(defineProps<ZtTreeSelectProps>(), {
  modelValue: null,
  data: () => [],
  checkStrategy: 'all',
  placeholder: '请选择',
  collapseTags: 3,
  teleported: true,
  clearable: false,
});
const emit = defineEmits<{
  'update:modelValue': [value: ZtTreeSelectValue];
  change: [value: ZtTreeSelectValue];
  clear: [];
  'visible-change': [visible: boolean];
  'load-error': [error: unknown, node: ZtTreeNode];
}>();
const form = inject(ztFormItemKey, undefined),
  config = useZtConfig(),
  size = useZtSize(props, () => form?.size.value),
  disabled = computed(() => props.disabled || form?.disabled.value),
  visible = ref(false),
  query = ref(''),
  host = ref<HTMLElement>(),
  loaded = ref(new Map<ZtTreeKey, ZtTreeNode[]>());
const rows = computed(() =>
    flattenTree(props.data, props.fields, loaded.value),
  ),
  keys = computed(() =>
    Array.isArray(props.modelValue)
      ? props.modelValue
      : props.modelValue == null
        ? []
        : [props.modelValue],
  ),
  labels = computed(() =>
    keys.value.map(
      (k) => rows.value.find((r) => r.key === k)?.label ?? String(k),
    ),
  );
const checked = computed(() =>
  props.checkStrictly ? keys.value : normalizeChecked(rows.value, keys.value),
);
let loadEpoch = 0;
onBeforeUnmount(() => {
  loadEpoch++;
});
async function load(node: ZtTreeNode) {
  const token = loadEpoch;
  try {
    const children = await props.load!(node);
    if (token === loadEpoch)
      loaded.value.set(node[props.fields?.key ?? 'key'] as ZtTreeKey, children);
    return children;
  } catch (e) {
    if (token === loadEpoch) emit('load-error', e, node);
    throw e;
  }
}
function change(value: ZtTreeSelectValue) {
  if (disabled.value) return;
  emit('update:modelValue', value);
  emit('change', value);
  void form?.validate('change');
}
function select(value: ZtTreeKey[]) {
  if (props.multiple) return;
  change(value[0] ?? null);
  visible.value = false;
}
function check(value: ZtTreeKey[]) {
  const reduced =
    props.checkStrictly || props.checkStrategy === 'all'
      ? value
      : value.filter((k) => {
          const row = rows.value.find((r) => r.key === k);
          return props.checkStrategy === 'leaf'
            ? !row?.branch
            : !row?.path.slice(0, -1).some((parent) => value.includes(parent));
        });
  change(reduced);
}
function clear() {
  change(props.multiple ? [] : null);
  emit('clear');
}
function blur(event: FocusEvent) {
  const target = event.relatedTarget as Node | null;
  const panel = document.getElementById(uid);
  if (!target || (!host.value?.contains(target) && !panel?.contains(target)))
    void form?.validate('blur');
}
async function keyboard(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    visible.value = true;
    await nextTick();
    document
      .querySelector<HTMLElement>(
        `[data-tree-select-panel="${uid}"] [role=tree]`,
      )
      ?.focus();
  }
}
const uid = `tree-select-${Math.random().toString(36).slice(2)}`;
watch(visible, (v) => {
  emit('visible-change', v);
  if (!v) {
    query.value = '';
    void form?.validate('blur');
  }
});
watch(
  () => props.data,
  () => {
    loadEpoch++;
    loaded.value.clear();
  },
);
watch(disabled, (v) => {
  if (v) visible.value = false;
});
</script>
<template>
  <span
    ref="host"
    @focusout="blur"
    class="zt-tree-select"
    :class="[`zt-tree-select--${size}`, { 'is-form-underline': underline, 'is-clearable': clearable }]"
    :style="[config.style.value, hierarchyStyle(status)]"
    ><ZtPopover
      v-model:visible="visible"
      :disabled="disabled"
      :teleported="teleported"
      placement="bottom-start"
      :width="300"
      ><button
        :id="form?.inputId"
        class="zt-hierarchy__control"
        type="button"
        role="combobox"
        aria-haspopup="tree"
        :aria-expanded="visible"
        :aria-controls="uid"
        :disabled="disabled"
        :aria-invalid="form?.validateState.value === 'error'"
        :aria-describedby="
          form?.validateMessage.value ? form.errorId : undefined
        "
        @keydown="keyboard"
      >
        <span v-if="!labels.length">{{ placeholder }}</span
        ><template v-else
          ><span
            v-for="(label, i) in labels.slice(
              0,
              multiple ? Math.max(1, collapseTags) : 1,
            )"
            :key="i"
            class="zt-hierarchy__tag"
            >{{ label }}</span
          ><span
            v-if="multiple && labels.length > collapseTags"
            :title="labels.join('、')"
            >+{{ labels.length - collapseTags }}</span
          ></template
        ><span aria-hidden="true">▾</span></button
      ><template #content
        ><div :id="uid" :data-tree-select-panel="uid" @focusout="blur">
          <input
            v-if="filterable"
            v-model="query"
            class="zt-hierarchy__search"
            aria-label="搜索树节点"
            placeholder="搜索"
          /><ZtTree
            :status="status"
            :data="data"
            :fields="fields"
            :checkable="multiple"
            :check-strictly="checkStrictly"
            :checked-keys="checked"
            :selected-keys="keys"
            :filter="query"
            :disabled="disabled"
            :load="props.load ? load : undefined"
            :virtual="virtual"
            :height="height"
            :item-height="itemHeight"
            :size="size"
            @update:selected-keys="select"
            @update:checked-keys="check"
            ><template v-if="$slots.default" #default="scope"
              ><slot v-bind="scope" /></template
          ></ZtTree></div></template></ZtPopover
    ><button
      v-if="clearable && keys.length && !disabled"
      type="button"
      class="zt-hierarchy__clear"
      :disabled="disabled"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button></span
  >
</template>
