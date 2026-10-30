import { expect, it } from 'vitest';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import * as sources from '../src/app/source';

const config = { size: 'large', borderRadius: 8, theme: 'dark' };
const raw = `<script setup lang="ts">import {ref} from "vue";const count=ref<number>(0)</script><template><section><template v-if="count"><b>{{count}}</b></template><button @click="count++">增加</button></section></template><style scoped>button{color:blue;padding:4px 8px}</style>`;

it('formats the entire independent Vue SFC including provider indentation, TypeScript and CSS', async () => {
  expect(sources.formatStandaloneSource).toBeTypeOf('function');
  const formatted = await sources.formatStandaloneSource(raw, config);
  expect(formatted).toContain("import { ref } from 'vue';");
  expect(formatted).toContain('const count = ref<number>(0);');
  expect(formatted).toContain('    <section>\n      <template v-if="count">');
  expect(formatted).toContain('  color: blue;\n  padding: 4px 8px;');
  expect(formatted).toContain(':border-radius="8"');
  expect(formatted.endsWith('\n')).toBe(true);
  const { descriptor, errors } = parse(formatted);
  expect(errors).toEqual([]);
  const script = compileScript(descriptor, { id: 'formatted' });
  expect(
    compileTemplate({
      id: 'formatted',
      source: descriptor.template!.content,
      filename: 'Formatted.vue',
      compilerOptions: { bindingMetadata: script.bindings },
    }).errors,
  ).toEqual([]);
});

it('produces stable formatting and a single provider when formatting copied source again', async () => {
  const first = await sources.formatStandaloneSource(raw, config);
  expect(await sources.formatStandaloneSource(first, config)).toBe(first);
  expect(first.match(/<ZtDemoConfigProvider\b/g)).toHaveLength(1);
});

it('formats template-only examples as compilable standalone SFCs', async () => {
  const formatted = await sources.formatStandaloneSource(
    '<template><div>示例</div></template>',
    config,
  );
  const { descriptor, errors } = parse(formatted);
  expect(errors).toEqual([]);
  expect(() => compileScript(descriptor, { id: 'template-only' })).not.toThrow();
  expect(formatted).toContain("import '@ztechjs/zt-ui/style.css';");
});
