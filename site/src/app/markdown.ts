import { marked } from 'marked';
import DOMPurify from 'dompurify';

/** Render Markdown as document HTML while excluding executable markup. */
export function renderMarkdown(source: string): string {
  const html = marked.parse(source.replace(/^\uFEFF/, ''), { async: false, gfm: true });
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
