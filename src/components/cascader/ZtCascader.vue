<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import { hierarchyStyle } from '../tree/appearance';
import { computed, inject, ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import ZtPopover from '../popover/ZtPopover.vue';
import { flattenTree, type TreeRow } from '../tree/model';
import type { ZtTreeKey, ZtTreeNode } from '../tree/types';
import type { ZtCascaderProps, ZtCascaderValue, ZtCascaderPath } from './types';
import '../tree-select/tree-select.scss';
import './cascader.scss';
defineOptions({ name: 'ZtCascader' });
const { underline } = useFormControlAppearance();
const props = withDefaults(defineProps<ZtCascaderProps>(), {
  modelValue: () => [],
  options: () => [],
  placeholder: '请选择',
  teleported: true,
  clearable: false,
});
const emit = defineEmits<{
  'update:modelValue': [value: ZtCascaderValue];
  change: [value: ZtCascaderValue];
  clear: [];
  'load-error': [error: unknown, node: ZtTreeNode];
  'visible-change': [visible: boolean];
}>();
const form = inject(ztFormItemKey, undefined),
  config = useZtConfig(),
  size = useZtSize(props, () => form?.size.value),
  disabled = computed(() => props.disabled || form?.disabled.value),
  visible = ref(false),
  query = ref(''),
  activePath = ref<ZtTreeKey[]>([]),
  loaded = ref(new Map<ZtTreeKey, ZtTreeNode[]>()),
  loading = ref(new Set<ZtTreeKey>()),
  errors = ref(new Set<ZtTreeKey>()),
  panel = ref<HTMLElement>(),
  host = ref<HTMLElement>();
let epoch = 0,
  alive = true;
const uid = `zt-cascader-${Math.random().toString(36).slice(2)}`;
const rows = computed(() =>
    flattenTree(props.options, props.fields, loaded.value),
  ),
  paths = computed<ZtCascaderPath[]>(() =>
    props.multiple
      ? (props.modelValue as ZtCascaderPath[])
      : props.modelValue.length
        ? [props.modelValue as ZtCascaderPath]
        : [],
  );
const columns = computed(() => {
  const result = [rows.value.filter((r) => r.depth === 0)];
  for (const key of activePath.value) {
    const children = rows.value.filter((r) => r.parent === key);
    if (children.length) result.push(children);
  }
  return result;
});
function label(path: ZtTreeKey[]) {
  return path
    .map((k) => rows.value.find((r) => r.key === k)?.label ?? String(k))
    .join(' / ');
}
const results = computed(() =>
  rows.value.filter(
    (r) =>
      (props.checkStrictly || !r.branch) &&
      label(r.path).toLowerCase().includes(query.value.toLowerCase()),
  ),
);
function selected(row: TreeRow) {
  return paths.value.some(
    (path) =>
      path.length === row.path.length &&
      path.every((k, i) => k === row.path[i]),
  );
}
function commit(value: ZtCascaderValue) {
  if (disabled.value) return;
  emit('update:modelValue', value);
  emit('change', value);
  void form?.validate('change');
}
function choose(row: TreeRow) {
  if (disabled.value || row.disabled || (row.branch && !props.checkStrictly))
    return;
  if (props.multiple)
    commit(
      selected(row)
        ? paths.value.filter((p) => p.at(-1) !== row.key)
        : [...paths.value, row.path],
    );
  else {
    commit(row.path);
    visible.value = false;
  }
}
function checkOption(row: TreeRow) {
  choose(row);
  for (const input of panel.value?.querySelectorAll<HTMLInputElement>(
    '[data-cascader-check]',
  ) ?? [])
    input.checked = input.dataset.selected === 'true';
}
async function expand(row: TreeRow) {
  if (disabled.value || row.disabled) return;
  activePath.value = row.path;
  if (!row.branch) {
    choose(row);
    return;
  }
  if (
    props.load &&
    !loaded.value.has(row.key) &&
    !rows.value.some((r) => r.parent === row.key) &&
    !loading.value.has(row.key)
  ) {
    const token = epoch;
    loading.value.add(row.key);
    errors.value.delete(row.key);
    try {
      const children = await props.load(row.node);
      if (alive && token === epoch) loaded.value.set(row.key, children);
    } catch (e) {
      if (alive && token === epoch) {
        errors.value.add(row.key);
        emit('load-error', e, row.node);
      }
    } finally {
      if (token === epoch) loading.value.delete(row.key);
    }
  }
}
async function keydown(e: KeyboardEvent, row: TreeRow, column: number) {
  const buttons = Array.from(
      panel.value?.querySelectorAll<HTMLButtonElement>(
        `[data-column="${column}"] [data-option]:not(:disabled)`,
      ) ?? [],
    ),
    i = buttons.indexOf(e.currentTarget as HTMLButtonElement);
  if (
    ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(
      e.key,
    )
  )
    e.preventDefault();
  if (e.key === 'ArrowDown') buttons[(i + 1) % buttons.length]?.focus();
  else if (e.key === 'ArrowUp')
    buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
  else if (e.key === 'Home') buttons[0]?.focus();
  else if (e.key === 'End') buttons.at(-1)?.focus();
  else if (e.key === 'ArrowRight' && row.branch) {
    await expand(row);
    await nextTick();
    panel.value
      ?.querySelector<HTMLButtonElement>(
        `[data-column="${column + 1}"] [data-option]:not(:disabled)`,
      )
      ?.focus();
  } else if (e.key === 'ArrowLeft')
    panel.value
      ?.querySelector<HTMLButtonElement>(
        `[data-column="${column - 1}"] [data-option]:not(:disabled)`,
      )
      ?.focus();
}
function blur(event: FocusEvent) {
  const target = event.relatedTarget as Node | null;
  if (
    !target ||
    (!host.value?.contains(target) && !panel.value?.contains(target))
  )
    void form?.validate('blur');
}
async function openKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    visible.value = true;
    await nextTick();
    panel.value
      ?.querySelector<HTMLElement>('[data-option]:not(:disabled)')
      ?.focus();
  }
}
watch(visible, (v) => {
  emit('visible-change', v);
  if (!v) {
    query.value = '';
    void form?.validate('blur');
  }
});
watch(
  () => props.options,
  () => {
    epoch++;
    loaded.value.clear();
    loading.value.clear();
    errors.value.clear();
    activePath.value = [];
  },
);
watch(disabled, (v) => {
  if (v) visible.value = false;
});
onBeforeUnmount(() => {
  alive = false;
  epoch++;
});
</script>
<template>
  <span
    ref="host"
    class="zt-cascader"
    @focusout="blur"
    :class="[`zt-cascader--${size}`, { 'is-form-underline': underline, 'is-clearable': clearable }]"
    :style="[config.style.value, hierarchyStyle(status)]"
    ><ZtPopover
      v-model:visible="visible"
      :disabled="disabled"
      :teleported="teleported"
      placement="bottom-start"
      ><button
        :id="form?.inputId"
        class="zt-hierarchy__control"
        type="button"
        role="combobox"
        :disabled="disabled"
        :aria-expanded="visible"
        :aria-controls="uid"
        aria-haspopup="dialog"
        :aria-invalid="form?.validateState.value === 'error'"
        :aria-describedby="
          form?.validateMessage.value ? form.errorId : undefined
        "
        @keydown="openKey"
      >
        {{ paths.length ? paths.map(label).join('、') : placeholder }} ▾</button
      ><template #content
        ><div
          :id="uid"
          ref="panel"
          class="zt-cascader__panel"
          :class="`zt-cascader__panel--${size}`"
          @focusout="blur"
          :style="hierarchyStyle(status)"
        >
          <input
            v-if="filterable"
            v-model="query"
            class="zt-hierarchy__search"
            aria-label="搜索路径"
            placeholder="搜索完整路径"
          />
          <div
            v-if="query"
            class="zt-cascader__results"
            role="listbox"
            aria-label="搜索结果"
          >
            <button
              v-for="row in results"
              :key="row.key"
              type="button"
              role="option"
              :aria-selected="selected(row)"
              :disabled="row.disabled || disabled"
              @click="choose(row)"
            >
              {{ label(row.path) }} {{ selected(row) ? '✓' : '' }}</button
            ><span v-if="!results.length">暂无数据</span>
          </div>
          <div v-else class="zt-cascader__columns">
            <div
              v-for="(column, i) in columns"
              :key="i"
              :data-column="i"
              class="zt-cascader__column"
              role="group"
              :aria-label="`第 ${i + 1} 级`"
            >
              <div
                v-for="row in column"
                :key="row.key"
                class="zt-cascader__row"
              >
                <input
                  v-if="multiple || checkStrictly"
                  data-cascader-check
                  :data-selected="selected(row)"
                  :type="multiple ? 'checkbox' : 'radio'"
                  :name="uid"
                  :disabled="
                    disabled || row.disabled || (!checkStrictly && row.branch)
                  "
                  :checked="selected(row)"
                  :aria-label="`选择 ${row.label}`"
                  @change="checkOption(row)"
                /><button
                  data-option
                  type="button"
                  :disabled="disabled || row.disabled"
                  :aria-expanded="
                    row.branch ? activePath.includes(row.key) : undefined
                  "
                  :class="{ 'is-active': activePath.includes(row.key) }"
                  @click="expand(row)"
                  @keydown="keydown($event, row, i)"
                >
                  <slot :node="row.node">{{ row.label }}</slot
                  ><span>{{
                    loading.has(row.key)
                      ? '…'
                      : row.branch
                        ? '›'
                        : selected(row)
                          ? '✓'
                          : ''
                  }}</span></button
                ><button
                  v-if="errors.has(row.key)"
                  data-retry
                  type="button"
                  @click="expand(row)"
                >
                  重试
                </button>
              </div>
              <span v-if="!column.length">暂无数据</span>
            </div>
          </div>
        </div></template
      ></ZtPopover
    ><button
      v-if="clearable && paths.length && !disabled"
      type="button"
      class="zt-hierarchy__clear"
      :disabled="disabled"
      aria-label="清空"
      @click="
        commit([]);
        emit('clear');
      "
    >
      ×
    </button></span
  >
</template>
