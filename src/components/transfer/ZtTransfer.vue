<script setup lang="ts">
import { hierarchyStyle } from '../tree/appearance';
import { computed, ref, inject, watch } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import type { ZtTransferProps, ZtTransferKey } from './types';
import './transfer.scss';
defineOptions({ name: 'ZtTransfer' });
const props = withDefaults(defineProps<ZtTransferProps>(), {
  data: () => [],
  modelValue: () => [],
  titles: () => ['待选', '已选'],
});
const emit = defineEmits<{
  'update:modelValue': [keys: ZtTransferKey[]];
  change: [
    keys: ZtTransferKey[],
    direction: 'left' | 'right',
    moved: ZtTransferKey[],
  ];
  'left-check-change': [keys: ZtTransferKey[]];
  'right-check-change': [keys: ZtTransferKey[]];
}>();
const form = inject(ztFormItemKey, undefined),
  config = useZtConfig(),
  size = useZtSize(props, () => form?.size.value),
  disabled = computed(() => props.disabled || form?.disabled.value),
  queries = ref(['', '']),
  checked = ref<[ZtTransferKey[], ZtTransferKey[]]>([[], []]);
const panels = computed(() =>
  [0, 1].map((side) =>
    props.data
      .filter(
        (option) => props.modelValue.includes(option.key) === Boolean(side),
      )
      .filter((option) =>
        props.filterMethod
          ? props.filterMethod(queries.value[side] ?? '', option)
          : option.label
              .toLowerCase()
              .includes((queries.value[side] ?? '').toLowerCase()),
      ),
  ),
);
const available = computed(() =>
  panels.value.map((panel) =>
    panel.filter((o) => !o.disabled).map((o) => o.key),
  ),
);
function blur(event: FocusEvent) {
  if (
    !(event.currentTarget as HTMLElement).contains(
      event.relatedTarget as Node | null,
    )
  )
    void form?.validate('blur');
}
function update(side: number, keys: ZtTransferKey[]) {
  if (disabled.value) return;
  checked.value[side as 0 | 1] = keys;
  if (side === 0) emit('left-check-change', keys);
  else emit('right-check-change', keys);
}
function toggle(side: number, key: ZtTransferKey) {
  const keys = checked.value[side]!;
  update(
    side,
    keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
  );
}
function all(side: number) {
  return (
    available.value[side]!.length > 0 &&
    available.value[side]!.every((k) => checked.value[side]!.includes(k))
  );
}
function partial(side: number) {
  return (
    !all(side) &&
    available.value[side]!.some((k) => checked.value[side]!.includes(k))
  );
}
function toggleAll(side: number) {
  update(
    side,
    all(side)
      ? checked.value[side]!.filter((k) => !available.value[side]!.includes(k))
      : [...new Set([...checked.value[side]!, ...available.value[side]!])],
  );
}
function movable(side: number) {
  return props.data
    .filter(
      (o) =>
        !o.disabled &&
        props.modelValue.includes(o.key) === Boolean(side) &&
        checked.value[side]!.includes(o.key),
    )
    .map((o) => o.key);
}
function move(side: number) {
  if (disabled.value) return;
  const moved = movable(side);
  if (!moved.length) return;
  const keys =
    side === 0
      ? [...new Set([...props.modelValue, ...moved])]
      : props.modelValue.filter((k) => !moved.includes(k));
  emit('update:modelValue', keys);
  emit('change', keys, side === 0 ? 'right' : 'left', moved);
  update(side, []);
  void form?.validate('change');
}
watch(
  () => [props.data, props.modelValue],
  () => {
    checked.value = checked.value.map((keys, side) =>
      keys.filter((k) =>
        props.data.some(
          (o) =>
            o.key === k &&
            !o.disabled &&
            props.modelValue.includes(k) === Boolean(side),
        ),
      ),
    ) as [ZtTransferKey[], ZtTransferKey[]];
  },
);
</script>
<template>
  <div
    class="zt-transfer"
    role="group"
    :id="form?.inputId"
    :aria-label="titles.join(' / ')"
    :aria-invalid="form?.validateState.value === 'error'"
    :aria-describedby="form?.validateMessage.value ? form.errorId : undefined"
    :class="`zt-transfer--${size}`"
    :style="[config.style.value, hierarchyStyle(status)]"
    :aria-disabled="disabled"
    @focusout="blur"
  >
    <template v-for="side in [0, 1]" :key="side"
      ><div v-if="side === 1" class="zt-transfer__actions">
        <button
          type="button"
          data-move="right"
          :disabled="disabled || !movable(0).length"
          aria-label="移入已选"
          @click="move(0)"
        >
          →</button
        ><button
          type="button"
          data-move="left"
          :disabled="disabled || !movable(1).length"
          aria-label="移回待选"
          @click="move(1)"
        >
          ←
        </button>
      </div>
      <section class="zt-transfer__panel" :aria-label="titles[side]">
        <header>
          <label
            ><input
              type="checkbox"
              :aria-label="`全选${titles[side]}`"
              :checked="all(side)"
              :indeterminate="partial(side)"
              :disabled="disabled || !available[side]?.length"
              @change="toggleAll(side)"
            />
            {{ titles[side] }}</label
          ><span>{{ checked[side]?.length }} / {{ panels[side]?.length }}</span>
        </header>
        <input
          v-if="filterable"
          v-model="queries[side]"
          class="zt-transfer__search"
          :disabled="disabled"
          :aria-label="`搜索${titles[side]}`"
          placeholder="搜索"
        />
        <div class="zt-transfer__list">
          <label
            v-for="option in panels[side]"
            :key="option.key"
            class="zt-transfer__option"
            ><input
              type="checkbox"
              :disabled="disabled || option.disabled"
              :checked="checked[side]?.includes(option.key)"
              @change="toggle(side, option.key)"
            /><slot :option="option">{{ option.label }}</slot></label
          >
          <p v-if="!panels[side]?.length">暂无数据</p>
        </div>
        <footer v-if="$slots['left-footer'] || $slots['right-footer']">
          <slot
            :name="side === 0 ? 'left-footer' : 'right-footer'"
            :checked="checked[side]"
          />
        </footer></section
    ></template>
  </div>
</template>
