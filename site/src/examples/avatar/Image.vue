<script setup lang="ts">
import { ref } from 'vue';
import { ZtAvatar, ZtAvatarGroup } from '@ztechjs/zt-ui';
const failed = ref(false);
function portrait(background: string, ink: string, hair: string) {
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="${background}"/><path d="M12 124c2-30 20-42 48-42s46 12 48 42" fill="${ink}"/><ellipse cx="60" cy="53" rx="24" ry="29" fill="#ecc3a7"/><path d="M34 54V41C34 8 87 8 87 41v13l-9-20c-11 8-22 10-35 8l-9 12" fill="${hair}"/><path d="M49 66q11 8 22 0" fill="none" stroke="#a96756" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="54" r="2" fill="${hair}"/><circle cx="70" cy="54" r="2" fill="${hair}"/></svg>`);
}
const portraits = [
  { name: '林青', src: portrait('#e2eaf6', '#788eb3', '#3c4055') },
  { name: '陈悦', src: portrait('#e5ede4', '#7c9b89', '#55463f') },
  { name: '苏宁', src: portrait('#f4e6d9', '#bf9677', '#453c3e') },
  { name: '李言', src: portrait('#e9e4f2', '#9b87b5', '#514457') },
];
</script>
<template>
  <div class="avatar-image-demo">
    <div class="avatar-image-demo__row">
      <ZtAvatarGroup label="创意团队肖像">
        <ZtAvatar v-for="member in portraits" :key="member.name" :src="member.src" :alt="member.name" />
      </ZtAvatarGroup>
      <span>本地插画头像</span>
    </div>
    <div class="avatar-image-demo__row">
      <ZtAvatar :src-set="`${portraits[0].src} 1x`" alt="林青" />
      <ZtAvatar :src="portraits[1].src" shape="square" alt="陈悦" />
      <ZtAvatar src="data:image/png;base64,broken" alt="陈悦" status="primary" @error="failed = true" />
      <span role="status">{{ failed ? '图片失败，已显示后备姓名' : '等待图片加载' }}</span>
    </div>
  </div>
</template>
<style scoped>
.avatar-image-demo { display: grid; gap: 26px; padding: 4px 0; }
.avatar-image-demo__row { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.avatar-image-demo__row > span { color: var(--zt-text-muted); font-size: 12px; }
</style>
