import { computed, effectScope, inject, provide, onMounted, onUnmounted, ref, shallowReactive, watchEffect, type ComputedRef, type Ref } from 'vue'
import type { ZtFocusRing } from './types'

const focusScopeKey = Symbol('ztFocusScope')
const variable = '--zt-focus-ring-width'
interface DocumentState {
  keyboard: Ref<boolean>
  users: number
  roots: Map<symbol, ComputedRef<ZtFocusRing>>
  release?: () => void
}
const documents = new WeakMap<Document, DocumentState>()

/** Track input modality separately from :focus-visible, which also matches clicked text inputs. */
export function useFocusRing(mode: ComputedRef<ZtFocusRing>) {
  const root = !inject(focusScopeKey, false)
  provide(focusScopeKey, true)
  const doc = typeof document === 'undefined' ? undefined : document
  let state = doc ? documents.get(doc) : undefined
  if (doc && !state) {
    state = { keyboard: ref(false), users: 0, roots: shallowReactive(new Map()) }
    documents.set(doc, state)
  }
  const current = state
  const key = Symbol('focus-ring')
  onMounted(() => {
    if (!doc || !current) return
    if (!current.users++) {
      const original = doc.documentElement.style.getPropertyValue(variable)
      const priority = doc.documentElement.style.getPropertyPriority(variable)
      const keyboard = (event: KeyboardEvent) => {
        if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) current.keyboard.value = true
      }
      const pointer = () => { current.keyboard.value = false }
      doc.addEventListener('keydown', keyboard, true)
      for (const event of ['pointerdown', 'mousedown', 'touchstart']) doc.addEventListener(event, pointer, { capture: true, passive: true })
      const scope = effectScope(true)
      scope.run(() => watchEffect(() => {
        const primary = current.roots.values().next().value?.value ?? 'none'
        doc.documentElement.style.setProperty(variable, primary === 'all' || primary === 'keyboard' && current.keyboard.value ? '2px' : '0px')
      }, { flush: 'sync' }))
      current.release = () => {
        scope.stop()
        doc.removeEventListener('keydown', keyboard, true)
        for (const event of ['pointerdown', 'mousedown', 'touchstart']) doc.removeEventListener(event, pointer, true)
        if (original) doc.documentElement.style.setProperty(variable, original, priority)
        else doc.documentElement.style.removeProperty(variable)
        current.keyboard.value = false
      }
    }
    if (root) current.roots.set(key, mode)
  })
  onUnmounted(() => {
    if (!current) return
    current.roots.delete(key)
    if (!--current.users) current.release?.()
  })
  return computed(() => mode.value === 'all' || mode.value === 'keyboard' && current?.keyboard.value ? '2px' : '0px')
}
