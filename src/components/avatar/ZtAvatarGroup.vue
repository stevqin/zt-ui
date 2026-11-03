<script setup lang="ts">
import { Comment, Fragment, Text, cloneVNode, computed, h, mergeProps, provide, ref, useAttrs, type VNode } from 'vue'
import { useZtConfig } from '../config-provider/context'
import ZtPopover from '../popover/ZtPopover.vue'
import { avatarGroupKey, avatarSizes, avatarSizeStyle } from './context'
import type { ZtAvatarGroupProps, ZtAvatarItem } from './types'
import './avatar.scss'

defineOptions({ name: 'ZtAvatarGroup', inheritAttrs: false })
const props = withDefaults(defineProps<ZtAvatarGroupProps>(), { shape: 'circle', label: '头像组' })
const slots = defineSlots<{
  /** 重叠展示的 ZtAvatar，支持 v-for；alt 用作成员面板中的姓名。 */
  default?: () => VNode[]
}>()
const emit = defineEmits<{
  /** 点击成员面板中的成员；item 为头像绑定的原始业务对象，未绑定时为头像 props；index 为完整列表中从 0 开始的索引。 */
  'member-click': [item: ZtAvatarItem, index: number, event: MouseEvent]
}>()
const attrs = useAttrs()
const config = useZtConfig(), opened = ref(false), memberList = ref<HTMLElement>()
const pointed = ref<number>(), focused = ref<number>()
const active = computed(() => pointed.value ?? focused.value)
// Resolve hover using original positions so raised avatars cannot hide the next pointer slot.
function pointMember(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  const group = event.currentTarget as HTMLElement
  const children = Array.from(group.children) as HTMLElement[]
  const rtl = getComputedStyle(group).direction === 'rtl'
  const position = rtl ? -event.clientX : event.clientX
  let next: number | undefined
  const items = children.filter(child => child.classList.contains('zt-avatar-group__item'))
  items.forEach((item, i) => {
    const rect = item.getBoundingClientRect()
    const following = item.nextElementSibling?.getBoundingClientRect()
    const start = rtl ? -rect.right : rect.left
    const end = following ? (rtl ? -following.right : following.left) : (rtl ? -rect.left : rect.right)
    if (position >= start && position < end) next = i
  })
  pointed.value = next
}
function focusMembers() {
  const list = memberList.value
  if (!list) return
  // Popover has no popup-label prop; name only the dialog owning this list.
  list.closest('[role="dialog"]')?.setAttribute('aria-label', `${props.label}，全部成员`)
  list.focus({ preventScroll: true })
}
const size = computed(() => props.size ?? config.size.value)
provide(avatarGroupKey, { size, shape: computed(() => props.shape) })

function members(nodes: VNode[]): VNode[] {
  return nodes.flatMap(node => node.type === Fragment
    ? members((node.children || []) as VNode[])
    : node.type === Comment || (node.type === Text && !String(node.children).trim()) ? [] : [node])
}

const RenderGroup = () => {
  const all = members(slots.default?.() || [])
  const limit = props.max == null || !Number.isFinite(props.max) ? all.length : Math.max(0, Math.floor(props.max))
  const visible = all.slice(0, limit), hidden = all.slice(limit)
  const preset = avatarSizes.includes(size.value as typeof avatarSizes[number]) ? size.value : undefined
  return h('span', mergeProps({
    class: ['zt-avatar-group', preset && `zt-avatar-group--${preset}`, `zt-avatar-group--${props.shape}`],
    style: { '--zt-avatar-size': avatarSizeStyle(size.value) },
    role: 'group', 'aria-label': props.label,
    onPointermove: pointMember,
    onPointerleave: () => { pointed.value = undefined },
  }, attrs), [
    ...visible.map((node, index) => h('span', { class: ['zt-avatar-group__item', { 'is-active': active.value === index }], key: node.key ?? index,
      onFocusin: () => { focused.value = index },
      onFocusout: (event: FocusEvent) => { if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) focused.value = undefined },
    }, [
      h('span', { class: 'zt-avatar-group__trigger', tabindex: 0 }, [node]),
    ])),
    hidden.length ? h(ZtPopover, {
      placement: 'bottom-end', visible: opened.value,
      onAfterEnter: focusMembers,
      onVnodeUnmounted: () => { opened.value = false },
      'onUpdate:visible': (value: boolean) => { opened.value = value },
    }, {
      default: () => h('button', {
        type: 'button', class: 'zt-avatar-group__overflow',
        'aria-label': `查看全部 ${all.length} 位成员`, 'aria-expanded': opened.value, 'aria-haspopup': 'dialog',
      }, `+${hidden.length}`),
      content: () => h('div', { class: 'zt-avatar-group__panel' }, [
        h('div', { class: 'zt-avatar-group__header' }, [
          h('span', { class: 'zt-avatar-group__title', title: props.label }, props.label),
          h('span', { class: 'zt-avatar-group__count' }, `全部 ${all.length} 位`),
        ]),
        h('ul', { ref: memberList, class: 'zt-avatar-group__members', tabindex: 0, 'aria-label': `${props.label}，全部成员` }, all.map((node, index) => {
          const name = String(node.props?.alt || node.props?.['aria-label'] || `成员 ${index + 1}`)
          return h('li', { key: node.key ?? index }, [h('button', {
            class: 'zt-avatar-group__member', type: 'button', 'aria-label': name,
            onClick: (event: MouseEvent) => emit('member-click', (node.props?.item ?? node.props ?? {}) as ZtAvatarItem, index, event),
          }, [cloneVNode(node), h('span', { class: 'zt-avatar-group__name', title: name }, name)])])
        })),
      ]),
    }) : null,
  ])
}
</script>
<template><RenderGroup /></template>
