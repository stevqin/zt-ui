import { compile } from 'sass'
import { afterEach, describe, expect, it } from 'vitest'

const css = compile('src/components/popover/popover.scss').css
const style = document.createElement('style')
afterEach(() => {
  style.remove()
  document.body.innerHTML = ''
  window.happyDOM.settings.device.prefersReducedMotion = 'no-preference'
})
function scene(placement: string, phase: string, reduced = false) {
  window.happyDOM.settings.device.prefersReducedMotion = reduced ? 'reduce' : 'no-preference'
  style.textContent = css
  document.head.append(style)
  const popup = document.createElement('div')
  popup.className = `zt-popover zt-popover--${placement} zt-popover-${phase}-active zt-popover-${phase === 'enter' ? 'enter-from' : 'leave-to'}`
  popup.style.setProperty('--zt-popover-arrow-x', '40px')
  popup.style.setProperty('--zt-popover-arrow-y', '20px')
  document.body.append(popup)
  return { popup, css: getComputedStyle(popup) }
}

describe('Anchored popup motion', () => {
  it.each([
    ['top', 'bottom', '0px', '3px'],
    ['bottom', 'top', '0px', '-3px'],
    ['left', 'right', '3px', '0px'],
    ['right', 'left', '-3px', '0px'],
  ])('opens %s from the anchor edge with a slight scale and directional offset', (placement, edge, x, y) => {
    const { css } = scene(placement!, 'enter')
    expect(css.transformOrigin).toContain(edge)
    expect(css.getPropertyValue('--zt-popover-enter-x')).toBe(x)
    expect(css.getPropertyValue('--zt-popover-enter-y')).toBe(y)
    expect(css.transform).toContain('scale(0.97)')
    expect(css.opacity).toBe('0')
    expect(css.transition).not.toMatch(/filter|width|height|all/)
  })

  it('fades out faster than it enters without a new scale target or intercepting pointer events', () => {
    const entering = scene('top', 'enter').css.transition
    const { css } = scene('top', 'leave')
    const durations = (value: string) => [...value.matchAll(/([\d.]+)ms/g)].map(match => Number(match[1]))
    expect(Math.max(...durations(css.transition))).toBeLessThan(Math.min(...durations(entering)))
    expect(css.transform).toMatch(/^(?:none)?$/)
    expect(css.opacity).toBe('0')
    expect(css.pointerEvents).toBe('none')
  })

  it('disables scaling and transitions under reduced motion', () => {
    const entering = scene('bottom', 'enter', true).css
    expect(entering.transition).toBe('none')
    expect(entering.transform).toBe('none')
    expect(scene('bottom', 'leave', true).css.transition).toBe('none')
  })
})
