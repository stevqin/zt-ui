export const toTemplateName = name => name.replace(/[A-Z]/g, value => `-${value.toLowerCase()}`)

export function normalizeEventType(type) {
  const tuple = type.trim().match(/^\[([\s\S]*)\]$/)
  return tuple ? `(${tuple[1].trim()}) => void` : type
}

export function normalizeDefault({ required, defaultValue, inherit, runtimeDefault, parentDefault }) {
  if (required) return '必填'
  if (inherit) return `继承 ConfigProvider（最终为 ${inherit}）`
  if (runtimeDefault) return `运行时计算：${runtimeDefault}`
  if (parentDefault) return `受组合组件控制：${parentDefault}`
  return defaultValue === undefined ? '无默认值' : String(defaultValue)
}
