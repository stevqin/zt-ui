import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  watch,
  type WatchSource,
} from 'vue';
export type ZtScrollTarget =
  | string
  | HTMLElement
  | Window
  | (() => HTMLElement | Window | null | undefined);
export function resolveScrollTarget(
  value?: ZtScrollTarget,
): HTMLElement | Window {
  try {
    const target =
      typeof value === 'function'
        ? value()
        : typeof value === 'string'
          ? document.querySelector<HTMLElement>(value)
          : value;
    return target ?? window;
  } catch {
    return window;
  }
}
export function isWindow(target: HTMLElement | Window): target is Window {
  return target === window;
}
export function scrollTop(target: HTMLElement | Window) {
  return isWindow(target) ? window.scrollY : target.scrollTop;
}
export function viewport(target: HTMLElement | Window) {
  return isWindow(target)
    ? {
        top: 0,
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    : target.getBoundingClientRect();
}
export function motion(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
}
export function findTarget(selector: string): HTMLElement | null {
  try {
    return document.querySelector<HTMLElement>(selector);
  } catch {
    return null;
  }
}
/** Bind the container, ancestor scrolling and geometry changes with symmetric teardown. */
export function useScrollTarget(
  source: WatchSource<ZtScrollTarget | undefined>,
  update: (target: HTMLElement | Window) => void,
) {
  let target: HTMLElement | Window | undefined,
    observer: ResizeObserver | undefined,
    mounted = false;
  const read = () => (typeof source === 'function' ? source() : source.value);
  const listener = () => {
    if (mounted && target) update(target);
  };
  const ancestorScroll = (event: Event) => {
    if (target !== window && event.target !== target) listener();
  };
  function bind() {
    if (!mounted) return;
    target?.removeEventListener('scroll', listener);
    observer?.disconnect();
    target = resolveScrollTarget(read());
    target.addEventListener('scroll', listener, { passive: true });
    if (target !== window && typeof ResizeObserver !== 'undefined') {
      observer ??= new ResizeObserver(listener);
      observer.observe(target as HTMLElement);
    }
    listener();
  }
  onMounted(() => {
    mounted = true;
    bind();
    window.addEventListener('resize', listener);
    window.addEventListener('scroll', ancestorScroll, {
      capture: true,
      passive: true,
    });
  });
  watch(source, () => void nextTick(bind));
  onBeforeUnmount(() => {
    mounted = false;
    target?.removeEventListener('scroll', listener);
    observer?.disconnect();
    window.removeEventListener('resize', listener);
    window.removeEventListener('scroll', ancestorScroll, true);
  });
  return {
    getTarget: () => target ?? resolveScrollTarget(read()),
    update: listener,
  };
}
