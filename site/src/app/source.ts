export function standaloneSource(
  source: string,
  config: { size: string; borderRadius: number; theme: string },
) {
  const importLine =
    "import { ZtConfigProvider as ZtDemoConfigProvider } from '@ztechjs/zt-ui'\n" +
    (source.includes("@ztechjs/zt-ui/style.css")
      ? ""
      : "import '@ztechjs/zt-ui/style.css'\n");
  let result = source.replace(
    /<template([^>]*)>([\s\S]*?)<\/template>\s*(?=<(?:style|script)\b|$)/,
    (_all, attributes, content) =>
      `<template${attributes}>\n  <ZtDemoConfigProvider size="${config.size}" :border-radius="${config.borderRadius}" theme="${config.theme}">\n${content.trim()}\n  </ZtDemoConfigProvider>\n</template>\n`,
  );
  if (/<script\b[^>]*\bsetup\b[^>]*>/.test(result))
    result = result.replace(
      /(<script\b[^>]*\bsetup\b[^>]*>)/,
      `$1\n${importLine}`,
    );
  else result = `<script setup lang="ts">\n${importLine}</script>\n${result}`;
  return result;
}
/** Format the exact standalone SFC shown and copied by the documentation. */
export async function formatStandaloneSource(
  raw: string,
  config: { size: string; borderRadius: number; theme: string },
): Promise<string> {
  const [{ format }, html, typescript, babel, estree, postcss] =
    await Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/html"),
      import("prettier/plugins/typescript"),
      import("prettier/plugins/babel"),
      import("prettier/plugins/estree"),
      import("prettier/plugins/postcss"),
    ]);
  const source =
    raw.includes("ZtConfigProvider as ZtDemoConfigProvider") &&
    /<ZtDemoConfigProvider\b/.test(raw)
      ? raw.replace(
          /<ZtDemoConfigProvider\b[^>]*>/,
          `<ZtDemoConfigProvider size="${config.size}" :border-radius="${config.borderRadius}" theme="${config.theme}">`,
        )
      : standaloneSource(raw, config);
  return format(source, {
    parser: "vue",
    plugins: [html, typescript, babel, estree, postcss],
    singleQuote: true,
    printWidth: 90,
    htmlWhitespaceSensitivity: "ignore",
  });
}
const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function highlightCode(source: string) {
  const pattern =
    /(<!--[\s\S]*?-->|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:import|from|const|let|function|return|if|else|async|await|type|interface|true|false|ref|computed)\b|<\/?[\w-]+|\b\d+\b)/g;
  let end = 0,
    output = "";
  for (const match of source.matchAll(pattern)) {
    const token = match[0],
      start = match.index!;
    const kind =
      token.startsWith("//") || token.startsWith("<!--")
        ? "comment"
        : /^['"]/.test(token)
          ? "string"
          : token.startsWith("<")
            ? "tag"
            : /^\d/.test(token)
              ? "number"
              : "keyword";
    output +=
      escape(source.slice(end, start)) +
      `<span class="syntax-${kind}">${escape(token)}</span>`;
    end = start + token.length;
  }
  return output + escape(source.slice(end));
}
export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const active = document.activeElement as HTMLElement | null;
  const input = document.createElement("textarea");
  input.value = text;
  input.style.cssText = "position:fixed;left:-9999px;top:0";
  document.body.append(input);
  input.select();
  try {
    if (!document.execCommand("copy"))
      throw new Error("复制失败，请选择源码手动复制");
  } finally {
    input.remove();
    active?.focus();
  }
}
