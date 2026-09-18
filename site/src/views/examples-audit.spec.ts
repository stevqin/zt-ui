import {
  existsSync,
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { components, componentPlan, guides } from '../docs/catalog';
import { api } from '../docs/reference';
// @ts-expect-error Node-only audit script is shared with the build gate.
import { inspectExamples } from '../../scripts/audit-examples.mjs';

type Example = { title: string; kind: string; file: string | null };
type Page = { component: string; examples: Example[] };
const audit = inspectExamples() as { pages: Page[]; errors: string[] };
function sourceFor(id: string) {
  return audit.pages
    .find((p) => p.component === id)!
    .examples.filter((e) => e.file)
    .map((e) => readFileSync(resolve(process.cwd(), e.file!), 'utf8'))
    .join('\n');
}

describe('complete and executable documentation examples', () => {
  it('audits every published component, not a handpicked subset', () => {
    expect(audit.pages.map((p) => p.component).sort()).toEqual(
      [...components.map((c) => c.path.slice(1)), 'feedback'].sort(),
    );
    expect(audit.errors).toEqual([]);
  });
  it.each(components)(
    '$name renders the exact Vue source exposed for copying',
    (component) => {
      const page = audit.pages.find(
        (p) => p.component === component.path.slice(1),
      )!;
      expect(
        page.examples.filter((e) => e.kind === 'live').length,
      ).toBeGreaterThan(0);
      expect(
        audit.errors.filter((error) => error.startsWith(page.component + '/')),
      ).toEqual([]);
      expect(
        new Set(page.examples.filter((e) => e.file).map((e) => e.file)).size,
      ).toBe(page.examples.filter((e) => e.file).length);
    },
  );
  it('contains long source lines without widening the page', () => {
    const styles =
      readFileSync(resolve(process.cwd(), 'src/style.scss'), 'utf8') +
      readFileSync(resolve(process.cwd(), 'src/docs/docs.scss'), 'utf8');
    expect(styles).toMatch(/\.doc-main\s*\{[\s\S]*?min-width:\s*0/);
    expect(styles).toMatch(/\.doc-demo\s*\{[\s\S]*?min-width:\s*0/);
  });
  it('documents the five-level inherited size contract', () => {
    for (const page of [
      'button',
      'tag',
      'radio',
      'checkbox',
      'switch',
      'input',
      'password',
      'input-number',
      'form',
      'badge',
      'steps',
      'pagination',
      'modal',
      'vtable-grid',
    ]) {
      const prop = api[page].components
        .flatMap((owner) => owner.props)
        .find((prop) => prop.name === 'size')!;
      const type = api[page].types.find((type) => type.name === prop.type);
      expect(`${prop.type} ${type?.code ?? ''}`).toContain('ZtComponentSize');
      expect(prop.default).toContain('ConfigProvider');
    }
  });
  it('documents independent geometry, density and underline appearance', () => {
    expect(sourceFor('drawer')).toContain('width=');
    expect(sourceFor('drawer')).toContain('height=');
    expect(sourceFor('drawer')).not.toMatch(/:size="\d+"/);
    expect(sourceFor('form')).toMatch(/<ZtForm\s+underline/);
    for (const component of [
      'Input',
      'Password',
      'InputNumber',
      'InputTag',
      'InputOtp',
      'Select',
      'SelectBox',
      'Autocomplete',
      'Cascader',
      'TreeSelect',
      'DatePicker',
      'DateTimePicker',
      'TimePicker',
      'TimeSelect',
      'Mention',
    ]) {
      expect(
        readFileSync(
          resolve(process.cwd(), 'src/views/form/Underline.vue'),
          'utf8',
        ),
      ).toContain(`<Zt${component}`);
    }
    for (const file of [
      'src/views/config-provider/Index.vue',
      'src/views/Conventions.vue',
    ]) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      expect(source).toContain('width / height');
      expect(source).not.toMatch(/size (仍表示|表示面板)/);
    }
    expect(sourceFor('icon')).toContain('size="1.5em"');
    expect(sourceFor('icon')).toContain('size="50%"');
    expect(sourceFor('icon')).not.toContain('ZtComponentSize');
    expect(sourceFor('feedback')).not.toMatch(/ZtDrawer|Dialog|Modal/);
    const props = (id: string) => api[id].components[0].props;
    expect(props('drawer').map((prop) => prop.name)).toEqual(
      expect.arrayContaining(['width', 'height', 'size']),
    );
    expect(
      props('drawer').find((prop) => prop.name === 'size')?.description,
    ).toContain('密度');
    expect(
      props('form').find((prop) => prop.name === 'underline')?.description,
    ).toContain('下边框');
    expect(
      props('icon').find((prop) => prop.name === 'size')?.description,
    ).not.toContain('继承 ConfigProvider');
    expect(props('icon').find((prop) => prop.name === 'size')?.default).toBe(
      "'1em'",
    );
    expect(props('alert').map((prop) => prop.name)).not.toContain('size');
  });
  it('keeps README Icon sizing independent from global density', () => {
    const readme = readFileSync(resolve(process.cwd(), '../README.md'), 'utf8');
    const iconSection = readme.split('### Icon\n')[1]?.split('\n### ')[0] ?? '';
    expect(iconSection).not.toMatch(
      /可继承\s*ConfigProvider|默认继承\s*ConfigProvider|五档(?:尺寸|预设)/,
    );
    for (const contract of [
      'number | string',
      'px',
      'CSS',
      '1em',
      '不读取 ConfigProvider',
    ]) {
      expect(iconSection, contract).toContain(contract);
    }
  });
  it('uses only the standardized RadioGroup, Pagination, and Badge APIs', () => {
    const publicSources = [
      sourceFor('radio'),
      sourceFor('pagination'),
      sourceFor('badge'),
      readFileSync(resolve(process.cwd(), '../README.md'), 'utf8'),
    ].join('\n');

    expect(publicSources).not.toMatch(
      /<ZtRadioGroup\b[^>]*\bvariant(?:\s|=|>)/,
    );
    expect(publicSources).not.toMatch(/<ZtPagination\b[^>]*\bsmall(?:\s|=|>)/);
    expect(publicSources).not.toMatch(/<ZtBadge\b[^>]*\btype(?:\s|=|>)/);
    expect(
      api.radio.components
        .find((owner) => owner.name === 'ZtRadioGroup')
        ?.props.map((prop) => prop.name),
    ).not.toContain('variant');
    expect(
      api.pagination.components[0].props.map((prop) => prop.name),
    ).not.toContain('small');
    expect(
      api.badge.components[0].props.map((prop) => prop.name),
    ).not.toContain('type');
  });
  it('shows all InputNumber controls positions and proper form autofill', () => {
    for (const position of ['default', 'left', 'right'])
      expect(sourceFor('input-number')).toContain(
        `controls-position="${position}"`,
      );
    expect(sourceFor('form')).toContain('autocomplete="username"');
    expect(sourceFor('form')).toContain('autocomplete="email"');
  });
  it('covers Select behavior with accessible live controls', () => {
    const source = sourceFor('select');
    for (const feature of [
      'multiple',
      'filterable',
      'remote-method',
      '#prefix',
      '#option',
      '#selected',
      '#tag',
      '#empty',
      '#loading',
      '#footer',
      'clearable',
      'mini',
      'small',
      'default',
      'medium',
      'large',
    ])
      expect(source).toContain(feature);
    for (const tag of source.match(/<ZtSelect\b[^>]*>/g) ?? [])
      expect(tag).toMatch(/\saria-(?:label|labelledby)="[^"]+"/);
    expect(source).toContain('option.label');
  });
  it('documents standalone SelectBox paging, batch matching, clear and configuration', () => {
    const source = sourceFor('select-box');
    for (const feature of [
      'ZtSelectBoxRemoteRequest',
      'ZtSelectBoxRemoteResult',
      "request.mode === 'batch'",
      'request.keywords',
      'request.keyword',
      'request.page',
      'request.pageSize',
      "mode: 'search'",
      "mode: 'batch'",
      'const pageSize = ref(20)',
      'v-model:page-size="pageSize"',
      'clearable',
      '.clear()',
      '#option',
      ':width=',
      'width="100%"',
      'ZtConfigProvider',
      'border-radius',
      'mini',
      'small',
      'default',
      'medium',
      'large',
      'light',
      'dark',
    ])
      expect(source, feature).toContain(feature);
    const page = readFileSync(
      resolve(process.cwd(), 'src/views/select-box/Index.vue'),
      'utf8',
    );
    expect(page).toContain('部分匹配');
    expect(page).toContain('@ztechjs/zt-alert');
    expect(page).toContain('仅在 clearable=true 时生效');
    const document = api['select-box'];
    expect(document.types.map((type) => type.name)).toEqual(
      expect.arrayContaining([
        'ZtSelectBoxRemoteRequest',
        'ZtSelectBoxRemoteResult',
      ]),
    );
    expect(document.components[0].props.map((prop) => prop.name)).toEqual(
      expect.arrayContaining(['pageSize', 'pageSizes', 'clearable']),
    );
    expect(
      document.components[0].exposes.map((method) => method.name),
    ).toContain('clear');
    expect(
      document.components[0].exposes.find((method) => method.name === 'clear')
        ?.description,
    ).toContain('仅在 clearable=true 时生效');
  });
  it('owns only declarative feedback and links to the external command API guide', () => {
    const guidePath = resolve(process.cwd(), 'src/views/feedback/Index.vue');
    expect(existsSync(guidePath)).toBe(true);
    const guide = readFileSync(guidePath, 'utf8');
    expect(guide).toContain('https://www.npmjs.com/package/@ztechjs/zt-alert');
    expect(guide).toContain('npm install @ztechjs/zt-alert');
    expect(guide).toContain('声明式');
    expect(sourceFor('feedback')).toMatch(
      /import\s*\{[^}]*ZtMessage[^}]*\}\s*from\s*['"]@ztechjs\/zt-alert['"]/s,
    );
    expect(sourceFor('feedback')).toContain(
      "import '@ztechjs/zt-alert/style.css'",
    );
    expect(guides.some((guide) => guide.path === '/feedback')).toBe(true);
    expect(components.some((component) => component.path === '/feedback')).toBe(
      false,
    );
    for (const id of ['message', 'notification', 'message-box']) {
      expect(existsSync(resolve(process.cwd(), 'src/views', id))).toBe(false);
      expect(api[id]).toBeUndefined();
    }
    expect(
      componentPlan.some((component) =>
        ['Message', 'Notification', 'MessageBox'].includes(component.name),
      ),
    ).toBe(false);
    expect(JSON.stringify(api)).not.toMatch(
      /ZtMessage|ZtNotification|ZtMessageBox|ZtLoadingService|useZtLoading/,
    );
    expect(api.loading.components.map((component) => component.name)).toEqual([
      'ZtLoading',
    ]);
  });
  it('keeps working table examples complete including simulated query and save', () => {
    const source = sourceFor('vtable-grid');
    for (const feature of [
      'ZtVTableGridColumn',
      'proxyConfig',
      'batchSave',
      'reserve-checkbox',
      'show-actions-column',
      'column-settings',
      'table-options',
      'auto-load',
      'loading',
      'disabled',
      'copyFormatter',
      "editable: 'textarea'",
      "editable: 'date'",
      "type: 'number'",
      "type: 'select'",
      "editable: 'email'",
      "editable: 'url'",
      "summary: 'sum'",
      "summary: 'min'",
      "summary: 'max'",
      'calculate:',
      'formatter:',
      '#form',
      '#toolbar-left',
      '#toolbar-right',
      '#empty',
      '#pager-left',
      '#edit-actions',
      'query(true)',
      'reload()',
      'resize()',
      'setRecords(',
      'getTableInstance()',
      'getSelectedRows',
      'getSelectedKeys',
      'setSelectedKeys',
      'clearSelection',
      'getChanges',
      'exportCsv',
    ])
      expect(source, feature).toContain(feature);
    expect(source).not.toContain("fetch('/api/");
  });
  it('distinguishes the business HTTP integration from executable demos', () => {
    const integration = audit.pages
      .flatMap((page) => page.examples)
      .filter((example) => example.kind === 'integration');
    expect(integration.map((e) => e.title)).toEqual(['接入真实接口']);
    expect(sourceFor('upload')).toContain('async function uploadAttachment');
  });
});

// These fixtures exercise the command-line gate against the imported SFCs,
// including examples whose names do not start with Example.
describe('example audit rejects regressions in the actual copied source', () => {
  function inspectFixture(
    example: string,
    pageMarkup = '<h3>选择</h3><DemoBlock :code="sampleCode"><Sample /></DemoBlock>',
    appSource?: string,
  ) {
    const root = mkdtempSync(resolve(tmpdir(), 'zt-doc-audit-'));
    try {
      mkdirSync(resolve(root, 'src/views/radio'), { recursive: true });
      mkdirSync(resolve(root, 'src/components'), { recursive: true });
      writeFileSync(
        resolve(root, 'src/App.vue'),
        appSource ??
          readFileSync(resolve(process.cwd(), 'src/App.vue'), 'utf8'),
      );
      const shell = resolve(
        process.cwd(),
        'src/components/ComponentPageShell.vue',
      );
      if (existsSync(shell))
        writeFileSync(
          resolve(root, 'src/components/ComponentPageShell.vue'),
          readFileSync(shell, 'utf8'),
        );
      writeFileSync(
        resolve(root, 'src/views/radio/Index.vue'),
        `<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import Sample from './CustomControls.vue'
import sampleCode from './CustomControls.vue?raw'
</script><template><div>${pageMarkup}</div></template>`,
      );
      writeFileSync(
        resolve(root, 'src/views/radio/CustomControls.vue'),
        example.includes('<script')
          ? example
          : `<template>${example}</template>`,
      );
      return inspectExamples(root).errors as string[];
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
  it.each([
    ['RadioGroup.variant', '<ZtRadioGroup variant="segmented" />'],
    ['Pagination.small', '<ZtPagination :small="true" />'],
    ['Badge.type', '<ZtBadge type="danger" />'],
    ['Badge.type', '<zt-badge type="danger" />'],
    [
      'Badge.type',
      '<script setup>const base = { type: "danger" }; const options = { ...base }</script><template><zt-badge v-bind="options" /></template>',
    ],
    ['RadioGroup.variant', `<zt-radio-group v-bind:variant="'segmented'" />`],
    ['Pagination.small', '<zt-pagination v-bind="{ small: true }" />'],
    [
      'Badge.type',
      '<script setup>const options = { type: "danger" }</script><template><ZtBadge v-bind="options" /></template>',
    ],
  ])('rejects removed %s in an imported example', (prop, markup) => {
    expect(inspectFixture(markup).some((error) => error.includes(prop))).toBe(
      true,
    );
  });
  it('rejects page-owned heading, shell and API scaffolding', () => {
    expect(
      inspectFixture(
        '<ZtRadio />',
        '<ComponentPageShell><h1>Radio</h1><ApiReference /></ComponentPageShell>',
      ).some((error) => error.includes('shell-owned')),
    ).toBe(true);
  });
  it('rejects a missing shell at the route composition boundary', () => {
    expect(
      inspectFixture(
        '<ZtRadio />',
        undefined,
        '<template><RouterView /></template>',
      ).some((error) => error.includes('exactly one ComponentPageShell')),
    ).toBe(true);
  });
  it('rejects a duplicated shell at the route composition boundary', () => {
    expect(
      inspectFixture(
        '<ZtRadio />',
        undefined,
        '<template><ComponentPageShell /><ComponentPageShell /></template>',
      ).some((error) => error.includes('exactly one ComponentPageShell')),
    ).toBe(true);
  });
  it('rejects opaque bindings on removed-prop components with an actionable error', () => {
    for (const markup of [
      '<ZtBadge v-bind="unknownOptions" />',
      '<ZtBadge v-bind:[key]="value" />',
      `<ZtBadge v-bind="{ [key]: value }" />`,
    ])
      expect(
        inspectFixture(markup).some((error) => error.includes('cannot audit')),
      ).toBe(true);
  });
  it('does not confuse events with removed props and accepts statically safe object bindings', () => {
    expect(
      inspectFixture(
        `<zt-badge @type="handle" v-bind="{ status: 'danger' }" /><ZtPagination @small="handle" /><ZtRadioGroup @variant="handle" />`,
      ),
    ).toEqual([]);
  });
  it('accepts canonical props and unrelated small/type props', () => {
    expect(
      inspectFixture(
        '<ZtRadioGroup segmented /><ZtPagination size="small" /><ZtBadge status="danger" /><ZtInput type="text" />',
      ),
    ).toEqual([]);
  });
});
