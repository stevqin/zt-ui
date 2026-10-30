import { checkApiDescriptions } from './check-api-descriptions.mjs';
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import {
  parse,
  compileScript,
  compileTemplate,
  compileStyle,
} from "@vue/compiler-sfc";
const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const content = (file) => {
  const code = ts.transpileModule(
    readFileSync(resolve(site, `src/content/${file}.ts`), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText;
  const exports = {};
  new Function("exports", code)(exports);
  return Object.values(exports)[0];
};
export function checkContent() {
  const pages = [
    ...content("pages-a"),
    ...content("pages-b"),
    ...content("alerts"),
  ];
  const api = JSON.parse(
    readFileSync(resolve(site, "src/generated/api.json"), "utf8"),
  );
  Object.assign(
    api,
    JSON.parse(
      readFileSync(resolve(site, "src/generated/alert-api.json"), "utf8"),
    ),
  );
  const ids = new Set(),
    files = new Set(),
    errors = checkApiDescriptions(api);
  for (const page of pages) {
    if (ids.has(page.id)) errors.push(`Duplicate page: ${page.id}`);
    ids.add(page.id);
    if (!page.description || !page.usage?.length || !page.examples?.length)
      errors.push(`Incomplete page: ${page.id}`);
    if (page.id !== "feedback" && !api[page.id]?.components?.length)
      errors.push(`Missing API contract: ${page.id}`);
    const examples = new Set();
    for (const example of page.examples) {
      if (examples.has(example.id))
        errors.push(`Duplicate example: ${page.id}/${example.id}`);
      examples.add(example.id);
      if (!example.title || !example.description)
        errors.push(`Missing example explanation: ${example.file}`);
      const file = resolve(site, example.file);
      files.add(file);
      if (!existsSync(file)) {
        errors.push(`Missing example: ${example.file}`);
        continue;
      }
      const source = readFileSync(file, "utf8"),
        { descriptor, errors: parseErrors } = parse(source, { filename: file });
      errors.push(...parseErrors.map(String));
      if (/from\s+['"](?:\.\.\/)+(?:app|content|components)\//.test(source))
        errors.push(`Example depends on site: ${example.file}`);
      try {
        const script =
          descriptor.script || descriptor.scriptSetup
            ? compileScript(descriptor, { id: example.id })
            : undefined;
        if (descriptor.template)
          errors.push(
            ...compileTemplate({
              id: example.id,
              filename: file,
              source: descriptor.template.content,
              compilerOptions: { bindingMetadata: script?.bindings },
            }).errors.map(String),
          );
        else errors.push(`Missing template: ${example.file}`);
        for (const style of descriptor.styles)
          errors.push(
            ...compileStyle({
              id: example.id,
              filename: file,
              source: style.content,
              scoped: style.scoped,
              preprocessLang: style.lang,
            }).errors.map(String),
          );
      } catch (error) {
        errors.push(`${example.file}: ${error.message}`);
      }
    }
  }
  for (const id of Object.keys(api))
    if (!ids.has(id)) errors.push(`Public API page missing: ${id}`);
  const walk = (directory) =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? walk(resolve(directory, entry.name))
        : [resolve(directory, entry.name)],
    );
  for (const file of walk(resolve(site, "src/examples")).filter((f) =>
    f.endsWith(".vue"),
  ))
    if (!files.has(file)) errors.push(`Unlisted example: ${file}`);
  if (errors.length) throw Error(errors.join("\n"));
  return {
    pages: pages.length,
    examples: files.size,
    apiPages: Object.keys(api).length,
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = checkContent();
  console.log(
    `${result.pages} documentation pages; ${result.examples} independent examples; ${result.apiPages} API pages; all contracts and SFCs verified`,
  );
}
