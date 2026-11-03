<script setup lang="ts">
import { ref } from 'vue';
import { ZtAvatar, ZtAvatarGroup } from '@ztechjs/zt-ui';
const selectedMember = ref('');
const team = [
  { name: '林青', status: 'primary' as const },
  { name: '陈悦', status: 'success' as const },
  { name: '苏宁', status: 'warning' as const },
  { name: '李言', status: 'info' as const },
  { name: '周可', status: 'danger' as const },
];
const storeTeam = [...team, ...['宋宁', '何依', '王澄', '许夏', '赵禾', '唐晓', '刘逸', '顾安', '孟知', '吴月'].map(name => ({ name, status: 'primary' as const }))];
</script>
<template>
  <div class="avatar-demo">
    <div class="avatar-demo__row">
      <span class="avatar-demo__label">独立头像</span>
      <div class="avatar-demo__samples">
        <ZtAvatar alt="林青" status="primary" />
        <ZtAvatar alt="陈悦" status="success" />
        <ZtAvatar icon="user" alt="访客" />
        <ZtAvatar shape="square" alt="华东门店">华东</ZtAvatar>
      </div>
    </div>
    <div class="avatar-demo__row">
      <span class="avatar-demo__label">设计团队</span>
      <ZtAvatarGroup label="设计团队">
        <ZtAvatar v-for="member in team" :key="member.name" :item="member" :alt="member.name" :status="member.status" />
      </ZtAvatarGroup>
      <span class="avatar-demo__note">5 位成员</span>
    </div>
    <div class="avatar-demo__row">
      <span class="avatar-demo__label">更多成员</span>
      <ZtAvatarGroup :max="3" label="项目成员" @member-click="item => selectedMember = String(item.name)">
        <ZtAvatar v-for="member in team" :key="member.name" :item="member" :alt="member.name" :status="member.status" />
      </ZtAvatarGroup>
      <span class="avatar-demo__note" role="status">{{ selectedMember ? `已点击：${selectedMember}` : '点击 +2 查看全部成员' }}</span>
    </div>
    <div class="avatar-demo__row">
      <span class="avatar-demo__label">方形组合</span>
      <ZtAvatarGroup shape="square" :max="3" label="门店团队">
        <ZtAvatar v-for="member in storeTeam" :key="member.name" :item="member" :alt="member.name" :status="member.status" />
      </ZtAvatarGroup>
    </div>
  </div>
</template>
<style scoped>
.avatar-demo { display: grid; gap: 26px; padding: 4px 0; }
.avatar-demo__row { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
.avatar-demo__samples { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
.avatar-demo__label { width: 5em; color: var(--zt-text); font-size: 13px; font-weight: 500; }
.avatar-demo__note { color: var(--zt-text-muted); font-size: 12px; }
@media (max-width: 480px) { .avatar-demo__row { gap: 12px; } .avatar-demo__note { flex-basis: 100%; padding-inline-start: calc(5em + 12px); } }
</style>
