import { compile } from 'sass'
import { parse } from 'postcss'
import { afterEach, describe, expect, it } from 'vitest'

const css = compile('src/components/drawer/drawer.scss').css
afterEach(() => {
  document.head.querySelector('[data-drawer-motion]')?.remove()
  document.body.innerHTML = ''
  window.happyDOM.settings.device.prefersReducedMotion = 'no-preference'
})

function scene(placement: string, phase: string, reduced = false) {
  window.happyDOM.settings.device.prefersReducedMotion = reduced ? 'reduce' : 'no-preference'
  const style = document.createElement('style')
  style.dataset.drawerMotion = ''
  style.textContent = css
  document.head.append(style)
  document.body.innerHTML = `<div class="zt-drawer-surface zt-drawer-surface--${placement} zt-drawer-surface-${phase}-active"><section class="zt-drawer-surface__panel"></section></div>`
  return { root: getComputedStyle(document.body.firstElementChild!), panel: getComputedStyle(document.querySelector('section')!) }
}

describe('Drawer elastic motion', () => {
  it.each([
    ['right', '100%', '0%', 'right center'],
    ['left', '-100%', '0%', 'left center'],
    ['top', '0%', '-100%', 'center top'],
    ['bottom', '0%', '100%', 'center bottom'],
  ])('slides from %s with elasticity anchored at the viewport edge', (placement, x, y, origin) => {
    const { panel, root } = scene(placement!, 'enter')
    expect(panel.animation).toContain('zt-drawer-slide-in 520ms')
    expect(root.transition).toContain('opacity 520ms')
    expect(root.getPropertyValue('--zt-drawer-motion-x')).toBe(x)
    expect(root.getPropertyValue('--zt-drawer-motion-y')).toBe(y)
    expect(panel.transformOrigin).toBe(origin)
    expect(root.getPropertyValue('--zt-drawer-axis-x')).toBe(['left', 'right'].includes(placement!) ? '1' : '0')
    expect(root.getPropertyValue('--zt-drawer-axis-y')).toBe(['top', 'bottom'].includes(placement!) ? '1' : '0')
  })

  it('keeps the overlay alive for the entire outgoing panel animation', () => {
    const { panel, root } = scene('right', 'leave')
    expect(panel.animation).toContain('zt-drawer-slide-out 300ms')
    expect(root.transition).toContain('background-color 300ms')
    expect(root.pointerEvents).toBe('none')
  })

  it.each(['in', 'out'])('uses a continuous, mild, edge-anchored %s spring trajectory', phase => {
    const keyframes = parse(css).nodes.find((n: any) => n.type === 'atrule' && n.params === `zt-drawer-slide-${phase}`) as any;
    const transforms = keyframes.nodes.map((rule: any) => rule.nodes.find((d: any) => d.prop === 'transform').value) as string[];
    expect(transforms.length).toBeGreaterThanOrEqual(50);
    const travel = transforms.map(value => Number(value.match(/--zt-drawer-motion-x\) \* ([\d.e-]+)/)![1]));
    const stretch = transforms.map(value => Number(value.match(/--zt-drawer-axis-x\) \* ([\d.e-]+)/)![1]));
    expect(travel[0]).toBe(phase === 'in' ? 1 : 0);
    expect(travel.at(-1)).toBe(phase === 'in' ? 0 : 1);
    expect(travel.every(value => value >= 0 && value <= 1)).toBe(true);
    expect(Math.max(...stretch)).toBeGreaterThan(.01);
    expect(Math.max(...stretch.map(Math.abs))).toBeLessThan(.05);
    const { panel } = scene('right', phase === 'in' ? 'enter' : 'leave');
    expect(panel.animation).toContain('linear');
    if (phase === 'in') {
      // The visible inner edge follows travel minus extension across the bounce.
      const edge = travel.map((value, i) => value - stretch[i]!);
      const velocity = edge.slice(1).map((value, i) => value - edge[i]!);
      expect(Math.max(...velocity.slice(1).map((v, i) => Math.abs(v - velocity[i]!)))).toBeLessThan(.04);
      expect(Math.min(...edge)).toBeLessThan(-.02);
      // Shape trails the slide: first extend, then compress, with a quieter tail.
      expect(Math.min(...stretch)).toBeLessThan(-.01);
      const extension = stretch.indexOf(Math.max(...stretch));
      const compression = stretch.indexOf(Math.min(...stretch));
      expect(extension).toBeGreaterThan(transforms.length * .2);
      expect(compression).toBeGreaterThan(extension);
      expect(stretch.slice(-5).every(value => Math.abs(value) < .002)).toBe(true);
    } else {
      expect(travel[1]).toBeGreaterThan(0);
      expect(travel.every((value, i) => i === 0 || value > travel[i - 1]!)).toBe(true);
      document.body.firstElementChild!.classList.add('zt-drawer-surface-leave-to');
      expect(getComputedStyle(document.body.firstElementChild!).opacity).not.toBe('0');
    }
  });

  it.each(['enter', 'leave'])('disables %s motion with reduced motion', phase => {
    const { panel, root } = scene('bottom', phase, true)
    expect(panel.animation).toBe('none')
    expect(panel.transform).toBe('none')
    expect(root.transition).toBe('none')
  })
})
