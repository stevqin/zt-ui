const sections = ['props', 'events', 'slots', 'exposes', 'types'];
const placeholders = [
  '组件配置属性；具体行为参见上方用法示例。',
  '组件交互事件。',
  '自定义内容插槽。',
  '公开类型或实例成员。',
];
export function checkApiDescriptions(documents) {
  const errors = [];
  for (const [page, document] of Object.entries(documents)) {
    for (const component of document.components ?? []) for (const section of sections) for (const row of component[section] ?? []) {
      const context = `${page}/${component.name}.${section}.${row.name}`;
      if (typeof row.description !== 'string' || !row.description.trim()) errors.push(`Missing API description: ${context}`);
      else if (placeholders.some(text => row.description.includes(text))) errors.push(`Placeholder API description: ${context}`);
    }
  }
  return errors;
}
