import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import ts from 'typescript';
import { renderExampleSource } from './render-example-source.mjs';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function elements(node) {
  if (!node) return [];
  return [
    ...(node.type === 1 ? [node] : []),
    ...(node.children ?? []).flatMap(elements),
  ];
}

function inspectShell(siteRoot, errors) {
  const readTemplate = (path) => {
    try {
      return parse(readFileSync(resolve(siteRoot, path), 'utf8')).descriptor
        .template?.ast;
    } catch {
      return undefined;
    }
  };
  const app = elements(readTemplate('src/App.vue'));
  if (app.filter((node) => node.tag === 'ComponentPageShell').length !== 1)
    errors.push(
      'App: component routes must compose exactly one ComponentPageShell',
    );
  if (app.some((node) => node.tag === 'ApiReference'))
    errors.push('App: API belongs inside ComponentPageShell');
  const shell = elements(readTemplate('src/components/ComponentPageShell.vue'));
  for (const tag of ['h1', 'ApiReference', 'slot'])
    if (shell.filter((node) => node.tag === tag).length !== 1)
      errors.push(`ComponentPageShell: expected exactly one ${tag}`);
}

export function inspectExamples(siteRoot = site) {
  const pages = [],
    errors = [];
  inspectShell(siteRoot, errors);
  for (const directory of readdirSync(resolve(siteRoot, 'src/views'), {
    withFileTypes: true,
  }).filter((item) => item.isDirectory())) {
    const id = directory.name,
      filename = resolve(siteRoot, 'src/views', id, 'Index.vue');
    let source;
    try {
      source = readFileSync(filename, 'utf8');
    } catch {
      continue;
    }
    const { descriptor, errors: parseErrors } = parse(source, { filename });
    errors.push(...parseErrors.map((error) => `${id}: ${error}`));
    if (id !== 'feedback') {
      const framing = elements(descriptor.template?.ast).filter(
        (node) =>
          ['h1', 'h2', 'ComponentPageShell', 'ApiReference'].includes(
            node.tag,
          ) ||
          node.props.some(
            (prop) =>
              prop.type === 6 &&
              prop.name === 'class' &&
              /(?:^|\s)(?:doc-section|api-reference)(?:\s|$)/.test(
                prop.value?.content ?? '',
              ),
          ),
      );
      if (framing.length)
        errors.push(
          `${id}: remove shell-owned framing (${framing.map((node) => node.tag).join(', ')})`,
        );
    }
    const imports = new Map();
    const script = ts.createSourceFile(
      filename,
      descriptor.scriptSetup?.content ?? '',
      ts.ScriptTarget.Latest,
      true,
    );
    for (const node of script.statements)
      if (ts.isImportDeclaration(node) && node.importClause?.name)
        imports.set(node.importClause.name.text, node.moduleSpecifier.text);
    const examples = [];
    let title = '';
    function visit(node) {
      if (node.type === 1 && ['h2', 'h3'].includes(node.tag))
        title = node.children.map((child) => child.content ?? '').join('');
      if (node.type === 1 && node.tag === 'DemoBlock') {
        const description =
          node.props.find((prop) => prop.type === 6 && prop.name === 'desc')
            ?.value?.content ?? '';
        const code = node.props.find(
          (prop) => prop.type === 7 && prop.arg?.content === 'code',
        )?.exp?.content;
        const codeOnly = node.props.some(
          (prop) => prop.type === 6 && prop.name === 'code-only',
        );
        if (codeOnly) {
          examples.push({
            title,
            kind: 'integration',
            file: null,
            description,
            props: [],
          });
          return;
        }
        const children = node.children.filter((child) => child.type === 1);
        const component = children.length === 1 ? children[0].tag : undefined;
        const componentFile = imports.get(component),
          rawFile = imports.get(code);
        if (!componentFile || rawFile !== `${componentFile}?raw`) {
          errors.push(
            `${id}/${title}: preview and source must import the same Vue file`,
          );
          return;
        }
        const examplePath = resolve(dirname(filename), componentFile);
        const exampleSource = readFileSync(examplePath, 'utf8');
        let displayedSource;
        try {
          displayedSource = renderExampleSource(exampleSource);
        } catch (error) {
          errors.push(`${id}/${title}: ${error.message}`);
          displayedSource = exampleSource;
        }
        const { descriptor: example, errors: exampleErrors } = parse(
          displayedSource,
          {
            filename: examplePath,
          },
        );
        errors.push(
          ...exampleErrors.map((error) => `${id}/${title}: ${error}`),
        );
        try {
          const compiled = example.scriptSetup
            ? compileScript(example, { id: examplePath })
            : undefined;
          const result = compileTemplate({
            id: examplePath,
            filename: examplePath,
            source: example.template?.content ?? '',
            compilerOptions: {
              bindingMetadata: compiled?.bindings,
              expressionPlugins: ['typescript'],
            },
          });
          errors.push(
            ...result.errors.map((error) => `${id}/${title}: ${error}`),
          );
        } catch (error) {
          errors.push(`${id}/${title}: ${error.message}`);
        }
        if (/from\s*['"](?:@\/|(?:\.\.\/)+docs\/)/.test(displayedSource))
          errors.push(
            `${id}/${title}: copied example depends on private site imports`,
          );
        if (/['"]\/(?:image-demo|upload-demo)\//.test(exampleSource))
          errors.push(
            `${id}/${title}: root-relative image asset is not portable`,
          );
        const bindings = [];
        const removed = {
          ZtRadioGroup: 'variant',
          ZtPagination: 'small',
          ZtBadge: 'type',
        };
        const sourceScript = ts.createSourceFile(
          examplePath,
          example.scriptSetup?.content ?? '',
          ts.ScriptTarget.Latest,
          true,
        );
        const declarations = new Map();
        for (const statement of sourceScript.statements)
          if (
            ts.isVariableStatement(statement) &&
            statement.declarationList.flags & ts.NodeFlags.Const
          )
            for (const declaration of statement.declarationList.declarations)
              if (ts.isIdentifier(declaration.name))
                declarations.set(
                  declaration.name.text,
                  declaration.initializer,
                );
        function objectKeys(node, seen = new Set()) {
          if (!node) return undefined;
          if (
            ts.isParenthesizedExpression(node) ||
            ts.isAsExpression(node) ||
            ts.isSatisfiesExpression(node)
          )
            return objectKeys(node.expression, seen);
          if (ts.isIdentifier(node)) {
            if (seen.has(node.text)) return undefined;
            return objectKeys(
              declarations.get(node.text),
              new Set([...seen, node.text]),
            );
          }
          if (!ts.isObjectLiteralExpression(node)) return undefined;
          const keys = [];
          for (const property of node.properties) {
            if (ts.isSpreadAssignment(property)) {
              const spread = objectKeys(property.expression, seen);
              if (!spread) return undefined;
              keys.push(...spread);
            } else if (
              property.name &&
              (ts.isIdentifier(property.name) ||
                ts.isStringLiteral(property.name))
            )
              keys.push(property.name.text);
            else return undefined;
          }
          return keys;
        }
        function check(tag, name) {
          bindings.push(`${tag}.${name}`);
          if (removed[tag] === name)
            errors.push(
              `${id}/${title}: removed ${tag.slice(2)}.${name} in ${componentFile}`,
            );
        }
        function collect(n) {
          const tag = n.tag?.replace(/(^|-)([a-z])/g, (_, prefix, letter) =>
            letter.toUpperCase(),
          );
          if (n.type === 1 && /^Zt/.test(tag)) {
            for (const prop of n.props) {
              if (prop.type === 6) check(tag, prop.name);
              else if (prop.name === 'bind') {
                if (prop.arg?.isStatic) check(tag, prop.arg.content);
                else if (removed[tag]) {
                  const expression = ts.createSourceFile(
                    'binding.ts',
                    `const binding = (${prop.exp?.content ?? ''})`,
                    ts.ScriptTarget.Latest,
                    true,
                  ).statements[0]?.declarationList?.declarations[0]
                    ?.initializer;
                  const keys = !prop.arg && objectKeys(expression);
                  if (!keys)
                    errors.push(
                      `${id}/${title}: cannot audit ${tag} dynamic v-bind; use explicit props or a static const object in ${componentFile}`,
                    );
                  else keys.forEach((name) => check(tag, name));
                }
              } else if (prop.name === 'model')
                check(tag, prop.arg?.content ?? 'modelValue');
            }
          }
          for (const child of n.children ?? []) collect(child);
        }
        collect(example.template.ast);
        examples.push({
          title,
          kind: 'live',
          file: `src/views/${id}/${componentFile.replace('./', '')}`,
          description,
          props: [...new Set(bindings)],
        });
        return;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(descriptor.template.ast);
    if (!examples.length) errors.push(`${id}: missing examples`);
    pages.push({ component: id, examples });
  }
  return { pages, errors };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { pages, errors } = inspectExamples();
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const live = pages
    .flatMap((page) => page.examples)
    .filter((example) => example.kind === 'live').length;
  const integration = pages.flatMap((page) => page.examples).length - live;
  const rows = pages.map(
    (page) =>
      `| ${page.component} | ${page.examples.filter((e) => e.kind === 'live').length} | ${page.examples.map((e) => `${e.title}${e.kind === 'integration' ? '（仅接入代码）' : ''}`).join('；')} |`,
  );
  const report = `# 组件示例盘点\n\n由 site/scripts/audit-examples.mjs 生成。共 ${pages.filter((page) => page.component !== 'feedback').length} 个组件文档页与 ${pages.filter((page) => page.component === 'feedback').length} 个反馈指南页、${live} 个可运行示例、${integration} 个接入代码示例。\n\n每个可运行示例都由独立 Vue 文件同时提供渲染组件与 ?raw 源码；包含状态、事件和样式。站点视觉状态绑定在展示和复制时转换为普通组件 status 值，不携带站点依赖。复制前需在业务项目安装 @ztechjs/zt-ui 并引入其样式。反馈指南的命令式 API 直接从 @ztechjs/zt-alert 导入并加载其样式。Menu 的路由示例需要安装 Vue Router 并配置示例中说明的路由；Upload 的 Axios 接入代码需要业务接口。\n\n| 组件 | 可运行示例数 | 场景 |\n| --- | ---: | --- |\n${rows.join('\n')}\n\n校验范围：共享页面外壳、所有示例与代码来源一致、已移除属性（含 kebab-case、静态对象绑定，动态绑定显式拒绝）、展示源码转换、SFC 解析与模板编译、私有路径与部署资源检查。完整类型检查由 npm run typecheck 执行，交互回归由 npm test 执行。该盘点统计演示场景，不将静态属性出现次数等同于功能测试通过。\n`;
  writeFileSync(resolve(site, '../docs/component-examples-audit.md'), report);
  console.log(
    `${pages.length} pages; ${live} live examples; ${integration} integration examples; source parity and SFC compilation verified`,
  );
}
