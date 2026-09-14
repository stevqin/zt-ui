function indent(value: string) {
  return value
    .trim()
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n')
}

export function sfc(script: string, template: string) {
  return `<script setup lang="ts">
${script.trim()}
</script>

<template>
${indent(template)}
</template>`
}
