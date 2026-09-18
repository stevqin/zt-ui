// Browser-safe: this exact transform powers both DemoBlock and the build audit.
const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
export function renderExampleSource(source, selected) {
  const rendered = source.replace(
    /<script\b[^>]*>([\s\S]*?)<\/script>/g,
    (block, script) => {
      const bindings = [];
      const declaration =
        /\bconst\s+(\w+)\s*=\s*useDemoStatus(?:<(\w+)>)?\(\s*['"](default|primary|success|warning|danger|info)['"]\s*\)\s*(?:;|(?=\n|$))/g;
      const withoutDeclarations = script.replace(declaration, (_, name) => {
        bindings.push(name);
        return '';
      });
      // Only template bindings are supported. A computed ref consumed by script
      // (including aliases or function arguments) cannot become a plain literal.
      if (
        bindings.some((name) =>
          new RegExp(`\\b${name}\\b`).test(withoutDeclarations),
        )
      )
        throw new Error(
          'Unsupported script consumption of site status; use template-only status bindings',
        );
      const standalone = script
        .replace(
          /^import\s*\{\s*useDemoStatus\s*\}\s*from\s*['"](?:\.\.\/)+docs\/useDemoStatus['"];?\s*\n/gm,
          '',
        )
        .replace(
          declaration,
          (_, name, type, fallback) =>
            `const ${name} = '${statuses.includes(selected) ? selected : fallback}'${type ? ` as ${type}` : ''};`,
        );
      return block.replace(script, () => standalone);
    },
  );
  if (/useDemoStatus|provideDemoStatus|["'](?:\.\.\/)+docs\//.test(rendered))
    throw new Error(
      'Unsupported site status plumbing in displayed example source',
    );
  return rendered;
}
