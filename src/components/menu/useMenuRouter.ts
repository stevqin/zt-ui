import { computed, getCurrentInstance, watch } from 'vue'
import type { Ref } from 'vue'
import type { ZtMenuItem, ZtMenuProps, ZtMenuRoute } from './types'

// Vue Router exposes this public instance on app.config.globalProperties.
// Keeping the adapter structural avoids making routing mandatory for library consumers.
interface MenuRouter {
 currentRoute: Ref<{ path: string; fullPath: string }>
 resolve: (to: ZtMenuRoute) => { path: string; fullPath: string; href: string }
 push: (to: ZtMenuRoute) => Promise<unknown>
}
export function useMenuRouter(props: ZtMenuProps, select: (key: string, ancestors: string[]) => void) {
 const instance = getCurrentInstance()!
 const router = computed(() => props.router ? instance.appContext.config.globalProperties.$router as MenuRouter | undefined : undefined)
 const target = (item: ZtMenuItem): ZtMenuRoute => item.route ?? item.key
 function href(item: ZtMenuItem) {
  if (item.href) return item.href
  if (!router.value || item.children?.length) return undefined
  try { return router.value.resolve(target(item)).href } catch { return undefined }
 }
 function sync() {
  if (!router.value) return
  const current = router.value.currentRoute.value
  let best: { key: string; ancestors: string[]; score: number } | undefined
  function visit(items: ZtMenuItem[], ancestors: string[] = []) {
   for (const item of items) {
    if (item.disabled) continue
    if (item.children?.length) { visit(item.children, item.type === 'group' ? ancestors : [...ancestors, item.key]); continue }
    if (item.href) continue
    try {
     const route = router.value!.resolve(target(item))
     const raw = target(item)
     const exact = typeof raw === 'string' ? /[?#]/.test(raw) : raw.query !== undefined || raw.hash !== undefined
     const matches = exact ? route.fullPath === current.fullPath : route.path === current.path
     const score = route.path.length + (exact ? 10000 : 0)
     if (matches && (!best || score > best.score)) best = { key: item.key, ancestors, score }
    } catch { /* Invalid routes do not interfere with other menu items. */ }
   }
  }
  visit(props.items ?? [])
  select(best?.key ?? '', best?.ancestors ?? [])
 }
 watch([() => router.value?.currentRoute.value.fullPath, () => props.items, () => props.router], sync, { deep: true, immediate: true })
 return { router, target, href, sync }
}
