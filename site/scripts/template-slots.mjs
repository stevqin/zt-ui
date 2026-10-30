import ts from 'typescript'
import { parse } from '@vue/compiler-dom'

const globals = new Set(['undefined','NaN','Infinity','Math','Number','String','Boolean','Object','Array','Date','JSON','Intl','RegExp','console','Map','Set','Promise'])
function bindingNames(name) {
  return ts.isIdentifier(name) ? [name.text] : [...name.elements].flatMap(element => ts.isBindingElement(element) ? bindingNames(element.name) : [])
}
function expressionNames(expression) {
  const source = ts.createSourceFile('expression.ts', `(${expression})`, ts.ScriptTarget.Latest, true)
  const result = new Set()
  function visit(node) {
    if (ts.isIdentifier(node) && !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) && !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)) result.add(node.text)
    ts.forEachChild(node, visit)
  }
  visit(source)
  return [...result]
}
function aliases(value) {
  const source = ts.createSourceFile('aliases.ts', `const [${value.replace(/^\((.*)\)$/s, '$1')}] = [];`, ts.ScriptTarget.Latest, true)
  return source.statements[0]?.declarationList?.declarations[0]?.name.elements?.map(element => element.name?.getText(source)).filter(Boolean) ?? []
}

/** Build an inert TypeScript view of template lexical scopes for the type checker. */
export function templateSlotProbe(source, template) {
  const scriptBindings = [], scriptFunctions = []
  let propsType = '{}'
  function findProps(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'defineProps' && node.typeArguments?.[0]) propsType = node.typeArguments[0].getText(source)
    ts.forEachChild(node, findProps)
  }
  findProps(source)
  for (const node of source.statements) {
    if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) scriptBindings.push(...bindingNames(declaration.name))
    if (ts.isFunctionDeclaration(node) && node.name) scriptFunctions.push(node.name.text)
    if (ts.isImportDeclaration(node) && node.importClause && !node.importClause.isTypeOnly) {
      const clause = node.importClause
      if (clause.name) scriptFunctions.push(clause.name.text)
      if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) scriptFunctions.push(...clause.namedBindings.elements.filter(item => !item.isTypeOnly).map(item => item.name.text))
    }
  }
  const ast = parse(template), names = new Set(scriptBindings), slots = [], statements = []
  const emit = text => statements.push(text)
  function expressions(node) {
    for (const prop of node.props ?? []) if (prop.type === 7 && prop.exp?.content) {
      const content = prop.name === 'for' ? prop.exp.content.match(/\s+(?:in|of)\s+([\s\S]+)$/)?.[1] : prop.name === 'slot' ? undefined : prop.exp.content
      if (content) for (const name of expressionNames(content)) if (!globals.has(name) && !scriptFunctions.includes(name)) names.add(name)
    }
    for (const child of node.children ?? []) expressions(child)
  }
  expressions(ast)
  function visit(node) {
    const directives = node.props?.filter(prop => prop.type === 7) ?? []
    // Vue evaluates v-if before v-for when both directives occur on the same node.
    const condition = directives.find(prop => prop.name === 'if' || prop.name === 'else-if')?.exp?.content
    if (condition) emit(`if (${condition}) {`)
    const loop = directives.find(prop => prop.name === 'for')?.exp?.content.match(/^([\s\S]+?)\s+(?:in|of)\s+([\s\S]+)$/)
    if (loop) {
      const [value,key,index] = aliases(loop[1].trim())
      emit('{')
      if (value) emit(`const ${value} = __docIterationValue(${loop[2]});`)
      if (key) emit(`const ${key} = __docIterationKey(${loop[2]});`)
      if (index) emit(`const ${index}: number = 0;`)
    }
    // Slot-provided variables belong to the child component, never a same-named outer binding.
    const slotScope = directives.find(prop => prop.name === 'slot')?.exp?.content
    if (slotScope) {
      emit('{')
      emit(`const ${slotScope} = null! as ${slotScope.trim().startsWith('{') ? 'Record<string, unknown>' : 'unknown'};`)
    }
    if (node.type === 1 && node.tag === 'slot') {
      const name = node.props.find(prop => prop.type === 6 && prop.name === 'name')?.value?.content
      const dynamic = directives.find(prop => prop.name === 'bind' && prop.arg?.content === 'name')?.exp?.content
      const binding = `__docSlot${slots.length}`
      const properties = node.props.flatMap(prop => {
        if (prop.type === 6 && prop.name !== 'name') return [`${JSON.stringify(prop.name)}: ${JSON.stringify(prop.value?.content ?? '')}`]
        if (prop.type !== 7 || prop.name !== 'bind') return []
        if (!prop.arg && prop.exp) return [`...(${prop.exp.content})`]
        if (prop.arg?.type === 4 && prop.arg.isStatic && prop.arg.content !== 'name') return [`${JSON.stringify(prop.arg.content)}: (${prop.exp?.content || prop.arg.content})`]
        return []
      })
      emit(`const ${binding} = { ${properties.join(', ')} };`)
      if (dynamic) emit(`const ${binding}Name = (${dynamic});`)
      slots.push({ name: name ?? (dynamic ? `[${dynamic}]` : 'default'), binding, dynamic: Boolean(dynamic), spread: directives.some(prop => prop.name === 'bind' && !prop.arg) })
    }
    for (const child of node.children ?? []) visit(child)
    if (slotScope) emit('}')
    if (loop) emit('}')
    if (condition) emit('}')
  }
  visit(ast)
  const bindingsType = scriptBindings.map(name => `${JSON.stringify(name)}: typeof ${name}`).join('; ')
  const code = `
declare function __docIterationValue<T>(source: T): T extends readonly (infer Item)[] ? Item : T extends string ? string : T extends number ? number : T extends object ? T[keyof T] : unknown;
declare function __docIterationKey<T>(source: T): T extends readonly unknown[] | string | number ? number : T extends object ? keyof T : unknown;
const __docBindings = null! as import('vue').ShallowUnwrapRef<{ ${bindingsType} }> & Readonly<${propsType}> & Record<string, unknown>;
function __docTemplate() {
const { ${[...names].join(', ')} } = __docBindings;
${statements.join('\n')}
}
`
  return { code, slots }
}
