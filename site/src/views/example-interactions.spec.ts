import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { computed, defineComponent, h, nextTick } from 'vue';
import { components } from '../docs/catalog';
import { createDemoStatusStore, provideDemoStatus } from '../docs/demo-status';
import DemoStatusController from '../components/DemoStatusController.vue';
import RadioBasic from './radio/Example01.vue';
import RadioGroup from './radio/Example03.vue';
import radioSource from './radio/Example01.vue?raw';
import { ZtRadio } from '@ztechjs/zt-ui';
import { ZtUpload } from '@ztechjs/zt-ui';
import EditableTabs from './tabs/Example02.vue';
import GuardedTabs from './tabs/Guard.vue';
import UploadHooks from './upload/Hooks.vue';
import UploadRequest from './upload/Request.vue';
import ImageViewer from './image/Viewer.vue';
import ResultExample from './result/Slots.vue';
import DemoBlock from '../components/DemoBlock.vue';
import App from '../App.vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { router as siteRouter } from '../router';
const wrappers: ReturnType<typeof mount>[] = [];
function render(component: Parameters<typeof mount>[0]) {
  const w = mount(component, { attachTo: document.body });
  wrappers.push(w);
  return w;
}
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  vi.useRealTimers();
});
describe('real example interactions', () => {
  it('synchronizes real examples and their displayed/copied source', async () => {
    window.innerWidth = 1440;
    const store = createDemoStatusStore();
    const Host = defineComponent({
      setup() {
        provideDemoStatus(
          computed(
            () => components.find((c) => c.path === '/radio')!.visualStatus!,
          ),
          store,
        );
        return () => [
          h(DemoStatusController),
          h(
            DemoBlock,
            { code: radioSource },
            { default: () => [h(RadioBasic), h(RadioGroup)] },
          ),
        ];
      },
    });
    const w = render(Host);
    await w.get('[data-status="danger"]').trigger('click');
    expect(
      w
        .findAllComponents(ZtRadio)
        .every((radio) => radio.props('status') === 'danger'),
    ).toBe(true);
    const code = w.get('pre').element.textContent!;
    expect(code).toContain("const demoStatus = 'danger'");
    expect(code).not.toContain('useDemoStatus');
    expect(code).toContain(':status="demoStatus"');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    await w.get('.doc-demo__copy').trigger('click');
    expect(writeText).toHaveBeenCalledWith(code);
  });
  it('retains the selection through real route changes and preserves excluded matrices', async () => {
    window.innerWidth = 1440;
    const router = createRouter({
      history: createMemoryHistory(),
      routes: siteRouter.options.routes,
    });
    await router.push('/radio');
    await router.isReady();
    const w = mount(App, {
      attachTo: document.body,
      global: { plugins: [router] },
    });
    wrappers.push(w);
    await flushPromises();
    await w.get('[data-status="success"]').trigger('click');
    await router.push('/badge');
    await flushPromises();
    expect(w.get('[data-status="success"]').attributes('aria-checked')).toBe(
      'true',
    );
    expect(w.findAll('.zt-badge--success').length).toBeGreaterThan(1);
    await router.push('/button');
    await flushPromises();
    expect(w.find('.demo-status').exists()).toBe(false);
    for (const status of [
      'default',
      'primary',
      'success',
      'warning',
      'danger',
      'info',
    ])
      expect(w.find('.zt-button--' + status).exists(), status).toBe(true);
    await router.push('/input');
    await flushPromises();
    expect(w.find('.demo-status').exists()).toBe(false);
    expect(w.find('.zt-input--error').exists()).toBe(true);
    await router.push('/radio');
    await flushPromises();
    expect(w.get('[data-status="success"]').attributes('aria-checked')).toBe(
      'true',
    );
  });
  it('adds and removes tabs and updates active content', async () => {
    const w = render(EditableTabs);
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(2);
    await w.get('[aria-label="新增标签"]').trigger('click');
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(3);
    expect(w.get('[role="status"]').text()).toContain('3');
    await w.get('[aria-label="关闭 新标签 3"]').trigger('click');
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(2);
    expect(w.get('[role="status"]').text()).toContain('2');
  });
  it('preserves editing while the async tab guard rejects a switch', async () => {
    vi.useFakeTimers();
    const w = render(GuardedTabs);
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    await vi.advanceTimersByTimeAsync(450);
    expect(w.findAll('[role="tab"]')[0]!.attributes('aria-selected')).toBe(
      'true',
    );
    expect(w.get('[role="status"]').text()).toContain('存在未保存内容');
    await w.get('[role="switch"]').trigger('click');
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    await vi.advanceTimersByTimeAsync(450);
    expect(w.findAll('[role="tab"]')[1]!.attributes('aria-selected')).toBe(
      'true',
    );
  });
  it('actually rejects filenames and protects removal', async () => {
    vi.useFakeTimers();
    const w = render(UploadHooks),
      upload = w.findComponent(ZtUpload);
    const reject = upload.props('beforeUpload')!(
      new File(['test'], '拒绝.txt'),
    );
    await vi.advanceTimersByTimeAsync(350);
    expect(await reject).toBe(false);
    const remove = upload.props('beforeRemove')!;
    expect(await remove({ uid: '1', name: 'a.txt', status: 'ready' }, [])).toBe(
      false,
    );
    await w.get('[role="switch"]').trigger('click');
    expect(await remove({ uid: '1', name: 'a.txt', status: 'ready' }, [])).toBe(
      true,
    );
  });
  it('passes FormData to the demonstrated request and reports progress', async () => {
    vi.useFakeTimers();
    const w = render(UploadRequest),
      upload = w.findComponent(ZtUpload);
    const data = new FormData(),
      file = new File(['demo'], 'demo.txt');
    data.append('attachment', file);
    data.append('folder', 'documents');
    const onProgress = vi.fn(),
      controller = new AbortController();
    const result = upload.props('request')!(data, {
      file,
      signal: controller.signal,
      onProgress,
      action: '',
      method: 'POST',
      headers: {},
      withCredentials: false,
      timeout: 0,
    });
    await vi.advanceTimersByTimeAsync(800);
    expect(await result).toEqual({ id: 'demo.txt', uploaded: true });
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(w.get('[role="status"]').text()).toContain('demo.txt');
  });
  it('opens a real image viewer and closes it with Escape', async () => {
    const w = render(ImageViewer);
    await w.get('button').trigger('click');
    await flushPromises();
    expect(document.querySelector('[aria-label="图片预览"]')).not.toBeNull();
    expect(
      document.querySelector('.zt-image-viewer__toolbar')?.textContent,
    ).toContain('2 / 3');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(document.querySelector('[aria-label="图片预览"]')).toBeNull();
  });
  it('result actions give visible feedback', async () => {
    const w = render(ResultExample);
    await w.get('button').trigger('click');
    expect(w.get('p[role="status"]').text()).toContain('已返回列表');
  });
  it('labels integration-only code instead of rendering a mismatched preview', () => {
    const w = mount(DemoBlock, {
      props: { code: 'business code', codeOnly: true },
      slots: { default: 'not a live example' },
    });
    wrappers.push(w);
    expect(w.find('.doc-demo__preview').exists()).toBe(false);
    expect(w.text()).toContain('接入代码');
    expect(w.get('pre').text()).toBe('business code');
    expect(w.get('.doc-demo__toggle').attributes('aria-expanded')).toBe('true');
  });
});
