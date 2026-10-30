interface Row { name: string; description?: string }
interface Component { name: string; props?: Row[]; events?: Row[]; slots?: Row[]; exposes?: Row[]; types?: Row[] }
export function checkApiDescriptions(documents: Record<string, { components: Component[] }>): string[]
