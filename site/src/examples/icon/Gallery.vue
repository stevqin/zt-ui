<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ZtIcon, ZtInput, ZtSelect, ZtPopover, ztIconNames } from '@ztechjs/zt-ui';
import type { ZtIconName, ZtIconAnimation, ZtIconAnimationTrigger } from '@ztechjs/zt-ui';
const query = ref('');
const category = ref('');
const selected = ref<ZtIconName | null>(null);
const active = ref<ZtIconName | null>(null);
const animation = ref<ZtIconAnimation | ''>('');
const trigger = ref<ZtIconAnimationTrigger>('hover');
const gallery = ref<HTMLElement>();
const toolbar = ref<HTMLElement>();
const stickyTop = ref(12);
const feedback = ref('');
const copied = ref<'name' | 'component' | null>(null);
const copying = ref(false);
let keyboardOpen = false;
let copyRequest = 0;
let filterRequest = 0;
let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
let headerObserver: ResizeObserver | undefined;
const effects = [
  { value: '', label: '静止' }, { value: 'spin', label: '旋转' },
  { value: 'pulse', label: '呼吸' }, { value: 'bounce', label: '弹跳' },
  { value: 'shake', label: '摇摆' }, { value: 'draw', label: '描边绘制' },
];
const triggers = [
  { value: 'hover', label: '悬停 / 聚焦' },
  { value: 'click', label: '点击播放' }, { value: 'always', label: '持续播放' },
];
const categories: { id: string; title: string; icon: ZtIconName; names: readonly ZtIconName[] }[] = [
  { id: 'actions', title: '操作与导航', icon: 'search', names: ['add', 'minus', 'close', 'check', 'search', 'chevron-up', 'chevron-right', 'chevron-down', 'chevron-left', 'arrow-up', 'arrow-right', 'arrow-down', 'arrow-left', 'more', 'more-vertical', 'menu', 'edit', 'delete', 'home', 'settings', 'refresh', 'upload', 'download', 'save', 'copy', 'link', 'external-link', 'share', 'undo', 'redo', 'login', 'logout', 'maximize', 'maximize-2', 'minimize-2', 'arrow-up-right', 'arrow-down-left', 'arrows-expand', 'arrows-collapse', 'repeat', 'shuffle', 'align-left', 'align-center', 'align-right', 'indent', 'outdent', 'crop'] },
  { id: 'data', title: '数据分析', icon: 'chart-bar', names: ['chart', 'chart-bar', 'chart-pie', 'chart-area', 'chart-scatter', 'chart-radar', 'chart-donut', 'chart-candlestick', 'chart-funnel', 'chart-gauge', 'chart-heatmap', 'chart-boxplot', 'dashboard', 'database', 'server', 'table', 'rows', 'columns', 'sort-ascending', 'sort-descending', 'group', 'aggregate', 'formula', 'data-import', 'data-export', 'filter', 'filter-list', 'chart-stacked', 'chart-waterfall', 'chart-network', 'chart-treemap', 'chart-timeline', 'pivot-table', 'merge-cells', 'split-cells', 'braces', 'binary', 'terminal', 'webhook'] },
  { id: 'fashion', title: '服装设计', icon: 'shirt', names: ['shirt', 'dress', 'jacket', 'pants', 'skirt', 'coat', 'hanger', 'shoe', 'bag', 'scissors', 'ruler', 'palette', 'bow-tie', 'tie', 'hat', 'cap', 'glasses', 'sock', 'boot', 'sneaker', 'watch', 'ring', 'umbrella', 'thread-spool'] },
  { id: 'retail', title: '零售交易', icon: 'store', names: ['store', 'shopping-cart', 'shopping-basket', 'barcode', 'qr-code', 'receipt', 'coupon', 'gift', 'credit-card', 'wallet', 'cash-register', 'percent', 'tag', 'price-tags', 'discount-badge', 'membership', 'ticket', 'scan-line', 'pos-terminal', 'shopping-bag-check', 'storefront-check', 'return-receipt', 'sales-target', 'loyalty-points', 'voucher-stack'] },
  { id: 'finance', title: '财务经营', icon: 'bank', names: ['bank', 'coins', 'banknote', 'calculator', 'invoice', 'piggy-bank', 'safe', 'trend-up', 'trend-down', 'currency-yuan', 'currency-dollar', 'abacus'] },
  { id: 'logistics', title: '库存物流', icon: 'warehouse', names: ['package', 'boxes', 'warehouse', 'inventory', 'pallet', 'forklift', 'truck', 'container', 'route', 'compass', 'scale', 'conveyor', 'location', 'ship', 'plane', 'train', 'car', 'bicycle', 'anchor', 'crane', 'hand-truck', 'delivery-return', 'map', 'signpost', 'fuel'] },
  { id: 'office', title: '办公协作', icon: 'briefcase', names: ['file', 'folder', 'paperclip', 'calendar', 'clock', 'clipboard', 'checklist', 'briefcase', 'building', 'workflow', 'approval', 'stamp', 'contract', 'presentation', 'notebook', 'archive', 'printer', 'calendar-check', 'calendar-range', 'organization', 'file-text', 'file-spreadsheet', 'file-pdf', 'file-code', 'folder-open', 'folder-add', 'book-open', 'graduation-cap', 'medal', 'award', 'coffee', 'clipboard-signature'] },
  { id: 'people', title: '人员沟通', icon: 'users', names: ['user', 'users', 'mail', 'phone', 'message', 'messages', 'send', 'bell', 'bell-off', 'megaphone', 'user-add', 'user-check', 'user-card', 'handshake', 'headset', 'contact-book', 'team-meeting', 'user-remove', 'user-settings', 'user-lock', 'chat-check', 'mail-open', 'mail-send', 'phone-call', 'phone-missed', 'video-call', 'languages'] },
  { id: 'security', title: '状态与安全', icon: 'shield-check', names: ['info', 'warning', 'error', 'success', 'visibility', 'eye-off', 'lock', 'unlock', 'help', 'ban', 'shield', 'shield-check', 'key', 'fingerprint', 'qr-scan', 'cloud', 'cloud-upload', 'wifi', 'globe', 'power', 'code', 'bug', 'shield-alert', 'lock-keyhole', 'scan-face'] },
  { id: 'devices', title: '设备媒体', icon: 'monitor', names: ['image', 'play', 'pause', 'monitor', 'laptop', 'smartphone', 'keyboard', 'mouse', 'camera', 'video', 'microphone', 'volume', 'volume-off', 'music', 'film', 'cpu', 'memory', 'hard-drive', 'usb', 'plug', 'battery', 'battery-charging', 'bluetooth', 'network'] },
  { id: 'tools', title: '常用工具', icon: 'sparkles', names: ['star', 'heart', 'bookmark', 'lightning', 'sparkles', 'target', 'flag', 'pin', 'rocket', 'timer', 'history', 'zoom-in', 'zoom-out', 'sliders', 'tool'] },
  { id: 'nature', title: '自然环境', icon: 'leaf', names: ['sun', 'moon', 'leaf', 'flower', 'tree', 'mountain', 'waves', 'flame', 'droplet', 'snowflake', 'thermometer', 'wind', 'cloud-rain', 'cloud-snow'] },
];
const categoryOptions = [{ value: '', label: '全部分类' }, ...categories.map(group => ({ value: group.id, label: group.title }))];
const visibleGroups = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  return categories.filter(group => !category.value || group.id === category.value)
    .map(group => ({ ...group, names: group.names.filter(name => name.includes(keyword) || group.title.includes(keyword)) }))
    .filter(group => group.names.length);
});
const filtered = computed(() => visibleGroups.value.flatMap(group => group.names));
function componentCode(name: ZtIconName) {
  return `<ZtIcon name="${name}"${animation.value ? ` animation="${animation.value}" animation-trigger="${trigger.value}"` : ''} />`;
}
function resetFeedback() {
  copyRequest++;
  clearTimeout(feedbackTimer);
  feedback.value = '';
  copied.value = null;
  copying.value = false;
}
function updateVisible(name: ZtIconName, visible: boolean) {
  if (visible) {
    resetFeedback();
    selected.value = name;
    active.value = name;
  } else if (active.value === name) {
    active.value = null;
    resetFeedback();
  }
}
function preparePopup(name: ZtIconName) {
  const content = document.querySelector<HTMLElement>(`[data-copy-icon="${name}"]`);
  // Popover has a fragment root; name the actual teleported dialog.
  content?.closest('[role="dialog"]')?.setAttribute('aria-label', `${name} 图标复制`);
  if (keyboardOpen && active.value === name) {
    content?.querySelector<HTMLButtonElement>('.icon-copy__action')?.focus();
  }
}
function openWithKeyboard(name: ZtIconName) {
  keyboardOpen = true;
  if (active.value === name) { preparePopup(name); return; }
  updateVisible(name, true);
}
async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return; } catch { /* Try the local selection fallback. */ }
  }
  const previous = document.activeElement as HTMLElement | null;
  const input = document.createElement('textarea');
  input.value = text;
  input.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.append(input);
  input.select();
  try {
    if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
  } finally {
    input.remove();
    previous?.focus({ preventScroll: true });
  }
}
async function copy(name: ZtIconName, kind: 'name' | 'component') {
  const request = ++copyRequest;
  const text = kind === 'name' ? name : componentCode(name);
  copying.value = true;
  try {
    await writeClipboard(text);
    if (request !== copyRequest) return;
    copied.value = kind;
    feedback.value = kind === 'name' ? '已复制图标名' : '已复制组件代码';
  } catch {
    if (request !== copyRequest) return;
    copied.value = null;
    feedback.value = '复制失败，请选择上方代码手动复制';
  } finally {
    if (request === copyRequest) copying.value = false;
  }
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { feedback.value = ''; copied.value = null; }, 2400);
}
watch([animation, trigger], () => { active.value = null; resetFeedback(); });
watch([query, category], async () => {
  const request = ++filterRequest;
  const rect = toolbar.value?.getBoundingClientRect();
  const pinned = rect && rect.top <= stickyTop.value + 1 && (gallery.value?.getBoundingClientRect().bottom ?? 0) > stickyTop.value;
  active.value = null;
  resetFeedback();
  await nextTick();
  if (request === filterRequest && pinned && toolbar.value) {
    const distance = toolbar.value.getBoundingClientRect().top - stickyTop.value;
    if (Math.abs(distance) > 1) window.scrollBy({ top: distance, behavior: 'instant' });
  }
});
onMounted(() => {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  const updateOffset = () => { stickyTop.value = header.getBoundingClientRect().height + 12; };
  updateOffset();
  if (typeof ResizeObserver !== 'undefined') {
    headerObserver = new ResizeObserver(updateOffset);
    headerObserver.observe(header);
  }
});
onBeforeUnmount(() => { resetFeedback(); filterRequest++; headerObserver?.disconnect(); });
</script>
<template>
  <div ref="gallery" class="icon-gallery" :style="{ '--icon-gallery-top': `${stickyTop}px` }">
    <div ref="toolbar" class="icon-gallery__toolbar" role="group" aria-label="图标检索与动效">
      <div class="icon-gallery__controls">
        <label class="icon-gallery__search">
          <span class="icon-gallery__label">查找图标</span>
          <ZtInput v-model="query" placeholder="搜索名称或分类，如 chart、服装" aria-label="搜索图标" clearable>
            <template #prefix><ZtIcon name="search" :size="16" /></template>
          </ZtInput>
        </label>
        <label><span class="icon-gallery__label">分类</span><ZtSelect v-model="category" :options="categoryOptions" aria-label="图标分类" /></label>
        <label><span class="icon-gallery__label">动效</span><ZtSelect v-model="animation" :options="effects" aria-label="图标动效" /></label>
        <label><span class="icon-gallery__label">触发方式</span><ZtSelect v-model="trigger" :options="triggers" aria-label="动效触发方式" :disabled="!animation" /></label>
      </div>
      <div class="icon-gallery__meta">
        <span class="icon-gallery__summary" aria-live="polite"><b>{{ filtered.length }}</b> / {{ ztIconNames.length }} 个图标<span class="icon-gallery__group-count"> · {{ visibleGroups.length }} 个分类</span></span>
        <span class="icon-gallery__hint"><ZtIcon name="copy" :size="12" /> 点击图标，选择复制方式</span>
      </div>
    </div>
    <section v-for="group in visibleGroups" :key="group.id" class="icon-gallery__group" :aria-label="group.title" :data-category="group.id">
      <header class="icon-gallery__group-heading">
        <ZtIcon :name="group.icon" :size="17" /><h3>{{ group.title }}</h3><span>{{ group.names.length }}</span>
      </header>
      <div class="icons">
        <ZtPopover v-for="name in group.names" :key="name" :visible="active === name" :restore-focus="active === name" placement="bottom" :width="288" :offset="10"
          @update:visible="updateVisible(name, $event)" @after-enter="preparePopup(name)">
          <button type="button" class="icon-gallery__tile" :class="{ 'is-selected': selected === name }" :data-icon="name"
            aria-haspopup="dialog" :aria-expanded="active === name"
            @click="keyboardOpen = $event.detail === 0; selected = name" @keydown.down.prevent="openWithKeyboard(name)">
            <ZtIcon :name="name" :size="28" :animation="animation || undefined" :animation-trigger="trigger" />
            <span>{{ name }}</span>
          </button>
          <template #content>
            <div class="icon-copy" :data-copy-icon="name" :aria-label="`${name} 图标复制`">
              <div class="icon-copy__heading">
                <span class="icon-copy__preview"><ZtIcon :name="name" :size="26" /></span>
                <div><strong>{{ name }}</strong><span>{{ group.title }}</span></div>
              </div>
              <pre class="icon-copy__code" tabindex="0"><code>{{ componentCode(name) }}</code></pre>
              <div class="icon-copy__actions">
                <button type="button" class="icon-copy__action" aria-label="复制图标名" :disabled="copying" @click="copy(name, 'name')">
                  <ZtIcon :name="copied === 'name' ? 'check' : 'tag'" :size="17" /><span>复制图标名<small>用于 name 属性</small></span><ZtIcon name="copy" :size="14" />
                </button>
                <button type="button" class="icon-copy__action" aria-label="复制组件" :disabled="copying" @click="copy(name, 'component')">
                  <ZtIcon :name="copied === 'component' ? 'check' : 'code'" :size="17" /><span>复制组件<small>包含当前动效设置</small></span><ZtIcon name="copy" :size="14" />
                </button>
              </div>
              <p class="icon-copy__feedback" role="status">{{ feedback || 'Esc 关闭 · 可直接选择代码' }}</p>
            </div>
          </template>
        </ZtPopover>
      </div>
    </section>
    <div v-if="!filtered.length" class="icon-gallery__empty" role="status"><ZtIcon name="search" :size="28" /><p>没有匹配的图标，请尝试其他关键词或分类。</p></div>
    <p class="icon-gallery__motion-note">系统开启“减少动态效果”时，动效预览保持静止。</p>
  </div>
</template>
<style scoped>
.icon-gallery { min-width: 0; color: var(--doc-text, inherit); }
.icon-gallery__toolbar {
  position: sticky; top: var(--icon-gallery-top, 12px); z-index: 25;
  padding: 16px 18px 12px; margin-bottom: 28px; border: 1px solid var(--doc-border, #e5e7eb); border-radius: 14px;
  background: var(--doc-bg, #fff); background: color-mix(in srgb, var(--doc-bg, #fff) 92%, transparent);
  backdrop-filter: blur(18px) saturate(1.15); -webkit-backdrop-filter: blur(18px) saturate(1.15);
  box-shadow: 0 8px 28px #182c4d0c, 0 1px 4px #182c4d04;
}
.icon-gallery__controls { display: grid; grid-template-columns: minmax(160px, 1fr) 130px 110px 140px; gap: 14px; align-items: end; }
.icon-gallery__controls label { display: block; min-width: 0; }
.icon-gallery__label { display: block; margin-bottom: 7px; color: var(--doc-muted, #60656f); font-size: 11px; font-weight: 500; }
.icon-gallery__meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; color: var(--doc-muted, #60656f); font-size: 11px; }
.icon-gallery__summary { font-variant-numeric: tabular-nums; }
.icon-gallery__summary b { color: var(--doc-text, #1f2329); font-weight: 600; }
.icon-gallery__hint { display: inline-flex; gap: 5px; align-items: center; }
.icon-gallery__group { margin-top: 26px; scroll-margin-top: calc(var(--icon-gallery-top, 12px) + 140px); }
.icon-gallery__group-heading { display: flex; align-items: center; gap: 9px; margin-bottom: 13px; color: var(--doc-muted, #60656f); }
.icon-gallery__group-heading h3 { margin: 0; color: var(--doc-text, #1f2329); font-size: 14px; font-weight: 600; }
.icon-gallery__group-heading > span:last-child { margin-left: 1px; font: 11px ui-monospace, SFMono-Regular, Consolas, monospace; }
.icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 8px; }
.icons :deep(.zt-popover__reference) { display: flex; width: 100%; min-width: 0; }
.icon-gallery__tile { position: relative; display: grid; width: 100%; min-width: 0; justify-items: center; align-content: center; gap: 13px; min-height: 98px; padding: 16px 5px; border: 1px solid transparent; border-radius: 10px; background: var(--doc-surface, #f6f7f9); color: inherit; cursor: pointer; transition: background .16s, border-color .16s, color .16s; }
.icon-gallery__tile:is(:hover, .is-selected, [aria-expanded='true']) { color: var(--doc-brand, #1677ff); border-color: color-mix(in srgb, var(--doc-brand, #1677ff) 34%, transparent); background: var(--doc-hover, #edf5ff); }
.icon-gallery__tile:focus-visible { outline: 2px solid var(--doc-brand, #1677ff); outline-offset: 2px; }
.icon-gallery__tile > span { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; overflow-wrap: anywhere; text-align: center; }
.icon-gallery__empty { display: grid; justify-items: center; gap: 12px; padding: 56px 12px; color: var(--doc-muted, #60656f); text-align: center; font-size: 13px; }
.icon-gallery__motion-note { margin: 24px 0 0; color: var(--doc-muted, #60656f); font-size: 11px; }
.icon-copy { color: var(--doc-text, #1f2329); }
.icon-copy__heading { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.icon-copy__preview { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 10px; color: var(--doc-brand, #1677ff); background: var(--doc-hover, #edf5ff); }
.icon-copy__heading strong { display: block; font: 600 13px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; }
.icon-copy__heading div > span { color: var(--doc-muted, #60656f); font-size: 11px; }
.icon-copy__code { margin: 0 0 10px; padding: 12px; border: 1px solid var(--doc-border, #e5e7eb); border-radius: 8px; background: var(--doc-code, #f8fafc); white-space: pre-wrap; overflow-wrap: anywhere; font: 11px/1.7 ui-monospace, SFMono-Regular, Consolas, monospace; user-select: text; }
.icon-copy__actions { display: grid; gap: 4px; }
.icon-copy__action { display: flex; gap: 11px; align-items: center; width: 100%; padding: 10px 8px; border: 0; border-radius: 7px; background: transparent; color: inherit; cursor: pointer; text-align: left; }
.icon-copy__action:hover { background: var(--doc-hover, #edf5ff); color: var(--doc-brand, #1677ff); }
.icon-copy__action:focus-visible { outline: 2px solid var(--doc-brand, #1677ff); outline-offset: -2px; }
.icon-copy__action:disabled { opacity: .5; cursor: wait; }
.icon-copy__action > span { flex: 1; font-size: 13px; font-weight: 500; }
.icon-copy__action small { display: block; margin-top: 2px; color: var(--doc-muted, #60656f); font-size: 10px; font-weight: 400; }
.icon-copy__action > .zt-icon-glyph:last-child { color: var(--doc-muted, #60656f); }
.icon-copy__feedback { min-height: 17px; margin: 10px 0 0; padding-top: 10px; border-top: 1px solid var(--doc-border, #e5e7eb); color: var(--doc-muted, #60656f); font-size: 10px; }
@media (max-width: 1100px) { .icon-gallery__controls { grid-template-columns: repeat(3, minmax(0, 1fr)); } .icon-gallery__search { grid-column: 1 / -1; } }
@media (max-width: 600px) {
  .icon-gallery__toolbar { padding: 12px; border-radius: 12px; }
  .icon-gallery__controls { gap: 10px 8px; }
  .icon-gallery__label { font-size: 10px; margin-bottom: 5px; }
  .icon-gallery__hint, .icon-gallery__group-count { display: none; }
  .icon-gallery__meta { margin-top: 9px; }
  .icons { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 6px; }
  .icon-gallery__tile { min-height: 90px; gap: 11px; }
}
@media (prefers-reduced-motion: reduce) { .icon-gallery__tile { transition: none; } }
@media (prefers-reduced-transparency: reduce) { .icon-gallery__toolbar { background: var(--doc-bg, #fff); backdrop-filter: none; -webkit-backdrop-filter: none; } }
</style>
