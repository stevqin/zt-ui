// Browser-safe: this exact transform powers both DemoBlock and the build audit.
const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
export function renderExampleSource(source, selected) {
  const rendered = source
    .replace(
      /^import\s*\{\s*useDemoStatus\s*\}\s*from\s*['"](?:\.\.\/)+docs\/useDemoStatus['"];?\s*\n/gm,
      '',
    )
    .replace(
      /useDemoStatus(?:<([\w]+)>)?\(\s*['"](default|primary|success|warning|danger|info)['"]\s*\)/g,
      (_, type, fallback) =>
        `'${statuses.includes(selected) ? selected : fallback}'${type ? ` as ${type}` : ''}`,
    );
  if (/useDemoStatus|provideDemoStatus|["'](?:\.\.\/)+docs\//.test(rendered))
    throw new Error(
      'Unsupported site status plumbing in displayed example source',
    );
  return rendered;
}
