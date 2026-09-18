import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import ts from 'typescript'

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export function inspectExamples() {
  const pages = [],
    errors = []
  for (const directory of readdirSync(resolve(site, 'src/views'), { withFileTypes: true }).filter(
    (item) => item.isDirectory(),
  )) {
    const id = directory.name,
      filename = resolve(site, 'src/views', id, 'Index.vue')
    let source
    try {
      source = readFileSync(filename, 'utf8')
    } catch {
      continue
    }
    const { descriptor, errors: parseErrors } = parse(source, { filename })
    errors.push(...parseErrors.map((error) => `${id}: ${error}`))
    const imports = new Map()
    const script = ts.createSourceFile(
      filename,
      descriptor.scriptSetup?.content ?? '',
      ts.ScriptTarget.Latest,
      true,
    )
    for (const node of script.statements)
      if (ts.isImportDeclaration(node) && node.importClause?.name)
        imports.set(node.importClause.name.text, node.moduleSpecifier.text)
    const examples = []
    let title = ''
    function visit(node) {
      if (node.type === 1 && node.tag === 'h2')
        title = node.children.map((child) => child.content ?? '').join('')
      if (node.type === 1 && node.tag === 'DemoBlock') {
        const code = node.props.find((prop) => prop.type === 7 && prop.arg?.content === 'code')?.exp
          ?.content
        const codeOnly = node.props.some((prop) => prop.type === 6 && prop.name === 'code-only')
        if (codeOnly) {
          examples.push({ title, kind: 'integration', file: null, props: [] })
          return
        }
        const children = node.children.filter((child) => child.type === 1)
        const component = children.length === 1 ? children[0].tag : undefined
        const componentFile = imports.get(component),
          rawFile = imports.get(code)
        if (!componentFile || rawFile !== `${componentFile}?raw`) {
          errors.push(`${id}/${title}: preview and source must import the same Vue file`)
          return
        }
        const examplePath = resolve(dirname(filename), componentFile)
        const exampleSource = readFileSync(examplePath, 'utf8')
        const { descriptor: example, errors: exampleErrors } = parse(exampleSource, {
          filename: examplePath,
        })
        errors.push(...exampleErrors.map((error) => `${id}/${title}: ${error}`))
        try {
          const compiled = example.scriptSetup
            ? compileScript(example, { id: examplePath })
            : undefined
          const result = compileTemplate({
            id: examplePath,
            filename: examplePath,
            source: example.template?.content ?? '',
            compilerOptions: {
              bindingMetadata: compiled?.bindings,
              expressionPlugins: ['typescript'],
            },
          })
          errors.push(...result.errors.map((error) => `${id}/${title}: ${error}`))
        } catch (error) {
          errors.push(`${id}/${title}: ${error.message}`)
        }
        if (/from\s*['"]@\//.test(exampleSource))
          errors.push(`${id}/${title}: copied example depends on private site imports`)
        if (/['"]\/(?:image-demo|upload-demo)\//.test(exampleSource))
          errors.push(`${id}/${title}: root-relative image asset is not portable`)
        const bindings = []
        function collect(n) {
          if (n.type === 1 && /^Zt/.test(n.tag)) {
            for (const prop of n.props) {
              const name = prop.type === 6 ? prop.name : prop.arg?.content
              if (name) bindings.push(`${n.tag}.${name}`)
            }
          }
          for (const child of n.children ?? []) collect(child)
        }
        collect(example.template.ast)
        examples.push({
          title,
          kind: 'live',
          file: `src/views/${id}/${componentFile.replace('./', '')}`,
          props: [...new Set(bindings)],
        })
        return
      }
      for (const child of node.children ?? []) visit(child)
    }
    visit(descriptor.template.ast)
    if (!examples.length) errors.push(`${id}: missing examples`)
    pages.push({ component: id, examples })
  }
  return { pages, errors }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { pages, errors } = inspectExamples()
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
  const live = pages
    .flatMap((page) => page.examples)
    .filter((example) => example.kind === 'live').length
  const integration = pages.flatMap((page) => page.examples).length - live
  const rows = pages.map(
    (page) =>
      `| ${page.component} | ${page.examples.filter((e) => e.kind === 'live').length} | ${page.examples.map((e) => `${e.title}${e.kind === 'integration' ? '（仅接入代码）' : ''}`).join('；')} |`,
  )
  const report = `# 组件示例盘点\n\n由 site/scripts/audit-examples.mjs 生成。共 ${pages.filter(page => page.component !== 'feedback').length} 个组件文档页与 ${pages.filter(page => page.component === 'feedback').length} 个反馈指南页、${live} 个可运行示例、${integration} 个接入代码示例。\n\n每个可运行示例都由独立 Vue 文件同时提供渲染组件与 ?raw 源码；包含状态、事件和样式。复制前需在业务项目安装 @ztechjs/zt-ui 并引入其样式。反馈指南的命令式 API 直接从 @ztechjs/zt-alert 导入并加载其样式。Menu 的路由示例需要安装 Vue Router 并配置示例中说明的路由；Upload 的 Axios 接入代码需要业务接口。\n\n| 组件 | 可运行示例数 | 场景 |\n| --- | ---: | --- |\n${rows.join('\n')}\n\n校验范围：所有示例与代码来源一致、SFC 解析与模板编译、私有路径与部署资源检查。完整类型检查由 npm run typecheck 执行，交互回归由 npm test 执行。该盘点统计演示场景，不将静态属性出现次数等同于功能测试通过。\n`
  writeFileSync(resolve(site, '../docs/component-examples-audit.md'), report)
  console.log(
    `${pages.length} pages; ${live} live examples; ${integration} integration examples; source parity and SFC compilation verified`,
  )
}
