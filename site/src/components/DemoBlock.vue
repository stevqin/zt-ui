<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'

const props = defineProps<{
  code: string
  desc?: string
}>()

const sourceId = `demo-source-${useId()}`
const expanded = ref(false)
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

const copyLabel = computed(() => ({
  idle: '复制代码',
  copied: '已复制',
  failed: '复制失败',
}[copyState.value]))

function fallbackCopy(value: string) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  const copied = document.execCommand?.('copy')
  textarea.remove()
  if (!copied) throw new Error('Clipboard API unavailable')
}

async function copyCode() {
  if (resetTimer) clearTimeout(resetTimer)
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(props.code)
    else fallbackCopy(props.code)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  resetTimer = setTimeout(() => { copyState.value = 'idle' }, 1800)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <div class="doc-demo">
    <div class="doc-demo__preview">
      <slot />
    </div>

    <div v-if="desc || $slots.desc" class="doc-demo__desc">
      <slot name="desc">{{ desc }}</slot>
    </div>

    <div class="doc-demo__actions">
      <button type="button" class="doc-demo__toggle" :aria-expanded="expanded" :aria-controls="sourceId" @click="expanded = !expanded">
        <svg :class="{ 'is-rotated': expanded }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        {{ expanded ? '隐藏代码' : '查看代码' }}
      </button>
      <button
        type="button"
        class="doc-demo__copy"
        :class="{ 'is-copied': copyState === 'copied', 'is-failed': copyState === 'failed' }"
        :aria-label="copyLabel"
        @click="copyCode"
      >
        <svg v-if="copyState !== 'copied'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="m5 12 4 4L19 6" />
        </svg>
        <span aria-live="polite">{{ copyLabel }}</span>
      </button>
    </div>

    <Transition name="code-expand">
      <div v-show="expanded" :id="sourceId" class="doc-demo__source">
        <div class="doc-demo__source-head">
          <span class="doc-demo__language">Vue + TypeScript</span>
        </div>
        <pre><code>{{ code }}</code></pre>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.code-expand-enter-active,
.code-expand-leave-active {
  transition: max-height 280ms ease, opacity 200ms ease;
  overflow: hidden;
}
.code-expand-enter-from,
.code-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.code-expand-enter-to,
.code-expand-leave-from {
  max-height: 2000px;
  opacity: 1;
}
</style>
