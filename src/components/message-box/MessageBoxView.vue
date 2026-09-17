<script setup lang="ts">
import { ref, onBeforeUnmount, useId } from 'vue';
import ZtModal from '../modal/ZtModal.vue';
import ZtInput from '../input/ZtInput.vue';
import type { ZtMessageBoxOptions, ZtMessageBoxAction } from './types';
import type { ZtOverlayCloseReason } from '../overlay/types';
const props = defineProps<
  ZtMessageBoxOptions & {
    message: string;
    kind: 'alert' | 'confirm' | 'prompt';
    finish: (action: ZtMessageBoxAction, value: string) => void;
  }
>();
const value = ref(props.inputValue ?? ''),
  busy = ref(false),
  error = ref(''),
  errorId = useId();
let alive = true;
onBeforeUnmount(() => {
  alive = false;
});
async function confirm() {
  if (busy.value) return;
  busy.value = true;
  error.value = '';
  try {
    if (props.kind === 'prompt' && props.inputValidator) {
      const valid = await props.inputValidator(value.value);
      if (!alive) return;
      if (valid !== true) {
        error.value = typeof valid === 'string' ? valid : '输入不符合要求';
        return;
      }
    }
    if ((await props.beforeConfirm?.(value.value)) === false) return;
    if (alive) props.finish('confirm', value.value);
  } catch (e) {
    if (alive)
      error.value = e instanceof Error ? e.message : '操作失败，请重试';
  } finally {
    if (alive) busy.value = false;
  }
}
function close(reason: ZtOverlayCloseReason) {
  props.finish(reason === 'cancel' ? 'cancel' : 'close', value.value);
}
</script>
<template>
  <ZtModal
    :model-value="true"
    :title="title ?? (kind === 'prompt' ? '输入内容' : '提示')"
    :width="440"
    show-footer
    :show-cancel-button="kind !== 'alert'"
    :confirm-text="confirmText ?? '确定'"
    :cancel-text="cancelText ?? '取消'"
    :confirm-loading="busy"
    :before-close="() => !busy"
    @confirm="confirm"
    @close="close"
    ><p>{{ message }}</p>
    <ZtInput
      v-if="kind === 'prompt'"
      v-model="value"
      :placeholder="inputPlaceholder"
      aria-label="输入内容"
      :aria-describedby="error ? errorId : undefined"
      :aria-invalid="!!error"
      :disabled="busy"
      @keydown.enter.prevent="confirm"
    />
    <p v-if="error" :id="errorId" role="alert" class="zt-message-box__error">
      {{ error }}
    </p></ZtModal
  >
</template>
<style scoped>
.zt-message-box__error {
  color: var(--zt-danger-ink, #991b1b);
  font-size: 13px;
}
</style>
