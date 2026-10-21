// Keep expensive slot content at its destination layout while only the small
// dialog shell changes size. In particular, never scale text or embedded charts.
function temporaryStyle(element: HTMLElement, styles: Record<string, string>) {
  const previous = Object.keys(styles).map(name => [name, element.style.getPropertyValue(name), element.style.getPropertyPriority(name)] as const)
  for (const [name, value] of Object.entries(styles)) element.style.setProperty(name, value)
  return () => {
    for (const [name, value, priority] of previous) {
      if (value) element.style.setProperty(name, value, priority)
      else element.style.removeProperty(name)
    }
  }
}

export function animateFullscreenBounds(panel: HTMLElement, from: DOMRect, to: DOMRect) {
  const body = panel.querySelector<HTMLElement>(':scope > .zt-modal__body')
  const header = panel.querySelector<HTMLElement>(':scope > .zt-modal__header')
  const footer = panel.querySelector<HTMLElement>(':scope > .zt-modal__footer')
  // Batch layout reads before style writes. There are no per-frame JS reads.
  const bodyRect = body?.getBoundingClientRect()
  const headerHeight = header?.getBoundingClientRect().height ?? 0
  const restore: (() => void)[] = []
  restore.push(temporaryStyle(panel, {
    position: 'fixed', left: '0', top: '0', margin: '0',
    'max-width': 'none', 'max-height': 'none', 'box-sizing': 'border-box',
  }))
  if (body && bodyRect) {
    restore.push(temporaryStyle(body, {
      position: 'absolute', left: '0', top: `${headerHeight}px`,
      width: `${bodyRect.width}px`, height: `${bodyRect.height}px`,
      'box-sizing': 'border-box', contain: 'layout paint style',
    }))
  }
  if (footer) restore.push(temporaryStyle(footer, { 'margin-top': 'auto' }))
  const frame = (rect: DOMRect) => ({
    width: `${rect.width}px`, height: `${rect.height}px`,
    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
  })
  const cleanup = () => restore.splice(0).reverse().forEach(reset => reset())
  try {
    const animation = panel.animate([frame(from), frame(to)], {
      duration: 320, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'both',
    })
    return { animation, cleanup }
  } catch (error) {
    cleanup()
    throw error
  }
}
