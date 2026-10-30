import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inventory } from '../../scripts/audit-component-contracts.mjs'
import { propExplanation } from './api-explanations.mjs'
import { eventDescription } from './api-event-explanations.mjs'
import { slotDescription, exposeDescription } from './api-member-explanations.mjs'
import { typeDescription } from './api-type-explanations.mjs'
import { templateSlotProbe } from './template-slots.mjs'

const read = file => readFileSync(file, 'utf8')
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)])
const nameOf = node => node && (ts.isStringLiteral(node) || ts.isIdentifier(node) || ts.isNumericLiteral(node)) ? node.text : node?.getText()
const emptyComponent = name => ({ name, props: [], events: [], slots: [], exposes: [], types: [] })
const typeFlags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope

/** Extract public contracts from the entry-point graph and their actual SFC macros. */
export function extractApi(root) {
  const files = walk(resolve(root, 'src')).filter(file => /\.(ts|js|vue)$/.test(file) && !/\.spec\./.test(file))
  const virtual = new Map(), templateSlots = new Map()
  for (const file of files.filter(file => file.endsWith('.vue'))) {
    const { descriptor, errors } = parse(read(file), { filename: file })
    if (errors.length) throw new Error(`${file}: ${errors.join(', ')}`)
    const generic = descriptor.scriptSetup?.attrs.generic
    const parameters = generic ? ts.createSourceFile('generic.ts', `function generic<${generic}>(){}`, ts.ScriptTarget.Latest, true).statements[0].typeParameters : []
    const aliases = [...parameters].map(parameter => `type ${parameter.name.text} = ${parameter.constraint?.getText() ?? 'unknown'};`).join('\n')
    const script = `${aliases}\n${descriptor.script?.content ?? ''}\n${descriptor.scriptSetup?.content ?? ''}`
    const parsed = ts.createSourceFile(file + '.ts', script, ts.ScriptTarget.Latest, true)
    let exposed = ''
    function findExpose(node) {
      if (ts.isCallExpression(node) && node.expression.getText(parsed) === 'defineExpose' && node.arguments[0]) exposed = node.arguments[0].getText(parsed)
      ts.forEachChild(node, findExpose)
    }
    findExpose(parsed)
    const componentType = descriptor.scriptSetup ? `\nconst __publicExposed = ${exposed || '{}'}; export default null as unknown as { new(): typeof __publicExposed };` : ''
    const probe = descriptor.template?.content ? templateSlotProbe(parsed, descriptor.template.content) : { code: '', slots: [] }
    templateSlots.set(file, probe.slots)
    const macros = `
declare function defineProps<T>(): Readonly<T>;
declare function withDefaults<P, D>(props: P, defaults: D): Readonly<Omit<P, keyof D> & { [K in Extract<keyof P, keyof D>]-?: undefined extends D[K] ? P[K] : Exclude<P[K], undefined> }>;
declare function defineEmits<T>(): T;
declare function defineSlots<T>(): T;
declare function defineExpose<T>(value: T): void;
declare function defineOptions<T>(value: T): void;
`
    virtual.set(file + '.ts', script + componentType + macros + probe.code)
  }
  const options = { strict: true, skipLibCheck: true, allowJs: true, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, noEmit: true }
  const host = ts.createCompilerHost(options)
  const originalRead = host.readFile, originalExists = host.fileExists
  host.fileExists = file => virtual.has(file) || originalExists(file)
  host.readFile = file => virtual.get(file) ?? originalRead(file)
  host.getSourceFile = (file, languageVersion) => {
    const content = host.readFile(file)
    return content === undefined ? undefined : ts.createSourceFile(file, content, languageVersion, true)
  }
  host.resolveModuleNames = (names, containingFile) => names.map(name => ts.resolveModuleName(name, containingFile, options, host).resolvedModule ?? (!name.startsWith('.') ? ts.resolveModuleName(name, fileURLToPath(import.meta.url), options, host).resolvedModule : undefined))
  const program = ts.createProgram([...files.filter(file => !file.endsWith('.vue')), ...virtual.keys()], options, host)
  const checker = program.getTypeChecker()
  const display = (type, node) => checker.typeToString(type, node, typeFlags)
  const description = symbol => ts.displayPartsToString(symbol?.getDocumentationComment(checker) ?? [])
  function propertyRows(type) {
    return checker.getPropertiesOfType(type).map(symbol => {
      const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
      const row = { name: symbol.name, type: declaration?.type?.getText() ?? display(checker.getTypeOfSymbolAtLocation(symbol, declaration), declaration), required: !(symbol.flags & ts.SymbolFlags.Optional) }
      const leading = declaration?.getSourceFile().text.slice(declaration.pos, declaration.getStart()) ?? ''
      const comment = [...leading.matchAll(/\/\*\*([\s\S]*?)\*\//g)].at(-1)?.[1]?.replace(/^\s*\* ?/gm, '').trim()
      const doc = description(symbol) || comment
      if (doc) row.description = doc
      return row
    })
  }
  function macroRows(call, component, category) {
    const node = call.typeArguments?.[0]
    if (!node) throw new Error(`${component.name}: ${category} requires a readable type contract`)
    const type = checker.getTypeFromTypeNode(node)
    if (type.flags & ts.TypeFlags.Any) throw new Error(`${component.name}: unresolved ${category} ${node.getText()}`)
    return { type, rows: propertyRows(type) }
  }
  const declarations = new Map()
  for (const file of program.getSourceFiles().filter(file => file.fileName.startsWith(resolve(root, 'src')))) for (const node of file.statements) {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) declarations.set(node.name.text, node)
  }
  function supportingRows(name) {
    const declaration = declarations.get(name)
    return declaration ? propertyRows(checker.getTypeAtLocation(declaration)) : []
  }
  function extractComponent(entry) {
    const component = emptyComponent(entry.name)
    const file = resolve(root, entry.file)
    const source = program.getSourceFile(file + '.ts')
    if (!source) throw new Error(`${entry.name}: unsupported component source ${entry.file}`)
    const macros = new Map(), bindings = new Map()
    function visit(node) {
      if (ts.isCallExpression(node) && /^defineProps|^defineEmits|^defineSlots|^defineExpose|^withDefaults/.test(node.expression.getText(source))) macros.set(node.expression.getText(source), node)
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && (node.name.text.startsWith('__docSlot') || ts.isVariableStatement(node.parent.parent) && ts.isSourceFile(node.parent.parent.parent))) bindings.set(node.name.text, node.name)
      if (ts.isFunctionDeclaration(node) && node.name && ts.isSourceFile(node.parent)) bindings.set(node.name.text, node.name)
      ts.forEachChild(node, visit)
    }
    visit(source)
    const props = macros.get('defineProps')
    if (props) component.props = macroRows(props, component, 'props').rows
    const defaults = macros.get('withDefaults')?.arguments[1]
    if (defaults && ts.isObjectLiteralExpression(defaults)) for (const property of defaults.properties) {
      const row = component.props.find(row => row.name === nameOf(property.name))
      if (row && ts.isPropertyAssignment(property)) row.defaultValue = property.initializer.getText(source)
    }
    const emits = macros.get('defineEmits')
    if (emits) {
      const { type, rows } = macroRows(emits, component, 'events')
      component.events = rows.map(({ required: _required, ...row }) => row)
      for (const signature of type.getCallSignatures()) {
        const [event, ...parameters] = signature.getParameters()
        const eventType = checker.getTypeOfSymbolAtLocation(event, event.valueDeclaration)
        for (const literal of eventType.isUnion() ? eventType.types : [eventType]) {
          if (!literal.isStringLiteral()) throw new Error(`${entry.name}: non-literal event name`)
          component.events.push({ name: literal.value, type: `(${parameters.map(parameter => parameter.valueDeclaration.getText()).join(', ')}) => ${display(checker.getReturnTypeOfSignature(signature))}` })
        }
      }
    }
    const slots = macros.get('defineSlots')
    if (slots) {
      const { type, rows } = macroRows(slots, component, 'slots')
      component.slots = rows
      for (const signature of checker.getIndexInfosOfType(type)) component.slots.push({ name: `[name: ${display(signature.keyType)}]`, type: display(signature.type) })
    }
    const publicSlots = supportingRows(entry.name + 'Slots')
    for (const row of publicSlots) if (!component.slots.some(slot => slot.name === row.name)) component.slots.push(row)
    for (const slot of templateSlots.get(file) ?? []) {
      if (component.slots.some(row => row.name === slot.name)) continue
      const binding = bindings.get(slot.binding)
      const type = binding ? checker.getTypeAtLocation(binding) : undefined
      const parameters = type ? checker.getPropertiesOfType(type).map(symbol => {
        const declaration = symbol.valueDeclaration
        const value = checker.getTypeOfSymbolAtLocation(symbol, declaration)
        return `${JSON.stringify(symbol.name)}: ${value.flags & ts.TypeFlags.Any ? 'unknown' : display(value, declaration)}`
      }) : []
      const nameBinding = bindings.get(`${slot.binding}Name`)
      const nameType = nameBinding && checker.getTypeAtLocation(nameBinding)
      const names = nameType ? (nameType.isUnion() ? nameType.types : [nameType]) : []
      const slotNames = names.length && names.every(type => type.isStringLiteral()) ? names.map(type => type.value) : [slot.name]
      const scope = parameters.length ? `scope: { ${parameters.join('; ')} }` : slot.spread ? 'scope: unknown' : ''
      for (const name of slotNames.filter(name => !component.slots.some(row => row.name === name))) component.slots.push({ name, type: `(${scope}) => VNode[]`, ...(slot.dynamic && name === slot.name ? { description: '动态插槽名称由运行时决定；作用域由转发来源提供。' } : {}) })
    }
    const publicExposes = [...supportingRows(entry.name + 'Expose'), ...supportingRows(entry.name + 'Instance')]
    const expose = macros.get('defineExpose')?.arguments[0]
    if (expose && ts.isObjectLiteralExpression(expose)) for (const property of expose.properties) {
      const expression = ts.isShorthandPropertyAssignment(property) ? bindings.get(property.name.text) : property.initializer
      const name = nameOf(property.name)
      const declared = publicExposes.find(row => row.name === name)
      let exposedType = expression ? checker.getTypeAtLocation(expression) : undefined
      const refValue = exposedType && /^(?:Ref|ComputedRef|WritableComputedRef)$/.test(exposedType.symbol?.name ?? '') ? exposedType.getProperty('value') : undefined
      if (refValue) exposedType = checker.getTypeOfSymbolAtLocation(refValue, expression)
      component.exposes.push(declared ? { name, type: declared.type, ...(declared.description ? { description: declared.description } : {}) } : { name, type: exposedType ? display(exposedType, expression) : 'unknown' })
    }
    for (const row of component.props) row.description ??= propExplanation(component.name, row.name)
    return component
  }
  const businessTypes = new Set(['ZtSkuProduct', 'ZtSkuColor', 'ZtSkuOption', 'ZtSkuQuantityValue'])
  const businessFields = (name, declaration) => businessTypes.has(name) ? { fields: propertyRows(checker.getTypeAtLocation(declaration)) } : {}
  const documents = {}
  const add = (page, component) => (documents[page] ??= { components: [] }).components.push(component)
  for (const entry of inventory(root).filter(component => component.kind !== 'glyph')) {
    const page = entry.name === 'ZtDateTimePicker' ? 'date-time-picker' : entry.name === 'ZtDatePickerPanel' ? 'date-picker-panel' : entry.file.split('/')[2]
    add(page, extractComponent(entry))
  }
  // Public family barrels define the documentation's supporting type vocabulary.
  for (const [page, document] of Object.entries(documents)) {
    const directory = page.startsWith('date-') ? 'date-picker' : page
    const barrel = program.getSourceFile(resolve(root, `src/components/${directory}/index.ts`))
    if (!barrel?.symbol) continue
    for (let symbol of checker.getExportsOfModule(barrel.symbol)) {
      if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
      for (const declaration of symbol.declarations ?? []) if (ts.isInterfaceDeclaration(declaration) || ts.isTypeAliasDeclaration(declaration)) {
        document.components[0].types.push({ name: symbol.name, type: declaration.getText(), ...(description(symbol) ? { description: description(symbol) } : {}), ...businessFields(symbol.name, declaration) })
      }
    }
  }
  const canvasFile = program.getSourceFile(resolve(root, 'src/components/vtable-grid/canvas.ts'))
  if (canvasFile?.symbol) for (const exported of checker.getExportsOfModule(canvasFile.symbol)) {
    const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
    const declaration = symbol.valueDeclaration
    if (!declaration || exported.name === 'resolveVTableTagAttributes') continue
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration)
    const signature = type.getCallSignatures()[0]
    if (!signature) continue
    const component = emptyComponent(exported.name)
    const parameter = signature.getParameters()[0]
    component.props = parameter ? propertyRows(checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration)) : []
    component.types = [{ name: '导入入口', type: '@ztechjs/zt-ui/vtable', description: `Canvas 子入口组件。${parameter ? '' : '上游公开函数声明未定义 Props；Canvas 图元属性由自定义布局适配器处理。'}` }]
    add('vtable-grid', component)
  }
  const documentedTypes = new Set(Object.values(documents).flatMap(page => page.components.flatMap(component => component.types.map(row => row.name))))
  for (const entryFile of [program.getSourceFile(resolve(root, 'src/index.ts')), canvasFile]) {
    if (!entryFile?.symbol) continue
    for (const exported of checker.getExportsOfModule(entryFile.symbol)) {
      const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
      if (documentedTypes.has(symbol.name)) continue
      for (const declaration of symbol.declarations ?? []) {
        if (!ts.isInterfaceDeclaration(declaration) && !ts.isTypeAliasDeclaration(declaration)) continue
        const sourceFile = declaration.getSourceFile().fileName
        let component
        if (sourceFile.endsWith('/canvas-tag.ts')) component = documents['vtable-grid']?.components.find(component => component.name === 'VTableTag')
        else if (sourceFile.endsWith('/components/types.ts')) component = documents['config-provider']?.components[0]
        else if (sourceFile.includes('/overlay/')) component = documents.modal?.components[0]
        else component = documents[sourceFile.split('/components/')[1]?.split('/')[0]]?.components[0]
        if (component) {
          component.types.push({ name: symbol.name, type: declaration.getText(), ...(description(symbol) ? { description: description(symbol) } : {}), ...businessFields(symbol.name, declaration) })
          documentedTypes.add(symbol.name)
        }
      }
    }
  }
  const explain = { props: propExplanation, events: eventDescription, slots: slotDescription, exposes: exposeDescription, types: typeDescription }
  for (const page of Object.values(documents)) for (const component of page.components) {
    for (const [section, describe] of Object.entries(explain)) for (const row of component[section]) {
      row.description ??= describe(component.name, row.name, row.type)
    }
  }
  return documents
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
  const output = resolve(root, 'site/src/generated/api.json')
  const documents = extractApi(root)
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, JSON.stringify(documents, null, 2) + '\n')
  console.log(`Extracted ${Object.values(documents).reduce((count, page) => count + page.components.length, 0)} component APIs across ${Object.keys(documents).length} pages`)
}
