<script setup lang="ts">
import { ref } from "vue";
import { ZtButton, ZtSelect, ZtVTableGridImportDialog } from "@ztechjs/zt-ui";
const format = ref("csv");
const options = ["csv", "xls", "xlsx"].map((value) => ({
  value,
  label: value.toUpperCase(),
}));
const open = ref(false);
const file = ref<File | null>(null);
const result = ref("选择文件后，confirm 事件将 File 交给业务导入逻辑。");
function show() {
  file.value = null;
  open.value = true;
}
function confirm(selected: File) {
  result.value = `已收到文件：${selected.name}`;
  open.value = false;
}
</script>
<template>
  <div class="demo">
    <div class="tools">
      <ZtSelect
        v-model="format"
        :options="options"
        aria-label="导入格式"
        class="format-select"
      />
      <ZtButton @click="show">预览导入对话框</ZtButton>
    </div>
    <ZtVTableGridImportDialog
      v-model="open"
      v-model:file="file"
      :title="`导入 ${format.toUpperCase()} 文件`"
      :allowed-extensions="[format]"
      :accept="`.${format}`"
      :file-type-label="format.toUpperCase()"
      :file-spec="`.${format} 格式`"
      :format-hint="`请选择 .${format} 文件`"
      @confirm="confirm"
    />
    <p role="status">{{ result }}</p>
  </div>
</template>
<style scoped>
.demo {
  display: grid;
  gap: 12px;
  max-width: 100%;
}
.tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.format-select {
  width: 110px;
}
p {
  margin: 0;
}
</style>
