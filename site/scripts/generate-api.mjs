import ts from 'typescript';
import { parse as parseSfc } from 'vue/compiler-sfc';
import { methods as methodOverrides } from './api-overrides.mjs';
import {
  metadataKeys,
  rowMetadata,
  sharedDescription,
} from './api/metadata/index.mjs';
import {
  normalizeDefault,
  normalizeEventType,
  toTemplateName,
} from './api/normalize.mjs';
import { validateApiDocuments } from './api/validate.mjs';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const walk = (path) =>
  readdirSync(path, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(resolve(path, e.name)) : [resolve(path, e.name)],
  );
const files = walk(resolve(root, 'src/components')).filter((f) =>
  f.endsWith('/types.ts'),
);
files.push(resolve(root, 'src/components/types.ts'));
files.push(resolve(root, 'src/components/index.ts'));
const program = ts.createProgram(files, {
  strict: true,
  target: ts.ScriptTarget.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext,
  skipLibCheck: true,
});
const checker = program.getTypeChecker();
const publicTypes = new Set(
  checker
    .getExportsOfModule(
      checker.getSymbolAtLocation(
        program.getSourceFile(resolve(root, 'src/components/index.ts')),
      ),
    )
    .map((s) => s.name),
);
const declarations = new Map();
for (const file of files)
  for (const node of program.getSourceFile(file).statements)
    if (
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      node.name.text.startsWith('Zt')
    )
      declarations.set(node.name.text, node);
const plain = (s) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
const config = {
  icon: ['icon', 'ZtIcon'],
  link: ['link', 'ZtLink'],
  text: ['text', 'ZtText'],
  scrollbar: ['scrollbar', 'ZtScrollbar'],
  popover: ['popover', 'ZtPopover'],
  popconfirm: ['popconfirm', 'ZtPopconfirm'],
  tabs: ['tabs', 'ZtTabs', 'ZtTabPane'],
  breadcrumb: ['breadcrumb', 'ZtBreadcrumb', 'ZtBreadcrumbItem'],
  segmented: ['segmented', 'ZtSegmented'],
  descriptions: ['descriptions', 'ZtDescriptions', 'ZtDescriptionsItem'],
  collapse: ['collapse', 'ZtCollapse', 'ZtCollapseItem'],
  result: ['result', 'ZtResult'],
  image: ['image', 'ZtImage', 'ZtImageViewer'],
  avatar: ['avatar', 'ZtAvatar'],
  upload: ['upload', 'ZtUpload'],
  'input-otp': ['input-otp', 'ZtInputOtp'],
  menu: ['menu', 'ZtMenu'],
  slider: ['slider', 'ZtSlider'],
  progress: ['progress', 'ZtProgress'],
  'config-provider': ['config-provider', 'ZtConfigProvider'],
  button: ['button', 'ZtButton'],
  tag: ['tag', 'ZtTag'],
  badge: ['badge', 'ZtBadge'],
  radio: ['radio', 'ZtRadio', 'ZtRadioGroup'],
  checkbox: ['checkbox', 'ZtCheckbox', 'ZtCheckboxGroup'],
  switch: ['switch', 'ZtSwitch'],
  input: ['input', 'ZtInput'],
  password: ['input', 'ZtPassword'],
  'input-number': ['input-number', 'ZtInputNumber'],
  select: ['select', 'ZtSelect'],
  form: ['form', 'ZtForm', 'ZtFormItem', 'ZtFormGroup'],
  steps: ['steps', 'ZtSteps', 'ZtStep'],
  pagination: ['pagination', 'ZtPagination'],
  modal: ['modal', 'ZtModal'],
  drawer: ['drawer', 'ZtDrawer'],
  'date-picker': ['date-picker', 'ZtDatePicker'],
  'date-time-picker': ['date-picker', 'ZtDateTimePicker'],
  'vtable-grid': ['vtable-grid', 'ZtVTableGrid'],
};
const expansion = JSON.parse(
  readFileSync(resolve(root, 'site/src/docs/expansion.json'), 'utf8'),
);
for (const item of expansion)
  if (item.owners.length) config[item.id] = [item.directory, ...item.owners];
const expansionIds = new Set(expansion.map((item) => item.id));
const output = {};
const usedMetadata = new Set();
const metaFor = (id, owner, section, name) => {
  const key = `${id}.${owner}.${section}.${name}`;
  if (metadataKeys.has(key)) usedMetadata.add(key);
  return rowMetadata(id, owner, section, name);
};
for (const [id, [dir, ...names]] of Object.entries(config)) {
  const page = readFileSync(
    resolve(root, `site/src/views/${id}/Index.vue`),
    'utf8',
  );
  const descriptions = new Map();
  let scope = names[0];
  for (const part of page
    .slice(page.indexOf('<template>'))
    .matchAll(/<h3>([^<]+)<\/h3>|<tr>([\s\S]*?)<\/tr>/g)) {
    if (part[1]) {
      const owner = part[1].match(/^(\w+) Props$/)?.[1];
      scope = owner ? 'Zt' + owner : names[0];
      continue;
    }
    const cells = [...part[2].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) =>
      plain(m[1]),
    );
    if (cells.length >= 3)
      for (const key of cells[0].split(' / '))
        descriptions.set(scope + '.' + key, cells.at(-1));
  }
  const docs = [];
  for (const name of names) {
    const content = readFileSync(
      resolve(root, `src/components/${dir}/${name}.vue`),
      'utf8',
    );
    const source = ts.createSourceFile(
      name + '.ts',
      content.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '',
      ts.ScriptTarget.Latest,
      true,
    );
    let defaults = {},
      events = [],
      methods = [],
      declaredSlots = [];
    const collect = (src) => {
      const visit = (node) => {
        if (ts.isCallExpression(node)) {
          if (
            node.expression.getText(src) === 'withDefaults' &&
            node.arguments[1] &&
            ts.isObjectLiteralExpression(node.arguments[1])
          )
            for (const p of node.arguments[1].properties)
              if (ts.isPropertyAssignment(p)) {
                let val = p.initializer.getText(src);
                if (ts.isArrowFunction(p.initializer))
                  val = p.initializer.body
                    .getText(src)
                    .replace(/^\((.*)\)$/s, '$1');
                defaults[p.name.getText(src).replace(/['"]/g, '')] = val;
              }
          if (node.expression.getText(src) === 'defineSlots') {
            const type = node.typeArguments?.[0];
            for (const member of type?.members ?? []) {
              if (member.name)
                declaredSlots.push({
                  name: member.name.getText(src).replace(/['"]/g, ''),
                  type: '无',
                });
            }
          }
          if (node.expression.getText(src) === 'defineEmits') {
            const type = node.typeArguments?.[0];
            if (type) {
              const declaration = ts.isTypeReferenceNode(type)
                ? declarations.get(type.typeName.getText(src))
                : type;
              if (declaration?.members)
                events = declaration.members.flatMap((member) => {
                  const sourceFile = member.getSourceFile();
                  const description = (member.jsDoc ?? [])
                    .map((doc) =>
                      typeof doc.comment === 'string' ? doc.comment : '',
                    )
                    .join(' ');
                  if (ts.isCallSignatureDeclaration(member)) {
                    const event = member.parameters[0]?.type;
                    if (!event || !ts.isLiteralTypeNode(event)) return [];
                    return [
                      {
                        name: event.literal.text,
                        type: `(${member.parameters
                          .slice(1)
                          .map((p) => p.getText(sourceFile))
                          .join(', ')}) => void`,
                        description,
                      },
                    ];
                  }
                  if (!member.name) return [];
                  return [
                    {
                      name: member.name
                        .getText(sourceFile)
                        .replace(/['"]/g, ''),
                      type: member.type?.getText(sourceFile) ?? '—',
                      description,
                    },
                  ];
                });
            }
          }
          if (
            node.expression.getText(src) === 'defineExpose' &&
            node.arguments[0] &&
            ts.isObjectLiteralExpression(node.arguments[0])
          )
            methods = node.arguments[0].properties.map((p) => ({
              name: p.name.getText(src),
              type: '',
            }));
        }
        ts.forEachChild(node, visit);
      };
      visit(src);
    };
    if (dir === 'date-picker') {
      const base = readFileSync(
        resolve(root, 'src/components/date-picker/ZtDatePickerBase.vue'),
        'utf8',
      );
      collect(
        ts.createSourceFile(
          'base.ts',
          base.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1],
          ts.ScriptTarget.Latest,
          true,
        ),
      );
    }
    collect(source);
    const declaration = declarations.get(name + 'Props');
    if (!declaration) throw new Error('Missing props ' + name);
    const type = checker.getTypeAtLocation(declaration);
    const props = checker.getPropertiesOfType(type).map((symbol) => {
      const node = symbol.valueDeclaration ?? symbol.declarations[0];
      const required = !(symbol.flags & ts.SymbolFlags.Optional);
      const metadata = metaFor(id, name, 'props', symbol.name);
      const inherited =
        symbol.name === 'size' && name !== 'ZtIcon' ? 'default' : undefined;
      return {
        name: symbol.name,
        templateName: toTemplateName(symbol.name),
        kind: 'prop',
        type:
          metadata.type ??
          node.type?.getText() ??
          checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, node)),
        required,
        default: normalizeDefault({
          required,
          defaultValue:
            metadata.defaultValue ??
            defaults[symbol.name] ??
            (expansionIds.has(id) &&
            node.type?.kind === ts.SyntaxKind.BooleanKeyword
              ? 'false'
              : undefined),
          inherit: metadata.inherit ?? inherited,
          runtimeDefault: metadata.runtimeDefault,
          parentDefault: metadata.parentDefault,
        }),
        description:
          (expansionIds.has(id)
            ? ts.displayPartsToString(
                symbol.getDocumentationComment(checker),
              ) || undefined
            : undefined) ??
          metadata.description ??
          descriptions.get(name + '.' + symbol.name) ??
          (symbol.name === 'modelValue'
            ? descriptions.get(name + '.v-model')
            : undefined) ??
          ts.displayPartsToString(symbol.getDocumentationComment(checker)) ??
          sharedDescription('props', symbol.name),
      };
    });
    const slotMap = new Map(declaredSlots.map((slot) => [slot.name, slot]));
    const template = parseSfc(content).descriptor.template?.ast;
    if (!template) throw new Error('Missing template AST: ' + name);
    function visitTemplate(node) {
      if (node.type === 1 && node.tag === 'slot') {
        const name =
          node.props.find((p) => p.type === 6 && p.name === 'name')?.value
            ?.content ?? 'default';
        const args = node.props
          .filter((p) => p.type === 7 && p.name === 'bind' && p.arg?.content)
          .map((p) => p.arg.content);
        slotMap.set(name, {
          name,
          type: args.length ? `{ ${args.join(', ')} }` : '无',
        });
      }
      for (const child of node.children ?? []) visitTemplate(child);
    }
    visitTemplate(template);
    const slots = [...slotMap.values()].map((row) => {
      const metadata = metaFor(id, name, 'slots', row.name);
      return {
        ...row,
        kind: 'slot',
        type: metadata.type ?? row.type,
        description:
          metadata.description ?? sharedDescription('slots', row.name),
      };
    });

    const instance = declarations.get(name + 'Instance');
    if (instance) {
      const it = checker.getTypeAtLocation(instance);
      for (const m of methods) {
        const symbol = it.getProperty(m.name);
        if (symbol) {
          const d = symbol.valueDeclaration ?? symbol.declarations[0];
          m.type =
            d.type?.getText() ??
            checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, d));
        }
      }
    }
    for (const m of methods)
      if (!m.type) {
        const fn = source.statements.find(
          (n) => ts.isFunctionDeclaration(n) && n.name?.text === m.name,
        );
        m.type = fn
          ? `(${fn.parameters.map((p) => p.getText(source)).join(', ')})${fn.type ? ': ' + fn.type.getText(source) : ''}`
          : '通过组件 ref 访问';
      }
    for (const method of methods)
      method.type = methodOverrides[name]?.[method.name] ?? method.type;
    events = events.map((row) => {
      const metadata = metaFor(id, name, 'events', row.name);
      return {
        ...row,
        kind: 'event',
        type: metadata.type ?? normalizeEventType(row.type),
        description:
          row.description ||
          metadata.description ||
          sharedDescription('events', row.name),
      };
    });
    const exposes = methods.map((row) => {
      const metadata = metaFor(id, name, 'exposes', row.name);
      const kind =
        metadata.kind ??
        (row.type.includes('=>') || row.type.startsWith('(')
          ? 'method'
          : 'property');
      return {
        ...row,
        kind,
        type: metadata.type ?? row.type,
        description:
          metadata.description ?? sharedDescription('exposes', row.name),
      };
    });
    docs.push({ name, props, events, slots, exposes });
  }
  const types = [...declarations]
    .filter(
      ([, n]) =>
        n.getSourceFile().fileName ===
        resolve(root, `src/components/${dir}/types.ts`),
    )
    .map(([name, n]) => ({ name, code: n.getText() }));
  // Include referenced shared types (theme, size, overlay contracts).
  const seen = new Set(types.map((t) => t.name));
  for (let i = 0; i < types.length; i++)
    for (const ref of types[i].code.match(/\bZt\w+\b/g) ?? [])
      if (!seen.has(ref) && declarations.has(ref)) {
        seen.add(ref);
        types.push({ name: ref, code: declarations.get(ref).getText() });
      }
  const sections = [...page.matchAll(/<h[23]>([^<]+)<\/h[23]>/g)].map(
    (m) => m[1],
  );
  output[id] = {
    components: docs,
    types: types.map((t) => ({ ...t, public: publicTypes.has(t.name) })),
    sections,
  };
}
const stale = [...metadataKeys].filter((key) => !usedMetadata.has(key));
if (stale.length)
  throw new Error(`API metadata does not match source:\n${stale.join('\n')}`);
const errors = validateApiDocuments(output);
if (errors.length)
  throw new Error(`API documentation validation failed:\n${errors.join('\n')}`);
writeFileSync(
  resolve(root, 'site/src/docs/api.generated.json'),
  JSON.stringify(output, null, 2) + '\n',
);
console.log(
  `API reference generated for ${Object.keys(output).length} component pages`,
);
