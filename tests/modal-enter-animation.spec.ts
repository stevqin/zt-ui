import { compile } from 'sass';
import { parse } from 'postcss';
import { afterEach, describe, expect, it } from 'vitest';
const css = compile('src/components/modal/modal.scss').css;
const style = document.createElement('style');
afterEach(() => {
  style.remove();
  document.body.innerHTML = '';
  window.happyDOM.settings.device.prefersReducedMotion = 'no-preference';
});
function scene(extra = '', reduced = false, phase = 'enter') {
  window.happyDOM.settings.device.prefersReducedMotion = reduced
    ? 'reduce'
    : 'no-preference';
  style.textContent = css;
  document.head.append(style);
  const root = document.createElement('div');
  root.className = `zt-modal zt-modal-${phase}-active ${extra}`;
  const panel = document.createElement('section');
  panel.className = 'zt-modal__panel';
  panel.style.transform = 'translate3d(60px, 40px, 0)';
  root.append(panel);
  document.body.append(root);
  return { root, panel };
}
describe('Modal entrance motion', () => {
  it('floats the panel while the root transition covers the full entrance and preserves drag transform', () => {
    const { root, panel } = scene();
    const p = getComputedStyle(panel),
      r = getComputedStyle(root);
    expect(p.animation).toContain('zt-modal-float-in 560ms');
    expect(r.transition).toContain('opacity 560ms');
    expect(p.transform).toBe('translate3d(60px, 40px, 0)');
  });
  it('settles after a more visible rebound', () => {
    const keyframes = parse(css).nodes.find(
      (n: any) =>
        n.type === 'atrule' &&
        n.name === 'keyframes' &&
        n.params === 'zt-modal-float-in',
    ) as any;
    expect(keyframes).toBeDefined();
    const frames = keyframes.nodes.map((rule: any) =>
      Object.fromEntries(rule.nodes.map((d: any) => [d.prop, d.value])),
    );
    const y = frames.map((f: any) => parseFloat(f.translate.split(/\s+/)[1]));
    expect(Math.max(...y.map(Math.abs))).toBeLessThanOrEqual(64);
    expect(parseFloat(frames[0].scale)).toBeLessThan(1);
    expect(frames.some((f: any) => parseFloat(f.scale) > 1)).toBe(true);
    expect(y.at(-1)).toBe(0);
    expect(frames.at(-1).scale).toBe('1');
  });
  it('uses opacity only for fullscreen entry', () => {
    const { panel } = scene('zt-modal--fullscreen');
    expect(getComputedStyle(panel).animationName).toBe('zt-modal-fade-in');
  });
  it('removes motion for reduced-motion users while preserving a dragged panel position', () => {
    const { root, panel } = scene('', true);
    const p = getComputedStyle(panel);
    expect(p.animation).toBe('none');
    expect(p.getPropertyValue('translate')).toBe('none');
    expect(p.getPropertyValue('scale')).toBe('none');
    expect(getComputedStyle(root).transition).toBe('none');
    expect(p.transform).toBe('translate3d(60px, 40px, 0)');
  });
});

function framesFor(name: string) {
  const frames = parse(css).nodes.find(
    (n: any) =>
      n.type === 'atrule' && n.name === 'keyframes' && n.params === name,
  ) as any;
  expect(frames).toBeDefined();
  return frames.nodes.map((rule: any) =>
    Object.fromEntries(rule.nodes.map((d: any) => [d.prop, d.value])),
  ) as Record<string, string>[];
}
describe('Modal coordinated spring motion', () => {
  it('restores weighted jelly deformation with only a modest increase in jump amplitude', () => {
    const frames = framesFor('zt-modal-float-in');
    const y = frames.map(frame => parseFloat(frame.translate!.split(/\s+/)[1]!));
    expect(y[0]).toBe(54); // Previous jelly entry started at 48px.
    expect(Math.min(...y)).toBeLessThan(-16);
    expect(Math.min(...y)).toBeGreaterThan(-20);
    const scales = frames.map(frame => frame.scale!.trim().split(/\s+/).map(Number));
    expect(scales.some(([x, y]) => x! < .86 && y! > 1.12)).toBe(true);
    expect(scales.some(([x, y]) => x! > 1.035 && y! < .98)).toBe(true);
    const peak = y.indexOf(Math.min(...y));
    expect(Math.max(...y.slice(peak + 1))).toBeGreaterThan(4);
    expect(Math.max(...y.slice(peak + 1))).toBeLessThan(8);
    for (const scale of scales.flat()) {
      expect(scale).toBeGreaterThanOrEqual(.8);
      expect(scale).toBeLessThanOrEqual(1.18);
    }
    expect(frames.at(-1)!.translate).toBe('0 0');
    expect(frames.at(-1)!.scale).toBe('1');
  });
  it('covers the full exit animation before releasing the overlay and preserves drag position', () => {
    const { root, panel } = scene('', false, 'leave');
    expect(getComputedStyle(panel).animation).toContain(
      'zt-modal-float-out 350ms',
    );
    expect(getComputedStyle(root).transition).toContain('background-color 350ms');
    expect(getComputedStyle(panel).transform).toBe(
      'translate3d(60px, 40px, 0)',
    );
  });
  it('shrinks in place for 150ms and then drops immediately until disappearing', () => {
    const rule = parse(css).nodes.find((n: any) => n.type === 'atrule' && n.params === 'zt-modal-float-out') as any;
    const frames = framesFor('zt-modal-float-out');
    const shrinkEnd = rule.nodes.findIndex((node: any) => Math.abs(parseFloat(node.selector) / 100 * 350 - 150) < .01);
    expect(shrinkEnd).toBeGreaterThan(0);
    expect(frames[0]!.translate).toBe('0 0');
    expect(frames[shrinkEnd]!.translate).toBe('0 0');
    expect(Number(frames[shrinkEnd]!.scale)).toBe(.9);
    expect(frames[shrinkEnd]!.opacity).toBe('1');
    expect(frames[shrinkEnd]!['animation-timing-function']).toBe('cubic-bezier(0.4, 0, 1, 1)');
    expect(frames.at(-1)!.opacity).toBe('0');
    expect(parseFloat(frames.at(-1)!.translate!.split(/\s+/)[1]!)).toBeGreaterThanOrEqual(100);
    const { root, panel } = scene('', false, 'leave');
    root.classList.add('zt-modal-leave-to');
    expect(getComputedStyle(root).opacity).not.toBe('0');
    expect(getComputedStyle(root).backgroundColor).toBe('transparent');
    expect(getComputedStyle(panel).animation).toContain('linear');
  });
  it('keeps entry momentum continuous while the spring settles', () => {
    const frames = framesFor('zt-modal-float-in');
    expect(frames.length).toBeGreaterThanOrEqual(40);
    const positions = frames.map(frame => parseFloat(frame.translate!.split(/\s+/)[1]!));
    const velocity = positions.slice(1).map((position, i) => position - positions[i]!);
    expect(Math.max(...velocity.slice(1).map((v, i) => Math.abs(v - velocity[i]!)))).toBeLessThan(2);
    expect(Math.abs(velocity[0]!)).toBeGreaterThan(.1);
    for (const frame of frames.slice(-12)) {
      expect(Math.abs(parseFloat(frame.translate!.split(/\s+/)[1]!))).toBeLessThan(2);
      for (const scale of frame.scale!.split(/\s+/).map(Number)) {
        expect(Math.abs(scale - 1)).toBeLessThan(.01);
      }
    }
    const { panel } = scene();
    expect(getComputedStyle(panel).animation).toContain('linear');
  });
  it('uses a matching fade for fullscreen exit and removes both animations under reduced motion', () => {
    const fullscreen = scene('zt-modal--fullscreen', false, 'leave');
    expect(getComputedStyle(fullscreen.panel).animationName).toBe(
      'zt-modal-fade-out',
    );
    const reduced = scene('', true, 'leave');
    expect(getComputedStyle(reduced.panel).animation).toBe('none');
    expect(getComputedStyle(reduced.root).transition).toBe('none');
  });
});
