<script setup lang="ts">
import { ZtLink, ZtSpace } from '@ztechjs/zt-ui';
const csv =
  'data:text/csv;charset=utf-8,' + encodeURIComponent('月份,销售额\n10月,128600');
</script>
<template>
  <ZtSpace wrap>
    <ZtLink href="#link-details" underline="always">始终显示</ZtLink>
    <ZtLink href="#link-details" underline="hover">悬停显示</ZtLink>
    <ZtLink :href="csv" download="销售汇总.csv" underline="never" icon="download">
      下载 CSV
    </ZtLink>
  </ZtSpace>
  <p id="link-details">链接目标：文件格式为 UTF-8 CSV。</p>
</template>
