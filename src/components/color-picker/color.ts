export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
export function hsvToRgb(h: number, s: number, v: number, a = 1): Color {
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return {
    r: Math.round((r! + m) * 255 + 1e-9),
    g: Math.round((g! + m) * 255 + 1e-9),
    b: Math.round((b! + m) * 255 + 1e-9),
    a,
  };
}
export function rgbToHsv({ r, g, b }: Color) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return { h: (h + 360) % 360, s: max === 0 ? 0 : d / max, v: max };
}
function number(text: string, max: number) {
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(text)) return NaN;
  return text.endsWith('%') ? (parseFloat(text) * max) / 100 : Number(text);
}
export function parseColor(input: string): Color | null {
  const text = input.trim().toLowerCase();
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/.test(text)) {
    let hex = text.slice(1);
    if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }
  const match = text.match(/^(rgba?|hsla?)\((.+)\)$/);
  if (!match) return null;
  const parts = match[2]!
    .trim()
    .replace(/\s*[,/]\s*/g, ' ')
    .split(/\s+/);
  if (parts.length < 3 || parts.length > 4) return null;
  const alpha = parts[3] === undefined ? 1 : number(parts[3], 1);
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null;
  if (match[1]!.startsWith('rgb')) {
    const [r, g, b] = parts.slice(0, 3).map((x) => number(x, 255));
    if ([r, g, b].some((n) => !Number.isFinite(n) || n! < 0 || n! > 255))
      return null;
    return {
      r: Math.round(r!),
      g: Math.round(g!),
      b: Math.round(b!),
      a: alpha,
    };
  }
  if (
    !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?$/.test(parts[0]!) ||
    !parts[1]!.endsWith('%') ||
    !parts[2]!.endsWith('%')
  )
    return null;
  const h = ((parseFloat(parts[0]!) % 360) + 360) % 360,
    s = number(parts[1]!, 1),
    l = number(parts[2]!, 1);
  if (
    !Number.isFinite(h) ||
    !Number.isFinite(s) ||
    !Number.isFinite(l) ||
    s < 0 ||
    s > 1 ||
    l < 0 ||
    l > 1
  )
    return null;
  const v = l + s * Math.min(l, 1 - l);
  return hsvToRgb(h, v === 0 ? 0 : 2 * (1 - l / v), v, alpha);
}
export function toHex(color: Color, alpha = false) {
  return (
    '#' +
    [color.r, color.g, color.b, ...(alpha ? [Math.round(color.a * 255)] : [])]
      .map((n) => Math.round(n).toString(16).padStart(2, '0'))
      .join('')
  );
}
