import { describe, expect, it } from 'vitest';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import { renderExampleSource } from './render-example-source.mjs';
const source = `<script setup lang="ts">
import { ZtRadio, type ZtRadioStatus } from '@ztechjs/zt-ui';
import { useDemoStatus } from '../../docs/useDemoStatus';
const demoStatus = useDemoStatus<ZtRadioStatus>('primary');
</script><template><ZtRadio :status="demoStatus" label="one">One</ZtRadio></template>`;
describe('standalone displayed example source', () => {
  it('replaces site context with ordinary typed component status and compiles independently', () => {
    const rendered = renderExampleSource(source, 'danger');
    expect(rendered).not.toMatch(/useDemoStatus|docs\/|provideDemoStatus/);
    expect(rendered).toContain("const demoStatus = 'danger' as ZtRadioStatus");
    expect(rendered).toContain(':status="demoStatus"');
    const { descriptor, errors } = parse(rendered);
    expect(errors).toEqual([]);
    const compiled = compileScript(descriptor, { id: 'standalone' });
    expect(
      compileTemplate({
        id: 'standalone',
        filename: 'Standalone.vue',
        source: descriptor.template!.content,
        compilerOptions: { bindingMetadata: compiled.bindings },
      }).errors,
    ).toEqual([]);
  });
  it('uses the documented default outside a status provider and leaves ordinary examples unchanged', () => {
    expect(renderExampleSource(source)).toContain(
      "const demoStatus = 'primary' as ZtRadioStatus",
    );
    const normal = '<template><ZtInput status="error" /></template>';
    expect(renderExampleSource(normal, 'danger')).toBe(normal);
  });
  it('preserves public ConfigProvider appearance and validation status', () => {
    const appearance = source
      .replace(
        '<template><ZtRadio',
        '<template><ZtConfigProvider size="small"><ZtRadio',
      )
      .replace('</ZtRadio>', '</ZtRadio></ZtConfigProvider>');
    const rendered = renderExampleSource(appearance, 'warning');
    expect(rendered).toContain('<ZtConfigProvider size="small">');
    expect(rendered).toContain("'warning' as ZtRadioStatus");
    expect(
      renderExampleSource(
        '<template><ZtInputOtp status="error" /></template>',
        'danger',
      ),
    ).toContain('status="error"');
  });
  it.each([
    'demoStatus.value',
    'demoStatus["value"]',
    'consume(demoStatus)',
    '(() => { const alias = demoStatus; return alias.value })()',
  ])('rejects unsupported script consumption: %s', (expression) => {
    expect(() =>
      renderExampleSource(
        source.replace(
          '</script>',
          `const current = ${expression};\n</script>`,
        ),
        'danger',
      ),
    ).toThrow(/site|status/i);
  });
  it('rejects unsupported site plumbing rather than silently producing broken copied code', () => {
    expect(() =>
      renderExampleSource(
        source.replace(
          "const demoStatus = useDemoStatus<ZtRadioStatus>('primary');",
          'const demoStatus = useDemoStatus(getDefault());',
        ),
      ),
    ).toThrow(/site|status/i);
  });
});
