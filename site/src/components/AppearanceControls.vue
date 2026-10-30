<script setup lang="ts">
import { appearance, resolvedTheme, updateAppearance } from "../app/appearance";
import { ZtSelect, ZtSlider, type ZtComponentSize } from "@ztechjs/zt-ui";
const sizes: ZtComponentSize[] = [
  "mini",
  "small",
  "default",
  "medium",
  "large",
];
</script>
<template>
  <div class="appearance-controls" role="group" aria-label="演示外观设置">
    <div class="appearance-setting appearance-size">
      <label class="appearance-label" for="global-size">尺寸</label>
      <ZtSelect
        id="global-size"
        aria-label="组件尺寸"
        size="small"
        :model-value="appearance.size"
        :options="sizes.map((size) => ({ label: size, value: size }))"
        @update:model-value="
          (value) => updateAppearance({ size: value as ZtComponentSize })
        "
      />
    </div>
    <div class="appearance-setting appearance-radius">
      <span class="appearance-label" aria-hidden="true">圆角</span>
      <ZtSlider
        :model-value="appearance.borderRadius"
        :min="0"
        :max="24"
        :step="1"
        :show-tooltip="false"
        size="small"
        aria-label="组件圆角"
        :format-tooltip="(value) => `${value}px`"
        @update:model-value="
          (value) => updateAppearance({ borderRadius: Number(value) })
        "
      />
      <output aria-label="当前圆角"
        >{{ appearance.borderRadius }}<span>px</span></output
      >
    </div>
    <div
      class="appearance-segments appearance-themes"
      role="group"
      aria-label="配色主题"
    >
      <button
        type="button"
        aria-label="浅色主题"
        title="浅色主题"
        :aria-pressed="resolvedTheme === 'light'"
        @click="updateAppearance({ themePreference: 'light' })"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="3.25" />
          <path
            d="M10 1.75v1.5m0 13.5v1.5M1.75 10h1.5m13.5 0h1.5M4.17 4.17l1.06 1.06m9.54 9.54 1.06 1.06M4.17 15.83l1.06-1.06m9.54-9.54 1.06-1.06"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="深色主题"
        title="深色主题"
        :aria-pressed="resolvedTheme === 'dark'"
        @click="updateAppearance({ themePreference: 'dark' })"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M16.9 11.6A7.2 7.2 0 0 1 8.4 3.1a7.2 7.2 0 1 0 8.5 8.5Z" />
        </svg>
      </button>
    </div>
  </div>
</template>
