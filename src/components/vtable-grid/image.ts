/** Bounded deduplicating image loader. release settles pending loads and removes all handlers. */
export function createGridImageLoader(createImage = () => new Image(), maxEntries = 1000) {
  const failed = '__zt_grid_image_load_failed__'
  const cache = new Map<string, Promise<HTMLImageElement | string>>()
  const pending = new Set<() => void>()
  let released = false
  const load = (value: unknown): unknown => {
    if (typeof value !== 'string' || !value.trim()) return typeof value === 'string' ? '' : value
    if (released) return failed
    const url = value.trim()
    const cached = cache.get(url)
    if (cached) return cached
    const promise = new Promise<HTMLImageElement | string>(resolve => {
      const image = createImage()
      let settled = false
      const finish = (result: HTMLImageElement | string) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        image.onload = image.onerror = null
        pending.delete(cancel)
        resolve(result)
      }
      const cancel = () => finish(failed)
      const timer = setTimeout(cancel, 15000)
      pending.add(cancel)
      image.onload = () => finish(image)
      image.onerror = cancel
      // Ordinary img requests allow non-CORS image hosts to display in Canvas.
      try { image.src = url } catch { cancel() }
    })
    cache.set(url, promise)
    if (cache.size > Math.max(1, maxEntries)) cache.delete(cache.keys().next().value!)
    return promise
  }
  return Object.assign(load, { release() { released = true; pending.forEach(cancel => cancel()); cache.clear() } })
}

interface ImagePreviewOptions {
  getColumn: (event: any) => { field?: string; cellType?: unknown; editable?: unknown; clickToPreview?: boolean } | undefined
  enabled?: () => boolean
  getValue?: (event: any, column: any, record: any) => unknown
  onOpen?: (url: string) => void
  onClose?: () => void
  onRefresh?: () => void
}

/** Bind single-click image-target preview. Supplying onOpen lets the host render its own preview UI. */
export function bindGridImagePreview(table: any, options: ImagePreviewOptions) {
  let overlay: HTMLElement | undefined
  let open = false
  let released = false
  let previousFocus: HTMLElement | null = null
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
    if (event.key === 'Tab' && overlay) { event.preventDefault(); overlay.querySelector('button')?.focus() }
  }
  function close() {
    if (!open) return
    open = false
    overlay?.remove()
    overlay = undefined
    document.removeEventListener('keydown', onKeydown)
    previousFocus?.focus?.()
    previousFocus = null
    options.onClose?.()
    options.onRefresh?.()
  }
  function show(url: string) {
    close()
    open = true
    previousFocus = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown)
    if (options.onOpen) { options.onOpen(url); return }
    overlay = document.createElement('div')
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-label', '图片预览')
    overlay.setAttribute('aria-modal', 'true')
    overlay.tabIndex = -1
    Object.assign(overlay.style, { position: 'fixed', inset: '0', zIndex: '10000', background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' })
    const image = document.createElement('img')
    image.src = url
    image.alt = '图片预览'
    Object.assign(image.style, { maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' })
    image.addEventListener('click', event => event.stopPropagation())
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = '关闭'
    button.setAttribute('aria-label', '关闭图片预览')
    Object.assign(button.style, { position: 'absolute', top: '16px', right: '16px', cursor: 'pointer', borderRadius: '8px', padding: '8px 14px' })
    button.addEventListener('click', close)
    overlay.append(image, button)
    overlay.addEventListener('click', close)
    document.body.appendChild(overlay)
    button.focus()
  }
  const listener = (event: any) => {
    if (released || options.enabled?.() === false || event.target?.type !== 'image') return
    const column = options.getColumn(event)
    const type = typeof column?.editable === 'object' ? (column.editable as any)?.type : column?.editable
    if (!column || column.clickToPreview === false || (column.cellType !== 'image' && type !== 'image')) return
    const record = table.getCellOriginRecord?.(event.col, event.row)
    if (!record || record.__zt_grid_summary__) return
    const value = options.getValue ? options.getValue(event, column, record) : column.field?.split('.').reduce((object: any, key) => object?.[key], record)
    if (typeof value === 'string' && value.trim()) show(value.trim())
  }
  table.on('click_cell', listener)
  return { close, release() { if (released) return; released = true; table.off('click_cell', listener); close() } }
}
