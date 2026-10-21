import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ZtModal from '../src/components/modal/ZtModal.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  vi.unstubAllGlobals()
  resetOverlayManager()
  document.body.innerHTML = ''
})

function setup() {
  const wrapper = mount(ZtModal, {
    attachTo: document.body,
    props: { modelValue: true, showFullscreenButton: true, draggable: true },
  })
  const root = document.querySelector<HTMLElement>('.zt-modal')!
  const panel = document.querySelector<HTMLElement>('.zt-modal__panel')!
  panel.getBoundingClientRect = () => {
    const full = root.classList.contains('zt-modal--fullscreen')
    const drag = panel.style.transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px/)
    const x = full ? 0 : 100 + Number(drag?.[1] ?? 0)
    const y = full ? 0 : 80 + Number(drag?.[2] ?? 0)
    const width = full ? 1000 : 560, height = full ? 800 : 320
    return { x, y, left: x, top: y, width, height, right: x + width, bottom: y + height, toJSON: () => ({}) }
  }
  const animations: { cancel: ReturnType<typeof vi.fn>; onfinish: (() => void) | null }[] = []
  const animate = vi.fn(() => {
    const animation = { cancel: vi.fn(), onfinish: null as (() => void) | null }
    animations.push(animation)
    return animation
  })
  Object.defineProperty(panel, 'animate', { value: animate, configurable: true })
  return { wrapper, root, panel, animate, animations }
}

describe('Modal fullscreen motion', () => {
  it('animates real window bounds in both directions without scaling or fading the contents', async () => {
    const { wrapper, root, panel, animate, animations } = setup()
    const body = panel.querySelector<HTMLElement>('.zt-modal__body')!
    body.getBoundingClientRect = () => ({ width: 1000, height: 740, top: 60, left: 0 }) as DOMRect
    try {
      const button = document.querySelector<HTMLButtonElement>('.zt-modal__fullscreen')!
      button.click()
      await nextTick()
      await nextTick()
      expect(animate).toHaveBeenCalledTimes(1)
      const [frames, options] = animate.mock.calls[0] as any
      expect(frames).toEqual([
        { width: '560px', height: '320px', transform: 'translate3d(100px, 80px, 0)' },
        { width: '1000px', height: '800px', transform: 'translate3d(0px, 0px, 0)' },
      ])
      expect(options.duration).toBe(320)
      expect(root.classList.contains('zt-modal--resizing')).toBe(true)
      expect(body.style.width).toBe('1000px')
      expect(body.style.height).toBe('740px')
      expect(body.style.position).toBe('absolute')
      expect(panel.style.position).toBe('fixed')
      animations[0]!.onfinish!()
      await nextTick()
      expect(root.classList.contains('zt-modal--resizing')).toBe(false)
      expect(body.style.width).toBe('')
      expect(body.style.position).toBe('')
      expect(panel.style.position).toBe('')
      button.click()
      await nextTick()
      await nextTick()
      expect(animate).toHaveBeenCalledTimes(2)
      const [restoreFrames] = animate.mock.calls[1] as any
      expect(restoreFrames).toEqual([...frames].reverse())
      expect(restoreFrames.every((frame: Keyframe) => !frame.transform?.includes('scale') && !('opacity' in frame))).toBe(true)
      expect(wrapper.emitted('fullscreen-change')).toEqual([[true], [false]])
    } finally { wrapper.unmount() }
  })

  it('switches four outward arrows to four inward arrows with the fullscreen state', async () => {
    const { wrapper } = setup()
    try {
      const button = document.querySelector<HTMLButtonElement>('.zt-modal__fullscreen')!
      const paths = () => [...button.querySelectorAll('path')].map(path => path.getAttribute('d'))
      expect(button.getAttribute('aria-label')).toBe('进入全屏')
      expect(paths()).toEqual([
        'M9 9 3 3m0 5V3h5',
        'm15 9 6-6m-5 0h5v5',
        'm9 15-6 6m0-5v5h5',
        'm15 15 6 6m-5 0h5v-5',
      ])
      button.click()
      await nextTick()
      expect(button.getAttribute('aria-label')).toBe('退出全屏')
      expect(paths()).toEqual([
        'm3 3 6 6M4 9h5V4',
        'm21 3-6 6m0-5v5h5',
        'm3 21 6-6m-5 0h5v5',
        'm21 21-6-6m0 5v-5h5',
      ])
      expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    } finally { wrapper.unmount() }
  })

  it('animates controlled fullscreen updates and cancels an interrupted transition', async () => {
    const { wrapper, root, animate, animations } = setup()
    try {
      await wrapper.setProps({ fullscreen: true })
      await nextTick()
      const oldFinish = animations[0]!.onfinish
      await wrapper.setProps({ fullscreen: false })
      await nextTick()
      expect(animate).toHaveBeenCalledTimes(2)
      expect(animations[0]!.cancel).toHaveBeenCalledOnce()
      oldFinish?.()
      await nextTick()
      expect(root.classList.contains('zt-modal--resizing')).toBe(true)
      animations[1]!.onfinish!()
      await nextTick()
      expect(root.classList.contains('zt-modal--resizing')).toBe(false)
    } finally { wrapper.unmount() }
  })

  it('restores the dragged position when leaving fullscreen', async () => {
    const { wrapper, panel, animate, animations } = setup()
    try {
      const header = document.querySelector<HTMLElement>('.zt-modal__header')!
      header.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, clientX: 200, clientY: 120 }))
      document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 260, clientY: 160 }))
      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
      await nextTick()
      await wrapper.setProps({ fullscreen: true })
      await nextTick()
      animations[0]!.onfinish!()
      await wrapper.setProps({ fullscreen: false })
      await nextTick()
      expect(panel.style.transform).toBe('translate3d(60px, 40px, 0)')
      expect((animate.mock.calls[1] as any)[0][1].transform).toBe('translate3d(160px, 120px, 0)')
    } finally { wrapper.unmount() }
  })

  it('changes fullscreen immediately without animation under reduced motion', async () => {
    const { wrapper, root, animate } = setup()
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    try {
      await wrapper.setProps({ fullscreen: true })
      await nextTick()
      expect(root.classList.contains('zt-modal--fullscreen')).toBe(true)
      expect(root.classList.contains('zt-modal--resizing')).toBe(false)
      expect(animate).not.toHaveBeenCalled()
    } finally { wrapper.unmount() }
  })

  it('cancels fullscreen animation when closing so exit motion can run', async () => {
    const { wrapper, root, animations } = setup()
    try {
      await wrapper.setProps({ fullscreen: true })
      await nextTick()
      expect(animations).toHaveLength(1)
      await wrapper.setProps({ modelValue: false })
      expect(animations[0]!.cancel).toHaveBeenCalledOnce()
      expect(root.classList.contains('zt-modal--resizing')).toBe(false)
      expect(document.querySelector<HTMLElement>('.zt-modal__body')!.style.position).toBe('')
    } finally { wrapper.unmount() }
  })
})
