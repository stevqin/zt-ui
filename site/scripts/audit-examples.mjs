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

function walkTs(node, visit) {
  if (!node) return;
  visit(node);
  ts.forEachChild(node, (child) => walkTs(child, visit));
}
function unwrapExpression(node) {
  while (
    node &&
    (ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node))
  )
    node = node.expression;
  return node;
}
function bindingNames(pattern) {
  const parsed = ts.createSourceFile(
    'pattern.ts',
    `const ${pattern} = null`,
    ts.ScriptTarget.Latest,
    true,
  );
  if (parsed.parseDiagnostics.length) return ['*'];
  const names = [];
  function collect(name) {
    if (!name) names.push('*');
    else if (ts.isIdentifier(name)) names.push(name.text);
    else if (
      ts.isObjectBindingPattern(name) ||
      ts.isArrayBindingPattern(name)
    ) {
      for (const element of name.elements)
        if (!ts.isOmittedExpression(element)) collect(element.name);
    } else names.push('*');
  }
  collect(parsed.statements[0]?.declarationList?.declarations[0]?.name);
  return names;
}
function templateScopes(node, inherited) {
  const self = new Set(inherited);
  for (const prop of node.props ?? [])
    if (prop.type === 7 && prop.name === 'for') {
      const aliases = prop.forParseResult;
      if (!aliases) self.add('*');
      else
        for (const alias of [aliases.value, aliases.key, aliases.index])
          if (alias)
            bindingNames(alias.content).forEach((name) => self.add(name));
    }
  const children = new Set(self);
  for (const prop of node.props ?? [])
    if (prop.type === 7 && prop.name === 'slot' && prop.exp)
      bindingNames(prop.exp.content).forEach((name) => children.add(name));
  return { self, children };
}
function parseExpression(content) {
  return ts.createSourceFile(
    'expression.ts',
    `const expression = (${content ?? ''})`,
    ts.ScriptTarget.Latest,
    true,
  ).statements[0]?.declarationList?.declarations[0]?.initializer;
}
// Keys are trusted only for const literals/aliases with no other script uses.
// Calls, property access, writes and escaping references are deliberately opaque.
function staticObjectBindings(script, template) {
  const declarations = new Map(),
    allowedReferences = new Set(),
    related = new Map(),
    unsafe = new Set();
  for (const statement of script.statements)
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.flags & ts.NodeFlags.Const
    )
      for (const declaration of statement.declarationList.declarations)
        if (ts.isIdentifier(declaration.name)) {
          declarations.set(declaration.name.text, declaration.initializer);
          allowedReferences.add(declaration.name);
        }
  function staticReferences(node, references = []) {
    node = unwrapExpression(node);
    if (node && ts.isIdentifier(node)) references.push(node);
    else if (node && ts.isObjectLiteralExpression(node))
      for (const property of node.properties)
        if (ts.isSpreadAssignment(property))
          staticReferences(property.expression, references);
    return references;
  }
  for (const [name, initializer] of declarations)
    for (const reference of staticReferences(initializer)) {
      allowedReferences.add(reference);
      if (!declarations.has(reference.text)) continue;
      for (const [a, b] of [
        [name, reference.text],
        [reference.text, name],
      ]) {
        if (!related.has(a)) related.set(a, new Set());
        related.get(a).add(b);
      }
    }
  function isReference(node) {
    if (!ts.isIdentifier(node) || !declarations.has(node.text)) return false;
    const p = node.parent;
    return !(
      (ts.isPropertyAccessExpression(p) && p.name === node) ||
      (ts.isPropertyAssignment(p) && p.name === node) ||
      (ts.isMethodDeclaration(p) && p.name === node) ||
      (ts.isBindingElement(p) && p.propertyName === node)
    );
  }
  walkTs(script, (node) => {
    if (isReference(node) && !allowedReferences.has(node))
      unsafe.add(node.text);
  });
  function noteExpression(content, scope, objectBinding = false) {
    const expression = objectBinding
      ? parseExpression(content)
      : ts.createSourceFile(
          'template-expression.ts',
          content ?? '',
          ts.ScriptTarget.Latest,
          true,
        );
    const allowed = new Set(objectBinding ? staticReferences(expression) : []);
    walkTs(expression, (node) => {
      if (
        isReference(node) &&
        !scope.has('*') &&
        !scope.has(node.text) &&
        !allowed.has(node)
      )
        unsafe.add(node.text);
    });
  }
  function notePatternExpressions(pattern, scope) {
    const parsed = ts.createSourceFile(
      'pattern.ts',
      `const ${pattern} = null`,
      ts.ScriptTarget.Latest,
      true,
    );
    walkTs(parsed, (node) => {
      if (ts.isBindingElement(node) && node.initializer)
        noteExpression(node.initializer.getText(parsed), scope);
      else if (ts.isComputedPropertyName(node))
        noteExpression(node.expression.getText(parsed), scope);
    });
  }
  function noteTemplate(node, inherited = new Set()) {
    const scope = templateScopes(node, inherited);
    for (const prop of node.props ?? [])
      if (prop.type === 7) {
        // Arguments execute too, even without a directive value. Slot names
        // are evaluated outside the slot parameters, in the element's scope.
        if (prop.arg && !prop.arg.isStatic)
          noteExpression(prop.arg.content, scope.self);
        if (!prop.exp) continue;
        if (prop.name === 'for') {
          noteExpression(prop.forParseResult?.source.content, inherited);
          for (const alias of [
            prop.forParseResult?.value,
            prop.forParseResult?.key,
            prop.forParseResult?.index,
          ])
            if (alias) notePatternExpressions(alias.content, scope.self);
        } else if (prop.name === 'slot')
          // Computed keys/defaults share the callback's local parameter scope.
          notePatternExpressions(prop.exp.content, scope.children);
        // Vue evaluates a same-node v-if before introducing v-for aliases.
        else if (prop.name === 'if' || prop.name === 'else-if')
          noteExpression(prop.exp.content, inherited);
        else
          noteExpression(
            prop.exp.content,
            scope.self,
            prop.name === 'bind' && !prop.arg,
          );
      }
    if (node.type === 5) noteExpression(node.content.content, inherited);
    for (const child of node.children ?? [])
      noteTemplate(child, scope.children);
  }
  noteTemplate(template);
  // Reject all connected aliases when any one can be mutated or escape.
  const queue = [...unsafe];
  for (let i = 0; i < queue.length; i++)
    for (const alias of related.get(queue[i]) ?? [])
      if (!unsafe.has(alias)) {
        unsafe.add(alias);
        queue.push(alias);
      }
  function keys(node, scope = new Set(), seen = new Set()) {
    node = unwrapExpression(node);
    if (!node) return undefined;
    if (ts.isIdentifier(node)) {
      if (
        scope.has('*') ||
        scope.has(node.text) ||
        unsafe.has(node.text) ||
        seen.has(node.text)
      )
        return undefined;
      // The initializer is in script scope, independent of template locals.
      return keys(
        declarations.get(node.text),
        new Set(),
        new Set([...seen, node.text]),
      );
    }
    if (!ts.isObjectLiteralExpression(node)) return undefined;
    const names = [];
    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        const spread = keys(property.expression, scope, seen);
        if (!spread) return undefined;
        names.push(...spread);
      } else if (
        (ts.isPropertyAssignment(property) ||
          ts.isShorthandPropertyAssignment(property)) &&
        property.name &&
        (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
      )
        names.push(property.name.text);
      else return undefined;
    }
    return names;
  }
  return keys;
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
        const objectKeys = staticObjectBindings(
          sourceScript,
          example.template.ast,
        );
        function check(tag, name) {
          bindings.push(`${tag}.${name}`);
          if (removed[tag] === name)
            errors.push(
              `${id}/${title}: removed ${tag.slice(2)}.${name} in ${componentFile}`,
            );
        }
        function collect(n, inherited = new Set()) {
          const scope = templateScopes(n, inherited);
          const tag = n.tag?.replace(/(^|-)([a-z])/g, (_, prefix, letter) =>
            letter.toUpperCase(),
          );
          if (n.type === 1 && /^Zt/.test(tag)) {
            for (const prop of n.props) {
              if (prop.type === 6) check(tag, prop.name);
              else if (prop.name === 'bind') {
                if (prop.arg?.isStatic) check(tag, prop.arg.content);
                else if (removed[tag]) {
                  const keys =
                    !prop.arg &&
                    objectKeys(parseExpression(prop.exp?.content), scope.self);
                  if (!keys)
                    errors.push(
                      `${id}/${title}: cannot audit ${tag} dynamic v-bind; use explicit props or an unshadowed, immutable static const object in ${componentFile}`,
                    );
                  else keys.forEach((name) => check(tag, name));
                }
              } else if (prop.name === 'model')
                check(tag, prop.arg?.content ?? 'modelValue');
            }
          }
          for (const child of n.children ?? []) collect(child, scope.children);
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
