import { afterEach, describe, expect, it, vi } from 'vitest'
import { animateFullscreenBounds } from '../src/components/modal/fullscreenMotion'

afterEach(() => { document.body.innerHTML = '' })

function scene() {
  const panel = document.createElement('section')
  panel.style.transform = 'translate3d(50px, 30px, 0)'
  panel.innerHTML = '<header class="zt-modal__header"></header><div class="zt-modal__body" style="padding: 0; width: 80%; contain: style;"><input value="unsaved"></div><footer class="zt-modal__footer" style="margin-top: 12px;"></footer>'
  document.body.append(panel)
  const body = panel.querySelector<HTMLElement>('.zt-modal__body')!
  const header = panel.querySelector<HTMLElement>('.zt-modal__header')!
  const footer = panel.querySelector<HTMLElement>('.zt-modal__footer')!
  body.getBoundingClientRect = vi.fn(() => ({ width: 1000, height: 682 }) as DOMRect)
  header.getBoundingClientRect = vi.fn(() => ({ height: 60 }) as DOMRect)
  const animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation)
  Object.defineProperty(panel, 'animate', { value: animate })
  const from = { left: 360, top: 240, width: 560, height: 320 } as DOMRect
  const to = { left: 0, top: 0, width: 1000, height: 800 } as DOMRect
  return { panel, body, header, footer, animate, from, to }
}

describe('Modal fullscreen content isolation', () => {
  it('keeps the live form and its layout stable while the shell changes size, then restores author styles', () => {
    const { panel, body, footer, from, to } = scene()
    const input = body.querySelector('input')!
    input.focus()
    body.scrollTop = 120
    const bodyStyle = body.style.cssText
    const { cleanup } = animateFullscreenBounds(panel, from, to)
    expect(body.style.width).toBe('1000px')
    expect(body.style.height).toBe('682px')
    expect(body.style.top).toBe('60px')
    expect(body.style.contain).toContain('layout')
    expect(footer.style.marginTop).toBe('auto')
    expect(body.querySelector('input')).toBe(input)
    expect(document.activeElement).toBe(input)
    expect(input.value).toBe('unsaved')
    expect(body.getBoundingClientRect).toHaveBeenCalledOnce()
    cleanup()
    cleanup()
    expect(body.style.cssText).toBe(bodyStyle)
    expect(body.scrollTop).toBe(120)
    expect(footer.style.marginTop).toBe('12px')
    expect(panel.style.position).toBe('')
    expect(panel.style.transform).toBe('translate3d(50px, 30px, 0)')
  })

  it('cleans up temporary layout if the browser rejects the animation', () => {
    const { panel, body, footer, animate, from, to } = scene()
    animate.mockImplementation(() => { throw new Error('animation unavailable') })
    expect(() => animateFullscreenBounds(panel, from, to)).toThrow('animation unavailable')
    expect(panel.style.position).toBe('')
    expect(body.style.width).toBe('80%')
    expect(body.style.contain).toBe('style')
    expect(footer.style.marginTop).toBe('12px')
  })
})
