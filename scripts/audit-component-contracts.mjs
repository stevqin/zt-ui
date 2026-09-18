import ts from 'typescript'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const read = file => readFileSync(file, 'utf8')
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)])
const sizes = ['default', 'large', 'medium', 'mini', 'small']
const visual = ['danger', 'default', 'info', 'primary', 'success', 'warning']
const dimensions = ['density', 'radius', 'status', 'interaction', 'overlay', 'api', 'metadata', 'evidence']
const contracts = {
  density: ['inherited', 'delegated', 'intrinsic', 'provider', 'structural'],
  radius: ['tokens', 'delegated', 'intrinsic'],
  status: ['visual', 'validation', 'mixed', 'workflow', 'result', 'none'],
  interaction: ['switch', 'checkbox', 'keyboard', 'native', 'delegated', 'structural', 'decorative-svg'],
  overlay: ['modal', 'anchored', 'delegated', 'local-tooltip', 'status-mask', 'owned-popup', 'none'],
  api: ['public-types'],
  metadata: ['generated', 'family:ZtIcon'],
}
const commonProps = new Set(['size', 'status', 'disabled', 'readonly', 'loading', 'clearable', 'width', 'height', 'placement'])
const normalize = value => value?.replace(/\s/g, '')


// Follow the actual entry-point graph, including local imports re-exported by a
// barrel and the JS bridge used by VTableGrid. Type-only exports are not widgets.
export function inventory(root) {
  const cache = new Map()
  function modulePath(from, request) {
    const path = resolve(dirname(from), request)
    return [path, path + '.ts', path + '.js', resolve(path, 'index.ts')].find(file => existsSync(file) && statSync(file).isFile())
  }
  function exportsOf(file) {
    if (!file) return new Map()
    if (file.endsWith('.vue')) return new Map([['default', { file: relative(root, file), kind: 'sfc' }]])
    if (cache.has(file)) return cache.get(file)
    const result = new Map(), locals = new Map()
    cache.set(file, result)
    const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true)
    const imported = (request, name) => exportsOf(modulePath(file, request)).get(name)
    for (const node of source.statements) {
      if (ts.isImportDeclaration(node) && node.importClause && !node.importClause.isTypeOnly && node.moduleSpecifier.text.startsWith('.')) {
        const clause = node.importClause
        if (clause.name) locals.set(clause.name.text, imported(node.moduleSpecifier.text, 'default'))
        if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) for (const item of clause.namedBindings.elements) locals.set(item.name.text, imported(node.moduleSpecifier.text, item.propertyName?.text ?? item.name.text))
      }
      if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue
        const name = declaration.name.text, expression = declaration.initializer
        let component = expression && ts.isIdentifier(expression) ? locals.get(expression.text) : undefined
        if (expression && /^iconComponents(?:\.|\[)/.test(expression.getText(source))) component = { file: relative(root, file), kind: 'glyph' }
        if (expression && ts.isCallExpression(expression) && /^(defineComponent|createIconComponent)$/.test(expression.expression.getText(source))) component = { file: relative(root, file), kind: 'render' }
        if (component) {
          locals.set(name, component)
          if (node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) result.set(name, component)
        }
      }
      if (!ts.isExportDeclaration(node) || node.isTypeOnly) continue
      const target = node.moduleSpecifier?.text
      if (target && !target.startsWith('.')) continue
      if (!node.exportClause && target) for (const [name, value] of exportsOf(modulePath(file, target))) result.set(name, value)
      else if (node.exportClause && ts.isNamedExports(node.exportClause)) for (const item of node.exportClause.elements) {
        if (item.isTypeOnly) continue
        const original = item.propertyName?.text ?? item.name.text
        const component = target ? imported(target, original) : locals.get(original)
        if (component) result.set(item.name.text, component)
      }
    }
    return result
  }
  return [...exportsOf(resolve(root, 'src/index.ts'))].map(([name, value]) => ({ name, ...value })).sort((a, b) => a.name.localeCompare(b.name))
}

export function inspect(root) {
  const components = inventory(root)
  const typeFiles = walk(resolve(root, 'src/components')).filter(file => file.endsWith('types.ts'))
  const program = ts.createProgram(typeFiles, { strict: true, skipLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 })
  const checker = program.getTypeChecker(), declarations = new Map()
  for (const file of typeFiles) for (const node of program.getSourceFile(file).statements) if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name) declarations.set(node.name.text, node)
  function literals(type) {
    const value = checker.getNonNullableType(type)
    return (value.isUnion() ? value.types : [value]).filter(item => item.isStringLiteral()).map(item => item.value).sort()
  }
  for (const component of components) {
    const source = read(resolve(root, component.file))
    const propName = component.name + 'Props'
    const declaration = declarations.get(propName)
    component.props = declaration ? checker.getPropertiesOfType(checker.getTypeAtLocation(declaration)).map(property => {
      const node = property.valueDeclaration ?? property.declarations?.[0]
      const type = checker.getTypeOfSymbolAtLocation(property, node)
      return { name: property.name, type: checker.typeToString(type), declaredType: node.type?.getText(), required: !(property.flags & ts.SymbolFlags.Optional), literals: literals(type) }
    }) : []
    component.source = source
    const directory = dirname(resolve(root, component.file))
    component.familySource = walk(directory).filter(file => /\.(vue|scss|ts)$/.test(file)).map(read).join('\n')
    component.styles = walk(directory).filter(file => /\.(scss|vue)$/.test(file)).map(file => file.endsWith('.vue') ? [...read(file).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]).join('\n') : read(file)).join('\n')
  }
  return { components, sharedSizes: literals(checker.getTypeAtLocation(declarations.get('ZtComponentSize'))) }
}

export function audit(root) {
  const { components, sharedSizes } = inspect(root), findings = []
  const fail = (name, rule, file, severity = 'Important') => findings.push({ severity, component: name, rule, file })
  const matrixFile = 'docs/ui-api-consistency-audit.md'
  const matrix = existsSync(resolve(root, matrixFile)) ? read(resolve(root, matrixFile)) : ''
  const rows = new Map()
  for (const line of matrix.split('\n').filter(line => /^\| Zt\w+ \|/.test(line))) {
    const [name, result, ...cells] = line.split('|').slice(1, -1).map(cell => cell.trim())
    if (rows.has(name)) fail(name, 'duplicate matrix row', matrixFile)
    rows.set(name, { result, ...Object.fromEntries(dimensions.map((dimension, index) => [dimension, cells[index]])) })
  }
  const docs = JSON.parse(read(resolve(root, 'site/src/docs/api.generated.json')))
  const metadata = new Map(Object.values(docs).flatMap(document => document.components.map(component => [component.name, component])))
  if (JSON.stringify(sharedSizes) !== JSON.stringify(sizes)) fail('library', 'density vocabulary must be mini/small/default/medium/large', 'src/components/types.ts')
  const names = new Set(components.map(component => component.name))
  for (const name of rows.keys()) if (!names.has(name)) fail(name, 'matrix row is not a public component', matrixFile)
  for (const component of components) {
    const { name, file, source, familySource, styles, props, kind } = component
    const row = rows.get(name)
    if (!row) { fail(name, 'missing matrix row', matrixFile); continue }
    if (!['compliant', 'fixed'].includes(row.result)) fail(name, 'unresolved matrix disposition', matrixFile)
    for (const dimension of dimensions) if (!row[dimension] || /^(?:todo|pending|unreviewed|waived)$/i.test(row[dimension])) fail(name, `missing ${dimension} contract`, matrixFile)
    for (const [dimension, allowed] of Object.entries(contracts)) if (!allowed.includes(row[dimension])) fail(name, `invalid ${dimension} contract ${row[dimension]}`, matrixFile)
    for (const evidence of row.evidence?.split(', ') ?? []) if (!existsSync(resolve(root, evidence))) fail(name, `missing regression evidence ${evidence}`, matrixFile)
    if (row.density === 'inherited' && !/\buseZtSize\s*\(\s*props\b/.test(source)) fail(name, 'density inheritance must use the shared resolver', file)
    const size = props.find(prop => prop.name === 'size')
    if (size && !['intrinsic', 'provider'].includes(row.density) && JSON.stringify(size.literals) !== JSON.stringify(sizes)) fail(name, 'density vocabulary differs from shared sizes', file)
    if (row.radius === 'tokens' && !/glass\.radius\(|(?<![\w-])radius\(|--zt-radius/.test(row.density === 'provider' ? familySource : styles)) fail(name, 'radius must derive from shared tokens', file)
    for (const prop of props) {
      if (['disabled', 'readonly', 'loading', 'clearable'].includes(prop.name) && prop.type !== 'boolean | undefined' && prop.type !== 'boolean') fail(name, `${prop.name} must use the common boolean contract`, file)
      if (['clearAble', 'readOnly', 'disable'].includes(prop.name)) fail(name, `nonstandard common prop spelling ${prop.name}`, file)
    }
    const status = props.find(prop => prop.name === 'status')
    const vocabularies = { visual, validation: ['default', 'error', 'success', 'warning'], mixed: [...visual, 'error'].sort(), workflow: ['error', 'finish', 'process', 'success', 'wait'], result: ['403', '404', '500', 'danger', 'info', 'success', 'warning'] }
    if (vocabularies[row.status] && JSON.stringify(status?.literals) !== JSON.stringify(vocabularies[row.status])) fail(name, `${row.status} status vocabulary changed`, file)
    if (row.status === 'none' && status) fail(name, 'unexpected status prop on a non-status component', file)
    if (/(?:transition|animation)(?:-\w+)?\s*:/.test(styles) && !/prefers-reduced-motion/.test(styles) && !/@use[^\n]+(?:entry|clear)/.test(styles)) fail(name, 'reduced-motion override missing for animated family', file)
    if (/<span\b[^>]*class="[^"]*__close[^"]*"[^>]*@click/.test(source)) fail(name, 'close action must use a keyboard-accessible named control', file)
    if (row.interaction === 'switch' && (!/:tabindex=/.test(source) || !/@keydown\.(?:space|enter)/.test(source) || !/:aria-disabled=/.test(source))) fail(name, 'switch must expose keyboard operation and disabled state', file)
    if (row.interaction === 'checkbox' && (!/@change="handleChange"/.test(source) || /\stabindex="-1"/.test(source))) fail(name, 'checkbox must keep native keyboard/change semantics', file)
    if (row.overlay === 'owned-popup' && !/useAnchoredDropdown\s*\(/.test(source)) fail(name, 'interactive popup must register shared overlay ownership', file)
    if (row.overlay === 'modal' && !/useOverlay\s*\(/.test(source)) fail(name, 'modal overlay must use shared focus/stack ownership', file)
    if (kind === 'glyph') {
      if (row.metadata !== 'family:ZtIcon' || !metadata.get('ZtIcon')?.props.some(prop => prop.name === 'strokeWidth') || !/createIconComponent\(name\)/.test(source) || !/props:\{strokeWidth:/.test(source)) fail(name, 'raw SVG icon missing shared metadata mapping', file)
    } else {
      const owner = metadata.get(name)
      if (!owner) fail(name, 'missing generated API metadata', 'site/src/docs/api.generated.json')
      else {
        for (const prop of props) {
          const documented = owner.props.find(row => row.name === prop.name)
          if (!documented) fail(name, `metadata missing prop ${prop.name}`, 'site/src/docs/api.generated.json')
          else if (commonProps.has(prop.name) && (normalize(documented.type) !== normalize(prop.declaredType) || documented.required !== prop.required)) fail(name, `metadata type mismatch for ${prop.name}`, 'site/src/docs/api.generated.json')
        }
        for (const prop of owner.props) if (!props.some(row => row.name === prop.name)) fail(name, `metadata contains unknown prop ${prop.name}`, 'site/src/docs/api.generated.json')
      }
    }
    for (const dimension of ['width', 'height']) {
      const prop = props.find(prop => prop.name === dimension)
      if (prop?.type.includes('number') && prop.type.includes('string') && !/typeof[\s\S]{0,90}number[\s\S]{0,90}px/.test(familySource) && !/ZtPopover|ZtSelect/.test(source)) fail(name, `${dimension} numeric/CSS length conversion is missing`, file)
    }
  }
  for (const file of walk(resolve(root, 'src/components')).filter(file => /\.(ts|vue|scss)$/.test(file))) {
    if (/@deprecated|兼容旧版|兼容的小尺寸|legacy alias|deprecated alias/i.test(read(file))) fail('public API', 'compatibility guidance is forbidden', relative(root, file))
  }
  return { count: components.length, sfcCount: components.filter(component => component.kind === 'sfc').length, glyphCount: components.filter(component => component.kind === 'glyph').length, findings }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flag = process.argv.indexOf('--root')
  const root = flag >= 0 ? resolve(process.argv[flag + 1]) : resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const result = audit(root)
  console.log(`Component contract audit: ${result.count} public components (${result.sfcCount} SFCs, ${result.glyphCount} shared SVG icons)`)
  for (const finding of result.findings) console.error(`[${finding.severity}] ${finding.component}: ${finding.rule} (${finding.file})`)
  console.log(`${result.findings.length} unwaived violations`)
  process.exitCode = result.findings.length ? 1 : 0
}
